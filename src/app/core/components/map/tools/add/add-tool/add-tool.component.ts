import { Component, OnInit, ComponentFactoryResolver, ViewChild, Input } from '@angular/core';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { AddTokenToolComponent } from '../add-token-tool/add-token-tool.component';
import { PlaceholderDirective } from 'src/app/core/directives/placeholder.directive';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { ToolsComponent } from '../../tools/tools.component';
import { ImageUtil } from 'src/app/core/util/ImageUtil';
import { TokenAnnotation, RouteContext, MapData, CircleAnnotation } from 'src/app/core/model';
import { ActivatedRoute } from '@angular/router';
import { DataService } from 'src/app/core/data.service';
import { MapComponent } from '../../../map/map.component';
import { Point, Rectangle } from 'pixi.js';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'add-tool',
  templateUrl: './add-tool.component.html',
  styleUrls: ['./add-tool.component.css']
})
export class AddToolComponent implements OnInit {
  constructor(private tabs : ToolTabsComponent, private tools: ToolsComponent, public session : LivePageComponent,
     private route: ActivatedRoute, private data : DataService) { }
  gameid : string

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      this.gameid = data.ctx.id
    })
  }

  startCircle()  { 
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

    const map : MapComponent = this.session.mapview
    const center : Point = map.getCenter()
    circle.x = center.x  
    circle.y = center.y 

    const bounds = map.viewport.getVisibleBounds()
    const small = Math.min(bounds.width , bounds.height )
    circle.radius = small / 10
    if (circle.radius < 0) {
      console.log("CIRCLE MATH ", bounds, " ", small)
      circle.radius = 5
    }
    circle.radius = circle.radius / this.session.mapdata.ppf
    circle.layer = this.session.currentLayer
    
    this.session.layerMgr.storeAnnotation(circle)
  }

  startRectangle()  { }
  startCharacter()  { 
    this.tools.showTabs('addcharacter')
  }
  startToken()  { 
    this.tools.showTabs('addtoken')
  }

  startMonster()  { 
    this.tools.showTabs('addmonster')
  }

  startPolygon()  { }
  startLine()  { }
  startMarker()  { }
  startFlag()  { }
  startImage()  { }
  startText() {

  }

  closeDialog() {

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
      const map : MapComponent = this.session.mapview
      const center : Point = map.getCenter()
      const gridSquare = map.grid.getGridCell(center)

      t.location = gridSquare
          
      // Save
      this.session.layerMgr.storeAnnotation(t)
    })
  }

  setLayer(layer : 'player' | 'gm' | 'background') {
    this.session.currentLayer = layer
  }

  isGM() : boolean {
    return this.session.isGM()
  }

 
}

