import {Point} from "../primitives/Point";

export interface Event extends MouseEvent{
    point: Point,
    data: any
}