import { Component, OnInit, OnDestroy, Output, EventEmitter } from '@angular/core';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { MeasurePlugin } from '../../plugins/measure-plugin';
import { MeasureMessage } from 'src/app/core/model';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'measure-tool',
  templateUrl: './measure-tool.component.html',
  styleUrls: ['./measure-tool.component.css']
})
export class MeasureToolComponent implements OnInit, OnDestroy {
  measurePlugin : MeasurePlugin
  @Output() onClose = new EventEmitter
  text = "Place first point"
  constructor(private session : LivePageComponent, private data : DataService) { }

  ngOnInit() {
    this.measurePlugin = new MeasurePlugin(this.session.layerMgr)
    this.measurePlugin.add()
  
  }

  get distance() {
    return this.measurePlugin.totalDistance().toFixed(0) + " ft"
  }

  ngOnDestroy() {
    this.measurePlugin.done()
  }

  cancel() {
    this.onClose.emit()
  }

  pause() {
    this.measurePlugin.pause()
  } 

  snapStyle() : string {
    if (this.measurePlugin) {
      switch (this.measurePlugin.snapMode) {
        case  MeasurePlugin.SNAP_NONE:  { return 'border-none' }
        case  MeasurePlugin.SNAP_CENTER:  { return 'border-inner' }
        case  MeasurePlugin.SNAP_VERTEX:  { return 'border-outer' }
      }
    } 
    return 'border-none'
  }

  snap() {
    this.measurePlugin.toggleSnap()
  }

  isPaused() {
    if (this.measurePlugin) {
      return this.measurePlugin.paused
    } else {
      return false
    }
  }

  send() {
    const msg = new MeasureMessage()
    msg.points = [...this.measurePlugin.points]
    msg.total = this.measurePlugin.totalDistance()
    msg.map = this.session.mapdata._id
    this.data.sendMessage(this.session.game._id, msg)
  }

  undo(){ 
    this.measurePlugin.undo()
  }  

}
