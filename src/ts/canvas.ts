import * as $ from "jquery";

export class Canvas {

    private width: number;
    private height: number;

    constructor(width: number, height: number) {

    }

    init() {
        let canvas = $("#canvas");
        canvas[0].setAttribute("width", `${this.width}px`);
        canvas[0].setAttribute("height", `${this.height}px`);
    }

}