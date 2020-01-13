import { Component, OnInit, HostListener } from '@angular/core';

@Component({
  selector: 'chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.css']
})
export class ChatPreviewComponent implements OnInit {
  chatTextSize = 'preview'
  constructor() { }

  ngOnInit() {
  }

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 600) {
      this.chatTextSize = 'preview'
    } else {
      this.chatTextSize = 'normal'
    }
  }
}
