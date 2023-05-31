import express from "express";
import { ExpressServerImp } from "../ExpressServerImp.js";
import cors from 'cors'
import { FlappyServerSocket } from "./FlappyServerSocket.js";

export class FlappyExpressServer extends ExpressServerImp {
    private static instance: FlappyExpressServer | null = null;
    private constructor(port: number) {
        super(port)
        this.app.use(cors({ origin: "*" }))
        this.app.use(express.json());
        this.app.use(express.urlencoded());

        this.app.get("/", (req, res) => {
            res.send("<h1>Server is working</h1>")
        })
        this.app.get("/room/exist/:id", (req, res) => {
            const id = req.params.id
            const room = FlappyServerSocket.getInstance().rooms.get(id)
            console.log(Array.from(FlappyServerSocket.getInstance().rooms.keys()),room)
            if (room) {
                return res.json({ result: "success" })
            }
            res.status(400).json({ error: "room not exist" })
        })
        this.app.get("/room/can-join/:id", (req, res) => {
            const id = req.params.id
            console.log("id", id)
            const room = FlappyServerSocket.getInstance().rooms.get(id)
            if (room) {
                if (room.IsBusy()) {
                    return res.status(400).json({ error: "room is busy" })
                }
                return res.json({ result: "success" })
            }
            res.status(400).json({ error: "room not exist" })
        })
    }
    public static getInstance(): FlappyExpressServer {
        if (!FlappyExpressServer.instance) {
            const port = parseInt(process.env.EXPRESS_PORT || "3000")
            FlappyExpressServer.instance = new FlappyExpressServer(port);
            FlappyExpressServer.instance.listen((p) => {
                console.log(`server running on http://localhost:${port}`)
            })
        }
        return FlappyExpressServer.instance;
    }
}