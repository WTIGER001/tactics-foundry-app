import { Component, OnInit } from '@angular/core';
import { LivePageComponent } from '../../pages/live-page/live-page.component';
import { Encounter } from '../encounter';

@Component({
  selector: 'round-counter',
  templateUrl: './round-counter.component.html',
  styleUrls: ['./round-counter.component.css']
})
export class RoundCounterComponent implements OnInit {
  encounter : Encounter

  constructor(private session : LivePageComponent) { }

  ngOnInit() {
    this.session.encounter$.subscribe( enc => {
      this.encounter = enc
    })
  }
  
}
