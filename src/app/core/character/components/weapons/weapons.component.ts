import { Component, OnInit, Input } from '@angular/core';
import { Weapon, Character } from '../../character';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { CharacterPageComponent } from '../../pages/character-page/character-page.component';

@Component({
  selector: 'weapons',
  templateUrl: './weapons.component.html',
  styleUrls: ['./weapons.component.css']
})
export class WeaponsComponent implements OnInit {
  @Input() item : Character

  weapons : Weapon[] = []
  showdialog : Weapon

  constructor(private parent : CharacterPageComponent) { }

  ngOnInit() {
    this.item.calculateAll()
    this.sortAndFilter()
  }

  updateOptions() {
    this.sortAndFilter()
  }

  sortAndFilter() {
    let sks = [...this.item.weapons]
    this.weapons = sks
  }

  add() {
    this.showdialog = new Weapon()
  }
  
  save(attr: Weapon) {
    const indx = this.item.weapons.findIndex(a => a.name.toLowerCase() == attr.name.toLowerCase())
    if (indx >= 0) {
      this.item.weapons[indx] = attr
    } else {
      this.item.weapons.push(attr)
    }
    this.sortAndFilter()

    this.parent.saveCharacter()
    this.cancel()
  }

  cancel() {
    this.showdialog = undefined
  }

  show(attr: Weapon) {
    this.showdialog = attr
  }

  delete() {
    const indx = this.item.weapons.findIndex( a=> a.name == this.showdialog.name)
    if (indx >= 0) {
      this.item.weapons.splice(indx, 1)
      this.parent.saveCharacter()
      this.sortAndFilter()

    }
    this.cancel()
  }

  copy(attr: Weapon) {
    this.item.weapons.push(attr)
    this.parent.saveCharacter()
    this.showdialog = attr
    this.sortAndFilter()

  }


}