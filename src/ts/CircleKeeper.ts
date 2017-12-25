import {Circle} from "./primitives/Circle";
import {Grid} from "./Grid";
import {Point} from "./primitives/Point";
import {Rectangle} from "./primitives/Rectangle";
import {GraphicElement} from "./primitives/GraphicElement";
import {Canvas} from "./Canvas";
import {Listener} from "./listeners/Listener";
import {Line} from "./primitives/Segment";
import {Config} from "./Config";
import {MovableCircle} from "./MovableCircle";

export class CircleKeeper implements GraphicElement {
    private circleRectRelation: [Circle, Rectangle[]][];
    private grid: Grid;
    private circlesAmount: number = 0;
    onCircleMoved: () => void;

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

        let circle = new MovableCircle(new Point(x, y), r, "rgba(255, 255, 255, 0.0)", "#000", 1);
        let rects: Rectangle[] = this.getRectsIntersectCircle(circle);

        let rel: [Circle, Rectangle[]] = [circle, rects];

        circle.onCircleMoved = () => {
            rel[1] = this.getRectsIntersectCircle(circle);
            this.onCircleMoved();
        };

        this.circleRectRelation.push(rel);
        this.circlesAmount++;
    }

    getRectsIntersectCircle(circle: Circle): Rectangle[] {
        let rects: Rectangle[] = [];

        for (let rect of this.grid.rects) {
            if (rect.intersectsCircle(circle)) {
                rects.push(rect);
            }
        }

        return rects;
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

        for (let i = 0; i < this.circlesAmount; i++) {
            this.circleRectRelation[i][0].strokeStyle = "#000000";
            this.circleRectRelation[i][0].fillStyle = "rgba(0,0,0,0)";
            this.circleRectRelation[i][0].lineWidth = 1;
        }

        if (Config.allCircleTraversal) {
            for (let i = 0; i < this.circlesAmount; i++) {
                let rects = this.circleRectRelation[i][1];
                for (let rect of rects) {
                    rect.fillStyle =  Config.green;
                }
            }
        }

        let circles = this.getCirclesByRects(rects);
        if (circles.length == 0) return;

        for (let circle of circles) {
            if (line.intersectsCircle(circle)) {
                //circle.strokeStyle = "#9E9E9E";
                circle.fillStyle = "rgba(30,30,30,0.5)";
                circle.lineWidth = 1.5;
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
                        if (Config.circleTraversal) {
                            for (let r of cRects) {
                                //r.fillStyle = "rgba(76,175,80,0.7)"
                                r.fillStyle = Config.green;
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
        let listeners: Listener[] = [];

        for (let i = 0; i < this.circlesAmount; i++) {
            let rel = this.circleRectRelation[i];
            let circle = rel[0];
            listeners = listeners.concat(circle.listeners());
        }

        return listeners;
    }
}