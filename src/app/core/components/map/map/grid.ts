import {Grid} from 'pathfinding';
import { MapData } from 'src/app/core/model';
import { GridDistanceUtil } from './grid-distance';


export class MapGrid {
    private grid : Grid = new Grid(100, 100)

    public static from(map: MapData) : MapGrid {
        let dist = new GridDistanceUtil()


        return new MapGrid()
    }

}