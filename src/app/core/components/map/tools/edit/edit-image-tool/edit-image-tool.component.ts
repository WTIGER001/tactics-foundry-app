import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { ImageAnnotation, Annotation, SnapMode } from 'src/app/core/model';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { DataService } from 'src/app/core/data.service';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'edit-image',
  templateUrl: './edit-image-tool.component.html',
  styleUrls: ['./edit-image-tool.component.css']
})
export class EditImageToolComponent implements OnInit {
  @ViewChild(ToolDialogComponent, { static: false }) formatDialog: ToolDialogComponent
  @Input() item: ImageAnnotation = new ImageAnnotation()

  constructor(private tabs: ToolTabsComponent, private data: DataService, private session: LivePageComponent) {

  }

  ngOnInit() {

  }

  updated(event?: any) {
    this.session.limitedUpdates$.next(this.item)
  }

  snapStyle(): string {
    if (this.item) {
      switch (this.item.snapMode) {
        case SnapMode.SNAP_NONE: { return 'border-none' }
        case SnapMode.SNAP_CENTER: { return 'border-inner' }
        case SnapMode.SNAP_VERTEX: { return 'border-outer' }
      }
    }
    return 'border-none'
  }

  snap() {
    if (this.item.snapMode == 0) {
      this.item.snapMode += 1
    } else if (this.item.snapMode == 1) {
      this.item.snapMode += 1
    } else if (this.item.snapMode == 2) {
      this.item.snapMode = 0
    }
    this.updated()
  }

}