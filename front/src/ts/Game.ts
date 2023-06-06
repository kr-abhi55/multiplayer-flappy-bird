import { MutableRefObject } from "react";
import { GameObject } from "./common";

export class Game {
    width = 500
    height = 300
    private draw(ctx: CanvasRenderingContext2D, gos: GameObject[]) {

        gos.forEach((go) => {

            ctx.fillStyle = go.color
            ctx.fillRect(go.position.x, go.position.y, go.width, go.height)
        })

        //draw line up and bottom

    }
    constructor(public gosRef: MutableRefObject<GameObject[]>) {

    }
    setSize(width: number, height: number) {
        this.width = width
        this.height = height
    }

    update(ctx: CanvasRenderingContext2D, dt: number) {
        const gos = this.gosRef.current
        this.draw(ctx, gos)
        this.gosRef.current = gos

    }
    onPlayerCollide(player: GameObject) {

    }
    onPlayerOutOfArea(player: GameObject) {

    }

}