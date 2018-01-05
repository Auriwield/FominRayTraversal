import $ from "jquery";
import {Circle} from "../primitives/Circle";
import {Point} from "../primitives/Point";
import {Canvas} from "../Canvas";

export class HtmlCircle extends Circle {
    private element: HTMLElement;

    constructor(center: Point,
                radius: number,
                ratio: number,
                fillStyle = "#000",
                strokeStyle = "#000",
                lineWidth = 2) {
        radius *= ratio;
        super(center, radius, fillStyle, strokeStyle, lineWidth);
        let element = $("<div></div>");
        this.element = element[0];
        $("#canvas").parent().append(element);

        this.element.style.height = radius * 2 / ratio + "px";
        this.element.style.width = radius * 2 / ratio + "px";
        this.element.classList.add("circle");
        this.element.classList.add("unselectable");
        this.element.style.borderWidth = lineWidth + "px";
        this.element.style.backgroundColor = fillStyle;
        this.element.style.borderColor = strokeStyle;
    }

    draw(canvas: Canvas): void {
        let c = $("#canvas")[0];
        let r = canvas.ratio;
        this.element.style.left = (this.center.x - this.radius) / r + c.offsetLeft + "px";
        this.element.style.top = (this.center.y - this.radius) / r + c.offsetTop + "px";
    }
}