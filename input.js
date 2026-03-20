import { Vector } from "./vector.js"

class InputLib {
    constructor() {
        this.addListeners()
    }

    keys = {}

    mouse = {x: 0, y: 0, down: [false, false, false]}

    onKeyDownFuncs = []

    addListeners() {
        window.onkeydown = (e) => {
            const key = e.key.toLocaleLowerCase()
            for (let {func, onFirstOnly} of this.onKeyDownFuncs) {
                if (!onFirstOnly || !this.keys[key]) {
                    func(key)
                }
            }
            this.keys[key] = true
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

        document.onvisibilitychange = (e) => {
            if (document.hidden) {
                this.mouse.down = [false, false, false]

                this.keys = {}
            }
        }
    }

    onKeyDown(func, onFirstOnly = false) {
        this.onKeyDownFuncs.push({func, onFirstOnly})
    }

    removeEvent(func) {
        const index = this.onKeyDownFuncs.findIndex((f) => {f == func})

        this.onKeyDownFuncs.splice(index, 1)
    }
}

export const Input = new InputLib()