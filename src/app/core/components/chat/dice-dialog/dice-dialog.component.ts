import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { DiceRoller } from 'src/app/core/util/dice';

@Component({
  selector: 'dice-dialog',
  templateUrl: './dice-dialog.component.html',
  styleUrls: ['./dice-dialog.component.css']
})
export class DiceDialogComponent implements OnInit {
  @Output() onComplete = new EventEmitter<string>()
  @Output() onClose = new EventEmitter()

  dice = new Map<number, number>()
  customDie : number
  modifier : number = 0
  expression : string
  label: string
  privateroll = false

  constructor() { }

  ngOnInit() {
  }

  selectCustom() {
    this.select(this.customDie)
  }

  select(die : number) {
    let cnt = this.dice.get(die)
    cnt = cnt?++cnt:1
    this.dice.set(die, cnt)
    this.updateExpression()
  }

  modPlus() {
    this.modifier += 1
    this.updateExpression()
  }

  update() {
    
  }

  modMinus() {
    this.modifier -= 1
    this.updateExpression()
  }

  updateExpression() {
    let all :number[][] = []
     this.dice.forEach( (v, k) => all.push([k, v]))
    all.sort().reverse()

    let txt =all.map(n => n[1]+'d'+n[0])
    let text = txt.join(' + ')
    if (this.modifier > 0) {
      text += ' + ' + this.modifier
    } else if (this.modifier <0 ) {
      text += ' - ' + Math.abs(this.modifier)
    }
    if (this.label) {
      text = this.label + " " + text
    }

    this.expression = text
  } 

  parse() {
  
    const d : DiceRoller = new DiceRoller(false, null)
    const roll = d.parse(this.expression)

    let dice = new Map<number, number>()

    roll.dice.forEach( d => {
      let cnt = dice.get(d.type)
      cnt = cnt?++cnt:1
      dice.set(d.type, cnt)
    })

    this.dice = dice
    this.modifier = roll.modifier
  }

  close() {
    this.onClose.emit()
    this.dice = new Map()
    this.customDie = undefined
    this.label = undefined
    this.modifier = 0
    this.expression = undefined
  }

  roll() {
    this.onComplete.emit(this.expression)
    this.close()    
  }
}
