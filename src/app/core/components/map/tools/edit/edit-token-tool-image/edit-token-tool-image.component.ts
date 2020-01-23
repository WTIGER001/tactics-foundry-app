import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TokenAnnotation } from 'src/app/core/model';
import { ImageUtil } from 'src/app/core/util/ImageUtil';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { MapComponent } from '../../../map/map.component';

@Component({
  selector: 'edit-token-tool-image',
  templateUrl: './edit-token-tool-image.component.html',
  styleUrls: ['./edit-token-tool-image.component.css']
})
export class EditTokenToolImageComponent implements OnInit {
  @Input() item : TokenAnnotation
  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  constructor(private session : LivePageComponent) { }

  ngOnInit() {
  }

  uploadImg($event) {
    ImageUtil.loadImg($event, {
      createThumbnail: true,
      thumbnailKeepAspect: true,
      thumbnailMaxHeight: 100,
      thumbnailMaxWidth: 100
    }).subscribe(result => {
      this.item.url = result.thumbDataUrl
      this.onUpdate.emit(this.item)
    })
  }

  search() {

  }

  edit() {


  }

  /**
   * Saves the current token for future use. This is available to all users. Only GMs can do this.
   */
  save() {
    // const newToken = this.item.
  }
}
