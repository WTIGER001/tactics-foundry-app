import { ObjectType } from './object-type'
import { Player } from './player'
import { Game } from './game'
import { Annotation } from './map-model/annotation'
import { MapData } from './map-model/mapdata'

export function To(doc : any) : ObjectType {
    if (doc.type == Player.TYPE) { return Player.to(doc)}
    if (doc.type == Game.TYPE) { return Game.to(doc)}
    if (doc.type == Annotation.TYPE) { return Player.to(doc)}
    if (doc.type == MapData.TYPE) { return Player.to(doc)}
    
    throw Error("Type " + doc.type + " not supported")
}
