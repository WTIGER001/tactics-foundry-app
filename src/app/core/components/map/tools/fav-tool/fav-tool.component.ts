import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/core/data.service';
import { Annotation, ObjectType, CircleAnnotation, FavoriteAnnotation } from 'src/app/core/model';
import { generate } from 'shortid'
import { IdUtil } from 'src/app/core/util/IdUtil';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'fav-tool',
  templateUrl: './fav-tool.component.html',
  styleUrls: ['./fav-tool.component.css']
})
export class FavToolComponent implements OnInit {
  @Input() item : Annotation
  @Output() onUpdate = new EventEmitter<Annotation>()
  @Output() onDelete = new EventEmitter<boolean>()

  constructor(private data : DataService, private session : LivePageComponent) { }

  ngOnInit() {
  }
  
  isFavorite() {
    return false;
  }

  isRestricted() {
    return false
  }

  saveFavorite() {
    let copy : Annotation = Annotation.to(this.item)
    const fav = new FavoriteAnnotation()
    fav.annotation = copy
    fav.sourceDB = copy.sourceDB
    fav.owner = this.data.player._id

    this.data.store(fav)
  }

  showRestrict() {

  }
  
  delete() {
    this.data.delete(this.item)
    this.onDelete.emit(true)
  }
}
