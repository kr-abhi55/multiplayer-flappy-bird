import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Player } from "../ts/common"
import { Utils } from "../ts/Utils"
import { JoinSocketImp } from "../ts/socket/JoinSocketImp"
import { JoinSocket } from "../ts/socket/JoinSocket"


export default function JoinRoom() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [isLobby, setIsLobby] = useState(true)
    const [player, setPlayer] = useState<Player>()
    const [socket, setSocket] = useState<JoinSocket>()
    const [players, setPlayers] = useState<Player[]>([])

    useEffect(() => {
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
        }
    }, [])
    useEffect(() => {
        let _socket: JoinSocket
        if (player) {
            _socket = new (class extends JoinSocketImp {
                async onConnected(): Promise<void> {
                    //if room exist
                    const { error, result } = await Utils.getJson("room/exist/" + player.roomID)
                    if (result) {
                        return _socket.joinRoom(player)
                    }
                    return navigate("/join")
                }
                onJoinRoom(players: Player[]): void {
                    setPlayers(players)
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
    }, [player])
    return (
        <div>
            {players.length}
        </div>
    )
}