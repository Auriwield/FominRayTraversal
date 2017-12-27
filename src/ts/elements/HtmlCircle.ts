import $ from "jquery";
import {Circle} from "../primitives/Circle";
import {Point} from "../primitives/Point";
import {Canvas} from "../Canvas";

export class HtmlCircle extends Circle {
    private element : HTMLElement;

    constructor(center: Point,
                radius: number,
                fillStyle = "#000",
                strokeStyle = "#000",
                lineWidth = 2) {
        super(center, radius, fillStyle, strokeStyle, lineWidth);

        let element = $("<div></div>");
        this.element = element[0];
        $("#canvas").parent().append(element);

        this.element.style.height = radius + "px";
        this.element.style.width = radius + "px";
        this.element.classList.add("circle");
        this.element.classList.add("unselectable");
        this.element.style.borderWidth = lineWidth + "px";
        this.element.style.backgroundColor = fillStyle;
        this.element.style.borderColor = strokeStyle;
    }

    draw(canvas: Canvas): void {
        let c = $("#canvas")[0];
        this.element.style.left = (this.center.x - this.radius ) / canvas.ratio + c.offsetLeft + "px";
        this.element.style.top = (this.center.y - this.radius) / canvas.ratio + c.offsetTop + "px";
    }
}