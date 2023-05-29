import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors'
import Utils from './Utils.js';
import SocketHandler from './SocketHandler.js';

const app = express();
app.use(cors({ origin: "*" }))
app.use(express.json());
app.use(express.urlencoded());

const server = app.listen(Utils.env.EXPRESS_PORT, () => {
    console.log('Server started on port http://localhost:' + Utils.env.EXPRESS_PORT);
});

const socketHandler = new SocketHandler(server)

/*---------------route----------------*/

app.get("/room", (req, res) => {
    res.json({ rooms: getRooms() })
})
app.get("/room/:id", (req, res) => {
    const id = req.params.id
    console.log("id",id)
    const room = socketHandler.rooms.get(id)
    if (room) {
        return res.json({ result: "success" })
    }
    res.status(400).json({ error: "room not exist" })
})

/*--------------*/
function getRooms() {
    const rooms = socketHandler.rooms
    return Array.from(rooms).map(([roomID, room]) => {
        const playersArray = Array.from(room.players).map((player) => {
            const { ws, ...playerWithoutWs } = player;
            return playerWithoutWs;
        });

        return {
            roomID,
            players: playersArray,
            // Include other properties from the Room interface if needed
        };
    });
}