import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TokenAnnotation, TokenBar } from 'src/app/core/model';
import { FormatToolDialogComponent } from '../../format-tool-dialog/format-tool-dialog.component';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';

@Component({
  selector: 'edit-token-tool-bars',
  templateUrl: './edit-token-tool-bars.component.html',
  styleUrls: ['./edit-token-tool-bars.component.css']
})
export class EditTokenToolBarsComponent implements OnInit {
  @Input() item : TokenAnnotation
  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  bar : TokenBar
  constructor(private tabs : ToolTabsComponent) { }

  ngOnInit() {
  }

  update() {
    this.emitChanges()
  }
  
  updateBarValue(bar: TokenBar, value) {
    if (this.canAddSub(value)) {
      bar.value = this.toNumber(value) + bar.value
      this.emitChanges()
    } else if (this.isNumber(value)) {
      bar.value = this.toNumber(value)
      this.emitChanges()
    }
  }

  updateBarMax(bar: TokenBar, value) {
    if (this.canAddSub(value)) {
      bar.max = this.toNumber(value) + bar.max
      this.emitChanges()
    } else if (this.isNumber(value)) {
      bar.max = this.toNumber(value)
      this.emitChanges()
    }
  }

  toNumber(val: string): number {
    if (val.indexOf('.') >= 0) {
      return parseFloat(val)
    } else {
      return parseInt(val)
    }
  }

  isNumber(value: string | number): boolean {
    return !isNaN(Number(value));
  }

  canAddSub(val: string): boolean {
    return (val.startsWith("+") || val.startsWith('-')) && val.length > 1 && this.isNumber(val.substr(1))
  }

  emitChanges() {
    this.onUpdate.emit(this.item)
  }

  setBarVisible(bar: TokenBar, visible: number) {
    bar.visible = visible
    this.emitChanges()
  }

  delete(bar: TokenBar) {
    const indx = this.item.bars.indexOf(bar)
    if (indx >= 0) {
      this.item.bars.splice(indx, 1)
      this.emitChanges()
    } else {
      // SHOW ERROR and RECORD
    }
  }

  addBar() {
    const bar = new TokenBar()
    bar.name = "New Bar " + (this.item.bars.length+1)
    this.item.bars.push(bar)
    this.bar = bar
  }

  showPill(bar) {
    this.bar = bar
  }

  
  showFormatDialog() {
    const dialog : FormatToolDialogComponent = this.tabs.showDialog(FormatToolDialogComponent)
    dialog.item = {
      border: false,
      color: "#FFFFFF",
      weight: 0,
      fill: true,
      fillColor: "#555555"
    }
    dialog.onUpdate.subscribe( () => {
      
      
    })
  }
}
