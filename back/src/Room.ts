import { Player, HostToPlayerMessage, PlayerToHostMessage, RoomToPlayerMessage } from "./common";
import WebSocket from "ws"
export abstract class Room {
    abstract addPlayer(player: Player, ws: WebSocket.WebSocket): void;

    abstract removePlayer(playerID: string): void;

    abstract sendMessageToAllPlayers(type: RoomToPlayerMessage, data: any): void;

    abstract sendMessageToHost(type:PlayerToHostMessage, data: any): void;

    abstract close(): void;

    abstract getAllPlayers(): Player[]

    abstract getPlayerByID(playerID: string): Player | null
}