import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/core/data.service';
import { Annotation, ObjectType } from 'src/app/core/model';

@Component({
  selector: 'fav-tool',
  templateUrl: './fav-tool.component.html',
  styleUrls: ['./fav-tool.component.css']
})
export class FavToolComponent implements OnInit {
  @Input() item : Annotation
  @Output() onUpdate = new EventEmitter<Annotation>()
  @Output() onDelete = new EventEmitter<boolean>()

  constructor(private data : DataService) { }

  ngOnInit() {
  }
  
  isFavorite() {
    return false;
  }

  isRestricted() {
    return false
  }

  showFavorite() {
    // Make this a game favorite, Take a copy of this and save it with my person
    // const copy = {}
    // this.item.copyTo(copy)

    // this.data.coreDB.store(<ObjectType>copy)

  }

  showRestrict() {

  }
  
  delete() {
    this.data.delete(this.item)
    this.onDelete.emit(true)
  }
}
