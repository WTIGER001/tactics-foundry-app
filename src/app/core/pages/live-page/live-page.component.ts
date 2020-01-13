import { Component, OnInit, OnDestroy, NgZone, ViewChild, HostListener, ElementRef, AfterViewInit } from '@angular/core';
import { DbWatcher } from '../../database-manager';
import { Game, RouteContext, SessionCommand, MapData, PanZoomMapCommand } from '../../model';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { MapComponent } from '../../components/map/map/map.component';
import { Graphics } from 'pixi.js';

@Component({
  selector: 'live-page',
  templateUrl: './live-page.component.html',
  styleUrls: ['./live-page.component.css']
})
export class LivePageComponent implements OnInit, OnDestroy, AfterViewInit{
  @ViewChild('mapview', {static: true}) mapview : MapComponent
  w = 0
  h = 0
  
  watcher : DbWatcher
  cmdWatcher : DbWatcher
  mapWatcher : DbWatcher
  game: Game = new Game()
  mapdata: MapData = new MapData()
  tab: number = 0
  selecting = false;
  commands : SessionCommand[] = []
  chatPreview = true

  constructor(private data: DataService, private route: ActivatedRoute, private router: Router, private zone: NgZone, private element : ElementRef) { }

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      // this.game = Game.to(<Game>data.asset)
      let id = data.ctx.id

      // Watch for the Game (not sure why... maybe permmissions)
      this.watcher = this.data.coreDB.watchId(id, this.zone)
      this.watcher.onAdd( doc =>  this.game.copyFrom(doc))
      this.watcher.onUpdate( doc => this.game.copyFrom(doc))
      this.watcher.onRemove( doc => this.router.navigate([".."], { relativeTo: this.route }))
      this.watcher.start()

      // Watch for the session commands
      this.data.createDbIfNeeded(id).subscribe( db => {
        console.log("Watching for Session Commands for ", id)
        this.cmdWatcher = db.watchType(SessionCommand.TYPE, this.zone)
        this.cmdWatcher.onAdd( doc => this.processCmd(doc))
        this.cmdWatcher.onUpdate( doc => this.processCmd(doc))
        this.cmdWatcher.start()
      })
      
      // Watch for Annotations


    })

    
  }

  ngAfterViewInit() {
    if (this.element) {
      if (window.innerWidth < 1024) {
        this.chatPreview = true
      } else {
        this.chatPreview = false
      }
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 1024) {
      this.chatPreview = true
    } else {
      this.chatPreview = false
    }
  }


  processCmd(cmd : SessionCommand) {
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

  center1() {
    this.w = this.mapview.viewport.screenWidth
    this.h = this.mapview.viewport.screenHeight
  }
  center2() {
    this.mapview.viewport.fit()
  }
  center3() {
    this.mapview.fit()
  }


  setCenter(x : number, y : number) {

  }

  setZoom( zoom : number) {

  }

  watchMap(mapId) {
    if (this.mapWatcher) {
      this.mapWatcher.cancel()
    }

    this.mapWatcher = this.data.getDbById(this.game._id).watchId(mapId,this.zone)
    this.mapWatcher.onAdd( m => this.updateMap(m))
    this.mapWatcher.onUpdate( m => this.updateMap(m))
    this.mapWatcher.onRemove(m => this.mapdata = new MapData())
    this.mapWatcher.start()
  }

  updateMap(mapdata : MapData) {
    console.log("Changing Map ", mapdata)
    this.mapview.changeMap(mapdata)

    this.mapview.viewport.on('moved', event => {
      this.w = this.mapview.viewport.screenWidth
      this.h = this.mapview.viewport.screenHeight
    })
  }


  ngOnDestroy(): void {
    if (this.watcher) { this.watcher.cancel()}
  }

}
