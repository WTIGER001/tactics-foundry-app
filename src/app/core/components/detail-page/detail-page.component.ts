import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {
  @Input() showHeader = true
  @Input() showTop = true
  @Input() title = "Title"
  constructor() { }

  ngOnInit() {
  }

}
