import {GraphicElement} from "./GraphicElement";
import {Point} from "./Point";
import {Canvas} from "../Canvas";
import {Listener} from "../listeners/Listener";
import {Line} from "./Segment";
import {Circle} from "./Circle";

export class Rectangle implements GraphicElement {
    private origin: Point;
    private width: number;
    private height: number;
    private _strokeStyle: string;
    private _fillStyle: string;

    constructor(origin: Point,
                width: number,
                height: number,
                strokeColor = "#ffffff",
                fillColor = "#ffffff") {
        this.origin = origin;
        this.width = width;
        this.height = height;
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

    intersects(line: Line): boolean {
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

        let top = new Line(topLeft, topRight);
        let left = new Line(topLeft, bottomLeft);
        let right = new Line(topRight, bottomRight);
        let bottom = new Line(bottomLeft, bottomRight);

        return {top, left, right, bottom};
    }

    set fillStyle(value: string) {
        this._fillStyle = value;
    }

    get fillStyle(): string {
        return this._fillStyle;
    }

    set strokeStyle(value: string) {
        this._strokeStyle = value;
    }

    equals(rect: Rectangle) {
        return this.origin.equals(rect.origin)
            && this.width == rect.width
            && this.height == rect.height
    }
}