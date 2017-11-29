import {GraphicElement} from "./GraphicElement";
import {Canvas} from "../Canvas";
import {Point} from "./Point";
import {Listener} from "../listeners/Listener";

export class Circle implements GraphicElement {
    private _center: Point;
    private radius: number;
    private fillStyle : string;
    private strokeStyle : string;
    private lineWidth: number;

    constructor(center: Point,
                radius: number,
                fillStyle = "#000",
                strokeStyle = "#000",
                lineWidth = 1) {
        this._center = center;
        this.radius = radius;
        this.fillStyle = fillStyle;
        this.strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
    }

    draw(canvas: Canvas): void {
        canvas.ctx.beginPath();
        canvas.ctx.arc(this.center.x, this.center.y,
            this.radius, 0, 2 * Math.PI, false);
        canvas.ctx.fillStyle = this.fillStyle;
        canvas.ctx.fill();
        canvas.ctx.lineWidth = this.lineWidth;
        canvas.ctx.strokeStyle = this.strokeStyle;
        canvas.ctx.stroke();
    }

    containsPoint(point : Point): boolean {

        let dx = point.x - this.center.x;
        let dy = point.y - this.center.y;

        return dx * dx + dy * dy < this.radius * this.radius;
    }

    listeners(): Array<Listener> {
        return null;
    }

    onMouseHover(x: number, y: number): void {
    }

    onMouseClick(x: number, y: number): void {
    }

    get center(): Point {
        return this._center;
    }

    set center(value: Point) {
        this._center.x = value.x;
        this._center.y = value.y;
    }
}