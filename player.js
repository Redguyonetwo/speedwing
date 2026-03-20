import { Vector } from "./vector.js"
import { getIntersection, pointToLineDistance, projectPointToLine } from "./math.js"

export class Player {
    constructor(pos, size) {
        this.pos = pos;
        this.size = size;
        //this.maxSpeed = maxSpeed;

        for (let v of this.vertices) {
            Vector.mult(v, size)
            Vector.add(v, pos)
        }

        for (let i = 0; i < 3; i++) {
            Vector.mult(this.flameVerts.inner[i], size)
            Vector.mult(this.flameVerts.outer[i], size)
            Vector.add(this.flameVerts.inner[i], pos)
            Vector.add(this.flameVerts.outer[i], pos)
        }

        Vector.mult(this.min, size)
        Vector.mult(this.max, size)
        Vector.mult(this.diff, size)

        Vector.add(this.min, pos)
        Vector.add(this.max, pos)
    }

    rotation = Math.PI / 2

    fillColour = 'blue'

    dir = {x: 0, y: 1}

    velocity = {x: 0, y: 0}

    decayFactor = 0.95

    vertices = [
        {x: -0.85, y: -1},
        {x: 0, y: -0.5},
        {x: 0.85, y: -1},
        {x: 0, y: 1}
    ]

    min = {x: -0.85, y: -1}
    max = {x: 0.85, y: 1}
    diff = {x: 2 * 0.85, y: 2}

    flameVerts = {
        outer: [
            {x: -0.6, y: -0.8},
            {x: 0, y: -0.5},
            {x: 0.6, y: -0.8}
        ],
        inner: [
            {x: -0.4, y: -0.7},
            {x: 0, y: -0.5},
            {x: 0.4, y: -0.7}
        ]
    }

    render(ctx, isW = false) {
        this.renderFlame(ctx)
        ctx.strokeStyle = 'white'
        ctx.beginPath()
        ctx.moveTo(this.vertices[0].x, this.vertices[0].y)
        for (let i = 1; i < this.vertices.length; i++) {
            ctx.lineTo(this.vertices[i].x, this.vertices[i].y)
        }
        ctx.lineTo(this.vertices[0].x, this.vertices[0].y)
        ctx.closePath()
        ctx.fillStyle = this.fillColour
        ctx.fill()
        ctx.strokeStyle = 'white'
        ctx.lineWidth = 5
        ctx.stroke()

        ctx.strokeStyle = 'red'
        ctx.strokeRect(this.min.x, this.min.y, this.diff.x, this.diff.y)
    }

    circle(ctx, x, y, r, colour = 'red') {
        ctx.beginPath()
        ctx.arc(x, y, r, 0, 2 * Math.PI)
        ctx.fillStyle = colour
        ctx.fill()
    }

    renderFlame(ctx) {
        const size = Vector.magnitude(this.velocity) * 0.15

        const backVert = Vector.mult2(this.dir, -size)
        //console.log('offset', offset)
        //console.log('pos', this.pos)

        Vector.add(backVert, this.pos)

        const innerBackVert = Vector.mult2(this.dir, -size * 0.7)
        
        Vector.add(innerBackVert, this.pos)
    
        //Get the normal to add some random variation
        const normal = Vector.normal(this.dir)

        //Random offset
        Vector.mult(normal, (Math.random() * 2 - 1))

        const outerOffset = Vector.mult2(normal, 10)
    
        Vector.add(backVert, outerOffset)

        //Since normal won't be used again, can use mult directly
        Vector.mult(normal, 6)

        Vector.add(innerBackVert, normal)

        ctx.beginPath()
        let [v1, v2, v3] = this.flameVerts.outer
        ctx.moveTo(v1.x, v1.y)
        ctx.lineTo(v2.x, v2.y)
        ctx.lineTo(v3.x, v3.y)
        ctx.lineTo(backVert.x, backVert.y)
        ctx.lineTo(v1.x, v1.y)
        ctx.closePath()
        ctx.fillStyle = 'rgb(113, 183, 240)'
        ctx.fill()

        ctx.beginPath()
        let [v4, v5, v6] = this.flameVerts.inner
        ctx.moveTo(v4.x, v4.y)
        ctx.lineTo(v5.x, v5.y)
        ctx.lineTo(v6.x, v6.y)
        ctx.lineTo(innerBackVert.x, innerBackVert.y)
        ctx.lineTo(v4.x, v4.y)
        ctx.closePath()
        ctx.fillStyle = 'rgb(0, 109, 204)'
        ctx.fill()
    }

    #move(v) {
        Vector.add(this.pos, v)

        for (let vert of this.vertices) {
            Vector.add(vert, v)
        }

        for (let i = 0; i < 3; i++) {
            Vector.add(this.flameVerts.inner[i], v)
            Vector.add(this.flameVerts.outer[i], v)
        }

        Vector.add(this.min, v)
        Vector.add(this.max, v)
    }

    goTo(v) {
        const moveV = Vector.subtract2(v, this.pos)
        this.#move(moveV)
    }

    setRot(n) {
        const diff = n - this.rotation
        this.rotate(diff)
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

    rotate(angle) {
        for (let v of this.vertices) {
            Vector.rotate(v, angle, this.pos)
        }

        for (let i = 0; i < 3; i++) {
            Vector.rotate(this.flameVerts.inner[i], angle, this.pos)
            Vector.rotate(this.flameVerts.outer[i], angle, this.pos)
        }

        const xs = this.vertices.map(v => v.x)
        const ys = this.vertices.map(v => v.y)

        this.min.x = Math.min(...xs)
        this.min.y = Math.min(...ys)
        this.max.x = Math.max(...xs)
        this.max.y = Math.max(...ys)

        this.diff = Vector.subtract2(this.max, this.min)

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

    checkSegment([v1, v2]) {
        const triangle = [this.vertices[0], this.vertices[2], this.vertices[3]]

        let minX, minY, maxX, maxY;
        if (v1.x > v2.x) {
            minX = v2.x;
            maxX = v1.x;
        }
        else {
            minX = v1.x;
            maxX = v2.x;
        }

        if (v1.y > v2.y) {
            minY = v2.y;
            maxY = v1.y;
        }
        else {
            minY = v1.y;
            maxY = v2.y;
        }

        if (minX > this.max.x) return;
        if (minY > this.max.y) return;
        if (this.min.x > maxX) return;
        if (this.min.y > maxY) return;

        for (let i = 0; i < 3; i++) {
            const t1 = triangle.at(i - 1)
            const t2 = triangle[i]

            const intersection = getIntersection(t1, t2, v1, v2)

            if (intersection) return intersection;
        }
        return false
    }

    checkFinished(finish) {
        return this.checkSegment(finish)
    }

    doCollisions(vertices) {
        for (let x = 0; x < 10; x++) {
            const collisions = this.checkCollisions(vertices)
            if (collisions.length == 0) break;
            this.resolveCollisions(collisions, true)
        }
    }

    checkCollisions(vertices) {
        const intersections = []

        for (let i = 0; i < vertices.length - 1; i++) {
            const v1 = vertices[i]
            const v2 = vertices[i + 1]

            let minX, minY, maxX, maxY;
            if (v1.x > v2.x) {
                minX = v2.x;
                maxX = v1.x;
            }
            else {
                minX = v1.x;
                maxX = v2.x;
            }

            if (v1.y > v2.y) {
                minY = v2.y;
                maxY = v1.y;
            }
            else {
                minY = v1.y;
                maxY = v2.y;
            }

            if (minX > this.max.x) continue;
            if (minY > this.max.y) continue;
            if (this.min.x > maxX) continue;
            if (this.min.y > maxY) continue;

            const intersection = this.checkSegment([v1, v2])

            if (!intersection) continue;

            intersections.push({A: v1, B: v2, intersection})
        }

        return intersections;
    }

    resolveCollisions(intersections) {
        let best;
        let bestDot = Infinity;

        for (let {A, B} of intersections) {
            const segment = Vector.subtract2(B, A)

            const normal = Vector.normal(segment)

            Vector.unit(normal)

            const dot = Vector.dot(normal, this.velocity)

            if (dot < bestDot) {
                best = normal;
                bestDot = dot;
            }
        }

        if (!best) return;

        this.#move(Vector.mult2(best, 0.5))

        if (bestDot < 0) {
            Vector.mult(best, -bestDot)

            this.addVelocity(best)
        }
    }

    resolveCollisionsOld(intersections, correctPos = false) {
        for (let {A, B, intersection} of intersections) {
            const segment = Vector.subtract2(B, A)

            Vector.unit(segment)

            const normal = Vector.normal(segment)
            //As segment was already a unit vector, normal will be as well

            // Correct position to prevent jittering
            if (correctPos) {
                const shift = Vector.mult2(normal, 0.5)

                this.#move(shift)
            }

            if (Vector.dot(normal, this.velocity) > 0) {
                Vector.mult(normal, -1)
            }

            const dot = Vector.dot(normal, this.velocity)

            if (dot < 0) {
                const addedVel = Vector.mult2(normal, -dot)

                this.addVelocity(addedVel)
            }
        }
    }
}