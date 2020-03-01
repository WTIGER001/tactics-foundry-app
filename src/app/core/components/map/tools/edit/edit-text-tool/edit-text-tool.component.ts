import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormatToolDialogComponent } from '../../format-tool-dialog/format-tool-dialog.component';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { RectangleAnnotation, TextAnnotation } from 'src/app/core/model';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { DataService } from 'src/app/core/data.service';
import { FontStyleDialogComponent } from '../../font-style-dialog/font-style-dialog.component';

@Component({
  selector: 'edit-text-tool',
  templateUrl: './edit-text-tool.component.html',
  styleUrls: ['./edit-text-tool.component.css']
})
export class EditTextToolComponent implements OnInit {
  @ViewChild(ToolDialogComponent, {static :false}) formatDialog: ToolDialogComponent
  @Input() item : TextAnnotation = new TextAnnotation()

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

  showStyleDialog() {
    const dialog : FontStyleDialogComponent = this.tabs.showDialog(FontStyleDialogComponent)
    dialog.item = this.item.style
    dialog.onUpdate.subscribe( () => {
      this.session.limitedUpdates$.next(this.item)
    })
  }
  
  
  updated(event ?: any) {
    this.session.limitedUpdates$.next(this.item)
  }


}
