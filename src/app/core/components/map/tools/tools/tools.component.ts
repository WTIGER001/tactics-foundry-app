import { Component, OnInit, ViewChild, ComponentFactoryResolver, AfterViewInit } from '@angular/core';
import { PlaceholderDirective } from 'src/app/core/directives/placeholder.directive';
import { ToolDialogComponent } from '../tool-dialog/tool-dialog.component';
import { ToolTabsComponent } from '../tool-tabs/tool-tabs.component';
import { Annotation, TokenAnnotation } from 'src/app/core/model';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent implements OnInit, AfterViewInit {
  @ViewChild(ToolDialogComponent, {static: true}) dialog: ToolDialogComponent;
  @ViewChild(ToolTabsComponent, {static: true}) tabs: ToolTabsComponent;

  addtools = false
  dialogShown = false
  tabsShown = false
  selected : Annotation
  constructor(private componentFactoryResolver: ComponentFactoryResolver, private session : LivePageComponent) { 
    this.session.layerMgr$.subscribe( lmgr => {
      if (lmgr) {
        lmgr.selection$.subscribe( item => {
          this.selected = item;
          console.log("Checking if token", this.selected)
        })
      }
    })
  }

  ngOnInit() {
   
  }

  ngAfterViewInit() {
    
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


  updateSelected() {

  }

  isTokenSelected() {
    return TokenAnnotation.is(this.selected)
  }
}
