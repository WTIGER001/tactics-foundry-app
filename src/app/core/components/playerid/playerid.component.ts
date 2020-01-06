import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'playerid',
  templateUrl: './playerid.component.html',
  styleUrls: ['./playerid.component.css']
})
export class PlayeridComponent implements OnInit {
  playerid = "UNSET"
  constructor(data : DataService) { 
    data.playerId$.subscribe(player => {
      this.playerid = player
    })
  }
  
  ngOnInit() {
  }

}
