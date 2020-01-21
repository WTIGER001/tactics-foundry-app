import { Component, OnInit, ViewChild, ComponentFactoryResolver } from '@angular/core';
import { PlaceholderDirective } from 'src/app/core/directives/placeholder.directive';
import { ToolDialogComponent } from '../tool-dialog/tool-dialog.component';
import { ToolTabsComponent } from '../tool-tabs/tool-tabs.component';

@Component({
  selector: 'tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit {
  @ViewChild(ToolDialogComponent, {static: true}) dialog: ToolDialogComponent;
  @ViewChild(ToolTabsComponent, {static: true}) tabs: ToolTabsComponent;

  addtools = false
  dialogShown = false
  tabsShown = false

  constructor(private componentFactoryResolver: ComponentFactoryResolver) { }

  ngOnInit() {
    
  }

  showDialog(component : any)  : any {
    // if (this.dialogShown) {
    //   this.dialogShown = false
    // } else {
      this.dialogShown = true

      const componentFactory = this.componentFactoryResolver.resolveComponentFactory(component)
      const viewContainerRef = this.dialog.host.viewContainerRef
      // const viewContainerRef =this.toolDialogHost.viewContainerRef
      viewContainerRef.clear()
      const componentRef = viewContainerRef.createComponent(componentFactory);
      return componentRef.instance
    // }
  }

  setTool(tool : string) {
    if (tool == 'add') {
      this.addtools = true
    }
  }

  onAddToolsClose() {
    this.addtools = false
  }

  onAddToolActivate($event ?: any) {
    
  }

  closeDialog($event ?: any) {

  }

  closeTab(event) {
    
  }

}
