import { Component, OnInit, Input } from '@angular/core';
import { SelectMarkerDialogComponent } from '../select-marker-dialog/select-marker-dialog.component';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { MarkerTypeAnnotation } from 'src/app/core/model';
import { Marker } from 'src/app/core/marker.service';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'edit-marker',
  templateUrl: './edit-marker.component.html',
  styleUrls: ['./edit-marker.component.css']
})
export class EditMarkerComponent implements OnInit {
  scales = [0.1, 0.2, 0.3, 0.4, 0.5, 0.6, 0.7, 0.8, 0.9, 1.0, 1.25, 1.50, 1.75, 2.0, 2.5, 3.0, 4.0, 5.0]
  @Input() item : MarkerTypeAnnotation
  constructor(private tabs : ToolTabsComponent, private session : LivePageComponent) { }

  ngOnInit() {
  }

  get scale() : number {
    let min = 1000
    let minIndx
    this.scales.forEach( (s, i) => {
      if (Math.abs(s - this.item.scale) < min) {
        min= Math.abs(s - this.item.scale) 
        minIndx = i
      }
    })
    return minIndx
  }

  set scale(index : number) {
    this.item.scale = this.scales[index]
    this.save()
  }

  showMarkerDialog() {
    const dialog : SelectMarkerDialogComponent = this.tabs.showDialog(SelectMarkerDialogComponent)
    dialog.onSelect.subscribe( (marker : Marker) => {
      this.item.url = marker.url
      this.item.w = marker.w
      this.item.h = marker.h
      this.item.ax = marker.ax
      this.item.ay = marker.ay
    })
  }

  updated(name : string ) {
    this.save()
  }

  save(){
    this.session.limitedUpdates$.next(this.item)
  }
}
