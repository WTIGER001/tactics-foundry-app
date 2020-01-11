import { ObjectType } from './object-type';
import { IdUtil } from '../util/IdUtil';
import { PlayerRole } from './player';

export class Game extends ObjectType {
    static readonly TYPE = 'game'

    type = Game.TYPE
    players: PlayerRole[] = []
    name: string
    description: string
    image: string

    static to(doc : any) : Game{
        return new Game().copyFrom(doc)
    }
}