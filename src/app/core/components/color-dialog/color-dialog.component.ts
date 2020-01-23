import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Formatted } from '../../model';
import { LangUtil } from '../../util/LangUtil';
import { ToolTabsComponent } from '../map/tools/tool-tabs/tool-tabs.component';
import { FormatToolDialogComponent } from '../map/tools/format-tool-dialog/format-tool-dialog.component';

@Component({
  selector: 'color-dialog',
  templateUrl: './color-dialog.component.html',
  styleUrls: ['./color-dialog.component.css']
})
export class ColorDialogComponent implements OnInit {
  @Input() item : Formatted
  @Input() color : string
  @Output() onUpdate = new EventEmitter()
  @Output() onUpdateColor = new EventEmitter<string>()
  
  constructor(private tabs : ToolTabsComponent) { }

  ngOnInit() {
  }

  showFormatDialog() {
    const dialog : FormatToolDialogComponent = this.tabs.showDialog(FormatToolDialogComponent)
    if (this.item ) {
      dialog.item = this.item
    } else if (this.color) {
      dialog.color = this.color
    } else {
      dialog.color = "#000000"
    }

    dialog.onUpdate.subscribe( () => {
      this.onUpdate.emit()
    })
    dialog.onUpdateColor.subscribe( color => {
      this.color = color
      this.onUpdateColor.emit(color)
    })
  }

  getStyle() {
    let style : any= {}
      style.background = this.getBackground()
      if (this.item && this.item.border) {
        style['border-width.px'] = this.item.weight
        style['border-color'] = this.item.color
      }
    return style
  }

  getBackground() {
    const url = '/assets/pages/transparency.png'
    
    if (this.item) {
      if (this.item.fill) {
        // convert to rgba
        let r = LangUtil.red(this.item.fillColor)
        let g = LangUtil.green(this.item.fillColor)
        let b = LangUtil.blue(this.item.fillColor)
        let a = LangUtil.colorAlpha(this.item.fillColor)
        let bg =`linear-gradient(0deg, rgba(${r},${g},${b},${a}), rgba(${r},${g},${b},${a})), url(${url})`
        return bg
      } else {
        return  `url(${url})`
      }
    } else if (this.color) {
      let r = LangUtil.red(this.color)
        let g = LangUtil.green(this.color)
        let b = LangUtil.blue(this.color)
        let a = LangUtil.colorAlpha(this.color)
        let bg =`linear-gradient(0deg, rgba(${r},${g},${b},${a}), rgba(${r},${g},${b},${a})), url(${url})`
        return bg
    }
  }
}

