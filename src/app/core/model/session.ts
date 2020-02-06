import { ObjectType } from './object-type';
import { IdUtil } from '../util/IdUtil';

export class LiveSession extends ObjectType {
    _id = "live_session" // ONE PER GAME
    name = "Live Session"
    sourceDB: string // Game


}

export class SessionCommand extends ObjectType {
    static readonly TYPE : string = 'session_command'
     objType = SessionCommand.TYPE
    _id = IdUtil.saltedIdType(SessionCommand.TYPE)
    mapId : string
    public command : string

    public static to(doc : any) : SessionCommand {
         const a = new SessionCommand()
         a.copyFrom(doc)
         return a
    }
}

export class ActivateMapCommand extends SessionCommand {
    static readonly CMD = 'Activate Map'
    command = ActivateMapCommand.CMD
    constructor(public sourceDB : string, public mapId : string) { super()}
}

export class PanZoomMapCommand extends SessionCommand {
    static readonly CMD = 'Pan / Zoom Map'
    command = PanZoomMapCommand.CMD
    constructor(public sourceDB : string,public mapId : string,public x : number,public y : number,public zoom ?: number) { super()}
}

export class PingMapCommand extends SessionCommand {
    static readonly CMD = 'Ping Map'
    command = PanZoomMapCommand.CMD
    constructor(public sourceDB : string,public mapId : string, public x : number,public y : number,public zoom ?: number) { super()}
}