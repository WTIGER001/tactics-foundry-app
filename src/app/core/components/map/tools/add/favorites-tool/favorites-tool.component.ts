import { Component, OnInit, ViewChild } from '@angular/core';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { FavoriteAnnotation } from 'src/app/core/model';
import { filter } from 'rxjs/operators';
import { AnnotationPreviews } from '../../../map/annotation-previews';

@Component({
  selector: 'favorites-tool',
  templateUrl: './favorites-tool.component.html',
  styleUrls: ['./favorites-tool.component.css']
})
export class FavoritesToolComponent implements OnInit {
  @ViewChild('scroller', {static : false}) scroller
  preview = new AnnotationPreviews()
  items : Item[] = []
  constructor(private session : LivePageComponent) { }

  ngOnInit() {
    this.session.favorite_add$.pipe( 
      filter( f => f.owner == this.session.data.player._id)
    ).subscribe( f => {
      this.handleNew(f)
    })
    
    this.session.favorite_update$.pipe( 
      filter( f => f.owner == this.session.data.player._id)
    ).subscribe( f => {
      this.handleUpdate(f)
    })

    this.session.favorite_removed$.subscribe( f => {
      let indx = this.items.findIndex(item => item.fav._id === f._id )
      if (indx >=0 ) {
        this.items.splice(indx, 1)
      }
    })

  }

  handleNew(f : FavoriteAnnotation) {
    let url = this.preview.preview(f.annotation)
    if (!url) {
      url = '/assets/sprites/notfound.png'
    }
    this.items.push(new Item(url, f))
  }

  handleUpdate(f : FavoriteAnnotation) {
    let url = this.preview.preview(f.annotation)
    if (!url) {
      url = '/assets/sprites/notfound.png'
    }
    let item = new Item(url, f)
    let indx = this.items.findIndex(item => item.fav._id === f._id )
    if (indx >=0 ) {
      this.items[indx] = item
    } else {
      this.items.push(item)
    }
  }

  scroll(event ) {
    let element = this.scroller.nativeElement
    let distance = event.wheelDelta
    element.scrollBy({left: distance})
  }


}

class Item {
  constructor( public url : string, public fav : FavoriteAnnotation) {}
}