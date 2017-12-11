import {GraphicElement} from "./GraphicElement";
import {Canvas} from "../Canvas";
import {Point} from "./Point";
import {Listener} from "../listeners/Listener";
import {Circle} from "./Circle";

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

    intersects(line: Line): boolean {
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

    /*
        Dx = Bx-Ax;
        Dy = By-Ay;

        LAB = (Dx^2 + Dy^2);
        t = ((Cx - Ax) * Dx + (Cy - Ay) * Dy) / LAB;

        if t > 1
            t=1;
        elseif t<0
            t=0;
        end;


        nearestX = Ax + t * Dx;
        nearestY = Ay + t * Dy;

        dist = sqrt( (nearestX-Cx)^2 + (nearestY-Cy)^2 );

        if (dist > R )
         flag=0;
        else
         flag=1;
        end

     */

    intersectsCircle(circle: Circle) : boolean {

        let ax = this.left.x;
        let bx = this.right.x;

        let ay = this.left.y;
        let by = this.right.y;

        let cx =  circle.center.x;
        let cy = circle.center.y;
        let r = circle.radius;

        let dx = bx - ax;
        let dy = by - ay;

        let lab = dx ** 2 + dy ** 2;
        let t = ((cx - ax) * dx + (cy - ay) * dy) / lab;

        if (t > 1) {
            t = 1;
        }
        else if (t < 0) {
            t = 0;
        }

        let nearestX = ax + t * dx;
        let nearestY = ay + t * dy;

        let dist = (nearestX-cx)**2 + (nearestY-cy)**2 ;

        return dist <= r ** 2;
    }
}
