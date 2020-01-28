import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'tactics-foundry-app';
  fw = false;
  imgLeft = '/assets/bg/2.png'
  imgRight = '/assets/bg/5.png'
  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    
  }

}
