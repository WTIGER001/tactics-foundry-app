import { Component, OnInit, Input } from '@angular/core';
import { MeasureMessage, ChatRecord } from 'src/app/core/model';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { MeasurePlugin } from '../../map/plugins/measure-plugin';

@Component({
  selector: 'measurement-message',
  templateUrl: './measurement-message.component.html',
  styleUrls: ['./measurement-message.component.css']
})
export class MeasurementMessageComponent implements OnInit {
  @Input() record :  ChatRecord<MeasureMessage>

  constructor(private session : LivePageComponent) {

   }

  ngOnInit() {
  }

  open() {
    const plugin = new MeasurePlugin(this.session.layerMgr)
    plugin.fromMessage(this.record)
  }

  fmt() {
    if (this.record && MeasureMessage.is(this.record.record)) {
      return this.record.record.total.toFixed(2) + " ft"
    }
    return "<BAD>"
  }

}
