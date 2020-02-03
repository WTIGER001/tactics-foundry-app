import { ObjectType, Annotation } from '../model'
import { LangUtil } from '../util/LangUtil'

export class Encounter extends ObjectType {
    static readonly TYPE = "encounter"
    type = Encounter.TYPE

    active: boolean = true
    map: string
    items: EncounterItem[] = []
    round: number = 1
    turn: EncounterItem

    nextTurn() : EncounterItem {
        if (this.items.length >0) {
            let indxCurrent = -1
            if (this.turn) {
                indxCurrent = this.items.findIndex(item => item.annoationId === this.turn.annoationId)
            }
            if (indxCurrent < this.items.length-1) {
                this.turn = this.items[++indxCurrent]
            } else if (indxCurrent >= this.items.length-1) {
                this.round++
                this.turn =this.items[0]
            }
            return this.turn
        }
        return null
    }

    nextRound() {
        this.round++
        if (this.items.length > 0) {
            this.turn = this.items[0]
        } else {
            this.turn = undefined
        }
    }

    static is(obj : any) : obj is Encounter {
        return obj && obj.type === Encounter.TYPE
    }

    static to(doc : any) : Encounter {
        const c = new Encounter()
        LangUtil.copyFrom(c, doc)
        return c
    }
}

export class EncounterItem {
    annoationId : string
    initiative: number
    dead: boolean
}