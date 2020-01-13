import { Component, OnInit, Input } from '@angular/core';
import { TextMessage } from 'src/app/core/model';

@Component({
  selector: 'text-message',
  templateUrl: './text-message.component.html',
  styleUrls: ['./text-message.component.css']
})
export class TextMessageComponent implements OnInit {
  @Input() record :  TextMessage
  constructor() { }

  ngOnInit() {
  }

}
