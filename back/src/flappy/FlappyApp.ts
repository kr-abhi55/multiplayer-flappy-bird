import { FlappyExpressServer } from "./FlappyExpressServer.js";
import { FlappyServerSocket } from "./FlappyServerSocket.js";


export namespace FlappyApp {
    export function run() {
        //start express
        const expressServer = FlappyExpressServer.getInstance()
        const socketServer = FlappyServerSocket.getInstance()
    }
}