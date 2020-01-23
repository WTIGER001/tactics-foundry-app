import { Component, OnInit, Input } from '@angular/core';
import { Formatted } from '../../model';
import { LangUtil } from '../../util/LangUtil';

@Component({
  selector: 'color-cell',
  templateUrl: './color-cell.component.html',
  styleUrls: ['./color-cell.component.css']
})
export class ColorCellComponent implements OnInit {
  @Input() item : Formatted
  @Input() color : string

  constructor() { }

  ngOnInit() {
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
