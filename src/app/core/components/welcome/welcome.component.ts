import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
  selector: 'welcome',
  templateUrl: './welcome.component.html',
  styleUrls: ['./welcome.component.css']
})
export class WelcomeComponent implements OnInit {
  displayName : string

  constructor(private data : DataService) { }

  async ngOnInit() {
    // screen.orientation.lock('portrait')
    try {
      await screen.orientation.lock("portrait");
      console.log("Locked to Portrait")
    } catch (err) {
    }
  }

  submit() {
    console.log("Creating Player: ", this.displayName);
    
    if (!this.displayName) {
      // BAD
    } else {
      this.data.createPlayer(this.displayName)
    }
  }
}
