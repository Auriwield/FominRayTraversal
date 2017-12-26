import $ from "jquery";
import {GraphicElement} from "./primitives/GraphicElement";
import {ListenerDelegate} from "./listeners/ListenerDelegate";
import {Listener} from "./listeners/Listener";

export class Canvas {
    private _width: number;
    private _height: number;
    private canvas: HTMLCanvasElement;
    private elements: Array<GraphicElement>;
    private listenerDelegate: ListenerDelegate;
    private _ratio: number;

    ctx: CanvasRenderingContext2D;

    constructor(width: number, height: number) {
        this._width = width;
        this._height = height;
        this._ratio = window.devicePixelRatio;
        this.init();
    }

    private init() {
        this.canvas = <HTMLCanvasElement> $("#canvas")[0];
        this.ctx = this.canvas.getContext("2d");
        this.listenerDelegate = new ListenerDelegate(this.canvas, this);
        this.canvas.setAttribute("width", `${this._width}px`);
        this.canvas.setAttribute("height", `${this._height}px`);
        this.canvas.style.width = `${this._width / this.ratio}px`;
        this.canvas.style.height = `${this._height / this.ratio}px`;
        this.elements = [];
        this.clear();
        window.addEventListener("resize", () => {
            this.refresh();
        })
    }

    refresh() {
        this.clear();
        this.elements
            .sort((a, b) => a.layer - b.layer)
            .forEach(value => value.draw(this));
    }

    clear() {
        this.fill("white");
    }

    fill(color: string | CanvasGradient | CanvasPattern) {
        this.ctx.beginPath();
        this.ctx.rect(0, 0, this._width, this._height);
        this.ctx.fillStyle = color;
        this.ctx.fill();
    }

    addElement(...elements: GraphicElement[]) {
        this.elements = this.elements.concat(elements);

        let listeners: Array<Listener> = [];
        elements.forEach(element => {
            listeners = listeners.concat(element.listeners());
        });

        this.listenerDelegate.addListeners(listeners);
    }

    get width(): number {
        return this._width;
    }

    get height(): number {
        return this._height;
    }

    get ratio(): number {
        return this._ratio;
    }
}