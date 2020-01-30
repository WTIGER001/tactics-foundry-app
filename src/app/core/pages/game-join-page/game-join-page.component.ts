import { Component, OnInit, NgZone } from '@angular/core';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { Game, Player } from '../../model';
import { tap, filter, first, mergeMap } from 'rxjs/operators';

@Component({
  selector: 'game-join-page',
  templateUrl: './game-join-page.component.html',
  styleUrls: ['./game-join-page.component.css']
})
export class GameJoinPageComponent implements OnInit {
  gameId : string
  error : string
  qrcodefile 
  player: Player
  constructor(private data : DataService, private route: ActivatedRoute, private router : Router, private zone : NgZone) { }

  ngOnInit() {
    this.route.queryParamMap.subscribe( map =>{
      this.gameId = map.get("id")
    })
    this.data.player$.subscribe( p => this.player = p)
  }

  paste() {
    navigator.clipboard.readText().then( text => {
      this.zone.run( () => {
        this.gameId = text
      })
    });
  }

  scanImage(file : File) {
    // this.qrcodefile = file

    const reader = new FileReader();
    reader.onload = () => {
      this.qrcodefile = reader.result
    };
    reader.readAsDataURL(file);
  }

  done(result :any) {
    let indx = result.result.indexOf("id=")
    if (indx > 0) {
      this.gameId = result.result.substring(indx+3)
    }
  }

  submit() {
    this.error = undefined
    // Look for game
    this.data.coreDB.findId(this.gameId).pipe(
      first(),
      filter( res => {
        if (res.docs && res.docs.length == 1) {
          let game = Game.to(res.docs[0])
          let found = game.players.find( p => p._id == this.player._id) 
          if (found) {
            this.error = "You are already a player in this game!"
            return false
          } else {
            return true
          }
        } else {
          this.error = "Game Not Found!"
          return false
        }
      }), 
      mergeMap( res => {
        let game = Game.to(res.docs[0])
        game.players.push({_id : this.player._id, role:'Player', displayName: this.player.displayName})
        return this.data.store(game)
      })
    ).subscribe( save => {
      this.router.navigate(["/games", this.gameId])
    })
  }
}
