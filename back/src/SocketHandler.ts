import WebSocket, { WebSocketServer } from 'ws';
import http from "http";
/**

room
    create join get-player
game
    update/go delete/go 
 */
type MessageType = "create/room" | "join/room" | "room/closed" | "get/rooms" | "go/add" | "go/update" | "go/delete" |
    "remove-player" | "add-player"
interface Player {
    name: string,
    playerID: string,
    ws: WebSocket,
    isHost: boolean
}
class Room {
    players: Player[] = []
    constructor(
        public roomID: string,
        public host: Player
    ) { }

    addPlayer(player: Player) {
        //send add-player to players (except player) and host
        this.sendToAll("add-player", {
            name: player.name,
            playerID: player.playerID,
            isHost: false
        })
        this.players.push(player)
    }
    removePlayer(playerID: string) {
        //send remove-player to all player (except player with playerID) and host
        this.sendToAll("remove-player", playerID, playerID)
    }
    /*-----------------------------------*/
    sendMessageToPlayers(type: MessageType, data: any) {
        this.players.forEach((e) => {
            this.sendMessage(e.ws, type, data)
        })
    }
    sendMessage(ws: WebSocket, type: MessageType, data: any) {
        ws.send(JSON.stringify(type, data))
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
}
export default class SocketHandler {
    wss: WebSocket.Server<WebSocket.WebSocket>
    rooms = new Map<string, Room>()
    private addObserver() {
        this.wss.on('connection', (ws) => {
            let player_id: string = ""
            let room_id: string = ""
            console.log("connected")
            ws.on('message', async (message) => {
                const { type, data }: { type: MessageType, data: any } = JSON.parse(message.toString('utf-8'))
                if (type == 'create/room') {
                    const { playerID, roomID, name } = data
                    const room = new Room(roomID, { playerID: playerID, name: name, ws: ws, isHost: true })
                    this.rooms.set(roomID, room)
                    player_id = playerID
                    room_id = roomID
                    console.log(type)
                } else if (type == 'join/room') {
                    const { playerID, roomID, name } = data
                    player_id = playerID
                    room_id = roomID
                    const room = this.rooms.get(roomID)
                    if (room) {
                        room.addPlayer({ isHost: false, playerID: playerID, name: name, ws: ws })
                    }
                }
            });

            ws.on('close', () => {
                //check ws is player or host
                console.log("dis-connected")
                const room = this.rooms.get(room_id)
                if (room) {
                    if (room.host.playerID == player_id) {
                        // ws is host
                        room.close()
                        this.rooms.delete(room_id)
                    } else {
                        // ws is player
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