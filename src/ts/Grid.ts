import {Rectangle} from "./primitives/Rectangle";
import {Point} from "./primitives/Point";
import {GraphicElement} from "./primitives/GraphicElement";
import {Canvas} from "./Canvas";
import {Listener} from "./listeners/Listener";
import {Line} from "./primitives/Segment";
import {Config} from "./Config";

export class Grid implements GraphicElement {
    // amount of cells in cols and rows
    private size: number;
    private _width: number;
    private _height: number;
    private _rects: Rectangle[];
    private lines: Line[];

    constructor(size: number, width: number, height: number) {
        this.size = size;
        this._rects = [];
        this.lines = [];

        this._width = width;
        this._height = height;

        let rectWidth = this._width / this.size;
        let rectHeight = this._width / this.size;

        for (let i = 0; i < size; i++) {
            for (let j = 0; j < size; j++) {
                let origin = new Point(rectWidth * j, rectHeight * i);
                this._rects.push(new Rectangle(origin, rectWidth, rectHeight))
            }
        }

        let lineWidth = 0.5;
        let lineColor = "#222";

        for (let i = 1; i < size; i++) {
            let height = rectHeight * i;
            let left = new Point(0, height);
            let right = new Point(this._width, height);
            this.lines.push(new Line(left, right, lineWidth, lineColor));
        }

        for (let j = 1; j < size; j++) {
            let width = rectWidth * j;
            let left = new Point(width, 0);
            let right = new Point(width, this._height);
            this.lines.push(new Line(left, right, lineWidth, lineColor));
        }
    }

    updateIntersection(line: Line): Rectangle[] {
        let rects: Rectangle[] = [];
        for (let rect of this._rects) {

            let lineCrossesRect = rect.intersects(line);

            if (lineCrossesRect) {
                rects.push(rect)
            }

            rect.fillStyle = Config.lineTraversal && lineCrossesRect ? Config.red : Config.white
        }

        return rects;
    }

    draw(canvas: Canvas): void {
        for (let rect of this._rects) {
            rect.draw(canvas);
        }

        if (!Config.showGrid) return;

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

    get rects(): Rectangle[] {
        return this._rects;
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }
}