import { Component, OnInit, Input } from '@angular/core';
import { TextStyle } from 'pixi.js';

@Component({
  selector: 'font-preview',
  templateUrl: './font-preview.component.html',
  styleUrls: ['./font-preview.component.css']
})
export class FontPreviewComponent implements OnInit {
  @Input() style = new TextStyle()
  @Input() previewText = "AaBbCcDd"

  constructor() { }

  ngOnInit() {
  }

  buildStyle() : any {
    let style : any = {
    }
    if (this.style.fontFamily) {
      style.fontFamily = this.style.fontFamily
    }
    if (this.style.fontSize) {
      style['font-size'] = this.style.fontSize
    }
    if (this.style.fill) {
      style.color = this.style.fill
    }
    if (this.style.stroke) {
      style['-webkit-text-stroke-color'] = this.style.stroke
    }
    if (this.style.strokeThickness) {
      style['-webkit-text-stroke-width'] = this.style.strokeThickness + "px"
    }
    if (this.style.align) {
      style['text-align'] = this.style.align
    }
    if (this.style.fontWeight) {
      style['font-weight'] = this.style.fontWeight
    }
    if (this.style.fontStyle) {
      style['font-style'] = this.style.fontStyle
    }
    return style
  }
}
