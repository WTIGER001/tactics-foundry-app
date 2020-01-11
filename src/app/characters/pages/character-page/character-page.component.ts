import { Component, OnInit } from '@angular/core';
import { ObjectType } from 'src/app/core/model';
import { Route } from '@angular/router';

@Component({
  selector: 'app-character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css']
})
export class CharacterPageComponent implements OnInit {

  constructor(private route : Route) { }

  ngOnInit() {
  //  this.route.resolve()

  }

}
