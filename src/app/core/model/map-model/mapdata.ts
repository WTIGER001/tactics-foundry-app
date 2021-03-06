import { ObjectType } from '../object-type';
import { IdUtil} from '../../util/IdUtil'
import { GridOptions } from './grid-options';
import { FogOfWar } from './fow';

export class MapData extends ObjectType {
    static readonly TYPE = 'mapdata'

    _id = IdUtil.saltedIdType(MapData.TYPE)
    
    objType = MapData.TYPE
    sourceDB
    name = "New Map"
    description = ""
    height = 0
    width = 0
    image: string //attatchment
    thumb: string //attatchment
    blank = false
    ppf = 1
    parentId : string
    bgColor = "#000000"
    game: string
    session: string
    gridOptions= new GridOptions()
    fog = new FogOfWar()

    static to(doc: any): MapData {
        return new MapData().copyFrom(doc)
    }

}

