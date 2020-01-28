import { Component, OnInit, Input } from '@angular/core';
import { Character, Attribute } from '../../character';
import { CharacterPageComponent } from '../../pages/character-page/character-page.component';

@Component({
  selector: 'attributes',
  templateUrl: './attributes.component.html',
  styleUrls: ['./attributes.component.css']
})
export class AttributesComponent implements OnInit {
  @Input() item : Character
  showdialog : Attribute

  constructor(private parent : CharacterPageComponent) { }

  ngOnInit() {
    this.item.calculateAll()
  }

  add() {
    this.showdialog = new Attribute()
  }
  save(attr: Attribute) {
    const indx = this.item.attributes.findIndex(a => a.name.toLowerCase() == attr.name.toLowerCase())
    if (indx >= 0) {
      this.item.attributes[indx] = attr
    } else {
      this.item.attributes.push(attr)
    }

    this.parent.saveCharacter()
    this.cancel()
  }

  cancel() {
    this.showdialog = undefined
  }

  show(attr: Attribute) {
    this.showdialog = attr
  }

  delete() {
    const indx = this.item.attributes.findIndex( a=> a.name == this.showdialog.name)
    if (indx >= 0) {
      this.item.attributes.splice(indx, 1)
      this.parent.saveCharacter()
    }
    this.cancel()
  }

  copy(attr: Attribute) {
    this.item.attributes.push(attr)
    this.parent.saveCharacter()
    this.showdialog = attr
  }

  derive(attr: Attribute) {
    this.item.attributes.push(attr)
    this.parent.saveCharacter()
    this.showdialog = attr
  }
}
