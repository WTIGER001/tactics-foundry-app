import { Component, OnInit, NgZone, Input, ElementRef, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { Application, Container, Sprite, Graphics, interaction, Rectangle } from 'pixi.js'
import { Viewport, ViewportOptions, Plugin as Plg } from 'pixi-viewport'
import { DataService } from 'src/app/core/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapData, TokenAnnotation, TokenBar, Distance } from 'src/app/core/model';
import { faTreeChristmas } from '@fortawesome/pro-solid-svg-icons';
import { GridLayer } from './annotations/grid-layer';
import { MapLayerManager } from './layer-manager';
import { TokenPlugin } from '../plugins/annotation-plugin';
import { AuraVisible, Aura } from 'src/app/core/model/aura';

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

  // Layers
  mapLayer: Container

  constructor(
    private elementRef: ElementRef,
    private data: DataService,
    private route: ActivatedRoute,
    private router: Router,
    private zone: NgZone) { }

  ngOnInit(): void { }


  ngAfterViewInit(): void {
    // Load the Map Configuration

    // Create the PixiJs Application
    this.zone.runOutsideAngular(() => {
      this.app = new Application({
        resolution: devicePixelRatio
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

    // Make the background layer where the map image is held
    this.mapLayer = new Container()
    this.viewport.addChild(this.mapLayer)

    this.viewport.on('moved', event => {
      let viewport: Viewport = (<any>event).viewport
      // console.log(`MOVED  Left: ${viewport.left} Right: ${viewport.right} Top: ${viewport.top} Bottom: ${viewport.bottom} Scale: ${viewport.scale.x}`, this.viewport)
    })
  }

  private debugrect: Graphics

  public fit() {
    let viewport = this.viewport
    viewport.fitWorld()
    viewport.left = 0
    viewport.top = 0

    console.log(`MOVED  Left: ${viewport.left} Right: ${viewport.right} Top: ${viewport.top} Bottom: ${viewport.bottom} Scale: ${viewport.scale.x}`, this.viewport)
  }

  public center(x: number, y: number) {

  }

  public zoom(x: number, y: number) {

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
  grid: GridLayer


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
      }

      // Set the Size
      this.viewport.worldWidth = m.width
      this.viewport.worldHeight = m.height
      this.viewport.interactive = true
      this.viewport.fitWorld()
    }

    let token = new TokenAnnotation()
    token.location = new Rectangle(200,300, 5, 5)
    let bar = new TokenBar()
    bar.color = "#FFFFFFFF"
    bar.bgColor = "#000000FF"
    bar.value= 50
    bar.max = 100
    bar.visible = AuraVisible.Visible
    token.bars.push(bar)


    let bar2 = new TokenBar()
    bar2.color = "#FFFFFFFF"
    bar2.bgColor = "#AAAAAAFF"
    bar2.value= 75
    bar2.max = 100
    bar2.visible = AuraVisible.Visible
    token.bars.push(bar2)


    let bar3 = new TokenBar()
    bar3.color = "#FFFFFF88"
    bar3.bgColor = "#000000FF"
    bar3.value= 25
    bar3.max = 100
    bar3.visible = AuraVisible.Visible
    token.bars.push(bar3)
    let t = new TokenPlugin(this, this.mapdata, token)

    let a = new Aura()
    a.border = true
    a.fill = false
    a.color = "#FFFFFF88"
    a.weight = 1
    a.radius = new Distance(15, 'ft')
    token.auras.push(a)

    t.add()
    // let layers = new MapLayerManager(this, this.mapdata)
    // let container = layers.createToken(token)
    // this.viewport.addChild(container) 

    /// Create a center rec

    //  let  graphics = new Graphics();
    //   graphics.interactive = true;
    //   graphics.lineStyle(0);
    //   graphics.beginFill(0xFFFF0B, 0.5);
    //   graphics.drawCircle(0, 0, 60);
    //   graphics.endFill();
    //   graphics.x = 100;
    //   graphics.y = 100;
    //   this.viewport.addChild(graphics);   

    //   graphics
    //   .on('mousedown', this.onDragStart)
    //   .on('touchstart',this. onDragStart)
    //   .on('mouseup', this.onDragEnd)
    //   .on('mouseupoutside', this.onDragEnd)
    //   .on('touchend', this.onDragEnd)
    //   .on('touchendoutside', this.onDragEnd)
    //   .on('mousemove', this.onDragMove)
    //   .on('touchmove', this.onDragMove);

    //   graphics.position.x = 200;
    //   graphics.position.y = 200;
    //   graphics.buttonMode = true
    //   this.rect = graphics

    // let debugMe = new DebugPlugin(this.viewport, this.app)
    // this.viewport.plugins.add('test', debugMe, 1)

    if (!this.grid) {
      this.grid = new GridLayer(this, m)
      this.viewport.plugins.add('grid', this.grid, 2)
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