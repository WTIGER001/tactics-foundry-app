import { Component, OnInit, Input } from '@angular/core';
import { Character, Roll } from '../../character';
import { CharacterPageComponent } from '../../pages/character-page/character-page.component';

@Component({
  selector: 'rolls',
  templateUrl: './rolls.component.html',
  styleUrls: ['./rolls.component.css']
})
export class RollsComponent implements OnInit {
  @Input() item : Character
 
  rolls : Roll[] = []
  showdialog : Roll

  constructor(private parent : CharacterPageComponent) { }

  ngOnInit() {
    this.item.calculateAll()
    this.sortAndFilter()
  }

  updateOptions() {
    this.sortAndFilter()
  }

  sortAndFilter() {
    let sks = [...this.item.rolls]
    this.rolls = sks
  }

  add() {
    this.showdialog = new Roll()
  }
  save(attr: Roll) {
    const indx = this.item.skills.findIndex(a => a.name.toLowerCase() == attr.name.toLowerCase())
    if (indx >= 0) {
      this.item.rolls[indx] = attr
    } else {
      this.item.rolls.push(attr)
    }

    this.parent.saveCharacter()
    this.sortAndFilter()
    this.cancel()
  }

  cancel() {
    this.showdialog = undefined
  }

  show(attr: Roll) {
    this.showdialog = attr
  }

  delete() {
    const indx = this.item.rolls.findIndex( a=> a.name == this.showdialog.name)
    if (indx >= 0) {
      this.item.rolls.splice(indx, 1)
      this.parent.saveCharacter()
      this.sortAndFilter()
    }
    this.cancel()
  }

  copy(attr: Roll) {
    this.item.rolls.push(attr)
    this.parent.saveCharacter()
    this.showdialog = attr
    this.sortAndFilter()
  }
}