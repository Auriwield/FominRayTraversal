import {GraphicElement} from "./GraphicElement";
import {Canvas} from "./Canvas";
import {Point} from "./Point";

export class Line implements GraphicElement {

    private p1: Point;
    private p2: Point;
    private lineWidth: number;
    private lineColor: string;

    constructor(p1: Point, p2: Point, lineWidth = 1, lineColor = "black") {
        this.p1 = p1;
        this.p2 = p2;
        this.lineWidth = lineWidth;
        this.lineColor = lineColor;
    }

    draw(canvas: Canvas): void {
        canvas.drawLine(this.p1, this.p2, this.lineWidth, this.lineColor);
    }

    containsPoint(x: number, y: number): boolean {
        return false;
    }

    onMouseHover(x: number, y: number): void {
    }

    onMouseClick(x: number, y: number): void {
    }
}
