import { Component, OnInit, Input } from '@angular/core';
import { Weapon, Character } from '../../character';

@Component({
  selector: 'weapon',
  templateUrl: './weapon.component.html',
  styleUrls: ['./weapon.component.css']
})
export class WeaponComponent implements OnInit {

  @Input() item : Weapon
  @Input() chr : Character
   constructor() { }
 
   ngOnInit() {
   }
 
 }
 