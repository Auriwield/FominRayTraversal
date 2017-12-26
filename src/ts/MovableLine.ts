import {Segment} from "./primitives/Segment";
import {Circle} from "./primitives/Circle";
import {GraphicElement} from "./primitives/GraphicElement";
import {Canvas} from "./Canvas";
import {Listener} from "./listeners/Listener";
import {Point} from "./primitives/Point";
import {OnDragListener} from "./listeners/OnDragListener";
import {HtmlCircle} from "./HtmlCircle";
import {Config} from "./Config";

export class MovableLine implements GraphicElement {
    private line: Segment;
    private leftEdge: Circle;
    private rightEdge: Circle;
    private edgeRadius: number;
    private canvas: Canvas;
    private callbacks: ((line: Segment) => void)[];

    layer = 0;

    constructor(canvas: Canvas) {
        this.line = new Segment(new Point(100, 100), new Point(500, 500), 1, Config.black);
        this.canvas = canvas;
        this.callbacks = [];
        this.edgeRadius = 24;
        this.leftEdge = new HtmlCircle(this.line.left, this.edgeRadius, "#fff", "#212121");
        this.rightEdge = new HtmlCircle(this.line.right, this.edgeRadius, "#fff", "#212121");
    }

    draw(canvas: Canvas): void {
        this.line.draw(canvas);
        this.leftEdge.draw(canvas);
        this.rightEdge.draw(canvas);
    }

    containsPoint(point: Point): boolean {
        return false;
    }

    listeners(): Listener[] {
        let onDragLeftListener = new OnDragListener(this.leftEdge, (event, canvas) => {
            this.leftEdge.center = event.point;

            this.checkPoint(this.leftEdge.center);

            this.callCallbacks();

            canvas.refresh();
        });

        let onDragRightListener = new OnDragListener(this.rightEdge, (event, canvas) => {
            this.rightEdge.center = event.point;

            this.checkPoint(this.rightEdge.center);

            this.callCallbacks();

            canvas.refresh();
        });

        return onDragLeftListener.listen().concat(onDragRightListener.listen());
    }

    callCallbacks() {
        this.callbacks.forEach(callback => callback(this.line));
    }

    // p1 - left top corner
    private checkPoint(p: Point) {
        let r = this.edgeRadius;

        let p1 = new Point(r, r);
        let p2 = new Point(p1.x + this.canvas.width - r * 2,
            p1.y + this.canvas.height - r * 2);

        /*if (p.x < p1.x) p.x = p1.x;
        if (p.y < p1.y) p.y = p1.y;
        if (p.x > p2.x) p.x = p2.x;
        if (p.y > p2.y) p.y = p2.y;*/

        let lc = this.leftEdge.center;
        let rc = this.rightEdge.center;

        if (this.leftEdge.intersects(this.rightEdge)) {
            let dx = lc.x - rc.x;
            let dy = lc.y - rc.y;

            let l = Math.sqrt(dx * dx + dy * dy);
            let d = this.edgeRadius * 2 - l;
            let rd = d / l;

            dx *= rd;
            dy *= rd;

            if (p.equals(lc)) {
                lc.move(dx, dy, true);
            }

            else if (p.equals(rc)) {
                dx *= -1;
                dy *= -1;
                rc.move(dx, dy, true);
            }
        }
    }

    addCallback(callback: (line: Segment) => void) {
        if (!callback) return;
        this.callbacks.push(callback);
        callback(this.line);
    }
}