import {Circle} from "./primitives/Circle";
import {Listener} from "./listeners/Listener";
import {OnDragListener} from "./listeners/OnDragListener";
import {Point} from "./primitives/Point";
import {Canvas} from "./Canvas";

export class MovableCircle extends Circle {
    onCircleMoved: () => void;

    listeners(): Listener[] {
        let onListener = new OnDragListener(this, (event, canvas) => {
            this.center = event.point;

            this.checkPoint(this.center, canvas);

            if (this.onCircleMoved) this.onCircleMoved();

            canvas.refresh();
        });

        return onListener.listen();
    }

    private checkPoint(p: Point, canvas: Canvas) {
        let r = this.radius;

        let p1 = new Point(r, r);
        let p2 = new Point(p1.x + canvas.width - r * 2,
            p1.y + canvas.height - r * 2);

        if (p.x < p1.x) p.x = p1.x;
        if (p.y < p1.y) p.y = p1.y;
        if (p.x > p2.x) p.x = p2.x;
        if (p.y > p2.y) p.y = p2.y;

    }
}