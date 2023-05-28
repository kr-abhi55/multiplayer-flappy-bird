import { useEffect } from "react";
import SocketHandler from "../SocketHandler";
import { Player, Utils } from "../Utils";

export interface LobbyProps {
    player: Player
    socket: SocketHandler,
    onStart?: () => void
}
export default function Lobby(props: LobbyProps) {
    useEffect(() => {
        console.log("lobby", props.socket)
    }, [])
    function click() {

    }
    return (
        <div onClick={click} >
            Lobby {props.player.roomID}
        </div>
    );
}