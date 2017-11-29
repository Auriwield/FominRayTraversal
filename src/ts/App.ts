import $ from "jquery";
import {Canvas} from "./Canvas";
import {Line} from "./primitives/Line";
import {Point} from "./primitives/Point";
import {MovableLine} from "./MovableLine";

$(() => {
    let canvas = new Canvas(600, 600);

    let leftPoint = new Point(100, 100);
    let rightPoint = new Point(500, 500);

    let line = new Line(leftPoint, rightPoint);

    canvas.addElement(new MovableLine(line));
    canvas.refresh();
});