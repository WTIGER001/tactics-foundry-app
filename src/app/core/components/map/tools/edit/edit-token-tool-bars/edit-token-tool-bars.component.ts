import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TokenAnnotation, TokenBar } from 'src/app/core/model';
import { FormatToolDialogComponent } from '../../format-tool-dialog/format-tool-dialog.component';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { AuraVisible } from 'src/app/core/model/aura';

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
    if (this.item.bars.length > 0 ) {
      this.bar = this.item.bars[0]
    }
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

  toggleVisiblity(event) {
    const reverse = event.ctrlKey

    if (this.bar.visible == AuraVisible.NotVisible) {
      this.bar.visible = reverse ? AuraVisible.OnHover : AuraVisible.Visible
    } else if (this.bar.visible == AuraVisible.Visible) {
      this.bar.visible = reverse ? AuraVisible.NotVisible : AuraVisible.OnSelect
    } else if (this.bar.visible == AuraVisible.OnSelect) {
      this.bar.visible = reverse ? AuraVisible.Visible : AuraVisible.OnHover
    } else if (this.bar.visible == AuraVisible.OnHover) {
      this.bar.visible = reverse ? AuraVisible.OnSelect : AuraVisible.NotVisible
    } else {
      this.bar.visible = AuraVisible.NotVisible
    }
    this.emitChanges()
  }

  delete(bar : TokenBar) {
    let i = this.item.bars.indexOf(this.bar)
    this.item.bars.splice(i, 1)
    
    if (this.item.bars.length == 0) {
      this.bar = null
    } else if (this.item.bars.length == 1) {
      this.bar = this.item.bars[0]
    } else {
      this.bar = this.item.bars[this.item.bars.length-1]
    }
    this.emitChanges()
  }

  updatebg(color : string) {
    this.bar.bgColor = color
    this.update()
  }
  
  updateclr(color : string) {
    this.bar.color = color
    this.update()
  }
}
