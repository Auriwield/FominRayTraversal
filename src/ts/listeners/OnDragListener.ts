import {Listener} from "./Listener";
import {GraphicElement} from "../primitives/GraphicElement";
import {Point} from "../primitives/Point";
import {Event} from "./Event";
import {Canvas} from "../Canvas";

export class OnDragListener implements Listener {
    name: string = "onDragListener";
    element: GraphicElement;
    onAction: (event: Event, canvas: Canvas) => void;
    propagation: boolean = false;

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
            propagation: false,
            onAction: (event: Event) => {
                if (this.element.containsPoint(event.point)) {
                    this.downPoint = event.point;
                    event.preventDefault();
                }
            }
        });

        listeners.push({
            name: "mouseup",
            element: document.body,
            propagation: true,
            onAction: () => {
                this.downPoint = null;
            }
        });

        let callback = this.onAction;
        let detectLeftButton = (evt : any) => {
            evt = evt || window.event;
            if ("buttons" in evt) {
                return evt.buttons == 1;
            }
            let button = evt.which || evt.button;
            return button == 1;
        };

        listeners.push({
            name: "mousemove",
            element: document.body,
            propagation: true,
            onAction: (event, canvas) => {
                if (this.downPoint) {

                    if (!detectLeftButton(event)) {
                        this.downPoint = null;
                        return;
                    }

                    this.downPoint = event.point;

                    if (event.point.equals(this.lastEventPoint)) {
                        return;
                    }

                    this.lastEventPoint = event.point;

                    callback(event, canvas);
                }
            }
        });

        return listeners;
    }
}