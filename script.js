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

ctx.translate(0, innerHeight)
ctx.scale(1, -1)

console.log(Vector)

const player = new Player({x: 500, y: 500}, 50)

function clear() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
}

function render() {
    clear()
    player.render(ctx)
}

function main() {
    requestAnimationFrame(main)
    player.rotate(0.1)
    render()
}

requestAnimationFrame(main)