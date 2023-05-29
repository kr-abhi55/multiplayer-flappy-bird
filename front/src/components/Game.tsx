import { useEffect, useRef } from "react";
import SocketHandler, { ActionType } from "../SocketHandler";
import { GameObject, Player } from "../Utils";

export interface GameProps {
    onGameEnd: () => void
    gameObjects: GameObject[]
    player: Player
    socket: SocketHandler
}
export default function Game(props: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    function onDraw(ctx: CanvasRenderingContext2D) {
        //draw all game objects
        props.gameObjects.forEach((go) => {
            ctx.fillStyle = go.color
            ctx.fillRect(go.x, go.y, 50, 50)
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
            sendAction("set_pos", { x, y })
            //send message update pos
        }
        canvas.addEventListener('mousemove', onMove)
        return () => {
            canvas.removeEventListener('mousemove', onMove)
            cancelAnimationFrame(animationFrameId);
        };
    }, [])
    return (
        <div className="full" style={{ overflow: 'hidden' }}>
            <canvas ref={canvasRef} ></canvas>
            <div className="game-panel">
                {props.player.isHost && <button onClick={props.onGameEnd}>end</button>}
                <div>
                    {props.player.name}
                </div>
            </div>
        </div>
    );
}