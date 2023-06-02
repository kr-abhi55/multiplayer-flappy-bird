import { Player, MessageType, ActionType, GameObject } from "../common";
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
        this.sendMessage("game/action",{type:action,data})
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
            case "game/start":
                this.onGameStart(data)
                break;
            case "game/end":
                this.onGameEnd()
                break;

            case "go/add":
                this.onGoAdd(data)
                break;
            case "go/update":
                this.onGoUpdate(data)
                break;
            case "go/remove":
                this.onGoRemove(data)
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