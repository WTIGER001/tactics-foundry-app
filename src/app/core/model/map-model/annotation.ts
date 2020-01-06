
import * as modelutil from '../modelutil';
import { ObjectType } from '../object-type';

export class Annotation extends ObjectType {
    static readonly TYPE = 'annotation'
    _id = modelutil.id(this)
    mapid : string
    type = Annotation.TYPE
    name = "Annotation" + new Date().toDateString()
    color = "Green"
    center = new CenterPoint(1, 2)

    static to(doc : any) : Annotation {
        return new Annotation().copyFrom(doc)
    }
}

export class CenterPoint {
    constructor(public x: number, public y: number) {

    }
}