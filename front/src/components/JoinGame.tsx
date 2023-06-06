import { MutableRefObject, useEffect, useRef } from "react";
import { GameObject, Player, ActionType, Point } from "../ts/common";
import { JoinSocket } from "../ts/socket/JoinSocket";

export interface GameProps {
    gosRef: React.MutableRefObject<Map<string, GameObject>>
    player: Player
    socket: JoinSocket
    goId: string


}
export default function JoinGame(props: GameProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null)
    function onDraw(ctx: CanvasRenderingContext2D) {
        const diff = playerGO().position.x - ctx.canvas.width * 0.5
        const offset: Point = {
            x: diff > 0 ? diff : 0,
            y: 0
        }
        ctx.save()
        ctx.translate(-offset.x, offset.y)
        //draw all game objects
        props.gosRef.current.forEach((go) => {
            ctx.fillStyle = go.color
            ctx.fillRect(go.position.x, go.position.y, go.width, go.height)
        })
        ctx.restore()
    }
    function sendAction(type: ActionType, data: any) {
        props.socket.sendAction(type, data)
    }

    function playerGO() {
        return props.gosRef.current.get(props.goId)!
    }

    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!
        let animationFrameId: number;

        const render = () => {
            context.clearRect(0, 0, canvas.width, canvas.height)
            onDraw(context)
            animationFrameId = requestAnimationFrame(render)
        }
        animationFrameId = requestAnimationFrame(render)

        const keyDown = (e: KeyboardEvent) => {
            sendAction("key", {
                playerID: props.player.id,
                key: e.key,
                keyState: "down"
            })

        }
        window.addEventListener("keydown", keyDown)
        const keyUp = (e: KeyboardEvent) => {
            sendAction("key", {
                playerID: props.player.id,
                key: e.key,
                keyState: "up"
            })
        }
        window.addEventListener("keyup", keyUp)
        return () => {
            cancelAnimationFrame(animationFrameId);
            window.removeEventListener("keydown", keyDown)
            window.removeEventListener("keyup", keyUp)
        };
    }, [])
    return (
        <div className="full center" style={{ overflow: 'hidden' }}>
            <canvas width={500} height={400} ref={canvasRef} ></canvas>
            <div className="game-panel">
                <div>
                    {props.player.name}
                </div>
            </div>
        </div>
    );
}