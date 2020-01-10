import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-map-info-page',
  templateUrl: './map-info-page.component.html',
  styleUrls: ['./map-info-page.component.css']
})
export class MapInfoPageComponent implements OnInit {
  name = "New Map"
  description = ""
  height = 0
  width=0
  image
  blank = false
  ppm = 1
  bgColor = "rgb(0,0,0)"
  tab=0
  constructor() { }

  ngOnInit() {
  }

}
