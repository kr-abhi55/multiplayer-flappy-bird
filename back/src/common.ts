import { Room } from "./Room"
import WebSocket from "ws"
export interface Player {
    name: string
    id: string
    roomID: string
}
export type MessageType =
    "room/create" | "room/created" | "room/closed" | "room/join" | "room/joined" |
    "player/add" | "player/remove" | "game/start" | "game/end" |
    "go/add" | "go/update" | "go/remove" |
    "game/action"

export interface SocketInfo {
    ws: WebSocket.WebSocket
}
export interface FlappySocketInfo extends SocketInfo {
    room: Room | null
    playerID: string
    isHost: boolean
}
export function removeWs(info: SocketInfo) {
    const { ws, ...withoutWs } = info
    return withoutWs
}
