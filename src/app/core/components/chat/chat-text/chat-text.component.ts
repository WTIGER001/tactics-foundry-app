import { Component, OnInit, NgZone, ViewChild, Input, Output, EventEmitter } from '@angular/core';
import { DataService } from 'src/app/core/data.service';
import { ActivatedRoute } from '@angular/router';
import { DiceCanvasComponent } from '../dice-canvas/dice-canvas.component';
import { DiceRoller } from 'src/app/core/util/dice';
import { ChatRecord, TextMessage, PingMessage, DiceRoll, RouteContext } from 'src/app/core/model';

@Component({
  selector: 'chat-text',
  templateUrl: './chat-text.component.html',
  styleUrls: ['./chat-text.component.css']
})
export class ChatTextComponent implements OnInit {
  @ViewChild('actionBox', {static: true}) actionbox: any
  @Input() dice: DiceCanvasComponent
  @Input() size : 'normal' | 'preview' = 'normal'
  @Output() toggleDiceDialog = new EventEmitter()

  commands = new Map<string, IChatCommand>()
  gameid : string
  action
  
  constructor(private data : DataService, private route : ActivatedRoute, private zone : NgZone) { }

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      this.gameid = data.ctx.id
    })

    

    this.dice.diceroll.subscribe( roll => {
      this.sendMessage(roll)
    })
  }

  public roll(exp : string) {
    this.dice.rollDice(exp)
  }


  enterAction(e: string) {
    if (e.toLowerCase().trim().startsWith("/")) {
      // let cmd = this.commands.get(e.toLowerCase())
      // if (cmd) {
      //   cmd.run(this)
      // } else {
      //   console.log("Unknown Command ", e.toLowerCase());
      // }
    } else if (this.dice.roller.isDiceExpression(e)) {
      this.dice.rollDice(e)
    } else {
      let t = new TextMessage()
      t.message = e
      this.sendMessage(t);
    }
    this.action = ""
  }

  private sendMessage(msg : DiceRoll | TextMessage | PingMessage) {
    let c =new ChatRecord()
    c.sourceDB = this.gameid
    // c.sourceDB = 'chat'
    c.record = msg
    c.displayName = this.data.player.displayName
    c.lastUpdate = new Date().valueOf()
    c.lastUpdatedBy = this.data.player._id;
    // let db = this.data.DBs.get('chat');
    // db.localdb.put(c);
    this.data.store(c)
  }

  send() {
    this.enterAction(this.action)
  }

  keyup() {

  }

  update(value : string) {

  }

  showRoller() {
    this.toggleDiceDialog.emit()
  }
}



interface IChatCommand {
  // cmd: string
  // help: string
  // run(chat: any)
}

