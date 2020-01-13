import { ObjectType } from './object-type';
import { IdUtil } from '../util/IdUtil';
import { LangUtil } from '../util/LangUtil';

export class ChatRecord extends ObjectType {
    static readonly TYPE = 'chat_message'
    _id = IdUtil.saltedIdType(ChatRecord.TYPE)
    type  = ChatRecord.TYPE
    sourceDB: string
    displayName : string
    record: TextMessage | DiceRoll | PingMessage

    static to(doc  : any) : ChatRecord {
        let c = new ChatRecord()
        LangUtil.copyFrom(c, doc)

        if (doc.messageType == TextMessage.MSG_TYPE) {
            c.record = TextMessage.to(doc.record)
        } 
        if (doc.messageType == DiceRoll.MSG_TYPE) {
            c.record =  DiceRoll.to(doc.record)
        } 
        if (doc.messageType == PingMessage.MSG_TYPE) {
            c.record = PingMessage.to(doc.record)
        } 
        return c
    }

    toDate(): Date {
      return new Date(this.lastUpdate)
    }
}

export class TextMessage  {
    static readonly MSG_TYPE = 'chat.messagetext'

    messageType = TextMessage.MSG_TYPE
    message: string = ""

    static to(doc : any)  : TextMessage {
        return LangUtil.copyFrom(new TextMessage(), doc)
    }
}

export class DiceRoll {
    public static readonly MSG_TYPE = 'chat.diceroll'
  
    static to(item: any): DiceRoll {
      let obj = new DiceRoll()
      Object.assign(obj, item)
  
      for (let i = 0; i < obj.dice.length; i++) {
        let d = new DiceResult()
        Object.assign(d, obj.dice[i])
        obj.dice[i] = d
      }
      return obj
    }
  
    static copy(r: DiceRoll): DiceRoll {
      let obj = new DiceRoll()
      obj.modifier = r.modifier
      obj.expression = r.expression
      obj.rolltype = r.rolltype
      obj.tokenId = r.tokenId
      r.dice.forEach(die => {
        let d = new DiceResult()
        d.negative = die.negative
        d.threeDIndex = die.threeDIndex
        d.threeDIndex100 = die.threeDIndex100
        d.type = die.type
        d.value = die.value
        d.value100 = die.value100
        obj.dice.push(d)
      })
      return obj
    }
  
    // TypeScript guard
    static is(obj: any): obj is DiceRoll {
      return obj.objType !== undefined && obj.objType === DiceRoll.MSG_TYPE
    }
  
    messageType = DiceRoll.MSG_TYPE
    modifier: number = 0
    expression: string
    dice: DiceResult[] = []
    _fav: boolean
    tokenId : string
    rolltype : string
  
    /**
     * 
     * @param numDice Number of DIce
     * @param numSides Number of Sides
     * @param negative Negative
     */
    addDice(numDice: number, numSides: number, negative?: boolean) {
      for (let i = 0; i < numDice; i++) {
        let di = new DiceResult()
        di.type = numSides
        di.negative = negative
        this.dice.push(di)
      }
    }
  
    addModifier(mod: number) {
      this.modifier += mod
    }
  
    getTotal(): number {
      // Sum the dice
      let diceTotal = 0
      this.dice.forEach(r => {
        if (r.negative) {
          diceTotal = diceTotal - r.getTotal()
        } else {
          diceTotal = diceTotal + r.getTotal()
        }
      })
      return diceTotal + this.modifier
    }
  
    getText(): string {
      let str = ""
      this.dice.forEach((d, i) => {
        if (i > 0 && d.negative == false) {
          str += " + "
        } else if (i > 0 || d.negative) {
          str += " - "
        } else if (d.negative) {
          str += "-"
        }
        str += "[" + d.type + "] " + (d.value + d.value100)
      })
      if (this.modifier > 0) {
        str = str + " + " + this.modifier
      }
      if (this.modifier < 0) {
        str = str + " - " + Math.abs(this.modifier)
      }
      str += " = " + this.getTotal()
      return str
    }
  
  }

export class DiceResult {
    public static readonly TYPE = 'chat.diceroll'

    value: number = 0;
    value100: number = 0;
    type: number;
    threeDIndex: number = -1;
    threeDIndex100: number = -1;
    negative: boolean

    getNoClass(): boolean {
        switch (this.type) {
            case 2:
            case 4:
            case 6:
            case 8:
            case 10:
            case 12:
            case 20:
                return false
        }
        return true
    }

    getClass(): string {
        return "df-d" + this.type + "-" + this.value
    }

    isCriticalFail(): boolean {
        return this.type == 20 && this.value == 1
    }

    isCriticalSuccess(): boolean {
        return this.type == 20 && this.value == 20
    }

    isMax(): boolean {
        return this.type == this.value
    }

    isMin(): boolean {
        return this.value == 1
    }

    getTotal(): number {
        if (this.type == 100 && this.value == 0 && this.value100 == 0) {
            return 100
        }
        return this.value + this.value100
    }
}


export class PingMessage  {
    public static readonly MSG_TYPE = 'chat.ping'
    static to(doc : any)  : PingMessage {
        return LangUtil.copyFrom(new PingMessage(), doc)
    }

    // TypeScript guard
    static is(obj: any): obj is PingMessage {
        return obj.objType !== undefined && obj.objType === PingMessage.MSG_TYPE
    }

    messageType = PingMessage.MSG_TYPE
    x: number
    y: number
    map: string
    mapname: string
}