import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from '@angular/core';
import { LivePageComponent } from '../../pages/live-page/live-page.component';
import { TokenAnnotation, Annotation } from '../../model';
import { Encounter } from '../encounter';
import { mergeMap } from 'rxjs/operators';

@Component({
  selector: 'token-carousel',
  templateUrl: './token-carousel.component.html',
  styleUrls: ['./token-carousel.component.css']
})
export class TokenCarouselComponent implements OnInit {
  @ViewChild('scroller', {static : false}) scroller
  encounter : Encounter
  items : Item[] = []
  all : Item[] = []
  selected

  constructor(private session : LivePageComponent) { 

  }

  get currentTurn() {
    if (this.encounter) {
      return this.encounter.turn.annoationId
    }
    return undefined
  }

  scrollTo(item : Annotation) {
    if (this.scroller && item && item._id) {
      const el =  document.getElementById(item._id)
      if (el) {
        el.scrollIntoView()
      }
    }
  }

  isSelected(item : Item) : boolean {
    if (this.selected && item.token._id === this.selected._id) {
      return true
    }
    return false
  }

  scroll(event ) {
    let element = this.scroller.nativeElement
    let distance = event.wheelDelta
    element.scrollBy({left: distance})
  }

  select(item : Item) {
    this.session.mapview.center(item.token.x, item.token.y)
    this.session.layerMgr.select(item.token)
  }

  ngOnInit() {
    this.session.encounter$.subscribe( enc => {
      this.encounter = enc
      this.filter()
    })
    this.session.layerMgr.selection$.subscribe( item => {
      this.selected = item
      this.scrollTo(item)
    })

    this.session.mapId$.pipe( mergeMap( mapId => this.session.gameMgr.getAnnotations$(mapId))).subscribe( a => {
      if (TokenAnnotation.is(a)) {
        const item = new Item(a)
        let indx = this.all.findIndex(aa => aa.token._id == a._id)
        if (indx >=0) {
          this.all[indx] = item
        } else {
          this.all.push(item)
        }
        this.filter()
      }
    })

    this.session.gameMgr.annotation_rem$.subscribe( a =>{
      let indx = this.all.findIndex(aa => aa.token._id == a._id)
      if (indx >=0) {
        this.all.splice(indx, 1)
        this.filter()
      }
    })
  }

  filter() {
    if (this.encounter) {
      this.items = this.all.filter(item => {
        let match = this.encounter.items.find( eItem => eItem.annoationId == item.token._id)
        if (match) {
          item.initative = match.initiative
          return true
        }
        return false
      })
      this.items.sort( (a,b) => b.initative - a.initative)
    } else {
      this.items = this.all.filter( item => item.token.layer === 'player' || this.session.isGM())
    }
  }
}
class Item  {
  token : TokenAnnotation
  selected = false
  initative = 0
  constructor(token : TokenAnnotation) {
    this.token = token;
  }

  get url() : string {
    if (this.token.url) {
      return this.token.url
    } else {
      return '/assets/sprites/sample-token.png'
    }
    return this.token.url
  }
}
