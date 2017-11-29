import {GraphicElement} from "./GraphicElement";
import {Canvas} from "../Canvas";
import {Point} from "./Point";
import {Listener} from "../listeners/Listener";

export class Line implements GraphicElement {
    private _left: Point;
    private _right: Point;
    private lineWidth: number;
    private lineColor: string;

    constructor(p1: Point, p2: Point, lineWidth = 1, lineColor = "black") {
        this._left = p1;
        this._right = p2;
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
        this.checkPoints();
    }

    draw(canvas: Canvas): void {
        canvas.ctx.beginPath();
        canvas.ctx.moveTo(this.left.x, this.left.y);
        canvas.ctx.lineTo(this.right.x, this.right.y);
        canvas.ctx.lineWidth = this.lineWidth;
        canvas.ctx.strokeStyle = this.lineColor;
        canvas.ctx.stroke();
    }

    containsPoint(point: Point): boolean {
        return false;
    }

    listeners(): Array<Listener> {
        return null;
    }

    onMouseHover(x: number, y: number): void {
    }

    onMouseClick(x: number, y: number): void {
    }

    get left(): Point {
        return this._left;
    }

    set left(value: Point) {
        this._left = value;
        this.checkPoints();
    }

    get right(): Point {
        return this._right;
    }

    set right(value: Point) {
        this._right = value;
        this.checkPoints();
    }

    checkPoints() {
        if (this._left.x > this._right.x) {
            let temp = this._left;
            this._left = this._right;
            this._right = temp;
        }
    }
}
