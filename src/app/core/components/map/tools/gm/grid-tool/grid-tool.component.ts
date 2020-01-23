import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapData, GridOptions } from 'src/app/core/model';

@Component({
  selector: 'grid-tool',
  templateUrl: './grid-tool.component.html',
  styleUrls: ['./grid-tool.component.css']
})
export class GridToolComponent implements OnInit {

  @Input() mapdata : MapData
  @Output() update = new EventEmitter<boolean>()

  constructor() { }

  ngOnInit() {
  }

  updateGrid() {
    this.update.emit(true);
  }

  toggleGrid() {
    this.updateGrid()
  }

  updateColor(color: string) {
    console.log("NEW COLOR : ", color)
    this.mapdata.gridOptions.color = color
    this.updateGrid()
  }
}
