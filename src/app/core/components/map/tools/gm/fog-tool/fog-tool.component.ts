import { Component, OnInit, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { MapData, CircleAnnotation, ShapeAnnotation, PolygonAnnotation, RectangleAnnotation } from 'src/app/core/model';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { CirclePlugin } from '../../../plugins/circle-plugin';
import { ShapeUtil } from '../../../map/shapeutil';
import { AnnotationPlugin } from '../../../plugins/annotation-plugin';
import { FowShape } from 'src/app/core/model/map-model/fow';
import { RectanglePlugin } from '../../../plugins/rectangle-plugin';
import { PathPlugin } from '../../../plugins/polygon-plugin';

@Component({
  selector: 'fog-tool',
  templateUrl: './fog-tool.component.html',
  styleUrls: ['./fog-tool.component.css']
})
export class FogToolComponent implements OnInit, OnDestroy {

  @Input() mapdata : MapData
  @Output() updated = new EventEmitter<boolean>()
  drawing : string
  plugin: AnnotationPlugin<any>
  constructor(private session: LivePageComponent) { }

  ngOnInit() {
  }

  toggleShowAll() {
    this.mapdata.fog.hideAll = !this.mapdata.fog.hideAll 
    this.save()
  }

  ngOnDestroy() {
    this.cancel()
  }


  startRectangle() {
    this.drawing = 'rectangle'
    this.session.layerMgr.suspendSelections(true)

    // Create a circle 
    const rect = ShapeUtil.createRectangle(this.session.mapview)
    rect.layer = 'fog'

    // Create a circle plugin
    this.plugin = new RectanglePlugin(this.session.layerMgr)
    this.plugin.autostore = false
    this.plugin.setAnnotation(rect)
    this.plugin.add()
  }

  startCircle() {
    this.drawing = 'circle'
    this.session.layerMgr.suspendSelections(true)

    // Create a circle 
    const circle = ShapeUtil.createCircle(this.session.mapview)
    circle.layer = 'fog'

    // Create a circle plugin
    this.plugin = new CirclePlugin(this.session.layerMgr)
    this.plugin.autostore = false
    this.plugin.setAnnotation(circle)
    this.plugin.add()

  }

  startPolygon() {
    this.drawing = 'polygon'
    this.session.layerMgr.suspendSelections(true)

    const polygon = new PolygonAnnotation()
    polygon.layer = 'fog'
    ShapeUtil.defaultFormat(polygon)

    this.plugin = new PathPlugin(this.session.layerMgr)
    this.plugin.saved = false
    this.plugin.autostore = false
    this.plugin.setAnnotation(polygon)
    this.plugin.add()
  }

  cancel() {
    this.drawing = undefined
    if (this.plugin) {    
      this.plugin.remove()
    }
    this.session.layerMgr.suspendSelections(false)
    this.plugin = undefined
  }

  update() {
    this.save()    
  }

  refresh() {

    this.mapdata.fog.reveals = []
    this.mapdata.fog.blur = 7
    this.mapdata.fog.gmAlpha = 0.7
    this.save()
  }

  show() {
    const item = this.createItem()
    item.hide = false
    this.mapdata.fog.reveals.push(item)
    this.save()
    this.cancel()
  }

  hide() {
    const item = this.createItem()
    item.hide = true
    this.mapdata.fog.reveals.push(item)
    this.save()
    this.cancel()
  }

  private createItem() {
    const a = <ShapeAnnotation> this.plugin.annotation
    let item : FowShape
    if (CircleAnnotation.is(a)) {
      item = new FowShape(a.toShape(this.mapdata.ppf))
    } else if (PolygonAnnotation.is(a)) {
      item = new FowShape(a.toShape(this.mapdata.ppf))
    } else if (RectangleAnnotation.is(a)) {
      item = new FowShape(a.toShape(this.mapdata.ppf))
    }
    item.type = this.drawing
    return item
  }

  save() {
    this.mapdata.fog.lastUpdate = new Date().getTime()
    this.session.mdUpatesSmall$.next(this.mapdata)
  }
}
