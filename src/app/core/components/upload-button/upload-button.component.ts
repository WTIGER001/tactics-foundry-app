import { Component, OnInit, Input, ViewChild, EventEmitter, Output } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-upload-button',
  templateUrl: './upload-button.component.html',
  styleUrls: ['./upload-button.component.css']
})
export class UploadButtonComponent implements OnInit {

  @Input() maxSize = 10000000
  @Input() picture: string
  @Input() multiple = false
  @Input() searchTerm = ''
  @Input() accept = ".jpg,.png"


  @ViewChild('fileupload', {static: true}) fileButton
  @Output() choice = new EventEmitter()

  dragging = false
  constructor(private data: DataService) { }

  ngOnInit() {
  }

  getFile() {
    this.fileButton.nativeElement.click()
  }

  uploadFile(event) {
    if (event.target.files) {
      this.setFiles(event.target.files)
    }
  }

  setFiles(files: FileList) {
    const filesToSend = []
    for (let i = 0; i < files.length; i++) {
      let f = files[i]
      if (f.size < this.maxSize) {
        filesToSend.push(f)
      }
    }
    if (filesToSend.length > 0) {
      if (this.multiple) {
        console.log("SENDING IMAGE2");
        this.choice.emit(filesToSend)
      } else {
        console.log("SENDING IMAGE3");
        this.choice.emit(filesToSend[0])
      }
    }
  }
}