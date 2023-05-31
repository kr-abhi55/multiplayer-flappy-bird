import WebSocket from "ws";
import { Room } from "./Room.js";
import { MessageType, Player } from "./common.js";
export class RoomImp extends Room {

    private players: Player[] = []
    private playerIDWsMap: Map<string, WebSocket.WebSocket> = new Map()
    isBusy = false

    constructor(public id: string, public host: Player, ws: WebSocket.WebSocket) {
        super();
        this.playerIDWsMap.set(host.id, ws)
    }

    setIsBusy(isBusy: boolean): void {
        this.isBusy = isBusy
    }
    IsBusy(): boolean {
        return this.isBusy
    }
    addPlayer(player: Player, ws: WebSocket): void {
        this.sendToAll("player/add", player)
        this.players.push(player);
        this.playerIDWsMap.set(player.id, ws);
    }


    removePlayer(playerID: string): void {
        const index = this.players.findIndex((player) => player.id === playerID);
        if (index !== -1) {
            this.players.splice(index, 1);
            this.playerIDWsMap.delete(playerID);
        }
        this.sendToAll("player/remove", playerID, playerID)
    }

    sendMessageToAllPlayers(type: MessageType, data: any): void {
        for (const [playerID, ws] of this.playerIDWsMap.entries()) {
            if (playerID !== this.host.id) {
                ws.send(JSON.stringify({ type, data }));
            }
        }
    }
    sendToAll(type: MessageType, data: any, exceptID: string = "", toHost: boolean = true): void {
        for (const [playerID, ws] of this.playerIDWsMap.entries()) {
            //write condition
            console.log("players ", Array.from(this.playerIDWsMap.keys()))
            if ((playerID == this.host.id && toHost) || playerID != exceptID) {
                ws.send(JSON.stringify({ type, data }));
            }
        }
    }


    sendMessageToHost(type: MessageType, data: any): void {
        const ws = this.playerIDWsMap.get(this.host.id);
        if (ws) {
            ws.send(JSON.stringify({ type, data }));
        }
    }

    close(): void {
        //when host disconnect
        this.sendToAll('room/closed', this.host.roomID, "", false)
    }

    getAllPlayers(): Player[] {
        return [this.host, ...this.players];
    }

    getPlayerByID(playerID: string): Player | null {
        return this.players.find((player) => player.id === playerID) || null;
    }
    getHost(): Player {
        return this.host
    }
}