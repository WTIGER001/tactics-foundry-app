import { Component, OnInit, ViewChild, AfterViewInit, ViewChildren } from '@angular/core';
import { LivePageComponent } from '../../pages/live-page/live-page.component';
import { TokenAnnotation, Annotation } from '../../model';
import { Encounter } from '../encounter';

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
  currentTurn
  selected

  constructor(private session : LivePageComponent) { 

  }

  scrollTo(item : Annotation) {
    if (this.scroller && item && item._id) {
      const el =  document.getElementById(item._id)
      el.scrollIntoView()
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
    this.session.layerMgr.selection$.next(item.token)
    this.currentTurn = item
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
    this.session.annotation_add$.subscribe( a => {
      if (TokenAnnotation.is(a)) {
        const item = new Item(a)
        this.all.push(item)
        this.filter()
      }
    })
    this.session.annotation_remove$.subscribe( a=> {
      if (TokenAnnotation.is(a)) {
        let indx = this.all.findIndex(aa => aa.token._id == a._id)
        if (indx >=0) {
          this.all[indx] = new Item(a)
          this.filter()
        }
      }
    })
    this.session.annotation_update$.subscribe( a =>{
      let indx = this.all.findIndex(aa => aa.token._id == a._id)
      if (indx >=0) {
        this.all.splice(indx, 1)
        this.filter()
      }
    })
    this.session.layerMgr.modelMap.forEach( (v, a) => {
      if (TokenAnnotation.is(a)) {
        const item = new Item(a)
        this.all.push(item)
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
      this.items = [...this.all]
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
