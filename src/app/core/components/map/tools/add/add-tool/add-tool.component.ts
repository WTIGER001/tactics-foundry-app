import { Component, OnInit, ComponentFactoryResolver, ViewChild, Input } from '@angular/core';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { AddTokenToolComponent } from '../add-token-tool/add-token-tool.component';
import { PlaceholderDirective } from 'src/app/core/directives/placeholder.directive';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { ToolsComponent } from '../../tools/tools.component';
import { ImageUtil, ImageResult } from 'src/app/core/util/ImageUtil';
import { TokenAnnotation, RouteContext, MapData, CircleAnnotation, RectangleAnnotation, Formatted, Geom, PolygonAnnotation, MarkerTypeAnnotation, PolylineAnnotation, ImageAnnotation } from 'src/app/core/model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/data.service';
import { MapComponent } from '../../../map/map.component';
import { Point, Rectangle, Polygon } from 'pixi.js';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { PathPlugin } from '../../../plugins/polygon-plugin';
import { MarkerService } from 'src/app/core/marker.service';
import { ShapeUtil } from '../../../map/shapeutil';

@Component({
  selector: 'add-tool',
  templateUrl: './add-tool.component.html',
  styleUrls: ['./add-tool.component.css']
})
export class AddToolComponent implements OnInit {
  constructor(private tabs: ToolTabsComponent, private tools: ToolsComponent, public session: LivePageComponent,
    private route: ActivatedRoute, private data: DataService, private markers: MarkerService) { }
  gameid: string
  uploadfile : File
  showCropDialog = false
  newName = "New Token"
  uploadType = ''

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      this.gameid = data.ctx.id
    })
  }

  startCircle() {
    const circle = ShapeUtil.createCircle(this.session.mapview)
    circle.layer = this.session.currentLayer

    this.session.layerMgr.storeAnnotation(circle)
  }

  startRectangle() {
    const rect = ShapeUtil.createRectangle(this.session.mapview)
    rect.layer = this.session.currentLayer

    this.session.layerMgr.storeAnnotation(rect)
  }

  startCharacter() {
    this.tools.showTabs('addcharacter')
  }
  startToken() {
    this.tools.showTabs('addtoken')
  }

  startMonster() {
    this.tools.showTabs('addmonster')
  }

  startPolygon() {

    // Enter the mode where we are editing initially
    const plugin = new PathPlugin(this.session.layerMgr)
    plugin.saved = false
    const annotation = new PolygonAnnotation()
    this.defaultFormat(annotation)
    annotation.layer = this.session.currentLayer
    plugin.setAnnotation(annotation)
    plugin.add()
  }

  startLine() { 
    // Enter the mode where we are editing initially
    const plugin = new PathPlugin(this.session.layerMgr)
    plugin.saved = false
    const annotation = new PolylineAnnotation()
    this.defaultFormat(annotation)
    annotation.layer = this.session.currentLayer
    plugin.setAnnotation(annotation)
    plugin.add()
  }

  startMarker() {
    const center: Point = this.session.mapview.getCenter()
    const m = this.markers.defaultMarker
    const a = new MarkerTypeAnnotation()
    a.x = center.x
    a.y = center.y
    a.name = "New Marker"
    a.layer = this.session.currentLayer
    a.url = m.url
    a.owner = this.session.data.player._id
    a.w = m.w
    a.h = m.h
    a.ax = m.ax
    a.ay = m.ay

    this.session.layerMgr.storeAnnotation(a)
  }

  startFlag() {
    this.session.layerMgr.flagPlugin.add()

  }
  
  startImage(img : ImageResult) {
    const rect =ShapeUtil.centerImage(this.session.mapview, img.width, img.height)
    const a = new ImageAnnotation()
    a.aspect = img.aspect
    a.x = rect.x
    a.y = rect.y
    a.w = rect.width
    a.h = rect.height
    a.layer = this.session.currentLayer
    a.url = img.dataURL

    this.session.layerMgr.storeAnnotation(a)
  }

  startText() {

  }

  closeDialog() {

  }

  defaultFormat(item: Formatted) {
    item.border = true
    item.color = '#FFFFFF'
    item.weight = 1
    item.fill = true
    item.fillColor = "#FF000088"
  }

  // uploadImg($event: File) {

    
  //   ImageUtil.loadImg($event, {
  //     createThumbnail: true,
  //     thumbnailKeepAspect: true,
  //     thumbnailMaxHeight: 100,
  //     thumbnailMaxWidth: 100
  //   }).subscribe(result => {
  //     // Create the token
  //     const t = new TokenAnnotation()
  //     t.name = $event.name
  //     t.url = result.thumbDataUrl
  //     t.size = 5
  //     t.sourceDB = this.gameid
  //     t.layer = this.session.currentLayer

  //     // TODO+: Spiral around the center square until an unoccupied square is found 
  //     // Place the token (start in the center and look for an open grid square)
  //     const map: MapComponent = this.session.mapview
  //     const center: Point = map.getCenter()
  //     const gridSquare = map.grid.getGridCell(center)

  //     t.x = gridSquare.x
  //     t.y = gridSquare.y

  //     // Save
  //     this.session.layerMgr.storeAnnotation(t)
  //   })
  // }

  
  uploadImg($event: File) {
    if (this.uploadType == 'image') {
      this.session.uploadImg($event).subscribe(result => {
        this.startImage(result)  
      })
    } else if (this.uploadType == 'token') {
      this.session.uploadTokenImg($event)
    }

  }

  saveImage($event) {
    // Create the token
    const t = new TokenAnnotation()
    t.name = "New Token"
    t.url = $event
    t.size = 5
    t.sourceDB = this.gameid
    t.layer = this.session.currentLayer

    // TODO+: Spiral around the center square until an unoccupied square is found 
    // Place the token (start in the center and look for an open grid square)
    const map: MapComponent = this.session.mapview
    const center: Point = map.getCenter()
    const gridSquare = map.grid.getGridCell(center)

    t.x = gridSquare.x
    t.y = gridSquare.y

    // Save
    this.session.layerMgr.storeAnnotation(t)


    // this.character.url = $event
    // this.data.store(this.character)
    this.showCropDialog = false
  }

  cancelCrop(){
    this.uploadfile = undefined
    this.showCropDialog = false
  }

  setLayer(layer: 'player' | 'gm' | 'background') {
    this.session.currentLayer = layer
  }

  isGM(): boolean {
    return this.session.isGM()
  }


}

