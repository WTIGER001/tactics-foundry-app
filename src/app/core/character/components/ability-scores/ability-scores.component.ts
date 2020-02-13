import { Component, OnInit, Input } from '@angular/core';
import { Character } from '../../character';
import { Pathfinder } from 'src/app/core/model/pathfinder';

@Component({
  selector: 'ability-scores',
  templateUrl: './ability-scores.component.html',
  styleUrls: ['./ability-scores.component.css']
})
export class AbilityScoresComponent implements OnInit {
  
  @Input() item : Character
  constructor() { }

  ngOnInit() {
  }

  pointcost() {
    return Pathfinder.pointCost(...this.item.abilityScores)
  }

}
