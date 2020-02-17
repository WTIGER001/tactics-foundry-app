import { Component, OnInit, OnDestroy, NgZone, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { DbWatcher, RemovedDocument } from '../../database-manager';
import { Game, RouteContext, SessionCommand, MapData, PanZoomMapCommand, GridOptions, Annotation, CircleAnnotation, ObjectType, Player, TokenAnnotation, DistanceUnit, Geom, FavoriteAnnotation } from '../../model';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../../components/map/map/map.component';
import {  Point } from 'pixi.js';
import { Subject, ReplaySubject, BehaviorSubject, combineLatest, Subscription } from 'rxjs';
import { debounceTime, filter } from 'rxjs/operators';
import { CalibrateToolComponent } from '../../components/map/tools/gm/calibrate-tool/calibrate-tool.component';
import { MapLayerManager } from '../../components/map/map/layer-manager';
import { AppComponent } from 'src/app/app.component';
import { SettingsService } from '../../settings.service';
import { Encounter } from '../../encounter/encounter';
import { ResetableSubject } from '../../util/resetable-subject';
import { GameDataManager } from '../../game-data-manager';
import { faTreeChristmas } from '@fortawesome/pro-solid-svg-icons';

@Component({
  selector: 'live-page',
  templateUrl: './live-page.component.html',
  styleUrls: ['./live-page.component.css']
})
export class LivePageComponent implements OnInit, OnDestroy, AfterViewInit {
  @ViewChild('mapview', { static: true }) mapview: MapComponent
  @ViewChild('calibrate', { static: false }) calibrate: CalibrateToolComponent
  w = 0
  h = 0

  // DB Watchers. All components that are a child of this should just subscribe to the results instead of 
  // watching on their own
  private mapSubscription : Subscription
  private watcher: DbWatcher
  private cmdWatcher: DbWatcher
  private mapWatcher: DbWatcher
  private annotationWatcher: DbWatcher
  private encounterWatcher : DbWatcher
  private favoriteWatcher : DbWatcher

  public gameId : string
  public mapId$ = new BehaviorSubject<string>(null)
  public game$ = new ReplaySubject<Game>()
  public gm$ = new BehaviorSubject<boolean>(false)
  public mapData$ = new ReplaySubject<MapData>()
  public commands$ = new ReplaySubject<SessionCommand>()
  public encounter$ = new BehaviorSubject<Encounter>(null)

  public favorite_add$ = new ReplaySubject<FavoriteAnnotation>()
  public favorite_update$ = new ReplaySubject<FavoriteAnnotation>()
  public favorite_removed$ = new ReplaySubject<RemovedDocument>()

  public currentLayer: 'player' | 'gm' | 'background' = 'player';
  public game: Game = new Game()
  public mapdata: MapData = new MapData()
  public commands: SessionCommand[] = []
  public layerMgr: MapLayerManager
  public selected: Annotation
  public encounters : Encounter[] = []
  public gameMgr :GameDataManager

  private annotationSubscription : Subscription

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
    private element: ElementRef, private app: AppComponent, public settings: SettingsService) { 
      this.app.fw = true
    }



  ngOnInit() {
    // May want to add an overall game content watcher....
    
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      // this.game = Game.to(<Game>data.asset)
      let id = data.ctx.id
      this.gameId = id

      // Watch for the Game (not sure why... maybe permmissions)
      this.watcher = this.data.coreDB.watchId(id, this.zone)
      this.watcher.onAdd(doc => this.updateGame(doc))
      this.watcher.onUpdate(doc => this.updateGame(doc))
      this.watcher.onRemove(doc => this.router.navigate([".."], { relativeTo: this.route }))
      this.watcher.start()

      this.data.createDbIfNeeded(id).subscribe(db => {
        this.gameMgr = db

        this.gameMgr.cmd$.subscribe( cmd => this.processCmd(cmd))
        this.gameMgr.map$.pipe( 
          filter(map => map._id === this.mapId$.getValue())
        ).subscribe( map => this.updateMap(map))

        // Watch for the encounter
        this.gameMgr.encounter$.subscribe( doc => this.processEncounter(doc))

        // Watch for changes to the current map
        this.mapSubscription = this.gameMgr.map$.pipe(
            filter( (m : MapData) => m._id === (this.mapdata?this.mapdata._id:''))
        ).subscribe( m => {
          this.updateMap(m) 
          this.mapId$.next(m._id)
        })
      })

      this.mapId$.subscribe( mapId => this.handleNewMap(mapId))
    })

    this.mdUpatesSmall$.pipe(
      debounceTime(300)
    ).subscribe(m => {
      this.data.store(m)
    })

    this.limitedUpdates$.pipe(
      debounceTime(100)
    ).subscribe(m => {
      console.log("Limited Update Triggered", m);
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

  handleNewMap(mapId: string) {
   
  }


  updateGame(g :Game) {
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
    // this.keyhandler.keydown(event)
  }

  @HostListener('window:keydown', ['$event'])
  onKeyDown(event : KeyboardEvent) {
    
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

    if (cmd.command == PanZoomMapCommand.CMD && !this.mapview.ignoreFollowMe) {
      let cmdPan = <PanZoomMapCommand>cmd

      if (this.settings.gameMapZoomListen.value.getValue()) {
        this.setZoom(cmdPan.zoom)
      }
      this.setCenter(cmdPan.x, cmdPan.y)
    }
  }

  processEncounter( doc : Encounter) {
      if (doc.map === this.mapdata._id && doc.active) {
        this.encounter$.next(doc)
      }
  }

  setCenter(x: number, y: number) {
    this.mapview.center(x, y)
  }

  setZoom(zoom: number) {
    this.mapview.zoom(zoom)
  }

  watchMap(mapId) {
    if (!mapId || !this.game || this.mapId$.getValue() === mapId) {
      return 
    }
    /// Get the correct map
    let mapdata = this.gameMgr.maps.find(m => m._id === mapId)
    if (mapdata) {
      this.mapId$.next(mapId)
      this.updateMap(mapdata)
    }
  }

  updateMap(mapdata: MapData) {
    console.log("Changing Map ", mapdata)
    this.mapdata = MapData.to(mapdata)
    if (!mapdata.gridOptions) {
      this.mapdata.gridOptions = new GridOptions()
    }
    this.mapview.changeMap(mapdata)
    this.mapview.followMe = this.isGM()
    this.mapview.ignoreFollowMe = this.isGM()

    this.mapview.viewport.on('moved', event => {
      this.w = this.mapview.viewport.screenWidth
      this.h = this.mapview.viewport.screenHeight
    })

    // this.selectEncounter()
  }


  ngOnDestroy(): void {
    this.app.fw = false
    if (this.watcher) { this.watcher.cancel() }
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


  newName = "New Token"
  uploadfile : File
  showCropDialog = false
  uploadTokenImg($event : File) {
    const name = $event.name
    const indx = name.indexOf(".")
    if (indx >0) {
      this.newName = $event.name.substr(0, indx-1)
    } else {
      this.newName = $event.name
    }
    this.uploadfile = $event
    this.showCropDialog = true
    
  }
  uploadImg($event: File) {
    const name = $event.name
    const indx = name.indexOf(".")
    if (indx >0) {
      this.newName = $event.name.substr(0, indx-1)
    } else {
      this.newName = $event.name
    }
    this.uploadfile = $event
    this.showCropDialog = true
  }

  saveImage($event) {
    // Create the token
    const t = new TokenAnnotation()
    t.name = "New Token"
    t.url = $event
    t.size = 5
    t.sourceDB = this.game._id
    t.layer = this.currentLayer

    // TODO+: Spiral around the center square until an unoccupied square is found 
    // Place the token (start in the center and look for an open grid square)
    const map: MapComponent = this.mapview
    const center: Point = map.getCenter()
    const gridSquare = map.grid.getGridCell(center)

    t.x = gridSquare.x
    t.y = gridSquare.y

    // Save
    this.layerMgr.storeAnnotation(t)

    // this.character.url = $event
    // this.data.store(this.character)
    this.showCropDialog = false
  }

  cancelCrop(){
    this.uploadfile = undefined
    this.showCropDialog = false
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