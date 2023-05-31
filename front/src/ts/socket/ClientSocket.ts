import { MessageType, Player } from "../common";

export abstract class ClientSocket {
    abstract sendMessage(type: MessageType, data: any): void
    abstract close(): void
    onMessage(type: MessageType, data: any) { }
    onConnected() { }
    onDisConnected() { }
    onAddPlayer(player: Player) { }
    onRemovePlayer(playerID: string) { }
}