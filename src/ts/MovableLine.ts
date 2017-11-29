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

    constructor(line: Line) {
        this.line = line;
        this.leftEdge = new Circle(line.left, 5);
        this.rightEdge = new Circle(line.right, 5);
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

            this.checkPoint(this.leftEdge.center,
                new Point(0, 0), canvas.width, canvas.height);

            canvas.refresh();
        });

        let onDragRightListener = new OnDragListener(this.rightEdge, (event, canvas) => {
            this.rightEdge.center = event.point;

            this.checkPoint(this.rightEdge.center,
                new Point(0, 0), canvas.width, canvas.height);

            canvas.refresh();
        });

        return onDragLeftListener.listen().concat(onDragRightListener.listen());
    }

    // checks if point p in specified rectangle
    // p1 - left top corner
    private checkPoint(p : Point, p1: Point, width: number, height: number) {
        let p2 = new Point(p1.x + width, p1.y + height);

        if (p.x < p1.x) p.x = p1.x;
        if (p.y < p1.y) p.y = p1.y;
        if (p.x > p2.x) p.x = p2.x;
        if (p.y > p2.y) p.y = p2.y;
    }
}