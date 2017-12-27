import {GraphicElement} from "./GraphicElement";
import {Canvas} from "../Canvas";
import {Point} from "./Point";
import {Listener} from "../listeners/Listener";
import {Circle} from "./Circle";
import {Rectangle} from "./Rectangle";
import {Line} from "./Line";
import {Config} from "../Config";

export class Segment implements GraphicElement {
    private _left: Point;
    private _right: Point;
    private lineWidth: number;
    private lineColor: string;

    layer = 0;

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
        canvas.ctx.lineWidth = this.lineWidth * canvas.ratio;
        canvas.ctx.strokeStyle = this.lineColor;
        canvas.ctx.stroke();
    }

    containsPoint(p: Point): boolean {
        let x1 = this.left.x;
        let x2 = this.right.x;
        let y1 = this.left.y;
        let y2 = this.right.y;

        let x = Math.min(x1,x2), X = Math.max(x1,x2);
        let y = Math.min(y1,y2), Y = Math.max(y1,y2);
        return x - Config.EPS <= p.x && p.x <= X + Config.EPS &&
            y - Config.EPS <= p.y && p.y <= Y + Config.EPS;
    }

    listeners(): Listener[] {
        return [];
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

    intersects(line: Segment): boolean {
        let l1p1 = this.left;
        let l1p2 = this.right;
        let l2p1 = line.left;
        let l2p2 = line.right;

        let q = (l1p1.y - l2p1.y) * (l2p2.x - l2p1.x) - (l1p1.x - l2p1.x) * (l2p2.y - l2p1.y);
        let d = (l1p2.x - l1p1.x) * (l2p2.y - l2p1.y) - (l1p2.y - l1p1.y) * (l2p2.x - l2p1.x);

        if (d == 0) {
            return false;
        }

        let r = q / d;

        q = (l1p1.y - l2p1.y) * (l1p2.x - l1p1.x) - (l1p1.x - l2p1.x) * (l1p2.y - l1p1.y);

        let s = q / d;

        return !(r < 0 || r > 1 || s < 0 || s > 1);
    }

    intersectsCircle(circle: Circle): boolean {
        let ax = this.left.x;
        let bx = this.right.x;
        let ay = this.left.y;
        let by = this.right.y;

        let cx = circle.center.x;
        let cy = circle.center.y;
        let r = circle.radius;

        let dx = bx - ax;
        let dy = by - ay;

        let lab = dx * dx + dy * dy;
        let t = ((cx - ax) * dx + (cy - ay) * dy) / lab;

        if (t > 1) {
            t = 1;
        }
        else if (t < 0) {
            t = 0;
        }

        let nearestX = ax + t * dx;
        let nearestY = ay + t * dy;

        let dist = (nearestX - cx) ** 2 + (nearestY - cy) ** 2;

        return dist <= r * r;
    }

    getIntersectionPoints(circle: Circle): Point[] {
        let points = this.convertToLine().intersects(circle);

        if (points.length === 0) {
            return [];
        }

        let p1 = points[0];
        let includePt1 = this.containsPoint(p1);

        if (points.length === 1) {
            return includePt1 ? [p1] : [];
        }

        let p2 = points[1];
        let includePt2 = this.containsPoint(p2);

        if (includePt1 && includePt2) {
            return [p1, p2];
        }
        if (includePt1) {
            return [p1];
        }
        if (includePt2) {
            return [p2];
        }
        return [];
    }

    convertToLine() : Line {
        let ax = this.left.x;
        let bx = this.right.x;
        let ay = this.left.y;
        let by = this.right.y;

        let a = ay - by;
        let b = bx - ax;
        let c = bx * ay - ax * by;

        return new Line(a, b, c);
    }
}