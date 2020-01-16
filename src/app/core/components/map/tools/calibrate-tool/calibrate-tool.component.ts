import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapData } from 'src/app/core/model';

@Component({
  selector: 'calibrate-tool',
  templateUrl: './calibrate-tool.component.html',
  styleUrls: ['./calibrate-tool.component.css']
})
export class CalibrateToolComponent implements OnInit {

  @Input() mapdata : MapData
  @Output() updated = new EventEmitter<boolean>()


  constructor() { }

  ngOnInit() {
  }

}
