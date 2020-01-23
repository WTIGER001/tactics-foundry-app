import { Component, OnInit, ViewChild, Input, OnChanges, SimpleChanges } from '@angular/core';
import { FormatToolDialogComponent } from '../../format-tool-dialog/format-tool-dialog.component';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { RectangleAnnotation } from 'src/app/core/model';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { DataService } from 'src/app/core/data.service';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'edit-rectangle-tool',
  templateUrl: './edit-rectangle-tool.component.html',
  styleUrls: ['./edit-rectangle-tool.component.css']
})
export class EditRectangleToolComponent implements OnInit {
  @ViewChild(ToolDialogComponent, {static :false}) formatDialog: ToolDialogComponent
  @Input() item : RectangleAnnotation = new RectangleAnnotation()

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
    this.session.limitedUpdates$.next(this.item)
  }

}