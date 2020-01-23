import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';

@Component({
  selector: 'tool-item',
  templateUrl: './tool-item.component.html',
  styleUrls: ['./tool-item.component.css']
})
export class ToolItemComponent implements OnInit {
  @Output() onClose = new EventEmitter()
  @Input() image
  @Input() imageOverlap
  
  constructor() { }

  ngOnInit() {
  }

  close() {
    this.onClose.emit()
  }

}
