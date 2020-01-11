import { Component, OnInit } from '@angular/core';
import { Game, ObjectType, PlayerRole } from '../../model';
import { DataService } from '../../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-games-page',
  templateUrl: './games-page.component.html',
  styleUrls: ['./games-page.component.css']
})
export class GamesPageComponent implements OnInit {

  constructor(private data: DataService, private router: Router) { }
  games: Game[] = []
  feed : PouchDB.LiveFind.LiveFeed<Game>

  ngOnInit() {
    // this.data.games$.subscribe(games => {
    //   this.games = games
    // })
    this.data.playerId$.subscribe( pid => {
      this.live(pid)
    })
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

  openGame(game: Game) {
    this.router.navigate(['games', game._id])
  }

  live(playerid: string) {
    console.log(playerid)
    let db = this.data.coreDB.localdb

    // Create the index (push this up!)
    db.createIndex({
      index: { fields: ['type'] }
    })

    // Looks for all the gams that the player is either a GM or a player
    this.feed = db.liveFind({
      selector : {
          $and :[
            {type: { $eq : Game.TYPE}},
            {players : {
              $elemMatch : {
                _id: playerid
              }
            }}
          ]
      },
      aggregate: true

    })


    this.feed.on('update', (update, aggregate) => {
      // update.action is 'ADD', 'UPDATE', or 'REMOVE'
      // update also contains id, rev, and doc
      console.log(update.action, update.id);

      if (update.action == 'ADD') {
        console.log("Adding a Game ", update.doc);
        let a = new Game().copyFrom(update.doc)
        this.games.push(a)
        // this.sort()
      }
    })
  }
}