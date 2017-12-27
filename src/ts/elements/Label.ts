import {GraphicElement} from "../primitives/GraphicElement";
import {Point} from "../primitives/Point";
import {Canvas} from "../Canvas";
import {Listener} from "../listeners/Listener";
import {Rectangle} from "../primitives/Rectangle";

export class Label implements GraphicElement {

    private rect : Rectangle;
    private text : string;
    private textColor: string;

    constructor(rect: Rectangle, num: string, textColor : string = "#000") {
        this.rect = rect;
        this.text = num;
        this.textColor = textColor;
    }

    layer = -1;

    draw(canvas: Canvas): void {
        let ctx = canvas.ctx;
        let rectX = this.rect.origin.x;
        let rectY = this.rect.origin.y;
        let rectWidth = this.rect.width;
        let rectHeight = this.rect.height;
        ctx.font= 10 * canvas.ratio + "px Georgia";
        ctx.textAlign="center";
        ctx.textBaseline = "middle";
        ctx.fillStyle = this.textColor;
        ctx.fillText(this.text,rectX+(rectWidth/2),rectY+(rectHeight/2));
    }

    containsPoint(point: Point): boolean {
        return false;
    }

    listeners(): Listener[] {
        return [];
    }
}