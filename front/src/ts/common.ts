export interface Player {
    name: string,
    id: string
    roomID: string
}
export type ActionType = "key" | ""


export type MessageType =
    "room/create" | "room/created" | "room/closed" | "room/join" | "room/joined" |
    "player/add" | "player/remove" | "game/start" | "game/end" |
    "go/add" | "go/update" | "go/remove" |
    "game/action"
export interface Point {
    x: number
    y: number
}
export class GameObject {
    id: string = ""
    width=50
    height=50
    position: Point = { x: 0, y: 0 }
    velocity: Point = { x: 0, y: 0 }
    color: string = "black"
    key: string = ""
    keyState: "up" | "down" = "up"
    bodyType: "dynamic" | "static" = "dynamic"
    tag: "wall" | "player" = "player"

}
