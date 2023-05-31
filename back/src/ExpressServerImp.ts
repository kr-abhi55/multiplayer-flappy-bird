import express from "express";
import http from "http";
import { ExpressServer } from "./ExpressServer.js";


export class ExpressServerImp extends ExpressServer {


    protected app: express.Express
    protected server: http.Server | null = null
    constructor(
        public port: number
    ) {
        super()
        this.app = express()
    }

    getApp() {

        return this.app
    }
    getServer() {
        return this.server
    }
    listen(callback: (port: number) => void): void {
        this.server = this.app.listen(this.port, () => {
            callback(this.port)
        })
    }

}