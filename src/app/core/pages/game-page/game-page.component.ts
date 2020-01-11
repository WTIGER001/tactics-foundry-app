import { Component, OnInit } from '@angular/core';
import { Game, ObjectType, PlayerRec, PlayerRole } from '../../model';
import { DataService } from '../../data.service';
import { ActivatedRoute, Router } from '@angular/router';
import { ImageUtil } from '../../util/ImageUtil';

@Component({
  selector: 'app-game-page',
  templateUrl: './game-page.component.html',
  styleUrls: ['./game-page.component.css']
})
export class GamePageComponent implements OnInit {
  game : Game = new Game()
  tab: number = 0
  selecting = false;
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe((data: { asset: ObjectType }) => {
      this.game = Game.to(<Game>data.asset)
    })
  }

  selectPlayers() {
    this.selecting = true;
  }

  updateSelection(  items : PlayerRec[]) {
    if (!this.game.players) {
      this.game.players = []
    }
    items.forEach( p => {
      let role : PlayerRole= {
        _id : p._id,
        displayName : p.displayName,
        role : 'Player'
      }
      this.game.players.push(role)
    })
    this.selecting = false;
    this.save()
  }

  makePlayer(p : PlayerRole) {
    p.role = 'Player'
    this.save()
  }

  makeGM(p : PlayerRole) {
    p.role = 'GM'
    this.save()
  }

  removePlayer(p : PlayerRole) {
    let indx = this.game.players.findIndex(pr => pr._id == p._id )
    if (indx >= 0) {
      this.game.players.splice(indx, 1)
    } 

    //TODO: Confirm

    this.save()
  }

  save() {
    this.data.store(this.game)
  }

  getPlayerName() {
    return "WORKING..."
  }

  cancelSelection() {
    this.selecting = false
  }

  updateTitle(newTitle : string) {
    console.log("New Title ,", newTitle);
    this.game.name  = newTitle
    this.save()
  }

  onBack() {

  }

  delete() {
    this.data.delete(this.game)
    this.router.navigate(["../"], {relativeTo: this.route})
  }

  uploadImg($event : File) {
    ImageUtil.loadImg($event, {
      createThumbnail: true, 
      thumbnailKeepAspect : true,
      thumbnailMaxHeight : 240,
      thumbnailMaxWidth : 420
    }).subscribe( result => {
      this.game.image = result.thumbDataUrl
      this.data.store(this.game)
    })
  }

  invite() {
    this.router.navigate(['/games', this.game._id, 'invite'])
  }

  maps() {
    this.router.navigate(['/games', this.game._id, 'maps'])
  }

  characters() {
    this.router.navigate(['/games', this.game._id, 'characters'])

  }

  monsters() {
    this.router.navigate(['/games', this.game._id, 'monsters'])
  }

  sessions() {
    this.router.navigate(['/games', this.game._id, 'characters'])
  }

}
