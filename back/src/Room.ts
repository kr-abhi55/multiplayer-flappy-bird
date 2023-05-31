
import WebSocket from "ws"
import { MessageType, Player } from "./common.js";
export abstract class Room {
    abstract addPlayer(player: Player, ws: WebSocket.WebSocket): void;

    abstract removePlayer(playerID: string): void;

    abstract sendMessageToAllPlayers(type: MessageType, data: any): void;

    abstract sendMessageToHost(type: MessageType, data: any): void;
    abstract sendToAll(type: MessageType, data: any, exceptID: string, toHost: boolean): void;


    abstract close(): void;

    abstract getAllPlayers(): Player[]
    abstract setIsBusy(isBusy: boolean): void;
    abstract IsBusy(): boolean;
    abstract getPlayerByID(playerID: string): Player | null
    abstract getHost(): Player;

}