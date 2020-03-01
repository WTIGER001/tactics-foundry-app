import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import * as Editor from '@ckeditor/ckeditor5-build-classic';
import { Annotation } from 'src/app/core/model';
// import * as Editor from '@ckeditor/ckeditor5-build-balloon';
// 

@Component({
  selector: 'edit-notes-dialog',
  templateUrl: './edit-notes-dialog.component.html',
  styleUrls: ['./edit-notes-dialog.component.css']
})
export class EditNotesDialogComponent implements OnInit {
  public Editor = Editor;

  @Input() item : Annotation
  @Output() onUpdate : EventEmitter<string>
  constructor() { }

  ngOnInit() {
  }

  update() {
    // Make changes
  }

}
