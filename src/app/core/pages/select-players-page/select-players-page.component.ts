import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { Player, PlayerRec } from '../../model';
import { DataService } from '../../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { LangUtil } from '../../util/LangUtil';

@Component({
  selector: 'select-players-page',
  templateUrl: './select-players-page.component.html',
  styleUrls: ['./select-players-page.component.css']
})
export class SelectPlayersPageComponent implements OnInit {
  title = "Select Players"
  
  players : PlayerRec[] = []
  @Input() multiple = true
  @Input() selection  : PlayerRec[] = []
  @Output() selected = new EventEmitter<PlayerRec[]>()
  @Output() canceled = new EventEmitter<boolean>()

  constructor(private data : DataService, private router: Router, private route : ActivatedRoute) { }

  ngOnInit() {
    this.getPlayerNames()
  }

  getPlayerNames() {
    this.data.coreDB.localdb.find({
      selector: { type : Player.TYPE},
      fields : ["_id", "displayName"]
    }).then( results => {
      let p : {_id : string, displayName: string}[] = []
      results.docs.forEach( doc => {
        p.push({_id : doc._id, displayName: doc['displayName']})
      })
      p.sort((a,b) => {
        return LangUtil.compareStrings(a.displayName, b.displayName)
      })
      this.players = p
    })
  }

  clear() {
    this.players.forEach(p => p.selected = false)
  }

  cancel() {
    this.canceled.emit(true)
  }

  done() {
    let sel = this.players.filter( p => p.selected)
    this.selected.emit(sel)
  }

  toggle(item: PlayerRec, $event ) {
    item.selected = !item.selected
    
    let cnt = this.players.map(p => p.selected?<number>1:<number>0).reduce( (total, num) => total + num);

    if (cnt == 0) {
      this.title = "Select Players"
    } else {
      this.title = cnt + " Selected"
    }
  }


}
