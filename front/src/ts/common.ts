export interface Player {
    name: string,
    id: string
    roomID: string
}
export type ActionType = "key"|""


export type MessageType =
    "room/create" | "room/created" | "room/closed" | "room/join" | "room/joined" |
    "player/add" | "player/remove" | "game/start" | "game/end" |
    "go/add" | "go/update" | "go/remove" |
    "game/action"
export interface GameObject {
    id: string
    x: number
    y: number
    color: string
    key: string
    keyState: "up" | "down"
}
