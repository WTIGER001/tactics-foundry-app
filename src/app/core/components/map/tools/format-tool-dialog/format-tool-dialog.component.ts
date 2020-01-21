import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { Annotation, CircleAnnotation } from 'src/app/core/model';
import { ToolDialogComponent } from '../tool-dialog/tool-dialog.component';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { DomSanitizer } from '@angular/platform-browser';
import { ColorPickerDirective } from 'ngx-color-picker';

@Component({
  selector: 'format-tool-dialog',
  templateUrl: './format-tool-dialog.component.html',
  styleUrls: ['./format-tool-dialog.component.css']
})
export class FormatToolDialogComponent implements OnInit {
  @Input() item: CircleAnnotation
  @Output() onUpdate = new EventEmitter<boolean>()
  @ViewChild(ColorPickerDirective, {static : false}) colorpick : ColorPickerDirective
  presetItems = []
  colorpickerhide = true
  colorpickerhide2 = true

  constructor( parent: ToolDialogComponent) {
    parent.image = '/assets/pages/format-tool.png'
    parent.imageOverlap = '-35px'
   }

   @HostListener('window:mousedown', ['$event'])
   onMouseDown(event : any) {
     console.log("MOUSE ", event)

     let path : string[] = event.path
    const found = path.indexOf('color-picker') >=0 
    if (!found) {
      this.colorpickerhide = true
      this.colorpickerhide2 = true
    }
   }

   getStyle(item : any) {
     let style : any= {}
     style.background = this.getBackground(item)
     style['border-width.px'] = item.weight
     style['border-color'] = item.color
     return style
   }


   getBackground(item : any) {
    // convert to rgba
    let r = LangUtil.red(item.fillColor)
    let g = LangUtil.green(item.fillColor)
    let b = LangUtil.blue(item.fillColor)
    let a = LangUtil.colorAlpha(item.fillColor)

    const url = '/assets/pages/transparency.png'

    let bg =`linear-gradient(0deg, rgba(${r},${g},${b},${a}), rgba(${r},${g},${b},${a})), url(${url})`
    return bg
   }

  ngOnInit() {
    this.presetItems.push({fillColor:"#00000088", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#0000FF88", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#00FF0088", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#FF000088", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#FF000088", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#FFFF0088", color:"#FFFFFF", weight: 1 })

    this.presetItems.push({fillColor:"#FF00FF", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#FF00FF", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#AAAAAA", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#BBBBBB", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#444444", color:"#FFFFFF", weight: 1 })
    this.presetItems.push({fillColor:"#222222", color:"#FFFFFF", weight: 1 })

    this.presetItems.push({fillColor:"#000000", color:"#000000", weight: 2 })
    this.presetItems.push({fillColor:"#000000", color:"#000000", weight: 2 })
    this.presetItems.push({fillColor:"#0000FF", color:"#000000", weight: 2 })
    this.presetItems.push({fillColor:"#00FF00", color:"#000000", weight: 2 })
    this.presetItems.push({fillColor:"#FF0000", color:"#000000", weight: 2 })
    this.presetItems.push({fillColor:"#FFFF00", color:"#000000", weight: 2 })

    this.presetItems.push({fillColor:"#000000", color:"#FFFFFF", weight: 3 })
    this.presetItems.push({fillColor:"#0000FF", color:"#FFFFFF", weight: 3 })
    this.presetItems.push({fillColor:"#00FF00", color:"#FFFFFF", weight: 3 })
    this.presetItems.push({fillColor:"#FF0000", color:"#FFFFFF", weight: 3 })
    this.presetItems.push({fillColor:"#FF0000", color:"#FFFFFF", weight: 4 })
    this.presetItems.push({fillColor:"#FFFF00", color:"#FFFFFF", weight: 5 })

    this.presetItems.forEach(i => {
      i.style = this.getStyle(i)
    })
  }

  usePreset(preset) {
    this.item.weight = preset.weight
    this.item.color = preset.color
    this.item.fillColor = preset.fillColor
    this.item.border = true
    this.item.fill = true
  }

  update() {
    console.log("COLOR ", this.item.color, "WEIGHT", this.item.weight);
    
    this.onUpdate.emit(true)
  }
}
