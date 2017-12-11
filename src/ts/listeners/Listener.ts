import {GraphicElement} from "../primitives/GraphicElement";
import {Event} from "./Event";
import {Canvas} from "../Canvas";

export interface Listener {
    name: string;

    element: GraphicElement | HTMLElement;

    onAction: (event: Event, canvas : Canvas) => void;

    propagation : boolean;
}