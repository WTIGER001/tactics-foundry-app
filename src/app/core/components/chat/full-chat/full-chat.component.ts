import { Component, OnInit, NgZone, ViewChild, HostListener } from '@angular/core';
import { DataService } from 'src/app/core/data.service';
import { ActivatedRoute } from '@angular/router';
import { DbWatcher, DatabaseManager } from 'src/app/core/database-manager';
import {  RouteContext, DiceRoll, ChatRecord, } from 'src/app/core/model';
import { DiceCanvasComponent } from '../dice-canvas/dice-canvas.component';

@Component({
  selector: 'full-chat',
  templateUrl: './full-chat.component.html',
  styleUrls: ['./full-chat.component.css']
})
export class FullChatComponent implements OnInit {
  @ViewChild('dice', {static: true}) dice: DiceCanvasComponent

  gameid
  watcher : DbWatcher
  messages : ChatRecord[] = []

  constructor(private data : DataService, private route : ActivatedRoute, private zone : NgZone) { }

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
            this.messages.unshift(ChatRecord.to(doc))
            // this.sort()
          })
          this.watcher.onUpdate(doc => {
            // let indx = this.messages.findIndex(m => doc._id === m._id)
            // if (indx >= 0) {
            //   this.messages[indx] = ChatRecord.to(doc)
            // }
          })
          this.watcher.onRemove( doc => {
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

  sort(){

  }

  diceRolled(roll : DiceRoll) {
    // SEND MESSAGE
    // let msg = new DiceRoll()
    // msg.dice = roll

  }


}
