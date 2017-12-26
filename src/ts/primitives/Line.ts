import {Point} from "./Point";
import {Circle} from "./Circle";
import {Config} from "../Config";

export class Line {
    private _a : number;
    private _b : number;
    private _c : number;

    constructor(a: number, b: number, c: number) {
        this._a = a;
        this._b = b;
        this._c = c;
    }


    get a(): number {
        return this._a;
    }

    get b(): number {
        return this._b;
    }

    get c(): number {
        return this._c;
    }

    intersects(circle: Circle): Point[]  {
        let a = this.a;
        let b = this.b;
        let c = this.c;

        let x = circle.center.x;
        let y = circle.center.y;
        let r = circle.radius;

        let b2 = b * b;
        let A = a * a + b2;
        let B = 2 * a * b * y - 2 * a * c - 2 * b2 * x;
        let C = b2 * x * x + b2 * y * y - 2 * b * c * y + c * c - b2 * r * r;

        let D = B * B - 4 * A * C;
        let x1, y1, x2, y2;

        // Handle vertical line case with b = 0
        if (Math.abs(b) < Config.EPS) {

            // Segment equation is ax + by = c, but b = 0, so x = c/a
            x1 = c / a;

            // No intersection
            if (Math.abs(x - x1) > r)
                return [];

            // Vertical line is tangent to circle
            if (Math.abs((x1 - r) - x) < Config.EPS
                || Math.abs((x1 + r) - x) < Config.EPS)
                return [new Point(x1, y)];

            let dx = Math.abs(x1 - x);
            let dy = Math.sqrt(r * r - dx * dx);

            // Vertical line cuts through circle
            return [
                new Point(x1, y + dy),
                new Point(x1, y - dy)
            ];
        }

        // Segment is tangent to circle
        if (Math.abs(D) < Config.EPS) {
            x1 = -B / (2 * A);
            y1 = (c - a * x1) / b;

            return [new Point(x1, y1)];
        }

        // No intersection
        if (D < 0) {
            return [];
        }

        D = Math.sqrt(D);

        x1 = (-B + D) / (2 * A);
        y1 = (c - a * x1) / b;

        x2 = (-B - D) / (2 * A);
        y2 = (c - a * x2) / b;

        return [
            new Point(x1, y1),
            new Point(x2, y2)
        ];
    }
}