import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Attribute, Character } from '../../character';
import { LangUtil } from 'src/app/core/util/LangUtil';

@Component({
  selector: 'attribute-dialog',
  templateUrl: './attribute-dialog.component.html',
  styleUrls: ['./attribute-dialog.component.css']
})
export class AttributeDialogComponent implements OnInit {
  original : Attribute
  working : Attribute
  @Input() chr : Character
  @Output() onSave = new EventEmitter<Attribute>()
  @Output() onCancel = new EventEmitter()
  @Output() onCopy = new EventEmitter<Attribute>()
  @Output() onDerive = new EventEmitter<Attribute>()
  @Output() onDelete= new EventEmitter()
  showTools = true

  constructor() { }

  @Input() set item(i : Attribute) {
    this.original = i
    this.working = new Attribute()
    LangUtil.copyFrom(this.item, this.original)
    this.calcValue()
    this.showTools = this.item.name?true:false
  }

  get item() : Attribute {
    return this.working
  }

  calcValue() {
    this.chr.calculate(this.item)
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
    const a = new Attribute()
    LangUtil.copyFrom(a, this.item)
    a.name = a.name + " copy"
    this.onCopy.emit(a)
  }

  derive() {
    const a = this.item.copy()
    a.name = a.name + " derived"
    a.formula = "[" +this.item.name +"]"
    a.description ="Derived value from " + this.item.name
    a.current = 0
    a.value = 0
    a.override = 0
    
    this.onDerive.emit(a)
  }

  delete() {
    this.onDelete.emit()
  }

  canSave() {
    return this.item.name && this.item.formula
  }
}
