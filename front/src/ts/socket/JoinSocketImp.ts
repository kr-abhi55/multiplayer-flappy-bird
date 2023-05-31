import { GameObject } from "../Utils";
import { Player, MessageType, ActionType } from "../common";
import { ClientSocketImp } from "./ClientSocketImp";
import { JoinSocket } from "./JoinSocket";


export class JoinSocketImp extends ClientSocketImp implements JoinSocket {
    constructor(url: string) {
        super(url)
    }
    joinRoom(player: Player): void {
        this.sendMessage('room/join', player)
    }
    sendAction(action: ActionType, data: any): void {

    }
    onMessage(type: MessageType, data: any): void {
        super.onMessage(type, data)
        switch (type) {
            case "room/joined":
                this.onJoinRoom(data)
                break;
            case "room/closed":
                this.onCloseRoom()
                break;

            default:
                break;
        }
    }
    onJoinRoom(player: Player[]): void { }
    onCloseRoom(): void { }
    onGameStart(gos: GameObject[]): void { }
    onGameEnd(): void { }
    onStartWait(): void { }
    onEndWait(): void { }
    onGoAdd(go: GameObject): void { }
    onGoRemove(goID: string): void { }
    onGoUpdate(gos: GameObject[]): void { }


}