import { Vector } from "./vector.js"

export class Player {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;

        for (let v of this.vertices) {
            Vector.mult(v, size)
            Vector.add(v, pos)
        }
    }

    vertices = [
        {x: -0.85, y: -1},
        {x: 0, y: -0.5},
        {x: 0.85, y: -1},
        {x: 0, y: 1}
    ]

    render(ctx) {
        ctx.beginPath()
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y)
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y)
        }
        ctx.lineTo(this.vertices[0].x, this.vertices[0].y)
        ctx.closePath()
        ctx.fillStyle = 'blue'
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 5
        ctx.stroke()
    }

    move(v) {
        Vector.add(this.pos, v)

        for (let vert of this.vertices) {
            Vector.add(vert, v)
        }
    }

    rotate(angle) {
        for (let v of this.vertices) {
            Vector.rotate(v, angle, this.pos)
        }
    }
} 