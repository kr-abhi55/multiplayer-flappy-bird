import { useEffect, useRef, useState } from "react"
import { useLocation, useNavigate } from "react-router"
import { ActionType, GameObject, Player } from "../ts/common"
import { HostSocket } from "../ts/socket/HostSocket"
import { Utils } from "../ts/Utils"
import { HostSocketImp } from "../ts/socket/HostSocketImp "
import HostLobby from "../components/HostLobby"
import HostGame from "../components/HostGame"


export default function HostRoom() {
    const { state } = useLocation()
    const navigate = useNavigate()
    const [isLobby, setIsLobby] = useState(true)
    const [player, setPlayer] = useState<Player>()
    const [socket, setSocket] = useState<HostSocket>()
    const [players, setPlayers] = useState<Player[]>([])
    const gosRef = useRef<GameObject[]>([])
    const playerGoMap = useRef(new Map<string, GameObject>())
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
            onGameAction(type: ActionType, data: any): void {
                const go = goByPlayerID(data.playerID)
                if (go) {

                    go.key = data.key
                    go.keyState = data.keyState
                    playerGoMap.current.set(data.playerID, go)
                }
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
    function makePlayerGo() {
        const go = new GameObject()
        go.id = Utils.generateID()
        go.color = Utils.getRandomColor()
        go.position = { x: Math.random() * 150, y: 200 }
        go.velocity.x=100
        go.tag = "player"
        return go
    }
    function initGame() {
        const gos = Array<GameObject>()
        const map = new Map<string, GameObject>()
        const go = makePlayerGo()
        gos.push(go)
        if (player) {
            map.set(player.id, go)
        }
        //add player gameObject and set in map
        players.forEach((player) => {
            const go = makePlayerGo()
            gos.push(go)
            map.set(player.id, go)
        })
        //send gameObject to all players by before/game/start
        socket?.sendMessage("game/start", gos)
        gosRef.current = gos
        playerGoMap.current = map
    }
    function handleStart() {
        initGame()
        setIsLobby(false)
    }
    function handleEnd() {
        socket?.sendMessage("game/end", {})
        setIsLobby(true)
    }
    function goByPlayerID(playerID: string) {
        return playerGoMap.current.get(playerID)
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

    return (
        <div className="full">

            {(state && player && socket) &&
                ((isLobby) ?
                    <HostLobby players={players} onStart={handleStart} player={player} />
                    :
                    <HostGame go={playerGoMap.current.get(player.id)!} gosRef={gosRef} onGameEnd={handleEnd} player={player} socket={socket} />
                )}
        </div>
    )
}