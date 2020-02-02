import { Component, OnInit, Input } from '@angular/core';
import { PingMessage, ChatRecord } from 'src/app/core/model';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'ping-message',
  templateUrl: './ping-message.component.html',
  styleUrls: ['./ping-message.component.css']
})
export class PingMessageComponent implements OnInit {
  @Input() record :  ChatRecord<PingMessage>

  constructor(private session: LivePageComponent) { }

  ngOnInit() {
  }

  open() {
    this.session.layerMgr.flagPlugin.fromMessage(this.record)
    this.session.mapview.center(this.record.record.x, this.record.record.y)
  }
}
