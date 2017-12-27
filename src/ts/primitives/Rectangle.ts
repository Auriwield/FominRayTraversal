import {GraphicElement} from "./GraphicElement";
import {Point} from "./Point";
import {Canvas} from "../Canvas";
import {Listener} from "../listeners/Listener";
import {Segment} from "./Segment";
import {Circle} from "./Circle";
import {Config} from "../Config";

export class Rectangle implements GraphicElement {
    private _origin: Point;
    private _width: number;
    private _height: number;
    private _strokeStyle: string;
    private _fillStyle: string;

    layer = 0;

    constructor(origin: Point,
                width: number,
                height: number,
                strokeColor = "#ffffff",
                fillColor = "#ffffff") {
        this._origin = origin;
        this._width = width;
        this._height = height;
        this._strokeStyle = strokeColor;
        this._fillStyle = fillColor;
    }

    draw(canvas: Canvas): void {
        canvas.ctx.lineWidth = canvas.ratio;

        canvas.ctx.strokeStyle = this._strokeStyle;
        canvas.ctx.fillStyle = this._fillStyle;

        canvas.ctx.strokeRect(this.origin.x, this.origin.y, this.width, this.height);
        canvas.ctx.fillRect(this.origin.x, this.origin.y, this.width, this.height);
    }

    listeners(): Listener[] {
        return [];
    }

    containsPoint(point: Point): boolean {
        return point.x >= this.origin.x
            && point.y >= this.origin.y
            && point.x <= this.origin.x + this.width
            && point.y <= this.origin.y + this.height;
    }

    intersects(line: Segment): boolean {
        if (this.containsPoint(line.left)
            || this.containsPoint(line.right)) {
            return true;
        }

        let sides = this.sides();

        return line.intersects(sides.top)
            || line.intersects(sides.left)
            || line.intersects(sides.right)
            || line.intersects(sides.bottom);
    }

    intersectsCircle(circle: Circle): boolean {

        if (this.containsPoint(circle.center)) {
            return true;
        }

        let sides = this.sides();

        return sides.top.intersectsCircle(circle)
            || sides.left.intersectsCircle(circle)
            || sides.right.intersectsCircle(circle)
            || sides.bottom.intersectsCircle(circle)
    }

    sides() {
        let topLeft = this.origin;
        let topRight = this.origin.move(this.width, 0);
        let bottomLeft = this.origin.move(0, this.height);
        let bottomRight = this.origin.move(this.width, this.height);

        let top = new Segment(topLeft, topRight);
        let left = new Segment(topLeft, bottomLeft);
        let right = new Segment(topRight, bottomRight);
        let bottom = new Segment(bottomLeft, bottomRight);

        return {top, left, right, bottom};
    }

    set fillStyle(value: string) {
        this._fillStyle = value;
    }

    get fillStyle(): string {
        return this._fillStyle;
    }

    get origin(): Point {
        return this._origin;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    set strokeStyle(value: string) {
        this._strokeStyle = value;
    }

    equals(rect: Rectangle): boolean {
        if (!rect) {
            return false;
        }
        return this.origin.equals(rect.origin)
            && this.width - rect.width < Config.EPS
            && this.height - rect.height < Config.EPS
    }

    compare(rect: Rectangle): number {
        let x1 = this.origin.x;
        let x2 = rect.origin.x;
        let y1 = this.origin.y;
        let y2 = rect.origin.y;

        if (x1 === x2 && y1 === y2) {
            return 0;
        }

        let sum = x1 - x2 + y1 - y2;

        return sum > 0 ? -1 : +1;
    }
}