import { Component, OnInit, ɵPlayer } from '@angular/core';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';
import { Player } from '../../model';

@Component({
  selector: 'app-player-home',
  templateUrl: './player-home.component.html',
  styleUrls: ['./player-home.component.css']
})
export class PlayerHomeComponent implements OnInit {
  player : Player
  displayname : string = ""
  newuser: boolean = true
  constructor(private data : DataService) {
    this.newuser = this.data.newUser
    this.data.player$.subscribe( p => {
      console.log("Recieved New Player Object", p)
      this.player = p
      this.newuser = false
      this.displayname  = p.displayName
    })
   }

  ngOnInit() {
  }

}
