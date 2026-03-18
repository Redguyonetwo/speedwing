import { Player } from "./player.js";
import { Vector } from "./vector.js";
import { Input } from "./input.js";

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

player.addVelocity({x: -20, y: -50})

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function simulate(dt) {
    let addedSpeed = 0;
    let addedRotation = 0;

    if (Input.keys.w) addedSpeed ++
    if (Input.keys.s) addedSpeed --
    if (Input.keys.a) addedRotation ++
    if (Input.keys.d) addedRotation --

    player.addForwardVelocity(addedSpeed * deltaSpeed)

    player.rotate(addedRotation * deltaRot)

    player.update(dt)
}

Input.onKeyDown((key) => {
    if (key == 'b') console.log(player.rotation)
}, true)

function render() {
    clear()
    player.render(ctx)

    return;

    ctx.save()
    ctx.scale(1, -1)
    ctx.translate(0, -innerHeight)
    ctx.fillStyle = 'white'
    ctx.fillText(player.velocity.x.toPrecision(3) + ',' + player.velocity.y.toPrecision(3), 100, 600)
    ctx.fillText(Vector.magnitude(player.velocity).toPrecision(4), 100, 500)
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