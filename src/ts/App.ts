import $ from "jquery";
import {Canvas} from "./Canvas";
import {Segment} from "./primitives/Segment";
import {MovableLine} from "./elements/MovableLine";
import {Grid} from "./elements/Grid";
import {CircleKeeper} from "./elements/CircleKeeper";
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
        (line: Segment) => {
            let rects = grid.updateIntersection(line);
            circleKeeper.updateIntersection(rects, line)
        });

    circleKeeper.onCircleMoved = () => movableLine.callCallbacks();

    canvas.addElement(circleKeeper);
    canvas.addElement(movableLine);
    canvas.refresh();

    let bindCheckbox = (id : string, configProp : string) => {
        $(id)
            .prop("checked", Config[configProp])
            .change((evt) => {
                let e = <any> evt;
                Config[configProp] = e.target.checked;
                movableLine.callCallbacks();
                canvas.refresh();
            });
    };

    bindCheckbox("#trace-circle-area", "CircleTraversal");
    bindCheckbox("#trace-all-circle-area", "AllCircleTraversal");
    bindCheckbox("#trace-line-area", "LineTraversal");
    bindCheckbox("#show-grid", "ShowGrid");
    bindCheckbox("#show-map", "ShowMap");

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