import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Roll, Character } from '../../character';
import { LangUtil } from 'src/app/core/util/LangUtil';

@Component({
  selector: 'roll-dialog',
  templateUrl: './roll-dialog.component.html',
  styleUrls: ['./roll-dialog.component.css']
})
export class RollDialogComponent implements OnInit {
  original : Roll
  working : Roll
  @Input() chr : Character
  @Output() onSave = new EventEmitter<Roll>()
  @Output() onCancel = new EventEmitter()
  @Output() onCopy = new EventEmitter<Roll>()
  @Output() onDerive = new EventEmitter<Roll>()
  @Output() onDelete= new EventEmitter()
  showTools = true

  constructor() { }

  @Input() set item(i : Roll) {
    this.original = i
    this.working = new Roll()
    LangUtil.copyFrom(this.item, this.original)
    this.calcValue()
    this.showTools = this.item.name?true:false
  }

  get item() : Roll {
    return this.working
  }

  calcValue() {
    this.chr.calculateRoll(this.item)
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
    const a = new Roll()
    LangUtil.copyFrom(a, this.item)
    a.name = a.name + " copy"
    this.onCopy.emit(a)
  }

  delete() {
    this.onDelete.emit()
  }

  canSave() {
    return this.item.name && this.item.formula
  }
}