import { MutableRefObject } from "react";
import { GameObject } from "./common";

export class Game {
    width = 500
    height = 300
    
    public get bottom() : number {
        return this.height-25
    }
    public get top() : number {
        return 25
    }
    
    private input(gos: GameObject[]) {

        gos.forEach((go) => {
            if (go.key == " ") {
                go.velocity.y = -300
                go.key = ""
            }
        })

    }
    private physics(dt: number, gos: GameObject[]) {
        const g = 9.8 //px/s
        gos.forEach((go) => {
            if (go.bodyType == 'dynamic' && go.tag == 'player') {
                go.velocity.y += g
                go.position.y += go.velocity.y * dt
                go.position.x += go.velocity.x * dt
            }
        })

    }
    private draw(ctx: CanvasRenderingContext2D, gos: GameObject[]) {

        gos.forEach((go) => {

            ctx.fillStyle = go.color
            ctx.fillRect(go.position.x, go.position.y, go.width, go.height)
        })

        //draw line up and bottom
        ctx.fillRect(0,this.top,this.width,1)
        ctx.fillRect(0,this.bottom,this.width,1)

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
        this.input(gos)
        this.physics(dt, gos)
        this.gosRef.current = gos

    }
    protected onPlayerCollide(player: GameObject) {

    }
    protected onPlayerOutOfArea(player: GameObject) {

    }

}