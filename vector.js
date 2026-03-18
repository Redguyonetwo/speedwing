class VectorLib {
    new(x, y) {
        return {x, y}
    }

    add(v1, v2) {
        v1.x += v2.x;
        v1.y += v2.y;
    }

    add2(v1, v2) {
        return {x: v1.x + v2.x, y: v1.y + v2.y}
    }

    subtract(v1, v2) {
        v1.x -= v2.x;
        v1.y -= v2.y;
    }

    subtract2(v1, v2) {
        return {x: v1.x - v2.x, y: v1.y - v2.y}
    }

    dot(v1, v2) {
        return v1.x * v2.x + v1.y * v2.y;
    }

    cross(v1, v2) {
        return v1.x * v2.y - v1.y * v2.x
    }

    magnitude(v) {
        return Math.sqrt(this.dot(v, v))
    }

    magSquared(v) {
        return this.dot(v, v)
    }

    mult(v, k) {
        v.x *= k;
        v.y *= k;
    }

    mult2(v, k) {
        return {x: v.x * k, y: v.y * k}
    }

    unit(v) {
        this.multiplyScalar(v, 1 / this.magnitude(v))
    }

    unit2(v) {
        return this.mult2(v, 1 / this.magnitude(v))
    }

    gradient(v) {
        return v.y / v.x;
    }

    normal(v, negative = false) {
        const scale = negative ? -1 : 1;
        return {x: -v.y * scale, y: v.x * scale}
    }

    rotate(v, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const x = v.x * cos - v.y * sin;
        const y = v.y * cos + v.x * sin;

        v.x = x;
        v.y = y;
    }

    rotate2(v, angle) {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const x = v.x * cos - v.y * sin;
        const y = v.y * cos + v.x * sin;

        return {x, y}
    }
}

export const Vector = new VectorLib()