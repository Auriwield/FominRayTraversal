import {Canvas} from "../Canvas";
import {Listener} from "../listeners/Listener";
import {Point} from "./Point";

export interface GraphicElement {
    draw(canvas: Canvas): void;

    containsPoint(point: Point): boolean;

    listeners() : Listener[]
}