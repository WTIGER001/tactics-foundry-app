import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'playerid',
  templateUrl: './playerid.component.html',
  styleUrls: ['./playerid.component.css']
})
export class PlayeridComponent implements OnInit {
  playerid = "2134-4567-123nd-dff"
  constructor() { }

  ngOnInit() {
  }

}
