import { Room } from "./Room"
import WebSocket from "ws"
export interface Player {
    name: string
    id: string
    roomID: string
}
export type HostToPlayerMessage =
    "game/start" | "game/end" | "game/wait" |
    "go/update" | "go/add" | "go/remove"

export type PlayerToHostMessage = "game/action"

export type RoomToPlayerMessage = "player/add" | "player/remove" | HostToPlayerMessage | "room/closed"

export interface SocketInfo {
    playerID: string
    ws: WebSocket.WebSocket
    isHost: boolean
    room: Room | null
}