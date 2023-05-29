import { useEffect, useState } from "react";
import SocketHandler, { EventCallback } from "../SocketHandler";
import { Player, Utils } from "../Utils";

export interface LobbyProps {
    player: Player
    socket: SocketHandler,
    onStart?: () => void
}
function Item({ player, isSelf }: { player: Player, isSelf: boolean }) {
    return (
        <div className="item">{player.name}{player.isHost && "@host"}{isSelf && "@me"}</div>
    )
}
export default function Lobby(props: LobbyProps) {
    const [players, setPlayers] = useState<Player[]>([])
    useEffect(() => {
        let callback: EventCallback
        if (props.player.isHost) {
            callback = props.socket.setOnEventCallbackListener({
                onRoomCreated() {
                    console.log("room created")
                },
                onRoomClosed() {
                    console.log("room closed")
                },
                onAddPlayer(data) {
                    console.log("add", data)
                    setPlayers((old) => [...old, data])
                },
                onRemovePlayer(data) {
                    console.log("removed", data, players)
                    setPlayers((old) => {
                        const f = old.filter((p) => p.playerID !== data)
                        return f
                    });
                },

            })
        } else {
            callback = props.socket.setOnEventCallbackListener({
                onJoinedRoom(data) {
                    console.log("joined", data)
                    setPlayers(data)
                },
                onDisJoinedRoom() {
                    console.log("dis-joined")
                },
                onAddPlayer(data) {
                    console.log("add", data)
                    setPlayers((old) => [...old, data])
                },
                onRemovePlayer(data) {
                    console.log("removed", data, players)
                    setPlayers((old) => {
                        const f = old.filter((p) => p.playerID !== data)
                        return f
                    });
                },

            })
        }
        return () => {
            if (callback) {
                props.socket.removeOnEventCallbackListener(callback)
            }
        }
    }, [])
    function click() {

    }
    return (
        <div className="full lobby" >
            <div className="lobby-header">
                <div className="lobby-title">
                    {props.player.isHost ? "Host" : "Player"}
                </div>
                <div>Name:{props.player.name}</div>
                <div>RoomID:{props.player.roomID}</div>
            </div>
            <div className="lobby-list">
                <div>Players</div>
                <div className="lobby-list-main">
                    <Item player={props.player} isSelf={true} />
                    {players.map((player, i) => (
                        <Item key={i} player={player} isSelf={false} />
                    ))}
                </div>
            </div>
        </div>
    );
}
