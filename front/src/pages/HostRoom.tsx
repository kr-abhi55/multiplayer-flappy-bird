import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Player } from "../ts/common"
import { HostSocket } from "../ts/socket/HostSocket"
import { Utils } from "../ts/Utils"
import { HostSocketImp } from "../ts/socket/HostSocketImp "


export default function HostRoom() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [isLobby, setIsLobby] = useState(true)
    const [player, setPlayer] = useState<Player>()
    const [socket, setSocket] = useState<HostSocket>()
    const [players, setPlayers] = useState<Player[]>([])
    useEffect(() => {
        let _socket: HostSocket
        if (!state) {
            navigate("/")
        } else {
            const { name, roomID } = state
            const _player: Player = {
                name: name,
                id: Utils.generateID(),
                roomID: roomID
            }
            setPlayer(_player)
            //create socket
            _socket = new (class extends HostSocketImp {
                onConnected(): void {
                    this.createRoom(_player)
                }
                onDisConnected(): void {
                }
                onRoomCreated(): void {

                }
                onAddPlayer(player: Player): void {
                    setPlayers((old) => [...old, player])
                }
                onRemovePlayer(playerID: string): void {
                    setPlayers((old) => {
                        const f = old.filter((p) => p.id !== playerID)
                        return f
                    });
                }

            })(Utils.env.SOCKET_URL)
            setSocket(_socket)
        }
        return () => {
            if (_socket) {
                _socket.close()
            }
        }
    }, [])
    return (
        <div>
            {players.length}
        </div>
    )
}