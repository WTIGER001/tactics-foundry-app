import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormatToolDialogComponent } from '../../format-tool-dialog/format-tool-dialog.component';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { PolygonAnnotation, PolylineAnnotation } from 'src/app/core/model';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { DataService } from 'src/app/core/data.service';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'edit-polygon',
  templateUrl: './edit-polygon.component.html',
  styleUrls: ['./edit-polygon.component.css']
})
export class EditPolygonComponent implements OnInit {
  @ViewChild(ToolDialogComponent, {static :false}) formatDialog: ToolDialogComponent
  @Input() item : PolygonAnnotation | PolylineAnnotation = new PolygonAnnotation()

  constructor(private tabs : ToolTabsComponent, private data : DataService, private session : LivePageComponent) { 

  }

  ngOnInit() {

  }

  showFormatDialog() {
    const dialog : FormatToolDialogComponent = this.tabs.showDialog(FormatToolDialogComponent)
    dialog.item = this.item
    dialog.onUpdate.subscribe( () => {
      this.session.limitedUpdates$.next(this.item)

    })
  }
  
  updated(event ?: any) {
    this.session.layerMgr.storeAnnotation(this.item)
  }

}