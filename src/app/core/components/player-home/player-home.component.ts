import { Component, OnInit, ɵPlayer } from '@angular/core';
import { DataService } from '../../data.service';
import { Observable } from 'rxjs';
import { Player } from '../../model';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-player-home',
  templateUrl: './player-home.component.html',
  styleUrls: ['./player-home.component.css']
})
export class PlayerHomeComponent implements OnInit {
  nameControl = new FormControl();

  player : Player
  displayname : string = ""
  newuser: boolean = true
  editingName = false

  constructor(private data : DataService) {
    this.newuser = this.data.newUser
    this.data.player$.subscribe( p => {
      console.log("Recieved New Player Object", p)
      this.player = p
      this.newuser = false
      this.displayname  = p.displayName
      this.nameControl.setValue(p.displayName)
    })
   }

  ngOnInit() {
  }


  editName() {
    if (this.editingName) {
      this.cancelEdit()
    } else {
      this.editingName = true
    }
  }

  saveName($event) {
    console.log("SAVING NAME ",  $event);
    this.editingName = false
    this.player.displayName = this.displayname
    this.data.store(this.player)
  }

  cancelEdit() {
    this.editingName = false
    this.displayname = this.player.displayName
  }

}
