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

    isGM(playerId : string) {
        let found = this.players.find(p => p._id == playerId)
        if (found) {
            return found.role === 'GM'
        }
        return false
    }

    static to(doc : any) : Game{
        return new Game().copyFrom(doc)
    }
}