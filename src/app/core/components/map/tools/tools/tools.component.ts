import { Component, OnInit, ViewChild, ComponentFactoryResolver, AfterViewInit, ViewChildren } from '@angular/core';
import { PlaceholderDirective } from 'src/app/core/directives/placeholder.directive';
import { ToolDialogComponent } from '../tool-dialog/tool-dialog.component';
import { ToolTabsComponent } from '../tool-tabs/tool-tabs.component';
import { Annotation, TokenAnnotation, CircleAnnotation, RectangleAnnotation, PolygonAnnotation, MarkerTypeAnnotation } from 'src/app/core/model';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'tools',
  templateUrl: './tools.component.html',
  styleUrls: ['./tools.component.css']
})
export class ToolsComponent  {
  @ViewChild(ToolDialogComponent, {static: true}) dialog: ToolDialogComponent;
  @ViewChildren(ToolTabsComponent) tabs : ToolTabsComponent
  shown : string

  addtools = false
  dialogShown = false
  contextName =''

  selected : Annotation
  constructor(private componentFactoryResolver: ComponentFactoryResolver, public session : LivePageComponent) { 
    this.session.layerMgr$.subscribe( lmgr => {
      if (lmgr) {
        lmgr.selection$.subscribe( item => {
          if (item || this.selected) {
            this.closeDialog()
            this.closeTab()
            this.selected = item;
          } else {
            this.selected = item;
          }
          // console.log("SELECTION RECIEVED : ", item);
        })
      }
    })
  }

  showDialog(component : any, contextName : string)  : any {
    // if (this.dialogShown) {
      // this.dialogShown = false
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

  showGmTools() {
    this.shown = 'gmtools'
  }

  onActivate($event ?: any) {
    
  }

  closeDialog($event ?: any) {
    this.dialogShown = false
  }

  closeSelection() {
    this.session.layerMgr.selection$.next(null)
  }

  closeTab(event ?: any) {
    this.shown = undefined
  }


  isGM() {
    return this.session.isGM()
  }

  
  needsRecenter() {
    return false
  }

  recenter() {

  }

  startMeasure() {
    
  }

  addToMap() {
    this.showTabs('addtools')
  }

  zoomExtents() {
    this.session.mapview.fit()
  }
  updateSelected() {

  }

  isTokenSelected() {
    return TokenAnnotation.is(this.selected)
  }

  isCircleSelected() {
    return CircleAnnotation.is(this.selected)
  }

  isRectangleSelected() {
    return RectangleAnnotation.is(this.selected)
  }

  isPolygonSelected() {
    return PolygonAnnotation.is(this.selected)
  }

  isMarkerSelected() {
    return MarkerTypeAnnotation.is(this.selected)
  }

  showTabs(name : string) {
    // Dismiss any tabs or dialog that are currently shown
    if (this.shown) {
      // CLOSE
      this.closeDialog()
      this.closeTab()
    }

    this.shown = name
  }

  updateGrid($event) {
    this.session.mdUpatesSmall$.next(this.session.mapdata)
  }

  updateFog($event) {
    this.session.mdUpatesSmall$.next(this.session.mapdata)
  }

  updateCalibrate($event) {
    this.session.mdUpatesSmall$.next(this.session.mapdata)
  }

}
