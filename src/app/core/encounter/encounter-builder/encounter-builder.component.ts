import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { LivePageComponent } from '../../pages/live-page/live-page.component';
import { Encounter, EncounterItem } from '../encounter';
import { TokenAnnotation } from '../../model';

@Component({
  selector: 'encounter-builder',
  templateUrl: './encounter-builder.component.html',
  styleUrls: ['./encounter-builder.component.css']
})
export class EncounterBuilderComponent implements OnInit {
  encounter : Encounter = new Encounter()
  all: EncounterItem[] = []
  addMissing = false
  @Output() onClose = new EventEmitter()

  constructor(private session : LivePageComponent) {

  }

  isChecked(item : EncounterItem) : boolean {
    let found = this.encounter.items.find( a => {
      return a.annoationId === item.annoationId
    })
    return !found
  }

  toggle(item : EncounterItem) {
    let indx = this.encounter.items.findIndex( a => {
      return a.annoationId === item.annoationId
    })
    if (indx >=0 ) {
      this.encounter.items.splice(indx, 1)
    } else {
      this.encounter.items.push(item)
    }
  }

  ngOnInit() {
    this.session.encounter$.subscribe( e => {
      if (e) {
        this.addMissing = false
        this.encounter = e
      } else {
        this.addMissing = true
        this.encounter = new Encounter()
      }
    })

    this.session.layerMgr.modelMap.forEach( (v, a) => {
      const item = new EncounterItem()
      if (TokenAnnotation.is(a)) {
        item.annoationId = a._id
        item.dead = false
        item.initiative = 0
        
        this.all.push(item)

        let indx = this.encounter.items.findIndex( a => a.annoationId == item.annoationId)
        if (indx >= 0) {
          item.initiative = this.encounter.items[indx].initiative
          item.dead = this.encounter.items[indx].dead
        } else if (this.addMissing) {
          this.encounter.items.push(item)
        }
        this.sort()

      }
    })
  }

  url(item : EncounterItem) {
    let token =  <TokenAnnotation>this.session.layerMgr.modelIdMap.get(item.annoationId)
    if (token && token.url) {
        return token.url
    } else {
      return '/assets/sprites/sample-token.png'
    }
  }

  name(item : EncounterItem) {
    let token =  <TokenAnnotation>this.session.layerMgr.modelIdMap.get(item.annoationId)
    return token?token.name:"WHAT!"
  }

  find(id : string) : TokenAnnotation {
    return <TokenAnnotation>this.session.layerMgr.modelIdMap.get(id)
  }

  sort() {
    this.encounter.items.sort((a, b) => b.initiative - a.initiative)
    this.all.sort((a, b) => b.initiative - a.initiative)
  }

  roundPlus() {
    this.encounter.nextRound()
  }

  roundMinus() {
    this.encounter.round -= 1
  }

  reset() {
    this.encounter.items = []
    this.encounter.round = 0
    this.encounter.turn = null
  }

  endEncounter() {
    this.encounter.active = false
    this.save()
  }

  close() {
    this.onClose.emit()
  }

  save() {
    // Provide the basic information
    this.sort()
    this.encounter.sourceDB  = this.session.game._id
    this.encounter.map = this.session.mapdata._id
    if (this.encounter.items.length > 0 && !this.encounter.turn) {
      this.encounter.turn = this.encounter.items[0]
    }
    
    // Store it in the database and then wait for the session to properly update
    this.session.data.store(this.encounter)
    this.onClose.emit()
  }
}
