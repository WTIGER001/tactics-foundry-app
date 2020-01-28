import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'image-crop-dialog',
  templateUrl: './image-crop-dialog.component.html',
  styleUrls: ['./image-crop-dialog.component.css']
})
export class ImageCropDialogComponent implements OnInit {
  @Input() image
  @Output() onSave = new EventEmitter<any>()
  @Output() onCancel = new EventEmitter<any>()

  cropped 
  constructor() { }

  ngOnInit() {
  }

  imageCropped(event) {
    console.log("CROPPER DONE");
    this.cropped = event
  }

  imageLoaded() {
    console.log("IMAGE LOADED");
  }

  cropperReady() {
    console.log("CROPPER READY");
  }

  loadImageFailed() {
    console.log("LOAD FAILED");

  }
  cancel() {
    console.log("IMAGE CANCELED --- EXITING");

    this.onCancel.emit()
  }

  save() {
    console.log("IMAGE SAVED --- EXITING");

    this.onSave.emit(this.cropped.base64)
  }
}
