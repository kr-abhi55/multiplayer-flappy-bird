import { useEffect, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { Player } from "../ts/common"
import { Utils } from "../ts/Utils"
import { JoinSocketImp } from "../ts/socket/JoinSocketImp"
import { JoinSocket } from "../ts/socket/JoinSocket"
import JoinLobby from "../components/JoinLobby"


export default function JoinRoom() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [isLobby, setIsLobby] = useState(true)
    const [player, setPlayer] = useState<Player>()
    const [socket, setSocket] = useState<JoinSocket>()
    const [players, setPlayers] = useState<Player[]>([])
    /*------------------------------*/
    const initSocket = (player: Player) => {
        return new (class extends JoinSocketImp {
            async onConnected(): Promise<void> {
                //if room exist
                const { error, result } = await Utils.getJson("room/exist/" + player.roomID)
                if (result) {
                    return this.joinRoom(player)
                }
                return navigate("/join")
            }
            onCloseRoom(): void {
                navigate("/join",{replace:true})
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
    }
    const makePlayer = (name: string, roomID: string) => {
        return {
            name: name,
            id: Utils.generateID(),
            roomID: roomID
        } as Player
    }
    /*-------useEffect----------------*/
    useEffect(() => {
        if (!state) {
            navigate("/")
        } else {
            const { name, roomID } = state
            const _player = makePlayer(name, roomID)
            setPlayer(_player)
        }
    }, [])
    useEffect(() => {
        let _socket: JoinSocket
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
    return (
        <div className="full">

        {(state && player && socket) &&
            ((isLobby) ?
                <JoinLobby players={players} player={player} />
                :
                <div />
            )}
    </div>
    )
}