import $ from "jquery";
import {GraphicElement} from "./GraphicElement";
import {Point} from "./Point";

export class Canvas {

    private width: number;
    private height: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private elements: Array<GraphicElement>;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.init();
    }

    private init() {
        this.canvas = <HTMLCanvasElement> $("#canvas")[0];
        this.ctx = this.canvas.getContext("2d");
        this.canvas.setAttribute("width", `${this.width}px`);
        this.canvas.setAttribute("height", `${this.height}px`);
        this.elements = [];
        this.clear();
    }

    refresh() {
        this.clear();
        this.elements.forEach(value => value.draw(this));
    }

    clear() {
        this.fill("white")
    }

    fill(color: string | CanvasGradient | CanvasPattern) {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this.width, this.height);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    addElement(element: GraphicElement) {
        this.elements.push(element);
    }

    drawLine(p1: Point, p2: Point, lineWidth: number, lineColor: string) {
        this.ctx.beginPath();
        this.ctx.moveTo(p1.x, p1.y);
        this.ctx.lineTo(p2.x, p2.y);
        this.ctx.lineWidth = lineWidth;
        this.ctx.strokeStyle = lineColor;
        this.ctx.stroke();
    }
}