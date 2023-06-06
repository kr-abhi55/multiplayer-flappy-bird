import { MutableRefObject } from "react";
import { GameObject, Point } from "./common";

export class Game {
    width = 500
    height = 300
    public get bottom(): number {
        return this.height - 25
    }
    public get top(): number {
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
    private isGoGoCollide(a: GameObject, b: GameObject) {
        const aRect = {
            left: a.position.x,
            top: a.position.y,
            right: a.position.x + a.width,
            bottom: a.position.y + a.height,
        }
        const bRect = {
            left: b.position.x,
            top: b.position.y,
            right: b.position.x + b.width,
            bottom: b.position.y + b.height,
        }
        // Check for overlap in the horizontal axis
        if (aRect.left < bRect.right && aRect.right > bRect.left) {
            // Check for overlap in the vertical axis
            if (aRect.top < bRect.bottom && aRect.bottom > bRect.top) {
                return true; // Colliding
            }
        }

        return false; // Not colliding

    }
    private collision(gos: GameObject[]) {
        const players = gos.filter((go) => go.tag == 'player')
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.state != 'normal') continue
            for (let j = 0; j < gos.length; j++) {
                const gameObject = gos[j];

                // Skip the player object itself
                if (player === gameObject || gameObject.tag == 'player') {
                    continue;
                }

                // Check for collision between the player and other objects
                if (this.isGoGoCollide(player, gameObject)) {
                    // Collision detected, handle accordingly
                    // console.log('Collision detected between player and object:', player, gameObject);
                    this.onPlayerCollide(player, gameObject)
                    // Perform actions or logic for the collision
                }
            }
        }

    }
    private checkOutOfArea(gos: GameObject[]) {
        const players = gos.filter((go) => go.tag == 'player')
        for (let i = 0; i < players.length; i++) {
            const player = players[i];
            if (player.state != 'normal') continue
            if (player.position.y < 0 || player.position.y > this.height) {
                this.onPlayerOutOfArea(player)
            }
        }
    }
    private physics(dt: number, gos: GameObject[]) {
        const g = 9.8 //px/s
        gos.forEach((go) => {
            if (go.bodyType == 'dynamic' && go.tag == 'player' && go.state != 'wait') {
                go.velocity.y += g
                go.position.y += go.velocity.y * dt
                go.position.x += go.velocity.x * dt
            }
        })

    }
    private draw(ctx: CanvasRenderingContext2D, gos: GameObject[]) {
        const diff = this.player.position.x - this.width * 0.5
        const offset: Point = {
            x: diff > 0 ? diff : 0,
            y: 0
        }
        ctx.save()
        ctx.translate(-offset.x, offset.y)
        gos.forEach((go) => {

            ctx.fillStyle = go.color
            ctx.fillRect(go.position.x, go.position.y, go.width, go.height)
        })
        ctx.restore()

        //draw line up and bottom
        ctx.fillRect(0, this.top, this.width, 1)
        ctx.fillRect(0, this.bottom, this.width, 1)

    }
    constructor(public gosRef: MutableRefObject<GameObject[]>, protected player: GameObject) {

    }
    setSize(width: number, height: number) {
        this.width = width
        this.height = height
    }

    update(ctx: CanvasRenderingContext2D, dt: number) {
        const gos = this.gosRef.current
        this.input(gos)
        this.physics(dt, gos)
        this.checkOutOfArea(gos)
        this.collision(gos)
        this.draw(ctx, gos)
        this.gosRef.current = gos


    }
    private revivePlayer(player: GameObject) {
        player.state = 'wait'
        player.velocity.y = 0
        setTimeout(() => {
            player.position.y = 200
            player.state = "review"
            setTimeout(() => {
                player.state = 'normal'
            }, 2000);
        }, 2000);
    }
    protected onPlayerCollide(player: GameObject, go: GameObject) {
        //player.collisionOff = true
        this.revivePlayer(player)

    }
    protected onPlayerOutOfArea(player: GameObject) {
        this.revivePlayer(player)

    }

}