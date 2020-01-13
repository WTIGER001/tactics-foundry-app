import { Component, OnInit, Input } from '@angular/core';
import { TextMessage,  PingMessage, ChatRecord, DiceRoll } from 'src/app/core/model';

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() odd = true
  @Input() record : ChatRecord 

  constructor() { }

  ngOnInit() {
  }


  isTextMessage() {
    return this.record.record.messageType == TextMessage.MSG_TYPE
  }

  isRollMessage() {
    return this.record.record.messageType == DiceRoll.MSG_TYPE
  }

  isPingMessage() {
    return this.record.record.messageType == PingMessage.MSG_TYPE
  }
}
