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
            // sendAction("set_pos", { x, y })
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
                <div>
                    {props.player.name}
                </div>
            </div>
        </div>
    );
}