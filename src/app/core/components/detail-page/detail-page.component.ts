import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
  @Input() editTitle = false
  @Output() titleUpdated = new EventEmitter<string>()
  constructor(private router : Router) { }

  ngOnInit() {
  }

  onBack() {
    this.router.navigate([this.backLink])
  }

  updateTitle() {
    this.titleUpdated.emit(this.title)
  }
}
