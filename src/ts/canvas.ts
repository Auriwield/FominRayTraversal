import * as $ from "jquery";

$(document).ready(() => {
    let width = 600;
    let height = 600;

    let canvas = $("#canvas");
    canvas[0].setAttribute("width", `${width}px`);
    canvas[0].setAttribute("height", `${height}px`);
});