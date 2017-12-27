import {Config} from "../Config";

export class Point {
    private _x: number;
    private _y: number;

    constructor(x: number, y: number) {
        this._x = x;
        this._y = y;
    }

    get x(): number {
        return this._x;
    }

    set x(value: number) {
        this._x = value;
    }

    get y(): number {
        return this._y;
    }

    set y(value: number) {
        this._y = value;
    }

    equals(point: Point): boolean {
        if (!point) return false;
        let x = this.x - point.x;
        let y = this.y - point.y;
        return x > -Config.EPS && x < Config.EPS
            && y > -Config.EPS && y < Config.EPS;
    }

    toString() {
        return "x: " + this.x + " y: " + this.y;
    }

    delta(point: Point): Point {
        return new Point(this.x - point.x, this.y - point.y);
    }

    move(x: number, y: number, applyOnThis: boolean = false): Point {
        if (applyOnThis) {
            this.x += x;
            this.y += y;
            return this;
        }
        return new Point(this.x + x, this.y + y);
    }
}