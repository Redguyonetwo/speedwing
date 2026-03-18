import { Vector } from "./vector.js"

export function getIntersection(a1, a2, b1, b2) {
    //The fact that lerp2D(a1, a2, t1) = lerp2D(b1, b2, t2) allows for two equations to be made - one for x and one for y.
    //These can be rearranged to t2 = ...
    //So the two equations can be set as equal to each other in order to find t1. The final result is found below.

    const a = a1.x;
    const b = a1.y;
    const c = a2.x;
    const d = a2.y;
    const e = b1.x;
    const f = b1.y;
    const g = b2.x;
    const h = b2.y;

    const numerator = (b - f) * (g - e) + (e - a) * (h - f)
    const denominator = (h - f) * (c - a) - (g - e) * (d - b)

    if (denominator == 0) {
        console.log('AAAAAAAAAAAAAA DIVIDE BY 0????')
        return;
    }

    const t = numerator / denominator

    if (t < 0 || t > 1) {
        console.log('Outside bounds!')
        return;
    }

    const point = lerp2D(a1, a2, t)

    return point;
}

export function lerp(a, b, t) {
    return a + (b - a) * t
}

export function lerp2D(A, B, t) {
    return {x: lerp(A.x, B.x, t), y: lerp(A.y, B.y, t)}
}

export function projectPointToLine(p, s1, s2) {
    const AB = Vector.subtract(s2, s1)
    const AP = Vector.subtract(p, s1)

    Vector.unit(AB)
    Vector.unit(AP)

    const t = Vector.dot(AB, AP)

    const point = lerp2D(s1, s2, t)

    return {t, point}
}