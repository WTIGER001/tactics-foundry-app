import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'editable-title',
  templateUrl: './editable-title.component.html',
  styleUrls: ['./editable-title.component.css']
})
export class EditableTitleComponent implements OnInit {
  origTitle : string = ""
  @Input() title : string = ""
  @Output() updated = new EventEmitter<string>()
  editting
  constructor() { }

  ngOnInit() {
  }


  edit() {
    if (this.editting) {
      this.cancelEdit()
    } else {
      this.origTitle = this.title
      this.editting = true
    }
  }

  save($event) {
    console.log("SAVING NAME ",  $event);
    this.editting = false;
    this.updated.emit(this.title)
  }

  cancelEdit() {
    this.editting = false
    this.title = this.origTitle
  }
}
