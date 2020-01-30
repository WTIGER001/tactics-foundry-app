import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { generate, isValid} from 'shortid'
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  displayName : string
  playerid : string
  editting = false
  error : string
  gameToJoin : string

  constructor(private data : DataService, private route : ActivatedRoute) { 
    this.playerid = generate()
  }

  async ngOnInit() {
    // screen.orientation.lock('portrait')
    try {
      await screen.orientation.lock("portrait");
      console.log("Locked to Portrait")
    } catch (err) {
    }

    this.route.queryParamMap.subscribe( m=> {
      if (m.has("gameToJoin")) {
         this.gameToJoin = m.get("gameToJoin")
      }
    })
  }

  submit() {
    console.log("Creating Player: ", this.displayName);
  
    if (!this.displayName) {
      // BAD
    } else {
      this.data.createPlayer(this.displayName)

      if (this.gameToJoin) {
        /// try to join the game
        this.data.join(this.gameToJoin).subscribe( () => {
          
        })
      }
    }
  }

  updatePlayerId(newPlayerId :string) {
    this.playerid = this.playerid
  }

  edit() {
    this.editting = true
  }

  paste() {
    navigator.clipboard.readText().then( text => {
      let valid = isValid(text) && text.length == 8
      if (!valid) {
        this.error = "Invalid Id Format Pasted"
      } else {
        this.playerid = text
        this.error = undefined
      }
    })
  }

  commit() {
    // Validates 
    this.editting = false
    let valid = isValid(this.playerid) && this.playerid.length == 8
    if (!valid) {
      this.error = "Invalid Id Format"
    } else {
      this.error = undefined
    }
  }

  generate() {
    this.playerid = generate()
    this.error = undefined
  }

  canceEdit() {
    this.editting = false
  }
}
