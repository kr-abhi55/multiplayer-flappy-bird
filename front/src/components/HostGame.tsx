
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
const speed = 10
export default function HostGame(props: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    function onDraw(ctx: CanvasRenderingContext2D) {
        //draw all game objects
        const gos = props.gosRef.current
        gos.forEach((go) => {
            if (go.keyState == "down") {
                if (go.key == "ArrowLeft") {
                    go.x -= speed
                } else if (go.key == "ArrowRight") {
                    go.x += speed
                }
                else if (go.key == "ArrowUp") {
                    go.y -= speed
                } else if (go.key == "ArrowDown") {
                    go.y += speed
                }
            }
            ctx.fillStyle = go.color
            ctx.fillRect(go.x, go.y, 50, 50)
        })

        props.gosRef.current = gos
    }
    function updateTick() {
        props.socket.sendMessage("go/update", props.gosRef.current)
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
        const render = () => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            onDraw(context)
            // updateTick()
            // animationFrameId = requestAnimationFrame(render)
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
        canvas.addEventListener("keydown", keyDown)
        const keyUp = (e: KeyboardEvent) => {
            props.go.key = ""
            props.go.keyState = "up"
        }
        canvas.addEventListener("keyup", keyUp)
        canvas.addEventListener('mousemove', onMove)
        const timer = setInterval(() => {
            render()
            updateTick()
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
            <canvas tabIndex={1} ref={canvasRef} ></canvas>
            <div className="game-panel">
                <button onClick={props.onGameEnd}>End</button>
                <div>
                    {props.player.name}
                </div>
            </div>
        </div>
    );
}