import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TokenAnnotation, TokenBar } from 'src/app/core/model';
import { FormatToolDialogComponent } from '../../format-tool-dialog/format-tool-dialog.component';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { AuraVisible } from 'src/app/core/model/aura';
import { Character, Attribute } from 'src/app/core/character/character';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { EditTokenToolComponent } from '../edit-token-tool/edit-token-tool.component';

@Component({
  selector: 'edit-token-tool-bars',
  templateUrl: './edit-token-tool-bars.component.html',
  styleUrls: ['./edit-token-tool-bars.component.css']
})
export class EditTokenToolBarsComponent implements OnInit {
  @Input() item : TokenAnnotation
  @Input() chr : Character
  
  attributes : Attribute[] = []

  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  bar : TokenBar
  maxreadonly = false

  constructor(private tabs : ToolTabsComponent, private edit : EditTokenToolComponent) { }

  ngOnInit() {
    if (this.item.bars.length > 0 ) {
      this.bar = this.item.bars[0]
    }
  }
    
  updateBarName() {
    const attr = this.getAttribute(this.bar)
    if (attr) {
      this.chr.calculate(attr)
      this.bar.max = attr.value
      this.bar.value = attr.current
      this.maxreadonly = true
    } else {
      this.maxreadonly = false
    }
  }

  update() {
    this.emitChanges()
  }
  
  getAttribute(bar: TokenBar) : Attribute{
    if (!this.chr) {
      return null
    }
    return this.chr.attributes.find(a => a.name.toLowerCase() === bar.name.toLowerCase())
  }

  updateBarValue(bar: TokenBar, value) {
    if (this.canAddSub(value)) {
      bar.value = this.toNumber(value) + bar.value
      this.emitChanges()
      this.updateCharacterBar(bar)
    } else if (this.isNumber(value)) {
      bar.value = this.toNumber(value)
      this.emitChanges()
      this.updateCharacterBar(bar)
    }
  }

  /**
   * Updates the linked character with
   * @param bar 
   */
  updateCharacterBar(bar: TokenBar) {
    if (this.chr && this.item.linkType =='character') {
      // Look for the bar
      const attr = this.getAttribute(bar)
      if (attr && attr.current != bar.value) {
        attr.override = bar.value
        this.edit.storeAndUpdateCharacter()
      }
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
    this.updateBarName()
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

  delete() {
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
