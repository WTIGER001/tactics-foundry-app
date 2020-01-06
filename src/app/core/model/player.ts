import { ObjectType } from './object-type'

export class Player extends ObjectType{
    static readonly TYPE = 'player'
    /** The database id for the player. */
    _id = 'playerid'

    /** Player Type */
    type = Player.TYPE
    
    /** The Id of the player. This must be unique */
    public playerid : string

    /** The display name for the player */
    public displayName: string 

    /** The list of games that the player is part of */
    public games  : Set<string> = new Set<string>()

    /** The list of characters that the player owns */
    public characters  : Set<string> = new Set<string>()

    static to(obj: any): Player {
        return new Player().copyFrom(obj)
    }
}