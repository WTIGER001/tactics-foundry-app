import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapData, DistanceUnit } from 'src/app/core/model';
import { MapComponent } from '../../map/map.component';
import {CalibratePlugin} from '../../map/annotations/calibrate-plugin'

@Component({
  selector: 'calibrate-tool',
  templateUrl: './calibrate-tool.component.html',
  styleUrls: ['./calibrate-tool.component.css']
})
export class CalibrateToolComponent implements OnInit {
  calState = 0
  distance = 0
  unit = 'ft'
  @Input() mapdata: MapData
  @Input() mapview: MapComponent
  @Output() updated = new EventEmitter<number>()
  plugin : CalibratePlugin

  constructor() { }

  ngOnInit() {
  }

  startCal() {
    if (this.plugin) {
      this.plugin.remove()
    }

    this.calState = 1
    this.plugin = new CalibratePlugin(this.mapview, this.mapdata)
    this.plugin.onSecond = () => {
      this.calState = 2
    }
    this.plugin.add()
  }

  cancelCal() {
    this.calState = 0
    this.plugin.remove()
  }

  doneCal() {
    this.calState = 0
    let first = this.plugin.first
    let second = this.plugin.second

    // Diff in world coords
    let diff = Math.abs(first.x - second.x)

    let distUnit = DistanceUnit.getUnit(this.unit);
    let dist = distUnit.toFeet(this.distance)
    let ppf = diff / dist
    this.mapdata.ppf = ppf

    this.plugin.remove()
    this.updated.emit(ppf);
  }
}
