import { Component, OnInit, Input } from '@angular/core';
import { Roll, Character } from '../../character';

@Component({
  selector: 'roll',
  templateUrl: './roll.component.html',
  styleUrls: ['./roll.component.css']
})
export class RollComponent implements OnInit {

  @Input() item : Roll
  @Input() chr : Character
   constructor() { }
 
   ngOnInit() {
   }
 
 }