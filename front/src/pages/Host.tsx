import { useState } from "react"
import { useNavigate } from "react-router"
import { Utils } from "../ts/Utils"

export default function Host() {
    const navigate = useNavigate()
    const [name, setName] = useState("")
    const [roomID, setRoomID] = useState("")
    async function handleCreate() {
        if (name.trim().length == 0 || roomID.trim().length == 0) {
            return alert("input can't be empty")
        }
        //check if room exist or not
        const { error, result } = await Utils.getJson("room/exist/" + roomID)
        console.log(error,result)
        if (error) {
            return navigate("/host-room", { state: { name, roomID } })
        }
        return alert(roomID + " already exist")
    }

    return (
        <div className="full host">
            <div className="host-box">
                <label className="host-label" htmlFor="">Host</label>
                <input onChange={(e) => setName(e.target.value)} type="text" placeholder="name" />
                <input onChange={(e) => setRoomID(e.target.value)} type="text" placeholder="room name" />
                <button onClick={handleCreate}>Create</button>
            </div>
        </div>
    )
}