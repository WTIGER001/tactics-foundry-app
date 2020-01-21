import { Component, OnInit, ViewContainerRef, Input, ViewChild, Output, EventEmitter, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { ToolDialogHostDirective } from './tool-dialog-host.directive';
import { Observable, Subject } from 'rxjs';

@Component({
  selector: 'tool-dialog',
  templateUrl: './tool-dialog.component.html',
  styleUrls: ['./tool-dialog.component.css']
})
export class ToolDialogComponent implements OnInit, AfterViewInit {
  @Input() shown = false
  @ViewChild(ToolDialogHostDirective, { static: false }) host: ToolDialogHostDirective
  @Output() onClose = new EventEmitter<true>()
  @Output() onShow = new EventEmitter<any>()
  public image
  public imageOverlap = '-15px'

  constructor(public viewContainerRef: ViewContainerRef, private cfr: ComponentFactoryResolver) { }

  ngOnInit() {

  }

  closeDialog() {
    this.shown = false
    this.onClose.emit(true)
  }

  ngAfterViewInit() {
    if (this.componentToCreate) {
      const cf = this.cfr.resolveComponentFactory(this.componentToCreate)
      const viewContainerRef = this.host.viewContainerRef
      viewContainerRef.clear()
      const componentRef = viewContainerRef.createComponent(cf);
      this.onShow.emit(componentRef.instance)
      componentRef.instance
    }
  }

  componentToCreate 
  observeMe = new Subject<any>()

  show(component : any) {
    this.componentToCreate = component
  }


}
