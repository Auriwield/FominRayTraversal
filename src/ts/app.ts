import * as $ from "jquery";
import {Canvas} from "./canvas";

$(() => {
    let canvas = new Canvas(600, 600);
    canvas.init();
});