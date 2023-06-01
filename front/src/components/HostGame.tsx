
import { useEffect, useRef } from "react";
import { HostSocket } from "../ts/socket/HostSocket";
import { Player, ActionType, GameObject } from "../ts/common";

export interface GameProps {
    onGameEnd: () => void
    gameObjects: GameObject[]
    player: Player
    socket: HostSocket
}
export default function HostGame(props: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    function onDraw(ctx: CanvasRenderingContext2D) {
        //draw all game objects
        props.gameObjects.forEach((go) => {
            ctx.fillStyle = go.color
            ctx.fillRect(go.x, go.y, 50, 50)
        })
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
               <button onClick={props.onGameEnd}>End</button>
                <div>
                    {props.player.name}
                </div>
            </div>
        </div>
    );
}