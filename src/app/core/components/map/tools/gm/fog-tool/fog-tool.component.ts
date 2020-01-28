import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapData } from 'src/app/core/model';

@Component({
  selector: 'fog-tool',
  templateUrl: './fog-tool.component.html',
  styleUrls: ['./fog-tool.component.css']
})
export class FogToolComponent implements OnInit {

  @Input() mapdata : MapData
  @Output() updated = new EventEmitter<boolean>()
  drawing : string
  constructor() { }

  ngOnInit() {
  }

  toggleShowAll() {

  }

  startRectangle() {
    this.drawing = 'rectangle'
  }

  startCircle() {
    this.drawing = 'circle'
  }

  startPolygon() {
    this.drawing = 'polygon'
  }

  cancel() {
    this.drawing = undefined
  }

  updatePlayerColor(color: string) {
    this.mapdata.fog.color = color
  }

  updateGmColor(color: string) {
    this.mapdata.fog.gmcolor = color
  }

  update() {
    
  }

  refresh() {


  }

  show() {

  }

  hide() {
    
  }
}
