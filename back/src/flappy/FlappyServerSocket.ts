import { ServerSocketImp } from "../ServerSocketImp.js";
import { FlappySocketInfo, MessageType, Player, SocketInfo, removeWs } from "../common.js";
import http from 'http'
import { FlappyExpressServer } from "./FlappyExpressServer.js";
import { Room } from "../Room.js";
import { RoomImp } from "../RoomImp.js";

export class FlappyServerSocket extends ServerSocketImp {
    private static instance: FlappyServerSocket | null = null;
    rooms = new Map<string, Room>()
    private constructor(server: http.Server) {
        super(server);
    }

    public static getInstance(): FlappyServerSocket {
        if (!FlappyServerSocket.instance) {
            const server = FlappyExpressServer.getInstance().getServer()
            console.log("created FlappyExpressServer")
            if (server == null) {
                throw new Error("you must listen to the server first");

            }
            FlappyServerSocket.instance = new FlappyServerSocket(server);
        }
        return FlappyServerSocket.instance;
    }
    override onMessage(si: FlappySocketInfo, message: any) {
        const { type, data }: {
            type: MessageType, data: any
        } = message
        //console.log(type, data)
        if (type == "room/create") {
            const player = data as Player
            const room = new RoomImp(player.roomID, player, si.ws)
            si.isHost = true
            si.playerID = player.id
            si.room = room
            this.rooms.set(player.roomID, room)
            this.sendMessage(si.ws, "room/created", {})
        } else if (type == "room/join") {
            const player = data as Player
            const room = this.rooms.get(player.roomID)
            if (room) {
                si.isHost = false
                si.playerID = player.id
                si.room = room
                this.sendMessage(si.ws, 'room/joined', room.getAllPlayers())
                room.addPlayer(player, si.ws)
            }
        } else {
            if (si.isHost) {
                this.onHostMessage(si, message)
            } else {
                this.onPlayerMessage(si, message)
            }
        }
    }
    onHostMessage(si: FlappySocketInfo, message: any) {
        /*
        *-message is send by host to send to all players
        *-game/start,end,wait go/update,add,remove
        *-game/start is send to only one player at a time
        */
        const { type, data }: {
            type: MessageType, data: any
        } = message
        si.room?.sendMessageToAllPlayers(type, data)
        // switch (type) {
        //     case "game/start":
        //         const { playerID, gos } = data
        //         si.room?.sendMessageToPlayer(playerID, type, gos)
        //         break;
        //     default:

        //         break;
        // }


    }

    onPlayerMessage(si: FlappySocketInfo, message: any) {
        /**
         * send by player to host like game/action
         */
        const { type, data }: {
            type: MessageType, data: any
        } = message
        si.room?.sendMessageToHost(type, data)
    }
    onConnected(): void {
        console.log("socket server connected")
    }
    onDisconnected(): void {
        console.log("socket server dis-connected")
    }
    onSocketConnected(socketInfo: FlappySocketInfo): void {
        socketInfo.isHost = false
        socketInfo.playerID = ""
        socketInfo.room = null
    }
    onSocketDisconnected(si: FlappySocketInfo): void {
        if (si.room) {
            if (si.isHost) {
                console.log("deleted " + si.room.getHost().roomID)
                this.rooms.delete(si.room.getHost().roomID)
                si.room.close()
            } else {
                si.room.removePlayer(si.playerID)
            }
        }
    }


}