import { ObjectType } from '../object-type';
import * as modelutil from '../modelutil';

export class MapData extends ObjectType {
    static readonly TYPE = 'mapdata'

    _id = modelutil.id(this)
    type = MapData.TYPE

    name = "New Map"
    description = ""
    height = 0
    width = 0
    image: string //attatchment
    thumb: string //attatchment
    blank = false
    ppm = 1
    parentId : string
    bgColor = "#000000"
    game: string
    session: string

    static to(doc: any): MapData {
        return new MapData().copyFrom(doc)
    }
}

