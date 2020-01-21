import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MapData } from 'src/app/core/model';

@Component({
  selector: 'fog-tool',
  templateUrl: './fog-tool.component.html',
  styleUrls: ['./fog-tool.component.css']
})
export class FogToolComponent implements OnInit {

  @Input() mapdata : MapData
  @Output() updated = new EventEmitter<boolean>()
  constructor() { }

  ngOnInit() {
  }

}
