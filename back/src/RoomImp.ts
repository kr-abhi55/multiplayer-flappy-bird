import WebSocket from "ws";
import { Room } from "./Room.js";
import { Player, HostToPlayerMessage, PlayerToHostMessage, RoomToPlayerMessage } from "./common.js";
class RoomImp extends Room {
    private players: Player[] = []
    private playerIDWsMap: Map<string, WebSocket.WebSocket> = new Map()
    isBusy = false

    constructor(public id: string, public host: Player) {
        super();
    }

    addPlayer(player: Player, ws: WebSocket): void {
        this.sendMessageToAllPlayers("player/add", player)
        this.players.push(player);
        this.playerIDWsMap.set(player.id, ws);
    }

    removePlayer(playerID: string): void {
        const index = this.players.findIndex((player) => player.id === playerID);
        if (index !== -1) {
            this.players.splice(index, 1);
            this.playerIDWsMap.delete(playerID);
        }
        this.sendMessageToAllPlayers("player/remove", playerID)
    }

    sendMessageToAllPlayers(type: RoomToPlayerMessage, data: any): void {
        for (const [playerID, ws] of this.playerIDWsMap.entries()) {
            if (playerID !== this.host.id) {
                ws.send(JSON.stringify({ type, data }));
            }
        }
    }


    sendMessageToHost(type: PlayerToHostMessage, data: any): void {
        const ws = this.playerIDWsMap.get(this.host.id);
        if (ws) {
            ws.send(JSON.stringify({ type, data }));
        }
    }

    close(): void {
        //when host disconnect
        this.sendMessageToAllPlayers('room/closed', {})
    }

    getAllPlayers(): Player[] {
        return this.players;
    }

    getPlayerByID(playerID: string): Player | null {
        return this.players.find((player) => player.id === playerID) || null;
    }
}