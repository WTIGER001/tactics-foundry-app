import { Component, OnInit, ViewContainerRef, Input, ViewChild, Output, EventEmitter } from '@angular/core';
import { ToolDialogHostDirective } from './tool-dialog-host.directive';

@Component({
  selector: 'tool-dialog',
  templateUrl: './tool-dialog.component.html',
  styleUrls: ['./tool-dialog.component.css']
})
export class ToolDialogComponent implements OnInit {
  @Input() shown = false
  @ViewChild(ToolDialogHostDirective, {static: false}) host : ToolDialogHostDirective
  @Output() onClose = new EventEmitter<true>()
  public image 
  public imageOverlap = '-15px'

  constructor(public viewContainerRef: ViewContainerRef) { }

  ngOnInit() {
  }

  closeDialog() {
    this.onClose.emit(true)
  }
}
