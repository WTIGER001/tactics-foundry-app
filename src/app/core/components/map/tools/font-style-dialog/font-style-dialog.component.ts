import { Component, OnInit, Input, Output, EventEmitter, HostListener, ViewChild } from '@angular/core';
import { Annotation, CircleAnnotation, Formatted } from 'src/app/core/model';
import { ToolDialogComponent } from '../tool-dialog/tool-dialog.component';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { ColorPickerDirective } from 'ngx-color-picker';
import { TextStyle } from 'pixi.js';

@Component({
  selector: 'font-style-dialog',
  templateUrl: './font-style-dialog.component.html',
  styleUrls: ['./font-style-dialog.component.css']
})
export class FontStyleDialogComponent implements OnInit {
  @Input() item: TextStyle
  @Input() color: string = "#000000"
  @Output() onUpdate = new EventEmitter<boolean>()
  @Output() onUpdateColor = new EventEmitter<string>()

  @ViewChild(ColorPickerDirective, {static : false}) colorpick : ColorPickerDirective
  presetItems : Formatted[] = []
  colorpickerhide = true
  colorpickerhide2 = true

  get outline() : boolean {
    return this.item.strokeThickness > 0
  } 

  set outline(v : boolean) {
    if (v) {
      this.item.strokeThickness = 1
    } else {
      this.item.strokeThickness = 0
    }
  }


  toggleBold() {
    if (this.item.fontWeight == 'bold') {
      this.item.fontWeight = 'normal'
    } else {
      this.item.fontWeight = 'bold'
    }
  }

  toggleItalic() {
    if (this.item.fontStyle == 'italic') {
      this.item.fontStyle = 'normal'
    } else {
      this.item.fontStyle = 'italic'
    }
  }

  align( a : string) {
    this.item.align = a
  }

  updateFill(color : string) {
    this.item.fill = color
  }

  updateStroke(color : string) {
    this.item.stroke = color
  }

  constructor( parent: ToolDialogComponent) {
   
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



  ngOnInit() {
    this.presetItems.push({fillColor:"#00000088", color:"#FFFFFF", weight: 1 , fill:true, border:true})
    this.presetItems.push({fillColor:"#0000FF88", color:"#FFFFFF", weight: 1 , fill:true, border:true})
    this.presetItems.push({fillColor:"#00FF0088", color:"#FFFFFF", weight: 1 , fill:true, border:true})
    this.presetItems.push({fillColor:"#FF000088", color:"#FFFFFF", weight: 1 , fill:true, border:true})
    this.presetItems.push({fillColor:"#FF000088", color:"#FFFFFF", weight: 1 , fill:true, border:true})
    this.presetItems.push({fillColor:"#FFFF0088", color:"#FFFFFF", weight: 1 , fill:true, border:true})


  }

  usePreset(preset: Formatted) {
   
    this.update()
  }

  update() {
    if (this.item) {
      this.onUpdate.emit(true)
    } else {
      this.onUpdateColor.emit(this.color)
    }
  }
}