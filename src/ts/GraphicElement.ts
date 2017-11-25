import {Canvas} from "./Canvas";

export interface GraphicElement {
    draw(canvas: Canvas): void;

    containsPoint(x: number, y: number): boolean;

    onMouseHover(x: number, y: number): void

    onMouseClick(x: number, y: number): void
}