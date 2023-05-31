export interface Player {
    name: string,
    id: string
    roomID: string
}
export type ActionType = "d"


export type MessageType =
"room/create" | "room/created" | "room/closed" | "room/join"|"room/joined"|
"player/add" | "player/remove"
