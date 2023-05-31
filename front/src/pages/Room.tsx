/*
import { useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router";
import Lobby from "../components/Lobby";
import Game from "../components/Game";
import { GameObject, Player, Utils } from "../Utils";
import SocketHandler, { ActionType, EventCallback } from "../SocketHandler";

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
        // console.log("room open")

        return () => {
            if (_socketHandler) {
                setTimeout(() => {
                    _socketHandler.close()
                }, 100);
            }
            // console.log("room close", _socketHandler)
        }
    }, [])

    useEffect(() => {
        let callback: EventCallback
        if (socketHandler && player) {
            callback = socketHandler.setOnEventCallbackListener({
                onConnected: async () => {
                    if (player.isHost) {
                        socketHandler.createRoom(player)
                    } else {
                        //if room exist
                        const { error, result } = await Utils.getJson("room/exist/" + player.roomID)
                        if (result) {
                            return socketHandler.joinRoom(player)
                        }
                        return navigate("/join")
                    }
                }

            })
        }
        return () => {
            if (callback && socketHandler) {
                socketHandler.removeOnEventCallbackListener(callback)
            }
        }
    }, [socketHandler, player])
    function handleStart() {
        //i'm host and going to start game
        hostInitGame()
        //send event starting
        socketHandler?.sendMessage("game/start", {})
        setIsLobby(false)
    }
    function hostInitGame() {
        const gos = Array<GameObject>()
        const map = new Map<string, GameObject>()
        const go: GameObject = {
            id: Utils.generateID(),
            color: 'red',
            x: Math.random() * 400,
            y: Math.random() * 300
        }
        gos.push(go)
        if (player) {
            map.set(player.playerID, go)
        }
        //add player gameObject and set in map
        players.forEach((player) => {
            const go: GameObject = {
                id: Utils.generateID(),
                color: 'red',
                x: Math.random() * 400,
                y: Math.random() * 300
            }
            gos.push(go)
            map.set(player.playerID, go)
        })
        //send gameObject to all players by before/game/start
        socketHandler?.sendMessage("before/game/start", {
            gameObjects: gos
        })
        setGameObjects(gos)
        playerGoMap.current = map
    }

    const [players, setPlayers] = useState<Player[]>([])
    const [gameObjects, setGameObjects] = useState<GameObject[]>([])
    const playerGoMap = useRef(new Map<string, GameObject>())

    useEffect(() => {
        let callback: EventCallback
        if (player && socketHandler) {
            if (player.isHost) {
                callback = socketHandler.setOnEventCallbackListener({
                    onGameAction(_data) {
                        const { type, data, playerID }: { type: ActionType, data: any, playerID: string } = _data
                        if (type == 'set_pos') {
                            const go = playerGoMap.current.get(playerID)
                            if (go) {
                                go.x = data.x
                                go.y = data.y
                                //send message update/go
                                socketHandler.sendMessage('go/update', go)
                            }
                        }
                    },
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
                //player
                callback = socketHandler.setOnEventCallbackListener({
                    onUpdateGameObject(data: GameObject) {
                        setGameObjects((old) => {
                            const i = old.findIndex((v) => v.id == data.id)
                            if (i != -1) {
                                old[i] = data
                            }
                            return old
                        })
                    },
                    onGameEnd() {
                        setIsLobby(true)
                    },
                    onGameStart(data) {
                        setIsLobby(false)
                    },
                    onBeforeGameStart(data) {
                        console.log("before start data", data)
                        setGameObjects(data.gameObjects)
                    },
                    onJoinedRoom(data) {
                        console.log("joined", data)
                        setPlayers(data)
                    },
                    onRoomClosed() {
                        alert("room closed")
                        navigate("/")
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
        }

        return () => {
            if (callback && socketHandler) {
                socketHandler.removeOnEventCallbackListener(callback)
            }
        }
    }, [player, socketHandler])
    function handleGameEnd() {
        setIsLobby(true)
        socketHandler?.sendMessage("game/end", {})
    }
    return (
        <div className="full">

            {(state && player && socketHandler) &&
                ((isLobby) ?
                    <Lobby players={players} onStart={handleStart} player={player} socket={socketHandler} />
                    :
                    <Game onGameEnd={handleGameEnd} gameObjects={gameObjects} player={player} socket={socketHandler} />)
            }
        </div>
    );
}

*/