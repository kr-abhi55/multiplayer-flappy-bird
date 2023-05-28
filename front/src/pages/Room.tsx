import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Lobby from "../components/Lobby";
import Game from "../components/Game";
import { Player, Utils } from "../Utils";
import SocketHandler from "../SocketHandler";

export default function Room() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [isLobby, setIsLobby] = useState(true)
    const [socketHandler, setSocketHandler] = useState<SocketHandler>()
    const [player, setPlayer] = useState<Player>()
    useEffect(() => {
        let _socketHandler: SocketHandler;
        if (!state) {
            navigate("/")
        } else {
            const { name, roomName, isHost } = state
            const _roomInfo: Player = {
                isHost: isHost,
                name: name,
                playerID: Utils.generateID(),
                roomID: roomName
            }
            setPlayer(_roomInfo)
            //create socket
            _socketHandler = new SocketHandler(Utils.env.SOCKET_URL)
            setSocketHandler(_socketHandler)
        }
        console.log("room open")

        return () => {
            if (_socketHandler) {
                setTimeout(() => {
                    _socketHandler.close()
                }, 50);
            }
            console.log("room close", _socketHandler)
        }
    }, [])

    useEffect(() => {
        if (socketHandler && player) {
            socketHandler.setOnConnectedListener(() => {
                if (player.isHost) {
                    socketHandler.createRoom(player)
                } else {

                }
            })
        }
    }, [socketHandler, player])
    return (
        <div className="full">

            {(state && player && socketHandler) &&
                ((isLobby) ?
                    <Lobby player={player} socket={socketHandler} />
                    :
                    <Game player={player} socket={socketHandler} />)
            }
        </div>
    );
}