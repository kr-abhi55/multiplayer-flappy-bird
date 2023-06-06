
import { MutableRefObject, Ref, useEffect, useRef } from "react";
import { HostSocket } from "../ts/socket/HostSocket";
import { Player, ActionType, GameObject } from "../ts/common";

export interface GameProps {
    onGameEnd: () => void
    gosRef: MutableRefObject<GameObject[]>
    player: Player
    socket: HostSocket
    go: GameObject
}
const speed = 500

export default function HostGame(props: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    function onDraw(ctx: CanvasRenderingContext2D, dt: number) {
        //draw all game objects
        const gos = props.gosRef.current

        gos.forEach((go) => {

            ctx.fillStyle = go.color
            ctx.fillRect(go.position.x, go.position.y, go.width, go.height)
        })

        props.gosRef.current = gos
    }
    function updateTick() {
        props.socket.sendMessage("go/update", props.gosRef.current)
    }
    function onInput() {
        const gos = props.gosRef.current

        gos.forEach((go) => {
            if (go.key == " ") {
                go.velocity.y=-300
                go.key=""
            }
        })

        props.gosRef.current = gos
    }
    function onPhysics(dt: number) {
        const gos = props.gosRef.current
        const g=9.8 //px/s
        gos.forEach((go) => {
            if (go.bodyType == 'dynamic' && go.tag=='player') {
                go.velocity.y+=g
                go.position.y+=go.velocity.y*dt
                go.position.x+=go.velocity.x*dt
            }
        })

        props.gosRef.current = gos
    }
    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!
        let animationFrameId: number;

        canvas.width = window.innerWidth
        canvas.height = window.innerHeight

        window.onresize = () => {
            canvas.width = window.innerWidth
            canvas.height = window.innerHeight
        }
        let previousTime = 0;
        const render = (time: number) => {
            const dt = (time - previousTime) / 1000
            context.clearRect(0, 0, canvas.width, canvas.height)
            onInput()
            onPhysics(dt)
            onDraw(context, dt)
            updateTick()
            animationFrameId = requestAnimationFrame(render)
            previousTime = time
        }
        animationFrameId = requestAnimationFrame(render)
        const onMove = (e: MouseEvent) => {
            const x = e.offsetX
            const y = e.offsetY
            // console.log(x, y)
            //send message update pos
        }
        const keyDown = (e: KeyboardEvent) => {
            props.go.key = e.key
            props.go.keyState = "down"
        }
        window.addEventListener("keydown", keyDown)
        const keyUp = (e: KeyboardEvent) => {
            props.go.key = ""
            props.go.keyState = "up"
        }
        window.addEventListener("keyup", keyUp)
        canvas.addEventListener('mousemove', onMove)
        const timer = setInterval(() => {

            // console.log(props.gosRef, "gos")
        }, 20)
        return () => {
            clearInterval(timer)
            canvas.removeEventListener('mousemove', onMove)
            canvas.removeEventListener("keydown", keyDown)
            canvas.removeEventListener("keyup", keyUp)

            cancelAnimationFrame(animationFrameId);
        };
    }, [])
    return (
        <div className="full" style={{ overflow: 'hidden' }}>
            <canvas  ref={canvasRef} ></canvas>
            <div className="game-panel">
                <button onClick={props.onGameEnd}>End</button>
                <div>
                    {props.player.name}
                </div>
            </div>
        </div>
    );
}