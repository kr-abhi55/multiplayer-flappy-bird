import WebSocket, { WebSocketServer } from 'ws';
import http from "http";
/**

room
    create join get-player
game
    update/go delete/go 
 */
type MessageType = "create/room" | "join/room" | "dis-join/room" | "room/closed" | "get/rooms" |
    "remove-player" | "add-player" |
    "before/game/start" | "game/start" | "game/end" |
    "go/add" | "go/update" | "go/remove" |
    "game/action"
interface Player {
    name: string,
    playerID: string,
    ws: WebSocket,
    isHost: boolean
}
function playerWithoutWs(player: Player) {
    const { ws, ...others } = player
    return others
}
class Room {
    players: Player[] = []
    isBusy = false
    constructor(
        public roomID: string,
        public host: Player
    ) { }

    addPlayer(player: Player) {
        console.log("added", player.playerID)
        //send add-player to players (except player) and host
        this.sendToAll("add-player", {
            name: player.name,
            playerID: player.playerID,
            isHost: false
        }, player.playerID)
        this.players.push(player)
    }
    removePlayer(playerID: string) {
        console.log("removed", playerID)
        //send remove-player to all player (except player with playerID) and host
        this.sendToAll("remove-player", playerID, playerID)
        this.players = this.players.filter((v) => v.playerID !== playerID)
    }
    /*-----------------------------------*/
    sendMessageToPlayers(type: MessageType, data: any) {
        this.players.forEach((e) => {
            this.sendMessage(e.ws, type, data)
        })
    }
    sendMessage(ws: WebSocket, type: MessageType, data: any) {
        ws.send(JSON.stringify({ type, data }))
    }
    sendToAll(type: MessageType, data: any, exceptPlayerID = "", toHost = true) {
        this.players.forEach((e) => {
            if (e.playerID != exceptPlayerID) {
                //send message
                this.sendMessage(e.ws, type, data)
            }
        })
        if (toHost)
            this.sendMessage(this.host.ws, type, data)
    }
    close() {
        //send room/close to all player
        this.sendToAll("room/closed", this.roomID, "", false)

    }
    getAllPlayer() {
        return [
            playerWithoutWs(this.host),
            ...this.players.map((value) => {
                const { ws, ...withoutWs } = value
                return withoutWs
            })
        ]

    }
    getPlayerBy(id: string) {
        return this.players.find((v) => v.playerID == id)
    }
}
export default class SocketHandler {
    wss: WebSocket.Server<WebSocket.WebSocket>
    rooms = new Map<string, Room>()
    sendMessage(ws: WebSocket, type: MessageType, data: any) {
        ws.send(JSON.stringify({ type, data }))
    }
    private addObserver() {
        this.wss.on('connection', (ws) => {
            let player_id: string = ""
            let room_id: string = ""
            let is_host = false
            //console.log("connected")
            ws.on('message', async (message) => {
                const { type, data }: { type: MessageType, data: any } = JSON.parse(message.toString('utf-8'))
                // console.log(type, data)
                if (type == 'create/room') {
                    const { playerID, roomID, name } = data
                    const room = new Room(roomID, { playerID: playerID, name: name, ws: ws, isHost: true })
                    this.rooms.set(roomID, room)
                    player_id = playerID
                    room_id = roomID
                    is_host = true
                    this.sendMessage(ws, type, {})
                } else if (type == 'join/room') {
                    const { playerID, roomID, name } = data
                    player_id = playerID
                    room_id = roomID
                    const room = this.rooms.get(roomID)
                    if (room) {
                        //send all other player + host except itself
                        this.sendMessage(ws, type, room.getAllPlayer())
                        room.addPlayer({ isHost: false, playerID: playerID, name: name, ws: ws })
                    }
                    console.log("joined ", room?.getPlayerBy(playerID)?.name)
                } else if (type == 'before/game/start') {
                    //send to all player except host
                    const room = this.rooms.get(room_id)
                    if (room) {
                        //send all other player + host except itself
                        room.sendToAll(type, data, "", false)
                    }
                } else if (type == 'game/start') {
                    //only send by host
                    if (is_host) {
                        const room = this.rooms.get(room_id)
                        if (room) {
                            room.isBusy=true
                            room.sendToAll(type, data, "", false)
                        }
                    }

                }
                else if (type == 'game/end') {
                    //only send by host
                    if (is_host) {
                        const room = this.rooms.get(room_id)
                        if (room) {
                            room.isBusy=false
                            room.sendToAll(type, data, "", false)
                        }
                    }

                }
                else if (type == 'game/action') {
                    const room = this.rooms.get(room_id)
                    if (room) {
                        data.playerID = player_id
                        this.sendMessage(room.host.ws, type, data)
                    }

                }
                else if (type == 'go/update') {
                    console.log(type)
                    //only host can send
                    if (is_host) {
                        //send to all players
                        const room = this.rooms.get(room_id)
                        if (room) {
                            room.sendToAll(type, data, "", false)
                        }
                    }
                }
            });

            ws.on('close', () => {
                //check ws is player or host
                //console.log("dis-connected", player_id, player_id.length)
                const room = this.rooms.get(room_id)
                if (room) {
                    if (room.host.playerID == player_id) {
                        // ws is host
                        this.rooms.delete(room_id)
                        room.close()
                    } else {
                        // ws is player
                        console.log("dis-joined", room?.getPlayerBy(player_id)?.name)
                        room.removePlayer(player_id)

                    }
                }
            });
        });
    }

    constructor(server: http.Server) {
        this.wss = new WebSocketServer({ server });
        this.addObserver()
    }

}