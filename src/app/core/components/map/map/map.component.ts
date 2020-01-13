import { Component, OnInit, NgZone, Input, ElementRef, ViewChild, AfterContentInit, AfterViewInit } from '@angular/core';
import { Application, Container, Sprite, Graphics } from 'pixi.js'
import { Viewport, ViewportOptions } from 'pixi-viewport'
import { DataService } from 'src/app/core/data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapData } from 'src/app/core/model';
import { faTreeChristmas } from '@fortawesome/pro-solid-svg-icons';

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
  app: Application

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
      setTimeout( ()  =>  this.resize(), 50)
    })
    screen.orientation.addEventListener("change", (event) => {
      console.log("SCREEN orientation CHANGE ", event)
      setTimeout( ()  =>  this.resize(), 50)
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
    this.buildDebugRect() 
  }

  makeMap() {
    this.viewport = new Viewport({
      screenHeight : window.innerHeight,
      screenWidth : window.innerWidth,
      interaction: this.app.renderer.plugins.interaction
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
      let viewport : Viewport = (<any>event).viewport
      // console.log(`MOVED  Left: ${viewport.left} Right: ${viewport.right} Top: ${viewport.top} Bottom: ${viewport.bottom} Scale: ${viewport.scale.x}`, this.viewport)
    })
  }

  private debugrect : Graphics

  buildDebugRect() {

    if (this.debugrect) {
      this.debugrect.destroy()
    }

    let d = new Graphics()
    d.lineStyle(20, 0x00ff00)
    d.drawRect(0, 0, this.viewport.screenWidth, this.viewport.screenHeight)
    d.zIndex = 1000
    this.debugrect = d;
    this.app.stage.addChild(d)
  }

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

  loadMap(m: MapData) {
    this.mapdata = m
    console.log("---------->>>> Setting Map", m);

    // Remove the old map if there is one
    if (this.mapSprite) {
      this.mapSprite.removeChild()
      this.mapSprite.destroy()
      this.mapSprite = null
    }

    // Create the map Sprite 
    if (m.image) {
      this.mapSprite = Sprite.from(m.image)
      this.mapSprite.x =  0
      this.mapSprite.y = 0
      this.mapLayer.addChild(this.mapSprite)
    }

    // Set the Size
    this.viewport.worldWidth = m.width
    this.viewport.worldHeight = m.height
    this.viewport.interactive = true
    // this.viewport.clamp({ direction: 'all' })
    // this.viewport.bounce({
    //   underflow: 'center'
    // })
    this.viewport.fitWorld()



    /// Create a center rec
    if (this.rect)  {
      this.rect.destroy()
    }
   let  graphics = new Graphics();
    graphics.interactive = true;
    graphics.lineStyle(0);
    graphics.beginFill(0xFFFF0B, 0.5);
    graphics.drawCircle(0, 0, 60);
    graphics.endFill();
    graphics.x = 100;
    graphics.y = 100;
    this.viewport.addChild(graphics);   
    
    graphics
    .on('mousedown', this.onDragStart)
    .on('touchstart',this. onDragStart)
    .on('mouseup', this.onDragEnd)
    .on('mouseupoutside', this.onDragEnd)
    .on('touchend', this.onDragEnd)
    .on('touchendoutside', this.onDragEnd)
    .on('mousemove', this.onDragMove)
    .on('touchmove', this.onDragMove);

    graphics.position.x = 200;
    graphics.position.y = 200;
    graphics.buttonMode = true
    this.rect = graphics
    this.buildDebugRect()
    // this.viewport.addChild(this.rect)
  }

  rect : Graphics

  onDragStart(event)
  {
      let me : any = <any>this
      // store a reference to the data
      // the reason for this is because of multitouch
      // we want to track the movement of this particular touch
      event.stopPropagationHint = true
      me.data = event.data;
      me.alpha = 0.5;
      me.dragging = true;
    
  }
  
  onDragEnd()
  {
    let me : any = <any>this
    me.alpha = 1;
  
    me.dragging = false;
  
      // set the interaction data to null
      me.data = null;
  }
  
  onDragMove()
  {
    let me : any = <any>this

      if (me.dragging)
      {
          let d : any = this.data
          var newPosition = d.getLocalPosition(me.parent);
          me.position.x = newPosition.x;
          me.position.y = newPosition.y;
      }
  }


}
