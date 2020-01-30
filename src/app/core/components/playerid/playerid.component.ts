import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from '../../data.service';
import * as shortid from 'shortid'

@Component({
  selector: 'playerid',
  templateUrl: './playerid.component.html',
  styleUrls: ['./playerid.component.css']
})
export class PlayeridComponent implements OnInit {
  @Input() showSignOut = false
  @Input() playerid = "UNSET"
  @Output() onUpdate = new EventEmitter<string>()
  editting = false
  error: string
  constructor(private data : DataService) { 
    data.playerId$.subscribe(player => {
      this.playerid = player
    })
  }
  
  ngOnInit() {
  }

  signout() {
    this.data.signout();
  }

  copy() {
    navigator.clipboard.writeText(this.playerid);
  }

  edit() {
    this.editting = true
  }

  commit() {
    // Validates 
    this.editting = false
    let valid = shortid.isValid(this.playerid) && this.playerid.length == 8
    if (!valid) {
      this.error = "Invalid Id Format"
    } else {
      this.onUpdate.emit(this.playerid)
    }
  }

  generate() {
    this.playerid = shortid.generate()
    // this.data.setPlayerId(this.playerid)
    this.onUpdate.emit(this.playerid)
  }

  canceEdit() {
    this.editting = false
  }
}
