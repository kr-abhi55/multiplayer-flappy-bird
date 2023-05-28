import SocketHandler from "../SocketHandler";
import { Player } from "../Utils";

export interface GameProps {
    player:Player
    socket: SocketHandler
}
export default function Game(props: GameProps) {
    return (
        <div>
            Game
        </div>
    );
}