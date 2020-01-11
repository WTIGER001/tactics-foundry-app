import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'detail-page',
  templateUrl: './detail-page.component.html',
  styleUrls: ['./detail-page.component.css']
})
export class DetailPageComponent implements OnInit {
  ctrl = false
  @Input() showTitle = true
  @Input() showBack = true
  @Input() showTop = true
  @Input() title = "Title"
  @Input() backLink
  @Input() editTitle = false
  @Output() titleUpdated = new EventEmitter<string>()
  @Output() back = new EventEmitter<boolean>()
  constructor(private router : Router) { }

  ngOnInit() {
  }

  onBack() {
  
    if (this.backLink) {
      this.router.navigate([this.backLink])
    } else if (this.backLink = "HISTORY.BACK") {
      window.history.back();
    } 
    this.back.emit(true)
  }

  updateTitle(newTitle : string) {
    this.titleUpdated.emit(newTitle)
  }
}
