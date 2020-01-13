import { Component, OnInit, Input } from '@angular/core';
import { PingMessage } from 'src/app/core/model';

@Component({
  selector: 'ping-message',
  templateUrl: './ping-message.component.html',
  styleUrls: ['./ping-message.component.css']
})
export class PingMessageComponent implements OnInit {
  @Input() message :  PingMessage

  constructor() { }

  ngOnInit() {
  }

}
