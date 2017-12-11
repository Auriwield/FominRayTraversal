import $ from "jquery";
import {Canvas} from "./Canvas";
import {Line} from "./primitives/Segment";
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

    let movableLine = new MovableLine(canvas);
    let circleKeeper = new CircleKeeper(grid, 15);

    movableLine.addCallback(
        (line: Line) => {
            let rects = grid.updateIntersection(line);
            circleKeeper.updateIntersection(rects, line)
        });

    circleKeeper.onCircleMoved = () => movableLine.callCallbacks();

    canvas.addElement(circleKeeper);
    canvas.addElement(movableLine);
    canvas.refresh();

    $("#trace-circle-area").change((evt) => {
        let e = <any> evt;
        Config.circleTraversal = e.target.checked;
        movableLine.callCallbacks();
        canvas.refresh();
    });

    $("#trace-all-circle-area").change((evt) => {
        let e = <any> evt;
        Config.allCircleTraversal = e.target.checked;
        movableLine.callCallbacks();
        canvas.refresh();
    });

    $("#trace-line-area").click((evt) => {
        let e = <any> evt;
        Config.lineTraversal = e.target.checked;
        movableLine.callCallbacks();
        canvas.refresh();
    });

    $("#show-grid").click((evt) => {
        let e = <any> evt;
        Config.showGrid = e.target.checked;
        movableLine.callCallbacks();
        canvas.refresh();
    });

    $("#add-circle-button").click(() => {
        circleKeeper.addCircle();
        movableLine.callCallbacks();
        canvas.refresh();
    });

    $("#remove-circle-button").click(() => {
        circleKeeper.removeCircle();
        movableLine.callCallbacks();
        canvas.refresh();
    })
});