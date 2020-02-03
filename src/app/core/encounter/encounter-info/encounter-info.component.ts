import { Component, OnInit } from '@angular/core';
import { Encounter } from '../encounter';
import { LivePageComponent } from '../../pages/live-page/live-page.component';
import { TokenAnnotation } from '../../model';

@Component({
  selector: 'encounter-info',
  templateUrl: './encounter-info.component.html',
  styleUrls: ['./encounter-info.component.css']
})
export class EncounterInfoComponent implements OnInit {
  encounter: Encounter
  whoseTurn: string = 'I dont know'
  myTurn: string = "never"
  constructor(private session: LivePageComponent) { }

  ngOnInit() {
    this.session.encounter$.subscribe(enc => {
      this.encounter = enc
      this.calculate()
    })

    this.session.annotation_add$.subscribe( a => this.calculate())
    this.session.annotation_update$.subscribe( a => this.calculate())
  }

  calculate() {
    if (this.encounter) {
      this.whoseTurn = "Not sure"
      this.myTurn = "never"
      if (this.encounter.turn) {
        const token = this.session.layerMgr.modelIdMap.get(this.encounter.turn.annoationId)
        if (token) {
          this.whoseTurn = token.name + "'s Turn"
        }
      }

      const myTurn = this.whenIsMyTurn()
      if (myTurn == 1) {
        this.myTurn = "Your up in 1 turn"
      } else if (myTurn == 0) {
        this.myTurn = "It is your turn!"
      } else if (myTurn > 1) {
        this.myTurn = `Your up in ${myTurn} turns`
      } else {
        this.myTurn = "Never"
      }
    } else {
      this.myTurn = "Never"
      this.whoseTurn = "No Encounter"
    }
  }

  public whenIsMyTurn(): number {
    // Get the player
    const playerId = this.session.data.player._id
    let turnIndex = -1
    if (this.encounter.turn) {
      turnIndex = this.encounter.items.findIndex(i => i.annoationId == this.encounter.turn.annoationId)
    }

    let distance = []
    this.encounter.items.forEach((item, index) => {
      const annotation = this.session.layerMgr.modelIdMap.get(item.annoationId)
      if (annotation && annotation.owner == playerId) {
        if (index >= turnIndex) {
          distance.push(index - turnIndex)
        } else {
          distance.push(this.encounter.items.length - turnIndex + index)
        }
      }
    })

    distance.sort()
    if (distance.length > 0) {
      return distance[0]
    }

    return -1
  }

  isMyTurn() : boolean {
    const playerId = this.session.data.player._id
    let myTurn  = false
    if (this.encounter.turn) {
      const annotation = this.session.layerMgr.modelIdMap.get(this.encounter.turn.annoationId)
      if (annotation) {
        myTurn = annotation.owner === playerId
      }
    }
    return this.session.isGM() || myTurn
  }

  nextTurn() {
    if (this.isMyTurn() ) {
      this.encounter.nextTurn()
      this.session.data.store(this.encounter)
    }
  }


}
