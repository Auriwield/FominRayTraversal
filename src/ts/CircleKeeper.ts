import {Circle} from "./primitives/Circle";
import {Grid} from "./Grid";
import {Point} from "./primitives/Point";
import {Rectangle} from "./primitives/Rectangle";
import {GraphicElement} from "./primitives/GraphicElement";
import {Canvas} from "./Canvas";
import {Listener} from "./listeners/Listener";
import {Line} from "./primitives/Line";
import {Config} from "./Config";

export class CircleKeeper implements GraphicElement {
    private circleRectRelation: [Circle, Rectangle[]][];
    private grid: Grid;
    private circlesAmount: number = 0;

    constructor(grid: Grid, circlesAmount: number) {
        this.circleRectRelation = [];
        this.grid = grid;

        for (let i = 0; i < circlesAmount; i++) {
            this.addCircle();
        }
    }

    addCircle() {
        let r = 20 + Math.random() * 50;
        let edgeCorrection = r + 10;

        let x = edgeCorrection + Math.random() * (this.grid.width - edgeCorrection * 2);
        let y = edgeCorrection + Math.random() * (this.grid.height - edgeCorrection * 2);

        let circle = new Circle(new Point(x, y), r, "rgba(255, 255, 255, 0.0)", "#000", 5);

        let rects: Rectangle[] = [];

        for (let rect of this.grid.rects) {
            if (rect.intersectsCircle(circle)) {
                rects.push(rect);
            }
        }

        this.circleRectRelation.push([circle, rects]);
        this.circlesAmount++;
    }

    removeCircle() {
        this.circleRectRelation.splice(0, 1);
        this.circlesAmount--;
    }

    draw(canvas: Canvas): void {
        for (let i = 0; i < this.circlesAmount; i++) {
            let rel = this.circleRectRelation[i];
            rel[0].draw(canvas);
        }
    }

    updateIntersection(rects: Rectangle[], line: Line) {
        let circles = this.getCirclesByRects(rects);
        if (circles.length == 0) return;

        for (let circle of circles) {
            if (line.intersectsCircle(circle)) {
                circle.strokeStyle = "#ff6666";
            }
            else {
                circle.strokeStyle = "#000000";
            }
        }
    }

    getCirclesByRects(rects: Rectangle[]): Circle[] {
        let circles: Circle[] = [];

        l:for (let i = 0; i < this.circlesAmount; i++) {
            let rel = this.circleRectRelation[i];
            let circle = rel[0];
            let cRects = rel[1];

            for (let rect of rects) {
                for (let crect of cRects) {
                    if (rect.equals(crect)) {
                        circles.push(circle);
                        if (Config.traceCircleArea) {
                            for (let r of cRects) {
                                r.fillStyle = "green";
                            }
                        }
                        continue l;
                    }
                }
            }
        }

        return circles;
    }

    containsPoint(point: Point): boolean {
        return null;
    }

    listeners(): Listener[] {
        return [];
    }
}