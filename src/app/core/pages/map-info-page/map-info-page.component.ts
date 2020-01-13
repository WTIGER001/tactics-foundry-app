import { Component, OnInit, NgZone } from '@angular/core';
import { ImageUtil } from '../../util/ImageUtil';
import { MapData, ObjectType, RouteContext, ActivateMapCommand } from '../../model';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { faSave } from '@fortawesome/pro-solid-svg-icons';
import { DbWatcher } from '../../database-manager';

@Component({
  selector: 'app-map-info-page',
  templateUrl: './map-info-page.component.html',
  styleUrls: ['./map-info-page.component.css']
})
export class MapInfoPageComponent implements OnInit {
  watcher : DbWatcher
  mapdata : MapData = new MapData()
  gameid : string

  // name = "New Map"
  // description = ""
  // height = 0
  // width=0
  // image
  // thumb
  // blank = false
  // ppm = 1
  // bgColor = "#000000"
  tab=0
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router, private zone : NgZone) { }

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      let id = data.ctx.id  
      this.gameid = data.ctx.parentId
      let dbmgr = this.data.getDbById(this.gameid)
    
      this.watcher = dbmgr.watchId(id, this.zone)
      this.watcher.onAdd( item => { this.mapdata.copyFrom(item)})
      this.watcher.onUpdate( item => { this.mapdata.copyFrom(item)})
      this.watcher.onRemove (item => { this.router.navigate(["../"], { relativeTo: this.route})})
      this.watcher.start()
    })
  }

  updateTitle($event : string) {
    this.mapdata.name = $event
    this.save()
  }

  // Save the contents
  goBack() {
    // this.data.store(this.mapdata)
    // this.router.
  }

  blankOut() {
    this.mapdata.image = null
    this.mapdata.thumb = null
    this.mapdata.blank = true
    this.save()
  }

  update() {
    this.save()
  }
  
  delete() {
    // Confirm
    this.data.delete(this.mapdata)

  }

  activate() {
    this.data.activate(this.gameid, this.mapdata)
    this.data.store( new ActivateMapCommand(this.gameid, this.mapdata._id))
  }

  uploadImg($event : File) {
    ImageUtil.loadImg($event, {
      createThumbnail: true
    }).subscribe( result => {
      this.mapdata.image = result.dataURL
      this.mapdata.thumb = result.thumbDataUrl
      this.mapdata.width = result.width
      this.mapdata.height = result.height
      this.save()
    })
  }

  save() {
    this.data.store(this.mapdata)
  }
}
