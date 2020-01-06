import { ObjectType } from '../object-type';
import * as modelutil from '../modelutil';

export class MapData extends ObjectType {
    static readonly TYPE = 'mapdata'

    _id = modelutil.id(this)
    type = MapData.TYPE

    name: string

    static to(doc : any) : MapData{
        return new MapData().copyFrom(doc)
    }
}

