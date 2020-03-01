import { Component, OnInit, Input, ViewChild } from '@angular/core';
import * as Editor from '@ckeditor/ckeditor5-build-classic';
// import * as BalloonEditor from '@ckeditor/ckeditor5-editor-balloon';
// import * as Editor from '@ckeditor/ckeditor5-build-balloon';


import { Annotation } from 'src/app/core/model';
import { EditNotesDialogComponent } from '../../edit-notes-dialog/edit-notes-dialog.component';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { DataService } from 'src/app/core/data.service';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { ToolsComponent } from '../../tools/tools.component';

@Component({
  selector: 'edit-notes-tool',
  templateUrl: './edit-notes-tool.component.html',
  styleUrls: ['./edit-notes-tool.component.css']
})
export class EditNotesToolComponent implements OnInit {
  public Editor = Editor;
  @Input() item : Annotation

  constructor(private tools : ToolsComponent, private data : DataService, private session : LivePageComponent) { 

  }

  ngOnInit() {
  }

  showNotesDialog() {
    // const dialog : EditNotesDialogComponent = this.tabs.showDialog(EditNotesDialogComponent)
    // dialog.text = this.item.notes
    // dialog.onUpdate.subscribe( () => {
    //   this.session.limitedUpdates$.next(this.item)
    // })
    this.tools.showTabs('notes')
  }
}
