import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TokenAnnotation } from 'src/app/core/model';
import { FormatToolDialogComponent } from '../../format-tool-dialog/format-tool-dialog.component';
import { Aura, AuraVisible } from 'src/app/core/model/aura';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';

@Component({
  selector: 'edit-token-tool-auras',
  templateUrl: './edit-token-tool-auras.component.html',
  styleUrls: ['./edit-token-tool-auras.component.css']
})
export class EditTokenToolAurasComponent implements OnInit {
  @Input() item : TokenAnnotation
  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  aura : Aura
  constructor(private tabs : ToolTabsComponent) { }

  ngOnInit() {
    if (this.item.auras.length > 0 ) {
      this.aura = this.item.auras[0]
    }
  }

  update() {
    this.emitChanges()
  }
  
  emitChanges() {
    this.onUpdate.emit(this.item)
  }

  setBarVisible(aura: Aura, visible: number) {
    aura.visible = visible
    this.emitChanges()
  }

  addAura() {
    const aura = new Aura()
    aura.name = "New Aura " + (this.item.auras.length+1)
    this.item.auras.push(aura)
    this.aura = aura
  }

  showPill(aura) {
    this.aura = aura
  }

  toggleVisiblity(event) {
    const reverse = event.ctrlKey

    if (this.aura.visible == AuraVisible.NotVisible) {
      this.aura.visible = reverse ? AuraVisible.OnHover : AuraVisible.Visible
    } else if (this.aura.visible == AuraVisible.Visible) {
      this.aura.visible = reverse ? AuraVisible.NotVisible : AuraVisible.OnSelect
    } else if (this.aura.visible == AuraVisible.OnSelect) {
      this.aura.visible = reverse ? AuraVisible.Visible : AuraVisible.OnHover
    } else if (this.aura.visible == AuraVisible.OnHover) {
      this.aura.visible = reverse ? AuraVisible.OnSelect : AuraVisible.NotVisible
    } else {
      this.aura.visible = AuraVisible.NotVisible
    }
    this.emitChanges()
  }

  delete(aura : Aura) {
    let i = this.item.auras.indexOf(this.aura)
    this.item.auras.splice(i, 1)
    
    if (this.item.auras.length == 0) {
      this.aura = null
    } else if (this.item.auras.length == 1) {
      this.aura = this.item.auras[0]
    } else {
      this.aura = this.item.auras[this.item.auras.length-1]
    }
    this.emitChanges()
  }

  getBg() {
    return this.aura.fillColor
  }
  
  onClose() {

  }
}
