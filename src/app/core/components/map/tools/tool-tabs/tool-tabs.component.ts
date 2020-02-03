import { Component, OnInit, ViewChildren, Output, EventEmitter, Input, AfterContentInit, AfterViewChecked, AfterViewInit, QueryList, ContentChildren, ComponentFactoryResolver, ViewChild } from '@angular/core';
import { ToolTabComponent } from '../tool-tab/tool-tab.component';
import { ToolDialogComponent } from '../tool-dialog/tool-dialog.component';
import { ToolDialogHostDirective } from '../tool-dialog/tool-dialog-host.directive';

@Component({
  selector: 'tool-tabs',
  templateUrl: './tool-tabs.component.html',
  styleUrls: ['./tool-tabs.component.css']
})
export class ToolTabsComponent implements OnInit, AfterContentInit {
  @ContentChildren(ToolTabComponent) tabs : QueryList<ToolTabComponent>
  @ViewChild(ToolDialogComponent, {static: true}) dialog: ToolDialogComponent;

  // tabs: ToolTabComponent[] = []
  @Output() onClose = new EventEmitter<boolean>()
  @Output() onCloseDialog = new EventEmitter<boolean>()
  @Output() onActivate = new EventEmitter<ToolTabComponent>()
  @Input() fullHeight = false
  dialogShown = false
  active : ToolTabComponent
  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    
  }

  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);
      
    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.activate(this.tabs.first);
    }
  }


  activate(tab : ToolTabComponent) {
    this.active = tab

    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    
    // activate the tab the user has clicked on.
    tab.active = true;
    
    this.onActivate.emit(this.active)
  }

  closeTools() {
    this.dialogShown = false
    this.onClose.emit(true)
  }

  closeDialog(event : any) {
    this.dialogShown = false
    this.onCloseDialog.emit(true)
  }

  showDialog(component : any)  : any {
      this.dialogShown = true

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component)
      const viewContainerRef = this.dialog.host.viewContainerRef
      // const viewContainerRef =this.toolDialogHost.viewContainerRef
      viewContainerRef.clear()
      const componentRef = viewContainerRef.createComponent(componentFactory);
      return componentRef.instance
  }

}
