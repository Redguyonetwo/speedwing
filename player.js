import { Vector } from "./vector.js"

export class Player {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
        //this.maxSpeed = maxSpeed;

        for (let v of this.vertices) {
            Vector.mult(v, size)
            Vector.add(v, pos)
        }
    }

    rotation = Math.PI / 2

    dir = {x: 0, y: 1}

    velocity = {x: 0, y: 0}

    decayFactor = 0.95

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

    #move(v) {
        Vector.add(this.pos, v)

        for (let vert of this.vertices) {
            Vector.add(vert, v)
        }
    }

    // moveForward(speed) {
    //     const vec = Vector.mult2(this.dir, speed)
    //     this.move(vec)
    // }

    addVelocity(v) {
        Vector.add(this.velocity, v)
    }

    addForwardVelocity(speed) {
        //if (Vector.magSquared(this.velocity) > this.maxSpeed * this.maxSpeed) return;
        const vec = Vector.mult2(this.dir, speed)
        Vector.add(this.velocity, vec)
    }

    addRotVelocity(n) {
        this.rotVelocity += n
    }

    rotate(angle) {
        for (let v of this.vertices) {
            Vector.rotate(v, angle, this.pos)
        }

        this.rotation += angle
        this.dir = {x: Math.cos(this.rotation), y: Math.sin(this.rotation)}
    }

    update(dt) {
        const {x, y} = this.pos;
        const deltaPos = Vector.mult2(this.velocity, dt)
        this.#move(deltaPos)

        const x2 = this.pos.x;
        const y2 = this.pos.y;

        //console.log('Delta Pos:', deltaPos.x.toPrecision(3), deltaPos.y.toPrecision(3))

        //console.log('Real Delta Pos: ', (x2 - x).toPrecision(3), (y2 - y).toPrecision(3))
        
        Vector.mult(this.velocity, this.decayFactor)

        if (Math.abs(this.velocity.x) < 1e-9) this.velocity.x = 0
        if (Math.abs(this.velocity.y) < 1e-9) this.velocity.y = 0
        //if (Vector.magSquared(this.velocity) > this.maxSpeed * this.maxSpeed) Vector.setMagnitude(this.velocity, this.maxSpeed)
    }
} 