import { Component, OnInit, ComponentFactoryResolver, ViewChild, Input } from '@angular/core';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { AddTokenToolComponent } from '../add-token-tool/add-token-tool.component';
import { PlaceholderDirective } from 'src/app/core/directives/placeholder.directive';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { ToolsComponent } from '../../tools/tools.component';
import { ImageUtil } from 'src/app/core/util/ImageUtil';
import { TokenAnnotation, RouteContext, MapData, CircleAnnotation, RectangleAnnotation, Formatted, Geom, PolygonAnnotation, MarkerTypeAnnotation, PolylineAnnotation } from 'src/app/core/model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/data.service';
import { MapComponent } from '../../../map/map.component';
import { Point, Rectangle, Polygon } from 'pixi.js';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { PathPlugin } from '../../../plugins/polygon-plugin';
import { MarkerService } from 'src/app/core/marker.service';

@Component({
  selector: 'add-tool',
  templateUrl: './add-tool.component.html',
  styleUrls: ['./add-tool.component.css']
})
export class AddToolComponent implements OnInit {
  constructor(private tabs: ToolTabsComponent, private tools: ToolsComponent, public session: LivePageComponent,
    private route: ActivatedRoute, private data: DataService, private markers: MarkerService) { }
  gameid: string

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      this.gameid = data.ctx.id
    })
  }

  startCircle() {
    const circle = new CircleAnnotation()
    circle.x = 300
    circle.y = 300
    circle.border = true
    circle.color = '#FFFFFF'
    circle.weight = 1
    circle.fill = true
    circle.fillColor = "#FF000088"
    circle.name = "TEST"
    circle.radius = 20

    const map: MapComponent = this.session.mapview
    const center: Point = map.getCenter()
    circle.x = center.x
    circle.y = center.y

    const bounds = map.viewport.getVisibleBounds()
    const small = Math.min(bounds.width, bounds.height)
    circle.radius = small / 10
    if (circle.radius < 0) {
      console.log("CIRCLE MATH ", bounds, " ", small)
      circle.radius = 5
    }
    circle.radius = circle.radius / this.session.mapdata.ppf
    circle.layer = this.session.currentLayer

    this.session.layerMgr.storeAnnotation(circle)
  }

  startRectangle() {
    const rect = new RectangleAnnotation()
    this.defaultFormat(rect)
    rect.name = "New Rectangle"
    const center: Point = this.session.mapview.getCenter()
    const bounds = this.session.mapview.viewport.getVisibleBounds()
    const r = new Rectangle(0, 0, bounds.width / 10 / this.session.mapdata.ppf, bounds.height / 10 / this.session.mapdata.ppf)
    const location = Geom.centerOn(r, center)
    rect.x = location.x
    rect.y = location.y
    rect.w = location.width
    rect.h = location.height
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
  startImage() { }
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

  uploadImg($event: File) {
    ImageUtil.loadImg($event, {
      createThumbnail: true,
      thumbnailKeepAspect: true,
      thumbnailMaxHeight: 100,
      thumbnailMaxWidth: 100
    }).subscribe(result => {
      // Create the token
      const t = new TokenAnnotation()
      t.name = $event.name
      t.url = result.thumbDataUrl
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
    })
  }

  setLayer(layer: 'player' | 'gm' | 'background') {
    this.session.currentLayer = layer
  }

  isGM(): boolean {
    return this.session.isGM()
  }


}

