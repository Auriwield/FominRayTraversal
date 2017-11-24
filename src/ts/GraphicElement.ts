import {Canvas} from "./Canvas";

export interface GraphicElement {
    draw(canvas: Canvas): any;

    containsPoint(x : number, y : number) : boolean;
}