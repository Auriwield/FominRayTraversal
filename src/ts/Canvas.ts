import $ from "jquery";
import {GraphicElement} from "./GraphicElement";

export class Canvas {

    private width: number;
    private height: number;
    private canvas: HTMLCanvasElement;
    private ctx: CanvasRenderingContext2D;
    private elements : GraphicElement[];

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
        this.clear();
    }

    refresh() {
        this.clear();
        this.elements.forEach( value => value.draw(this));
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

}