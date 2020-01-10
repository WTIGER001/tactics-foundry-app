import { Component, OnInit } from '@angular/core';
import { ImageUtil } from '../../util/ImageUtil';
import { MapData, ObjectType } from '../../model';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-map-info-page',
  templateUrl: './map-info-page.component.html',
  styleUrls: ['./map-info-page.component.css']
})
export class MapInfoPageComponent implements OnInit {
  mapdata : MapData = new MapData()

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
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe((data: { asset: ObjectType }) => {
      this.mapdata = MapData.to(<MapData>data.asset)
    })
  }

  update() {

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
  }

  uploadImg($event : File) {
    ImageUtil.loadImg($event, {
      createThumbnail: true
    }).subscribe( result => {
      this.mapdata.image = result.dataURL
      this.mapdata.thumb = result.thumbDataUrl
      this.mapdata.width = result.width
      this.mapdata.height = result.height
    })
  }
}
