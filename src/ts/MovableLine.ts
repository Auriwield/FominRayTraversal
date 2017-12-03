import {Line} from "./primitives/Line";
import {Circle} from "./primitives/Circle";
import {GraphicElement} from "./primitives/GraphicElement";
import {Canvas} from "./Canvas";
import {Listener} from "./listeners/Listener";
import {Point} from "./primitives/Point";
import {OnDragListener} from "./listeners/OnDragListener";

export class MovableLine implements GraphicElement {
    private line: Line;
    private leftEdge: Circle;
    private rightEdge: Circle;
    private edgeRadius: number;
    private canvas: Canvas;
    private _onUpdate: (line: Line) => void;

    constructor(line: Line, canvas: Canvas) {
        this.line = line;
        this.canvas = canvas;

        this.edgeRadius = 20;
        this.leftEdge = new Circle(line.left, this.edgeRadius);
        this.rightEdge = new Circle(line.right, this.edgeRadius);
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

            if (this._onUpdate) this._onUpdate(this.line);

            canvas.refresh();
        });

        let onDragRightListener = new OnDragListener(this.rightEdge, (event, canvas) => {
            this.rightEdge.center = event.point;

            this.checkPoint(this.rightEdge.center);

            if (this._onUpdate) this._onUpdate(this.line);

            canvas.refresh();
        });

        return onDragLeftListener.listen().concat(onDragRightListener.listen());
    }

    // p1 - left top corner
    private checkPoint(p: Point) {
        let r = this.edgeRadius;

        let p1 = new Point(r, r);
        let p2 = new Point(p1.x + this.canvas.width - r*2,
            p1.y + this.canvas.height - r*2);

        if (p.x < p1.x) p.x = p1.x;
        if (p.y < p1.y) p.y = p1.y;
        if (p.x > p2.x) p.x = p2.x;
        if (p.y > p2.y) p.y = p2.y;

        if (this.leftEdge.intersects(this.rightEdge)) {
            // todo
        }
    }

    set onUpdate(value: (line: Line) => void) {
        this._onUpdate = value;
        if (this._onUpdate) this._onUpdate(this.line);
    }
}