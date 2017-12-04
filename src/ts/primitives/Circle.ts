import {GraphicElement} from "./GraphicElement";
import {Canvas} from "../Canvas";
import {Point} from "./Point";
import {Listener} from "../listeners/Listener";

export class Circle implements GraphicElement {
    private _center: Point;
    private _radius: number;
    private fillStyle: string;
    private _strokeStyle: string;
    private lineWidth: number;

    constructor(center: Point,
                radius: number,
                fillStyle = "#000",
                strokeStyle = "#000",
                lineWidth = 1) {
        this._center = center;
        this._radius = radius;
        this.fillStyle = fillStyle;
        this._strokeStyle = strokeStyle;
        this.lineWidth = lineWidth;
    }

    draw(canvas: Canvas): void {
        canvas.ctx.beginPath();
        canvas.ctx.arc(this.center.x, this.center.y,
            this._radius, 0, 2 * Math.PI, false);
        canvas.ctx.fillStyle = this.fillStyle;
        canvas.ctx.fill();
        canvas.ctx.lineWidth = this.lineWidth;
        canvas.ctx.strokeStyle = this._strokeStyle;
        canvas.ctx.stroke();
    }

    containsPoint(point: Point): boolean {

        let dx = point.x - this.center.x;
        let dy = point.y - this.center.y;

        return dx * dx + dy * dy < this._radius * this._radius;
    }

    listeners(): Array<Listener> {
        return null;
    }

    get center(): Point {
        return this._center;
    }

    set center(value: Point) {
        this._center.x = value.x;
        this._center.y = value.y;
    }

    get radius(): number {
        return this._radius;
    }

    intersects(circle: Circle): boolean {
        let rm = this._radius - circle._radius;
        let rp = this._radius + circle._radius;

        let dx = this.center.x - circle.center.x;
        let dy = this.center.y - circle.center.y;

        let d = dx * dx + dy * dy;

        return rm * rm <= d && d <= rp * rp;
    }

    set strokeStyle(value: string) {
        this._strokeStyle = value;
    }
}