import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Attribute, Character, Skill } from '../../character';
import { LangUtil } from 'src/app/core/util/LangUtil';

@Component({
  selector: 'skill-dialog',
  templateUrl: './skill-dialog.component.html',
  styleUrls: ['./skill-dialog.component.css']
})
export class SkillDialogComponent implements OnInit {
  original : Skill
  working : Skill
  @Input() chr : Character
  @Output() onSave = new EventEmitter<Skill>()
  @Output() onCancel = new EventEmitter()
  @Output() onCopy = new EventEmitter<Skill>()
  @Output() onDerive = new EventEmitter<Skill>()
  @Output() onDelete= new EventEmitter()
  showTools = true

  constructor() { }

  @Input() set item(i : Skill) {
    this.original = i
    this.working = new Skill()
    LangUtil.copyFrom(this.item, this.original)
    this.showTools = this.item.name?true:false
  }

  get item() : Skill {
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
    const a = new Skill()
    LangUtil.copyFrom(a, this.item)
    a.name = a.name + " copy"
    this.onCopy.emit(a)
  }

  delete() {
    this.onDelete.emit()
  }

  canSave() {
    return this.item.name && this.item.ability
  }
}
