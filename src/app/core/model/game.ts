import { ObjectType } from './object-type';

export class Game extends ObjectType {
    static readonly TYPE = 'game'

    type = Game.TYPE

    static to(doc : any) : Game{
        return new Game().copyFrom(doc)
    }
}