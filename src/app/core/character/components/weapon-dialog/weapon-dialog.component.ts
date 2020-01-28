import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { Weapon, Character } from '../../character';

@Component({
  selector: 'weapon-dialog',
  templateUrl: './weapon-dialog.component.html',
  styleUrls: ['./weapon-dialog.component.css']
})
export class WeaponDialogComponent implements OnInit {
  original : Weapon
  working : Weapon
  @Input() chr : Character
  @Output() onSave = new EventEmitter<Weapon>()
  @Output() onCancel = new EventEmitter()
  @Output() onCopy = new EventEmitter<Weapon>()
  @Output() onDerive = new EventEmitter<Weapon>()
  @Output() onDelete= new EventEmitter()
  showTools = true

  constructor() { }

  @Input() set item(i : Weapon) {
    this.original = i
    this.working = new Weapon()
    LangUtil.copyFrom(this.item, this.original)
    this.showTools = this.item.name?true:false
  }

  get item() : Weapon {
    return this.working
  }


  ngOnInit() {
    
  }

  save() {
    LangUtil.copyFrom(this.original, this.item)
    this.onSave.emit(this.item)
  }

  cancel() {
    this.onCancel.emit()
  }

  copy() {
    const a = new Weapon()
    LangUtil.copyFrom(a, this.item)
    a.name = a.name + " copy"
    this.onCopy.emit(a)
  }

  delete() {
    this.onDelete.emit()
  }

  canSave() {
    return this.item.name
  }
}
