import $ from "jquery";
import {Canvas} from "./Canvas";
import {Line} from "./Line";
import {Point} from "./Point";

$(() => {
    let canvas = new Canvas(600, 600);
    canvas.addElement(new Line(new Point(0, 0), new Point(600, 600)));
    canvas.refresh();
});