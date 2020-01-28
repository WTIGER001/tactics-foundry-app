import { Component, OnInit, Input } from '@angular/core';
import { AbilityScore } from '../../character';

@Component({
  selector: 'ability-score',
  templateUrl: './ability-score.component.html',
  styleUrls: ['./ability-score.component.css']
})
export class AbilityScoreComponent implements OnInit {
  @Input() score : AbilityScore
  constructor() { }

  ngOnInit() {
  }

  setScore(newScore : string) {
    this.score.score = parseInt(newScore)
  }

  setAdjustment(newAdjustment : string) {
    this.score.tempAdjustment = parseInt(newAdjustment)
  }
}
