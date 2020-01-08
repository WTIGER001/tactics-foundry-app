import { Component, OnInit, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {
  @Input() showTitle = true
  @Input() showBack = true
  @Input() showTop = true
  @Input() title = "Title"
  @Input() backLink = "Title"
  constructor(private router : Router) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([this.backLink])
  }

}
