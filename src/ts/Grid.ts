import {Rectangle} from "./primitives/Rectangle";
import {Point} from "./primitives/Point";
import {GraphicElement} from "./primitives/GraphicElement";
import {Canvas} from "./Canvas";
import {Listener} from "./listeners/Listener";
import {Line} from "./primitives/Line";

export class Grid implements GraphicElement {
    // amount of cells in cols and rows
    private size: number;
    private width: number;
    private height: number;
    private rects: Rectangle[];
    private lines: Line[];

    constructor(size: number, width: number, height: number) {
        this.size = size;
        this.rects = [];
        this.lines = [];

        this.width = width;
        this.height = height;

        let rectWidth = this.width / this.size;
        let rectHeight = this.width / this.size;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let origin = new Point(rectWidth * j, rectHeight * i);
                this.rects.push(new Rectangle(origin, rectWidth, rectHeight))
            }
        }

        let lineWidth = 1;
        let lineColor = "#222";

        for (let i = 1; i < size; i++) {
            let height = rectHeight * i;
            let left = new Point(0, height);
            let right = new Point(this.width, height);
            this.lines.push(new Line(left, right, lineWidth, lineColor));
        }
        
        for (let j = 1; j < size; j++) {
            let width = rectWidth * j;
            let left = new Point(width, 0);
            let right = new Point(width, this.height);
            this.lines.push(new Line(left, right,  lineWidth, lineColor));
        }
    }

    updateIntersection(line: Line) {
        for (let rect of this.rects) {
            rect.fillStyle = rect.intersects(line) ? "#ff5252" : "#ffffff"
        }
    }

    draw(canvas: Canvas): void {
        for (let rect of this.rects) {
            rect.draw(canvas);
        }
        for (let line of this.lines) {
            line.draw(canvas);
        }
    }

    containsPoint(point: Point): boolean {
        return null;
    }

    listeners(): Listener[] {
        return [];
    }
}