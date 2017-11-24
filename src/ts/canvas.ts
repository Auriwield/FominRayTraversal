import $ from "jquery";

export class Canvas {

    private width: number;
    private height: number;
    private canvas: JQuery;

    constructor(width: number, height: number) {
        this.width = width;
        this.height = height;
        this.init();
    }

    private init() {
        this.canvas = $("#canvas");
        this.canvas[0].setAttribute("width", `${this.width}px`);
        this.canvas[0].setAttribute("height", `${this.height}px`);
    }

}