import { Component, OnInit, OnDestroy, NgZone, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { DbWatcher, RemovedDocument } from '../../database-manager';
import { Game, RouteContext, SessionCommand, MapData, PanZoomMapCommand, GridOptions, Annotation, CircleAnnotation, ObjectType, Player, TokenAnnotation, DistanceUnit, Geom } from '../../model';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../../components/map/map/map.component';
import { Graphics } from 'pixi.js';
import { Subject, ReplaySubject, BehaviorSubject, combineLatest } from 'rxjs';
import { debounceTime, map, combineAll, mergeMap } from 'rxjs/operators';
import { CalibrateToolComponent } from '../../components/map/tools/gm/calibrate-tool/calibrate-tool.component';
import { ToolTabComponent } from '../../components/map/tools/tool-tab/tool-tab.component';
import { ToolsComponent } from '../../components/map/tools/tools/tools.component';
// import { ToolService } from '../../components/map/tools/tool.service';
import { Session } from 'protractor';
import { MapLayerManager } from '../../components/map/map/layer-manager';
import { AppComponent } from 'src/app/app.component';

@Component({
  selector: 'live-page',
  templateUrl: './live-page.component.html',
  styleUrls: ['./live-page.component.css']
})
export class LivePageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapview', { static: true }) mapview: MapComponent
  @ViewChild('calibrate', { static: false }) calibrate: CalibrateToolComponent
  @ViewChild(ToolsComponent, { static: false }) tools: ToolsComponent
  w = 0
  h = 0

  // DB Watchers. All components that are a child of this should just subscribe to the results instead of 
  // watching on their own
  private watcher: DbWatcher
  private cmdWatcher: DbWatcher
  private mapWatcher: DbWatcher
  private annotationWatcher: DbWatcher

  public game$ = new ReplaySubject<Game>()
  public gm$ = new BehaviorSubject<boolean>(false)
  public mapData$ = new ReplaySubject<MapData>()
  public commands$ = new ReplaySubject<SessionCommand>()

  public annotation_add$ = new Subject<Annotation>()
  public annotation_update$ = new Subject<Annotation>()
  public annotation_remove$ = new Subject<RemovedDocument>()

  public currentLayer: 'player' | 'gm' | 'background' = 'player';
  public game: Game = new Game()
  public mapdata: MapData = new MapData()
  public commands: SessionCommand[] = []
  public layerMgr: MapLayerManager
  public selected: Annotation

  // Active tool that is being shown. Can be undefined
  public activeTool 
  public showToolbar = true

  public keyhandler = new KeyboardHandler(this)

  tab: number = 0
  selecting = false;

  chatPreview = true

  tool: string
  gmtool: string
  mdUpatesSmall$ = new Subject<MapData>()
  limitedUpdates$ = new Subject<ObjectType>()
  layerMgr$ = new BehaviorSubject<MapLayerManager>(null);
  addtool: string

  circle = false
  addtools = false

  constructor(public data: DataService,
    private route: ActivatedRoute, private router: Router, private zone: NgZone,
    private element: ElementRef, private app: AppComponent) { 
      this.app.fw = true
    }

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      // this.game = Game.to(<Game>data.asset)
      let id = data.ctx.id

      // Watch for the Game (not sure why... maybe permmissions)
      this.watcher = this.data.coreDB.watchId(id, this.zone)
      this.watcher.onAdd(doc => this.updateGame(doc))
      this.watcher.onUpdate(doc => this.updateGame(doc))
      this.watcher.onRemove(doc => this.router.navigate([".."], { relativeTo: this.route }))
      this.watcher.start()

      this.data.createDbIfNeeded(id).subscribe(db => {
        // Watch for the session commands
        this.cmdWatcher = db.watchType(SessionCommand.TYPE, this.zone)
        this.cmdWatcher.onAdd(doc => this.processCmd(doc))
        this.cmdWatcher.onUpdate(doc => this.processCmd(doc))
        this.cmdWatcher.start()
      })

    })

    this.mdUpatesSmall$.pipe(
      debounceTime(300)
    ).subscribe(m => {
      this.data.store(m)
    })
    this.limitedUpdates$.pipe(
      debounceTime(100)
    ).subscribe(m => {
      this.data.store(m)
    })

    this.gm$.subscribe( gm => {
      this.mapview.showGmLayer(gm)
    })
    
    combineLatest(this.game$, this.data.player$).subscribe(
      item => {
        const game= item[0]
        const player = item[1]
        if (game && player) {
          this.gm$.next(this.game.isGM(player._id))
        } else {
          this.gm$.next(false) 
        }
      }
    )

  }

  updateGame(g :Game) {
    //TODO: Check if the person is still part of the game. 
    console.log("LOADING GAME: ", g);
    
    this.game = Game.to(g)
    this.game$.next(this.game)
  }

  circleSelected() {
    return this.selected && CircleAnnotation.is(this.selected)
  }

  setMap(doc: any) {


  }


  @HostListener('window:keyup', ['$event'])
  onKeyUp(event : KeyboardEvent) {
    console.log("KEY DOWN ", event.key)
    // this.keyhandler.keydown(event)
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event : KeyboardEvent) {
    console.log("KEY DOWN ", event.key)
    
  }

  onBack() {
    this.router.navigate(['../'], { relativeTo: this.route })
  }

  ngAfterViewInit() {
    if (this.element) {
      if (window.innerWidth < 1024) {
        this.chatPreview = true
      } else {
        this.chatPreview = false
      }
    }
    this.layerMgr = new MapLayerManager(this)
    this.layerMgr.selection$.subscribe(selected => {
      this.selected = selected
    })
    this.layerMgr$.next(this.layerMgr)
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1024) {
      this.chatPreview = true
    } else {
      this.chatPreview = false
    }
  }


  processCmd(cmd: SessionCommand) {
    console.log("PROCESSING MAP COMMAND ", cmd)
    // Keep a reverse sorted list
    this.commands.unshift(cmd)

    // Every command should include the map id
    if (this.mapdata._id != cmd.mapId) {
      // Change the map
      this.watchMap(cmd.mapId)
    }

    if (cmd.command == PanZoomMapCommand.CMD) {
      let cmdPan = <PanZoomMapCommand>cmd
      this.setCenter(cmdPan.x, cmdPan.y)
      this.setZoom(cmdPan.zoom)
    }
  }


  setCenter(x: number, y: number) {

  }

  setZoom(zoom: number) {

  }

  watchMap(mapId) {
    if (this.mapWatcher) {
      this.mapWatcher.cancel()
    }
    if (this.annotationWatcher) {
      this.annotationWatcher.cancel()
    }

    this.mapWatcher = this.data.getDbById(this.game._id).watchId(mapId, this.zone)
    this.mapWatcher.onAdd(m => this.updateMap(m))
    this.mapWatcher.onUpdate(m => this.updateMap(m))
    this.mapWatcher.onRemove(m => this.mapdata = new MapData())
    this.mapWatcher.start()

    // Watch for annotations
    this.annotationWatcher = this.data.getDbById(this.game._id)
      .watchFields([{ field: 'type', value: Annotation.TYPE }, { field: 'map', value: mapId }], this.zone)
    this.annotationWatcher.onAdd(doc => {
      this.annotation_add$.next(Annotation.to(doc))
    })
    this.annotationWatcher.onUpdate(doc => {
      this.annotation_update$.next(Annotation.to(doc))
    })
    this.annotationWatcher.onRemove(doc => this.annotation_remove$.next(doc))
    this.annotationWatcher.start()
  }

  updateMap(mapdata: MapData) {
    console.log("Changing Map ", mapdata)
    this.mapdata = MapData.to(mapdata)
    if (!mapdata.gridOptions) {
      this.mapdata.gridOptions = new GridOptions()
    }
    this.mapview.changeMap(mapdata)

    this.mapview.viewport.on('moved', event => {
      this.w = this.mapview.viewport.screenWidth
      this.h = this.mapview.viewport.screenHeight
    })

    // this.layerMgr.fogPlugin.updateMap()
  }


  ngOnDestroy(): void {
    this.app.fw = false
    if (this.watcher) { this.watcher.cancel() }
  }

  showGmTools() {
    this.tools.showTabs('gmtools')
  }

  closeGmTools() {
    this.gmtool = undefined
    if (this.calibrate) {
      this.calibrate.cancelCal()
    }
  }

  closeTools() {
    this.addtool = undefined
  }

  isGM(player ?: Player): boolean {
    const p = player?player:this.data.player
    if (p) {
      return this.game.isGM(p._id)
    } else {
      return false
    }
  }

  bounds() {
    if (this.mapview && this.mapview.viewport) {
      return this.mapview.viewport.getVisibleBounds().width + ", " + this.mapview.viewport.getVisibleBounds().height
    }
    return ''
  }


}


class KeyboardHandler {
  constructor( private session : LivePageComponent) {

  }

  keydown(e: any) {
    console.log("Checking for Move", e.keyCode)

    const item = this.session.layerMgr.selection$.getValue()


    if (item && TokenAnnotation.is(item)) {
      // figure out which (if any) direction is triggered
      const direction = this.triggers.find(t => t.matches(e))
      if (direction) {
        this.move(item, direction.direction, 5, DistanceUnit.Feet)
      }
    }
      
    
  }


  move(token: TokenAnnotation, direction: number, distance: number, unit: DistanceUnit) {
    // const distanceM = unit.toFeet(distance)

    // const plugin = this.session.layerMgr.modelMap.get(token)
    // const bounds = token.location
    // const newBounds = Geom.offset(bounds, direction, distance, unit)
    // token.location = newBounds
    // this.session.layerMgr.storeAnnotation(token)
  }
  
  triggers = [
    // DOWN LEFT, numpad 1, #1
    new Direction(1, 49, 97),

    // DOWN, down arrow, numpad 2, #2, s
    new Direction(2, 40, 98, 50, 83),

    // DOWN RIGHT, numpagd 3, #3
    new Direction(3, 99, 51),

    // LEFT, left arrow, numpagd 4, #4, a
    new Direction(4, 37, 100, 52, 65),

    // RIGHT, right arrow, numpad 6, #6, d
    new Direction(6, 39, 102, 54, 68),

    // UP LEFT, numpagd 7, #7,
    new Direction(7, 103, 55),

    // UP, up arrow, numpad 8, #8, w
    new Direction(8, 38, 104, 56, 87),

    // UP RIGHT,  numpad 9, #9
    new Direction(9, 105, 57),
  ]

}

class Direction {
  codes: number[]
  constructor(public direction: number, ...codes: number[]) {
    this.codes = codes
  }

  matches(e: any) {
    return this.codes.includes(e.keyCode)
  }
}