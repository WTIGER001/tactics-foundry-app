import { Component, OnInit, Input } from '@angular/core';
import { Character, Skill } from '../../character';

@Component({
  selector: 'skill',
  templateUrl: './skill.component.html',
  styleUrls: ['./skill.component.css']
})
export class SkillComponent implements OnInit {

 @Input() item : Skill
 @Input() chr : Character
  constructor() { }

  ngOnInit() {
  }

}
