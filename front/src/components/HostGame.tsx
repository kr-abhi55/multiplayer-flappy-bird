
import { MutableRefObject, Ref, useEffect, useRef, useState } from "react";
import { HostSocket } from "../ts/socket/HostSocket";
import { Player, ActionType, GameObject } from "../ts/common";
import { Game } from "../ts/Game";

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
    //const [game, setGame] = useState<Game>()

    function updateTick() {
        //only players
        const players = props.gosRef.current.filter((go) => go.tag == 'player')
        props.socket.sendMessage("go/update", players)
    }

    useEffect(() => {
        const canvas = canvasRef.current!;
        const context = canvas.getContext('2d')!
        let animationFrameId: number;

        console.log(props.go.position)
        const game = new Game(props.gosRef, props.go)
        game.setSize(canvas.width, canvas.height)
        let previousTime = 0;
        let isFirstFrame = true
        const render = (time: number) => {
            if (isFirstFrame) {
                isFirstFrame = false;
                previousTime = time;
                animationFrameId = requestAnimationFrame(render);
                return;
            }
            const dt = (time - previousTime) / 1000
            context.clearRect(0, 0, canvas.width, canvas.height)
            game.update(context, dt)
            updateTick()
            previousTime = time
            animationFrameId = requestAnimationFrame(render)
        }
        animationFrameId = requestAnimationFrame(render)

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

        return () => {
            window.removeEventListener("keydown", keyDown)
            window.removeEventListener("keyup", keyUp)

            cancelAnimationFrame(animationFrameId);

        };
    }, [])
    return (
        <div className="full center" style={{ overflow: 'hidden' }}>
            <canvas width={500} height={400} ref={canvasRef} ></canvas>
            <div className="game-panel">
                <button onClick={props.onGameEnd}>End</button>
                <div>
                    {props.player.name}
                </div>
            </div>
        </div>
    );
}