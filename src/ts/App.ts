import $ from "jquery";
import {Canvas} from "./Canvas";
import {Line} from "./primitives/Line";
import {Point} from "./primitives/Point";
import {MovableLine} from "./MovableLine";
import {Grid} from "./Grid";
import {CircleKeeper} from "./CircleKeeper";
import {Config} from "./Config";

$(() => {

    let w = Math.max(document.documentElement.clientWidth, window.innerWidth || 0);
    let h = Math.max(document.documentElement.clientHeight, window.innerHeight || 0);

    let width = w * window.devicePixelRatio * 0.8;
    let height = h * window.devicePixelRatio * 0.8;

    let side = Math.min(width, height);

    let canvas = new Canvas(side, side);
    let grid = new Grid(20, side, side);

    canvas.addElement(grid);

    let leftPoint = new Point(100, 100);
    let rightPoint = new Point(500, 500);

    let line = new Line(leftPoint, rightPoint);
    let movableLine = new MovableLine(line, canvas);
    let circleKeeper = new CircleKeeper(grid, 0);

    movableLine.addCallback(
        (line: Line) => {
            let rects = grid.updateIntersection(line);
            circleKeeper.updateIntersection(rects, line)
        });

    canvas.addElement(movableLine);
    canvas.addElement(circleKeeper);
    canvas.refresh();

    $("#trace-circle-area").change((evt) => {
        let e = <any> evt;
        Config.traceCircleArea = e.target.checked;
        movableLine.callCallbacks();
        canvas.refresh();
    });

    $("#add-circle-button").click(() => {
        circleKeeper.addCircle();
        movableLine.callCallbacks();
        canvas.refresh();ç
    });

    $("#remove-circle-button").click(() => {
        circleKeeper.removeCircle();
        movableLine.callCallbacks();
        canvas.refresh();
    })
});