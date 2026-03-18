import { Vector } from "./vector.js"

class InputLib {
    constructor() {
        this.addListeners()
    }

    keys = {}

    mouse = {x: 0, y: 0, down: [false, false, false]}

    addListeners() {
        window.onkeydown = (e) => {
            this.keys[e.key.toLocaleLowerCase()] = true
        }
        window.onkeyup = (e) => {
            this.keys[e.key.toLocaleLowerCase()] = false
        }
        window.onmousedown = (e) => {
            this.mouse.down[e.button] = true
        }
        window.onmouseup = (e) => {
            this.mouse.down[e.button] = false
        }
        window.onmousemove = (e) => {
            Vector.copy(this.mouse, e)
        }
    }
}

export const Input = new InputLib()