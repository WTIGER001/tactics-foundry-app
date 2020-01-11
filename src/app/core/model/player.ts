import { ObjectType } from './object-type'

export class Player extends ObjectType{
    static readonly TYPE = 'player'
    /** The database id for the player. */
    _id = 'playerid'

    /** Player Type */
    type = Player.TYPE

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

export class PlayerRec {
    /** The database id for the player. */
    _id : string

    /** The display name for the player */
    public displayName: string 

    public selected ?: boolean = false
}

export class PlayerRole {
    /** The database id for the player. */
    _id : string

    /** The display name for the player */
    public displayName: string 

    // Role of the user
    public role : 'Player' | 'GM' = 'Player'
}