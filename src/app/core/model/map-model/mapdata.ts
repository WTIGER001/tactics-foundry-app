import { ObjectType } from '../object-type';
import { IdUtil} from '../../util/IdUtil'
import { GridOptions } from './grid-options';

export class MapData extends ObjectType {
    static readonly TYPE = 'mapdata'

    _id = IdUtil.saltedIdType(MapData.TYPE)
    
    type = MapData.TYPE
    sourceDB
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
    gridOptions= new GridOptions()

    static to(doc: any): MapData {
        return new MapData().copyFrom(doc)
    }
}

