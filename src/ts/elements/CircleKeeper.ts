import {Circle} from "../primitives/Circle";
import {Grid} from "./Grid";
import {Point} from "../primitives/Point";
import {Rectangle} from "../primitives/Rectangle";
import {GraphicElement} from "../primitives/GraphicElement";
import {Canvas} from "../Canvas";
import {Listener} from "../listeners/Listener";
import {Segment} from "../primitives/Segment";
import {Config} from "../Config";
import {MovableCircle} from "./MovableCircle";
import {Label} from "./Label";

export class CircleKeeper implements GraphicElement {
    private static DefaultLayer = 0;
    private circleRectRelation: [Circle, Rectangle[]][];
    private grid: Grid;
    private circlesAmount: number = 0;
    private lastIntersectedCircleAreas : Rectangle[] = [];
    onCircleMoved: () => void;

    layer = CircleKeeper.DefaultLayer;

    constructor(grid: Grid, circlesAmount: number) {
        this.circleRectRelation = [];
        this.grid = grid;

        for (let i = 0; i < circlesAmount; i++) {
            this.addCircle();
        }
    }

    addCircle() : Listener[] {
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

        return circle.listeners();
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

        if (Config.ShowMap) {
            let stats = this.statistics();
            for (let stat of stats) {
                new Label(stat[0], stat[1].toString()).draw(canvas);
            }
        }

        for (let i = 0; i < this.circlesAmount; i++) {
            let rel = this.circleRectRelation[i];
            rel[0].draw(canvas);
        }
    }

    updateIntersection(rects: Rectangle[], line: Segment) {
        for (let i = 0; i < this.circlesAmount; i++) {
            this.circleRectRelation[i][0].strokeStyle = "#000000";
            this.circleRectRelation[i][0].fillStyle = "rgba(0,0,0,0)";
            this.circleRectRelation[i][0].lineWidth = 1;
        }

        if (Config.AllCircleTraversal) {
            for (let i = 0; i < this.circlesAmount; i++) {
                let rects = this.circleRectRelation[i][1];
                for (let rect of rects) {
                    rect.fillStyle = Config.Green;
                }
            }
        }

        let circles = this.getCirclesByRects(rects);
        if (circles.length == 0) return;

        if (Config.CircleTraversal) {
            for (let r of this.lastIntersectedCircleAreas) {
                r.fillStyle = Config.Green;
            }
        }

        for (let circle of circles) {
            let points = line.getIntersectionPoints(circle);
            if (points.length > 0) {
                circle.intersectionPoints(points);
                circle.fillStyle = "rgba(30,30,30,0.5)";
                circle.lineWidth = 1.5;
                this.layer = 3;
            } else {
                this.layer = CircleKeeper.DefaultLayer;
            }
        }
    }

    getCirclesByRects(rects: Rectangle[]): Circle[] {
        let circles: Circle[] = [];
        let intRects : Rectangle[] = [];

        l:for (let i = 0; i < this.circlesAmount; i++) {
            let rel = this.circleRectRelation[i];
            let circle = rel[0];
            let cRects = rel[1];

            for (let rect of rects) {
                for (let crect of cRects) {
                    if (rect.equals(crect)) {
                        circles.push(circle);
                        intRects = intRects.concat(cRects);
                        continue l;
                    }
                }
            }
        }

        this.lastIntersectedCircleAreas = [].concat(intRects);
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

    statistics(): [Rectangle, number][] {
        let rects: Rectangle[] = [];

        if (Config.AllCircleTraversal) {
            for (let i = 0; i < this.circlesAmount; i++) {
                let rel = this.circleRectRelation[i];
                rects = rects.concat(rel[1]);
            }
        } else if (Config.CircleTraversal) {
            rects = rects.concat(this.lastIntersectedCircleAreas);
        }

        rects = rects.sort((a, b) => a.compare(b));

        let stats: [Rectangle, number][] = [];

        while (rects.length) {
            let rect = rects.shift();
            let rect2: Rectangle;
            let count = 0;
            do {
                rect2 = rects.shift();
                count++;
            }
            while (rect.equals(rect2));

            if (rect2) {
                rects.unshift(rect2);
            }

            stats.push([rect, count])
        }
        return stats;
    }
}