import { Component, OnInit, HostListener, NgZone } from '@angular/core';
import { DbWatcher } from 'src/app/core/database-manager';
import { ChatRecord, RouteContext, TextMessage, PingMessage, DiceRoll, MeasureMessage } from 'src/app/core/model';
import { DataService } from 'src/app/core/data.service';
import { ActivatedRoute } from '@angular/router';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

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
  messages : ChatRecord<any>[] = []
  showroller = false

  constructor(private data : DataService, private route : ActivatedRoute, private zone : NgZone, private session : LivePageComponent) { }
  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      this.gameid = data.ctx.id
      if (this.gameid) {
        this.data.createDbIfNeeded(this.gameid).subscribe(db => {
          // console.log("Watching for chat messages")
          this.watcher = db.watchType(ChatRecord.TYPE, this.zone)
          this.watcher.onAdd(doc => {
            let d = ChatRecord.to(doc)
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
  
  isMeasure(m : any) {
    return m.messageType == MeasureMessage.MSG_TYPE
  }

  dblClick() {

  }

  toggleSize() {
    this.large = !this.large
    if (this.large) {
      document.documentElement.style.setProperty("--chat-preview-height", '50vh')
    } else {
      document.documentElement.style.setProperty("--chat-preview-height", '120px')
    }
  }


  diceRolled(roll: DiceRoll) {

  }

  toggleRoller() {
    this.showroller = !this.showroller
    this.session.showToolbar = !this.showroller
  }
  

  getTotal(item : DiceRoll) {
    if (!item || !item.getTotal) {
      return "IDK"
    }

    return item.getTotal()
  }

}
