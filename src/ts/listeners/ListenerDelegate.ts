import {Listener} from "./Listener";
import {Point} from "../primitives/Point";
import {Event} from "./Event";
import {Canvas} from "../Canvas";
import {GraphicElement} from "../primitives/GraphicElement";

export class ListenerDelegate {
    private listeners: Listener[];
    private element: HTMLCanvasElement;
    private canvas: Canvas;
    private registeredEvents: string[];

    constructor(element: HTMLCanvasElement, canvas: Canvas) {
        this.listeners = [];
        this.canvas = canvas;
        this.element = element;
        this.registeredEvents = [];
    }

    addListeners(listeners: Listener[]) {
        this.listeners = listeners.concat(this.listeners);
        this.registerEvents(listeners);
    }

    registerEvents(listeners: Listener[]) {
        listeners.forEach(value => {

            if (!value || !value.name
                || this.registeredEvents.indexOf(value.name) !== -1) {
                return;
            }

            let element = value.element instanceof HTMLElement ? value.element : document.body;

            element.addEventListener(value.name, evt => {
                let listeners = this.getListenersByEvent(value.name);

                if (!listeners || listeners.length == 0) {
                    element.removeEventListener(value.name, null, false);
                }

                let event: Event = {
                    point: this.getPointFromEvent(evt),
                    data: evt
                };

                for (let listener of listeners) {
                    let ge = listener.element as GraphicElement;
                    if (ge.containsPoint) {
                       if (!ge.containsPoint(event.point)) {
                           continue;
                       }
                    }

                    listener.onAction(event, this.canvas);

                    if (!listener.propagation) {
                        break;
                    }
                }
            });

            this.registeredEvents.push(value.name);
        });
    }

    getPointFromEvent(e: any) {
        let x;
        let y;
        if (e.pageX || e.pageY) {
            x = e.pageX;
            y = e.pageY;
        }
        else {
            x = e.clientX + document.body.scrollLeft + this.element.scrollLeft;
            y = e.clientY + document.body.scrollTop + this.element.scrollTop;
        }
        x -= this.element.offsetLeft;
        y -= this.element.offsetTop;

        //console.log(new Point(x, y));
        return new Point(x * this.canvas.ratio, y * this.canvas.ratio);
    }

    getListenersByEvent(event: string) {
        let listeners: Listener[] = [];

        for (let listener of this.listeners) {
            if (listener.name === event) {
                listeners.push(listener);
            }
        }

        return listeners;
    }
}