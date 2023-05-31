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
                    //this.joinRoom(_player)
                    //if room exist
                    const { error, result } = await Utils.getJson("room/exist/" + player.roomID)
                    if (result) {
                        return _socket.joinRoom(player)
                    }
                    return navigate("/join")
                }
                onJoinedRoom(player: Player[]): void {
                    console.log(player)
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

        </div>
    )
}