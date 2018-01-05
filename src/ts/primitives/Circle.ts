import {GraphicElement} from "./GraphicElement";
import {Canvas} from "../Canvas";
import {Point} from "./Point";
import {Listener} from "../listeners/Listener";
import {Config} from "../Config";

export class Circle implements GraphicElement {
    protected _center: Point;
    protected _radius: number;
    protected _fillStyle: string;
    protected _strokeStyle: string;
    protected _lineWidth: number;
    private _intersectionPoints: Circle[] = [];

    layer = this.getDefaultLayer();

    constructor(center: Point,
                radius: number,
                fillStyle = "#000",
                strokeStyle = "#000",
                lineWidth = 2) {
        this._center = center;
        this._radius = radius;
        this._fillStyle = fillStyle;
        this._strokeStyle = strokeStyle;
        this._lineWidth = lineWidth;
    }

    draw(canvas: Canvas): void {
        canvas.ctx.beginPath();
        canvas.ctx.arc(this.center.x, this.center.y,
            this._radius, 0, 2 * Math.PI, false);
        canvas.ctx.fillStyle = this._fillStyle;
        canvas.ctx.fill();
        canvas.ctx.lineWidth = this._lineWidth * canvas.ratio;
        canvas.ctx.strokeStyle = this._strokeStyle;
        canvas.ctx.stroke();
        for (let circle of this._intersectionPoints) {
            circle.draw(canvas);
        }
        this._intersectionPoints = [];
    }

    containsPoint(point: Point): boolean {

        let dx = point.x - this.center.x;
        let dy = point.y - this.center.y;

        return dx * dx + dy * dy < this._radius * this._radius;
    }

    listeners(): Listener[] {
        return [];
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

    intersectionPoints(points: Point[]) {
        let r = window.devicePixelRatio;
        this._intersectionPoints = [];
        for (let p of points) {
            let circle = new Circle(p, 4 + (r - 1) * 2, Config.White, Config.Black, 1);
            this._intersectionPoints.push(circle);
        }
    }

    set strokeStyle(value: string) {
        this._strokeStyle = value;
    }


    set fillStyle(value: string) {
        this._fillStyle = value;
    }

    set lineWidth(value: number) {
        this._lineWidth = value;
    }

    getDefaultLayer(): number {
        return 1;
    }
}