import { Component, OnInit, Input } from '@angular/core';
import { TextMessage,  PingMessage, ChatRecord, DiceRoll, MeasureMessage } from 'src/app/core/model';
import * as moment from 'moment'

@Component({
  selector: 'message',
  templateUrl: './message.component.html',
  styleUrls: ['./message.component.css']
})
export class MessageComponent implements OnInit {
  @Input() odd = true
  @Input() record : ChatRecord<any>

  constructor() {
    
   }

  ngOnInit() {
  }

  timeFormat() {
    const diffMs = (new Date().getTime() - this.record.lastUpdate) / 1000
    return moment(this.record.lastUpdate).fromNow()
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

  isMeasureMessage() {
    return this.record.record.messageType == MeasureMessage.MSG_TYPE
  }
}
