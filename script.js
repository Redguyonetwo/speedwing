import { Player } from "./player.js";
import { Vector } from "./vector.js";
import { Input } from "./input.js";
import { Level1 } from "./level.js";

const canvas = document.getElementById('canvas')

canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

window.onresize = () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}

const ctx = canvas.getContext('2d')

ctx.font = '50px Arial'

ctx.translate(0, innerHeight)
ctx.scale(1, -1)

const player = new Player({x: 500, y: 500}, 30)

const deltaSpeed = 40;
const deltaRot = 0.1;

let hasFinished = false;

//player.addVelocity({x: -20, y: -50})
player.goTo(Level1.startPos)
player.setRot(Level1.startRot)

let started = false;

let time = 0;

let bestTime = Infinity;

let isNewRecord = false;

function isInput(key) {
    return key == 'w' || key == 'a' || key == 's' || key == 'd'
}

Input.onKeyDown((key) => {
    if (key != 'r') {
        if (!started && isInput(key)) {
            started = true;
            time = 0;
        }
        //else console.log(key)
        return;
    }
    player.velocity.x = 0;
    player.velocity.y = 0;
    player.goTo(Level1.startPos)
    player.setRot(Level1.startRot)
    hasFinished = false
    started = false
    isNewRecord = false
    player.fillColour = 'blue'
    time = 0
}, true)

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}


function simulate(dt) {
    let addedSpeed = 0;
    let addedRotation = 0;

    if (started) {
        time += dt
    }

    if (!hasFinished) {
        if (Input.keys.w) addedSpeed ++
        if (Input.keys.s) addedSpeed --
        if (Input.keys.a) addedRotation ++
        if (Input.keys.d) addedRotation --

        player.addForwardVelocity(addedSpeed * deltaSpeed)

        player.rotate(addedRotation * deltaRot)
    }

    player.update(dt)

    if (hasFinished) return;

    player.doCollisions(Level1.vertices)

    const intersection = player.checkFinished(Level1.finish)

    if (intersection) {
        player.fillColour = 'teal'
        console.log('You Finished!')
        ctx.beginPath()
        ctx.arc(intersection.x, intersection.y, 10, 0, 2 * Math.PI)
        ctx.fillStyle = 'red'
        ctx.fill()
        hasFinished = true
        started = false
        if (time < bestTime) {
            bestTime = Number(time.toFixed(3))
            isNewRecord = true
            console.log('New Record!')
        }
    }
}

console.log('yeah')

function drawGrid() {
    const x = 500
    const y = 500

    const numLines = 10

    const bigOffset = (numLines / 2) * player.size * 5

    const minX = x - bigOffset
    const minY = y - bigOffset
    const maxX = x + bigOffset
    const maxY = y + bigOffset

    ctx.beginPath()

    for (let i = -numLines / 2; i < numLines / 2; i++) {
        const offset = i * player.size * 5
        ctx.moveTo(minX, y + offset)
        ctx.lineTo(maxX, y + offset)

        ctx.moveTo(x + offset, minY)
        ctx.lineTo(x + offset, maxY)
    }
    ctx.moveTo(minX, maxY)
    ctx.lineTo(maxX, maxY)
    ctx.lineTo(maxX, minY)
    ctx.strokeStyle = 'white'
    ctx.stroke()
}

function render() {
    clear()
    ctx.save()
    ctx.translate(-player.pos.x, -player.pos.y)
    ctx.translate(innerWidth / 2, innerHeight / 2)
    drawGrid()
    Level1.render(ctx)
    player.render(ctx)
    ctx.restore()

    ctx.save()
    ctx.scale(1, -1)
    ctx.translate(0, -innerHeight)
    ctx.fillStyle = 'white'
    ctx.fillText('Time: ' + time.toFixed(3) + (isNewRecord ? '(New Record!)' : ''), 100, 500)
    if (bestTime < Infinity) ctx.fillText('Best Time: ' + bestTime, 100, 600)
    ctx.restore()
}

let lastTime = performance.now()

const maxDt = 1 / 20

let dt = 0

function main() {
    requestAnimationFrame(main)
    const now = performance.now()
    dt = (now - lastTime) * 0.001
    if (dt > maxDt) dt = maxDt
    simulate(dt)
    render()
    lastTime = now
}

requestAnimationFrame(main)