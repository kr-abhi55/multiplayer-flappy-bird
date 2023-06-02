import { ActionType, Player } from "../common";
import { ClientSocket } from "./ClientSocket";



export abstract class HostSocket extends ClientSocket {
    abstract createRoom(player: Player): void
    abstract onRoomCreated(): void
    abstract onRoomClosed(): void
    abstract onGameAction(type: ActionType, data: any): void


}