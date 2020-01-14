import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { DbWatcher } from 'src/app/core/database-manager';
import { ChatRecord, RouteContext, TextMessage, PingMessage, DiceRoll } from 'src/app/core/model';
import { DataService } from 'src/app/core/data.service';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'chat-preview',
  templateUrl: './chat-preview.component.html',
  styleUrls: ['./chat-preview.component.css']
})
export class ChatPreviewComponent implements OnInit {
  chatTextSize = 'preview'
  large = false

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

            if (d.record.messageType == DiceRoll.MSG_TYPE) {
              console.log("MY DIEC ROLL", (<DiceRoll>d.record).getTotal())
            }
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

  @HostListener('window:resize', ['$event'])
  onResize(event) {
    if (event.target.innerWidth < 600) {
      this.chatTextSize = 'preview'
    } else {
      this.chatTextSize = 'normal'
    }
  }

  
  isText(m : any) {
    return m.messageType == TextMessage.MSG_TYPE
  }

  isRoll(m : any) {
    return m.messageType == DiceRoll.MSG_TYPE
  }

  isPing(m : any) {
    return m.messageType == PingMessage.MSG_TYPE
  }

  dblClick() {

  }


  diceRolled(roll: DiceRoll) {

  }
  

  getTotal(item : DiceRoll) {
    if (!item || !item.getTotal) {
      return "IDK"
    }

    return item.getTotal()
  }

}
