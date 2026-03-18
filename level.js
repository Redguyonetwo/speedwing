import { Vector } from "./vector.js";

class Level {
    constructor(vertices, startPos = Vector.zero, startRot = 0) {
        this.vertices = vertices;
        this.startPos = startPos;
        this.startRot = startRot;
        this.finish = [vertices[0], vertices.at(-1)]
    }

    render(ctx) {
        const last = this.vertices.at(-1)

        ctx.beginPath()
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y)
        ctx.lineTo(last.x, last.y)
        ctx.strokeStyle = 'lime'
        ctx.lineWidth = 10
        ctx.lineCap = 'round'
        ctx.stroke()

        ctx.beginPath()
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y)

        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y)
        }
        ctx.strokeStyle = 'white'
        ctx.stroke()

        
    }
}

export const Level1 = new Level(
    [
        {x: 1800, y: 200},
        {x: 1650, y: 300},
        {x: 150, y: 300},
        {x: 0, y: 200},
        {x: 0, y: -200},
        {x: 150, y: -300},
        {x: 1650, y: -300},
        {x: 1800, y: -200}
    ],
    {x: 100, y: 0} 
)