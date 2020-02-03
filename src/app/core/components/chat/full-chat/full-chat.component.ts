import { Component, OnInit, NgZone, ViewChild, HostListener } from '@angular/core';
import { DataService } from 'src/app/core/data.service';
import { ActivatedRoute } from '@angular/router';
import { DbWatcher, DatabaseManager } from 'src/app/core/database-manager';
import { RouteContext, DiceRoll, ChatRecord, PingMessage, } from 'src/app/core/model';
import { DiceCanvasComponent } from '../dice-canvas/dice-canvas.component';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'full-chat',
  templateUrl: './full-chat.component.html',
  styleUrls: ['./full-chat.component.css']
})
export class FullChatComponent implements OnInit {
  @ViewChild('dice', { static: true }) dice: DiceCanvasComponent

  gameid
  watcher: DbWatcher
  messages: ChatRecord<any>[] = []
  showroller

  constructor(private data: DataService, private route: ActivatedRoute, private zone: NgZone, private session: LivePageComponent) { }

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      this.gameid = data.ctx.id
      if (this.gameid) {
        this.data.createDbIfNeeded(this.gameid).subscribe(db => {
          // console.log("Watching for chat messages")
          this.watcher = db.watchType(ChatRecord.TYPE, this.zone)
          this.watcher.onAdd(doc => {
            let d = ChatRecord.to(doc)
            // console.log("New Chat MEssage: ", doc, d, d.displayName, d.lastUpdate)
            // this.messages.push(ChatRecord.to(doc))
            const record = ChatRecord.to(doc)
            this.messages.unshift(record)
            this.sort()

            if (PingMessage.is(record.record)) {
              if (new Date().getTime() - record.lastUpdate < 10000) {
                this.session.layerMgr.flagPlugin.fromMessage(record)
              }
            }
          })
          this.watcher.onUpdate(doc => {
            // let indx = this.messages.findIndex(m => doc._id === m._id)
            // if (indx >= 0) {
            //   this.messages[indx] = ChatRecord.to(doc)
            // }
          })
          this.watcher.onRemove(doc => {
            // let indx = this.messages.findIndex(m => doc._id === m._id)
            // if (indx >= 0) {
            //   this.messages.splice(indx, 1)
            // }
          })
          this.watcher.start()
        })
      }
    })

  }

  dblClick(message) {

  }

  sort() {
    this.messages.sort((a, b) => b.lastUpdate - a.lastUpdate)
  }

  diceRolled(roll: DiceRoll) {
    // SEND MESSAGE
    // let msg = new DiceRoll()
    // msg.dice = roll

  }

  diceDialogComplete($event) {

  }

}
