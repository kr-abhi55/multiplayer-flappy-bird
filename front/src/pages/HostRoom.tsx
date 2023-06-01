import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Player } from "../ts/common"
import { HostSocket } from "../ts/socket/HostSocket"
import { Utils } from "../ts/Utils"
import { HostSocketImp } from "../ts/socket/HostSocketImp "
import HostLobby from "../components/HostLobby"


export default function HostRoom() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [isLobby, setIsLobby] = useState(true)
    const [player, setPlayer] = useState<Player>()
    const [socket, setSocket] = useState<HostSocket>()
    const [players, setPlayers] = useState<Player[]>([])
    /*------------------------------*/
    const initSocket = (player: Player) => {
        return new (class extends HostSocketImp {
            onConnected(): void {
                this.createRoom(player)
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
    }
    const makePlayer = (name: string, roomID: string) => {
        return {
            name: name,
            id: Utils.generateID(),
            roomID: roomID
        } as Player
    }
    /*-------useEffect----------------*/
    //update player
    useEffect(() => {
        if (!state) {
            navigate("/")
        } else {
            const { name, roomID } = state
            const _player = makePlayer(name, roomID)
            setPlayer(_player)
        }
    }, [])
    //init socket Socket
    useEffect(() => {
        let _socket: HostSocket
        if (player) {
            _socket = initSocket(player)
            setSocket(_socket)
        }
        return () => {
            if (_socket) {
                _socket.close()
            }
        }
    }, [player])
    function handleStart() {

    }
    return (
        <div className="full">

            {(state && player && socket) &&
                ((isLobby) ?
                    <HostLobby players={players} onStart={handleStart} player={player} />
                    :
                    <div />
                )}
        </div>
    )
}