import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Game, ObjectType, PlayerRole } from '../../model';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';
import { DbWatcher } from '../../database-manager';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.css']
})
export class GamesPageComponent implements OnInit, OnDestroy {

  constructor(private data: DataService, private router: Router, private zone : NgZone) { }
  games: Game[] = []
  // feed : PouchDB.LiveFind.LiveFeed<Game>
  watcher : DbWatcher

  ngOnInit() {
    // this.data.games$.subscribe(games => {
    //   this.games = games
    // })
    this.data.player$.subscribe( pid => {
      this.live(pid._id)
    })
  }

  ngOnDestroy() {
    // if (this.feed) {
    //   this.feed.cancel()
    // }

    if (this.watcher) { this.watcher.cancel()}
  }

  newGame() {
    // Generate a new ID
    let game = new Game()

    game.name = "New Game (Please Change)" 
    let gm : PlayerRole = {
      _id :  this.data.playerId$.getValue(),
      displayName : this.data.player.displayName, 
      role : 'GM'
    }
    game.players.push(gm)
    
    this.data.store(game).subscribe(() => {
      this.router.navigate(['/games', game._id])
    })
  }

  openGame(game: Game, $event) {
    if ($event && $event.ctrlKey) {
      this.router.navigate(['games', game._id])
    } else {
      this.router.navigate(['games', game._id, 'live'])
    }
  }
  
  onLongPress(game : Game) {
    console.log("LONG PRESS", game)
    this.router.navigate(['games', game._id])
  }

  onLongPressing() {
    console.log("LONG PRESSING")
  }

  onLongPressEnd() {
    console.log("LONG PRESS END")
  }

  live(playerid: string) {
    // THIS DOESNT WORK... SEEMS TO BE A BUG IN POUCHDB
    // let selector = {
    //     "players": {
    //       "$elemMatch": {
    //          "_id": playerid
    //       }
    //    }
    // }

    this.watcher = this.data.coreDB.watchType(Game.TYPE, this.zone)
    this.watcher.filter( item => item.players.findIndex((p : PlayerRole) => p._id == playerid) >= 0)
    this.watcher.onAdd( item =>  this.games.push(Game.to(item)))
    this.watcher.onUpdate( item => {
      let indx = this.games.findIndex( game => game._id === item._id)
      if (indx >=0 ) {
        this.games[indx] = Game.to(item)
      }
      // let newGames= [...this.games]
      // this.games = newGames;
    })
    this.watcher.onRemove(item => {
      let indx = this.games.findIndex( game => game._id === item._id)
        if (indx >=0 ) {
          this.games.splice(indx, 1)
        }
    })
    this.watcher.start()
  }
}