import { ObjectType, Annotation } from '../model'
import { LangUtil } from '../util/LangUtil'

export class Encounter extends ObjectType {
    static readonly TYPE = "encounter"
    type = Encounter.TYPE

    items: EncounterItem[] = []
    round: number
    turn: EncounterItem

    nextTurn() : EncounterItem {
        if (this.items.length >0) {
            let indxCurrent = 0
            if (this.turn == undefined) {
                indxCurrent = this.items.findIndex(item => item.annoationId == this.turn.annoationId)
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

    whenIsMyTurn(annotationId : string) : number {
        if (this.items.length == 0) {
            return -1;
        }
        let indxCurrent = 0
        if (this.turn == undefined) {
            indxCurrent = this.items.findIndex(item => item.annoationId == this.turn.annoationId)
        }
        let indx = this.items.findIndex(item => item.annoationId == annotationId)
        if (indx == -1) {
            return -1
        }
        if (indxCurrent <= indx) {
            return indx-indxCurrent
        } else {
            return (this.items.length - indxCurrent) + indx
        }
    }

    is(obj : any) : obj is Encounter {
        return obj && obj.type === Encounter.TYPE
    }

    to(doc : any) : Encounter {
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