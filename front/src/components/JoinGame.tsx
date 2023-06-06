import { MutableRefObject, useEffect, useRef } from "react";
import { GameObject, Player, ActionType } from "../ts/common";
import { JoinSocket } from "../ts/socket/JoinSocket";

export interface GameProps {
    gosRef: MutableRefObject<GameObject[]>
    player: Player
    socket: JoinSocket
}
export default function JoinGame(props: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    function onDraw(ctx: CanvasRenderingContext2D) {
        //draw all game objects
        props.gosRef.current.forEach((go) => {
            ctx.fillStyle = go.color
            ctx.fillRect(go.position.x, go.position.y, go.width,go.height)
        })
    }
    function sendAction(type: ActionType, data: any) {
        props.socket.sendAction(type, data)
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
            animationFrameId = requestAnimationFrame(render)
        }
        animationFrameId = requestAnimationFrame(render)
        const onMove = (e: MouseEvent) => {
            const x = e.offsetX
            const y = e.offsetY
            // console.log(x, y)
            // sendAction("set_pos", { x, y })
            //send message update pos
        }
        canvas.addEventListener('mousemove', onMove)
        const keyDown = (e: KeyboardEvent) => {
            sendAction("key", {
                playerID: props.player.id,
                key: e.key,
                keyState: "down"
            })
        }
        canvas.addEventListener("keydown", keyDown)
        const keyUp = (e: KeyboardEvent) => {
            sendAction("key", {
                playerID: props.player.id,
                key: e.key,
                keyState: "up"
            })
        }
        canvas.addEventListener("keyup", keyUp)
        return () => {
            canvas.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(animationFrameId);
            canvas.removeEventListener("keydown", keyDown)
            canvas.removeEventListener("keyup", keyUp)
        };
    }, [])
    return (
        <div className="full" style={{ overflow: 'hidden' }}>
            <canvas tabIndex={1} ref={canvasRef} ></canvas>
            <div className="game-panel">
                <div>
                    {props.player.name}
                </div>
            </div>
        </div>
    );
}