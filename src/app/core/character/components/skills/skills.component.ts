import { Component, OnInit, Input } from '@angular/core';
import { Character, Skill } from '../../character';
import { CharacterPageComponent } from '../../pages/character-page/character-page.component';
import { LangUtil } from 'src/app/core/util/LangUtil';

@Component({
  selector: 'skills',
  templateUrl: './skills.component.html',
  styleUrls: ['./skills.component.css']
})
export class SkillsComponent implements OnInit {
  @Input() item : Character
  @Input() options : SkillOptions = {
    hideUntrained : false,
    sortBy : 'name'
  }
  skills : Skill[] = []
  showdialog : Skill

  constructor(private parent : CharacterPageComponent) { }

  ngOnInit() {
    this.item.calculateAll()
    this.sortAndFilter()
  }

  updateOptions() {
    this.sortAndFilter()
  }

  sortAndFilter() {
    let sks = [...this.item.skills]
    if (this.options.hideUntrained) {
      sks = sks.filter( s => s.ranks > 0)
    }
    sks.sort(( a, b) => {
      if (this.options.sortBy == 'name') {
        return LangUtil.compareStrings(a.name, b.name)
      } else if (this.options.sortBy == 'ability') {
        return LangUtil.compareStrings(a.ability, b.ability)
      } else if (this.options.sortBy == 'rank') {
        return a.ranks - b.ranks
      }
      return 0
    })

    this.skills = sks
  }

  add() {
    this.showdialog = new Skill()
  }
  save(attr: Skill) {
    const indx = this.item.skills.findIndex(a => a.name.toLowerCase() == attr.name.toLowerCase())
    if (indx >= 0) {
      this.item.skills[indx] = attr
    } else {
      this.item.skills.push(attr)
    }

    this.parent.saveCharacter()
    this.cancel()
  }

  cancel() {
    this.showdialog = undefined
  }

  show(attr: Skill) {
    this.showdialog = attr
  }

  delete() {
    const indx = this.item.skills.findIndex( a=> a.name == this.showdialog.name)
    if (indx >= 0) {
      this.item.skills.splice(indx, 1)
      this.parent.saveCharacter()
    }
    this.cancel()
  }

  copy(attr: Skill) {
    this.item.skills.push(attr)
    this.parent.saveCharacter()
    this.showdialog = attr
  }

  derive(attr: Skill) {
    this.item.skills.push(attr)
    this.parent.saveCharacter()
    this.showdialog = attr
  }
}


export interface SkillOptions {
  hideUntrained: boolean,
  sortBy : 'name' | 'rank' | 'ability'
}