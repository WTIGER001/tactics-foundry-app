import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'playerid',
  templateUrl: './playerid.component.html',
  styleUrls: ['./playerid.component.css']
})
export class PlayeridComponent implements OnInit {
  @Input() showSignOut = false
  playerid = "UNSET"
  constructor(private data : DataService) { 
    data.playerId$.subscribe(player => {
      this.playerid = player
    })
  }
  
  ngOnInit() {
  }

  signout() {
    this.data.signout();;
  }

  copy() {
    
    navigator.clipboard.writeText(this.playerid);
    console.log("TEXT COPPIED")
  }

  edit() {

  }
}
