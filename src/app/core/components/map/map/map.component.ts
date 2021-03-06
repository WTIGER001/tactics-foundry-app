import { Component, OnInit, NgZone, Input, ElementRef, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { Application, Container, Sprite, Graphics, interaction, Rectangle, DisplayObject, Point } from 'pixi.js'
import { Viewport, ViewportOptions, Plugin as Plg } from 'pixi-viewport'
import { DataService } from 'src/app/core/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapData, TokenAnnotation, TokenBar, Distance, Geom, PanZoomMapCommand } from 'src/app/core/model';
import { faTreeChristmas } from '@fortawesome/pro-solid-svg-icons';
import { GridLayer } from './annotations/grid-layer';
import { MapLayerManager } from './layer-manager';
import { TokenPlugin } from '../plugins/token-plugin';
import { AuraVisible, Aura } from 'src/app/core/model/aura';
import { FogPlugin } from '../plugins/fog-plugin';
import { Subject } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/**
 * The map component is a component, based on pixijs, to display a map and let people interact with it
 */
@Component({
  selector: 'map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css']
})
export class MapComponent implements OnInit, AfterViewInit {

  // @ViewChild('mapdiv', {static : true}) mapDiv : HTMLDivElement 
  padding = 0
  // Inputs
  @Input() mapdata: MapData

  // Application for Pixijs
  public app: Application

  // Viewport
  viewport: Viewport

  // Layers / Plugins
  grid: GridLayer

  mapLayer: Container = new Container()
  gridLayer = new Container()
  backgroundLayer: Container = new Container()
  playerLayer: Container = new Container()
  gmLayer: Container = new Container()
  _gmLayer: Container = new Container()
  fogLayer: Container = new Container()
  decalLayer: Container = new Container()

  followMe : boolean = false
  moveCmds$ = new Subject<PanZoomMapCommand>()
  ignoreFollowMe: boolean = false;

  constructor(
    private elementRef: ElementRef,
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone) {
    this.backgroundLayer.name = "Background"
    this.playerLayer.name = "Player"
    this.fogLayer.name = "Fog"
    this.gmLayer.name = "GM"
    this.decalLayer.name = "Decal"
  }

  ngOnInit(): void { 
    this.moveCmds$.pipe(
      debounceTime(100)
    ).subscribe( cmd => {
      this.data.store(cmd)
    })
  }


  ngAfterViewInit(): void {
    // Load the Map Configuration

    // Create the PixiJs Application
    const devicePixelRatio = window.devicePixelRatio
    this.zone.runOutsideAngular(() => {
      this.app = new Application({
        resolution: devicePixelRatio, 
        autoDensity: true
      });
    });
    this.elementRef.nativeElement.appendChild(this.app.view);
    window.addEventListener('resize', (event) => {
      console.log("Resized");
      setTimeout(() => this.resize(), 50)
    })
    screen.orientation.addEventListener("change", (event) => {
      console.log("SCREEN orientation CHANGE ", event)
      setTimeout(() => this.resize(), 50)
    });
    this.app.resizeTo = this.elementRef.nativeElement
    // this.app.resizeTo = window

    this.makeMap()
    this.loadMap(this.mapdata)


    // HACK: Did this to avoid the maximize and other issues with screen resize
    // setInterval( () => { this.resize() }, 250)
  }

  resize() {
    this.viewport.screenHeight = window.innerHeight
    this.viewport.screenWidth = window.innerWidth
  }

  makeMap() {
    this.viewport = new Viewport({
      screenHeight: window.innerHeight,
      screenWidth: window.innerWidth,
      interaction: this.app.renderer.plugins.interaction,
      divWheel: this.app.view
    })

    this.app.stage.addChild(this.viewport)
    this.viewport
      .drag()
      .pinch()
      .wheel()
      .decelerate()

    // this._gmLayer.addChild(this.gmLayer)

    // Make the background layer where the map image is held
    this.viewport.addChild(this.mapLayer)
    this.viewport.addChild(this.gridLayer)
    this.viewport.addChild(this.backgroundLayer)
    this.viewport.addChild(this.playerLayer)
    this.viewport.addChild(this.fogLayer)
    this.viewport.addChild(this._gmLayer)
    this.app.stage.addChild(this.decalLayer)

    this.viewport.on('zoomed', event => {
      console.log("Zoomed");
      
      this.sendFollowMeCmd()
    })
    this.viewport.on('moved-end', event => {
      this.sendFollowMeCmd()
      // console.log(`MOVED  Left: ${viewport.left} Right: ${viewport.right} Top: ${viewport.top} Bottom: ${viewport.bottom} Scale: ${viewport.scale.x}`, this.viewport)
    })
  }

  private sendFollowMeCmd() {
    
    if (this.followMe) {
      const center  = Geom.center(this.viewport.getVisibleBounds())
      const cmd = new PanZoomMapCommand(
        this.mapdata.game,
        this.mapdata._id,
        center.x, 
        center.y,
        this.viewport.scale.x
      )
      this.moveCmds$.next(cmd)
    }
  }

  public showGmLayer(show: boolean) {
    console.log("SHOWING GM LAYER ", show);
    
    const isChild = this.hasChild(this._gmLayer, this.gmLayer)
    if (show && !isChild) {
        this._gmLayer.addChild(this.gmLayer)
    } else if (!show && isChild) {
        const indx = this._gmLayer.getChildIndex(this.gmLayer)
        this._gmLayer.removeChildAt(indx)
    }
  }

  public hasChild(parent : Container, item : DisplayObject) : boolean {
    try {
      const indx = this._gmLayer.getChildIndex(this.gmLayer)
      return indx >= 0
    } catch (err) {
      return false
    }
  }

  private debugrect: Graphics

  public fit() {
   
    let viewport = this.viewport
    viewport.fitWorld(true)

    let xD = this.viewport.worldScreenWidth - this.mapdata.width
    let yD = this.viewport.worldScreenHeight - this.mapdata.height

    if (xD > yD) {
      viewport.left = -xD/2
      viewport.top = 0
    } else  {
      viewport.left = 0
      viewport.top = -yD /2
    }
  }

  public center(x: number, y: number) {
    this.viewport.moveCenter(new Point(x,y))
  }

  public zoom(scale : number) {
    this.viewport.setZoom(scale)
  }

  public getCenter() {
    return Geom.center(this.viewport.getVisibleBounds())
  }

  public zoomIn() {
    this.viewport.zoomPercent(.25, true)
  }

  public zoomOut() {
    this.viewport.zoomPercent(-.25, true)
  }

  public changeMap(mapdata: MapData) {
    this.loadMap(mapdata)
  }


  mapSprite: Sprite

  loadMap(m: MapData) {
    let oldMapId = 'NONE'
    if (this.mapdata) {
      oldMapId = this.mapdata._id
    }

    this.mapdata = m
    console.log("---------->>>> Setting Map", m);

    if (this.mapdata._id != oldMapId) {
      // Remove the old map if there is one
      if (this.mapSprite) {
        this.mapSprite = null
      }
      // Create the map Sprite 
      if (m.image) {
        this.mapSprite = Sprite.from(m.image)
        this.mapSprite.x = 0
        this.mapSprite.y = 0
        this.mapLayer.addChild(this.mapSprite)
        this.mapSprite.addListener('pointerup', (event) => {
          console.log("pointer up", event);
        })
      }

      // Set the Size
      this.viewport.worldWidth = m.width
      this.viewport.worldHeight = m.height
      this.viewport.interactive = true
      
      this.fit()
    }

    if (!this.grid) {
      this.grid = new GridLayer(this, m, this.gridLayer)
      this.viewport.plugins.add('grid', this.grid)
    } else {
      this.grid.mapData = m
    }


  }

  rect: Graphics

  onDragStart(event) {
    let me: any = <any>this
    // store a reference to the data
    // the reason for this is because of multitouch
    // we want to track the movement of this particular touch
    event.stopPropagationHint = true
    me.data = event.data;
    me.alpha = 0.5;
    me.dragging = true;

  }

  onDragEnd() {
    let me: any = <any>this
    me.alpha = 1;

    me.dragging = false;

    // set the interaction data to null
    me.data = null;
  }

  onDragMove() {
    let me: any = <any>this

    if (me.dragging) {
      let d: any = this.data
      var newPosition = d.getLocalPosition(me.parent);
      me.position.x = newPosition.x;
      me.position.y = newPosition.y;
    }
  }


}

class DebugPlugin extends Plg {
  debugrect: Graphics
  constructor(private viewport: Viewport, private app: Application) { super(viewport) }
  down(event: PIXI.interaction.InteractionEvent): void { }
  up(event: PIXI.interaction.InteractionEvent): void { }
  move(event: PIXI.interaction.InteractionEvent): void { }
  wheel(event: WheelEvent): void { }
  update(): void {
    if (!this.debugrect) {
      this.debugrect = new Graphics()
      this.app.stage.addChild(this.debugrect)
    }
    this.debugrect.clear()
    this.debugrect.lineStyle(20, 0x00ff00)
    this.debugrect.drawRect(0, 0, this.viewport.screenWidth, this.viewport.screenHeight)
  }
  resize(): void { }
  reset(): void { }
  pause(): void { }
  resume(): void { }
}