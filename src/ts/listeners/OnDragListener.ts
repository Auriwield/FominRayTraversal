import {Listener} from "./Listener";
import {GraphicElement} from "../primitives/GraphicElement";
import {Point} from "../primitives/Point";
import {Event} from "./Event";
import {Canvas} from "../Canvas";

export class OnDragListener implements Listener {
    name: string = "onDragListener";
    element: GraphicElement;
    onAction: (event: Event, canvas: Canvas) => void;

    private downPoint: Point = null;
    private lastEventPoint: Point = null;

    constructor(element: GraphicElement,
                onAction: (event: Event, canvas: Canvas) => void) {
        this.element = element;
        this.onAction = onAction;
    }

    listen(): Listener[] {
        let listeners: Listener[] = [];

        listeners.push({
            name: "mousedown",
            element: this.element,
            onAction: (event) => {
                if (this.element.containsPoint(event.point)) {
                    this.downPoint = event.point;
                }
            }
        });

        listeners.push({
            name: "mouseup",
            element: document.body,
            onAction: () => {
                this.downPoint = null;
            }
        });

        let callback = this.onAction;

        listeners.push({
            name: "mousemove",
            element: document.body,
            onAction: (event, canvas) => {
                if (this.downPoint) {
                    //let delta = event.point.delta(this.downPoint);

                    this.downPoint = event.point;

                    if (event.point.equals(this.lastEventPoint)) {
                        return;
                    }

                    this.lastEventPoint = event.point;

                    let e: Event = {
                        point: event.point,
                        data: event
                    };

                    callback(e, canvas);
                }
            }
        });

        return listeners;
    }
}