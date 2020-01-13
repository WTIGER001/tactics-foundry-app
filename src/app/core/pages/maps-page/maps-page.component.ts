import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Game, ObjectType, MapData, RouteContext } from '../../model';
import { DataService } from '../../data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DbWatcher } from '../../database-manager';

@Component({
  selector: 'app-maps-page',
  templateUrl: './maps-page.component.html',
  styleUrls: ['./maps-page.component.css']
})
export class MapsPageComponent implements OnInit, OnDestroy {
  gameid: string
  sortBy: 'date' | 'alpa' = 'date'
  game: Game = new Game()
  maps: MapData[] = []
  tab: number = 0
  watcher: DbWatcher
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router, private zone: NgZone) { }

  ngOnInit() {
    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      this.gameid = data.ctx.id
      if (this.gameid) {
        this.data.createDbIfNeeded(this.gameid).subscribe(db => {
          this.watcher = db.watchType(MapData.TYPE, this.zone)
          this.watcher.onAdd(doc => {
            this.maps.push(MapData.to(doc))
            this.sort()
          })
          this.watcher.onUpdate(doc => {
            let indx = this.maps.findIndex(m => doc._id === m._id)
            if (indx >= 0) {
              this.maps[indx] = MapData.to(doc)
            }
          })
          this.watcher.onRemove( doc => {
            let indx = this.maps.findIndex(m => doc._id === m._id)
            if (indx >= 0) {
              this.maps.splice(indx, 1)
            }
          })
          this.watcher.start()
        })
      }
    })
  }



  ngOnDestroy() {
    if (this.watcher) { this.watcher.cancel() }
  }

  toggleSort() {
    if (this.sortBy == 'alpa') {
      this.sortBy = 'date'
    } else {
      this.sortBy = 'alpa'
    }
    this.sort()
  }

  private sort() {
    this.maps = this.maps.sort((a, b) => {
      // console.log("Comparing, ", this.sortBy,  a, b);
      if (this.sortBy == 'date') {
        let aLast =
          console.log(b.lastUpdate - a.lastUpdate, a.lastUpdate, b.lastUpdate)
        return b.lastUpdate - a.lastUpdate
      } else if (this.sortBy == 'alpa') {
        if (a.name.toLowerCase() == b.name.toLowerCase()) {
          return 0
        } else if (a.name.toLowerCase() < b.name.toLowerCase()) {
          console.log("1 ", a.name, b.name)
          return -1;
        } else {
          console.log("-1 ", a.name, b.name)
          return 1
        }
      }
    })

    let names = []
    this.maps.forEach(m => names.push(m.name))
    console.log("SORTED: ", names)
  }

  /**
   * Creates a new map that is ready to use and forwards to the map edit page
   */
  newMap() {
    // Generate a new ID
    let map = new MapData()

    map.name = "New Map (please change)"
    map.game = this.gameid
    map.sourceDB = this.gameid

    this.data.store(map).subscribe(() => {
      this.router.navigate(['/games', map.game, 'maps', map._id, 'edit'])
    })
  }

  open(map: MapData, $event) {
    // let ctrl = $event.ctrlKey
    // if (ctrl) {
    this.router.navigate([map._id], { relativeTo: this.route })
    // } else {
    // this.router.navigate([map._id], {relativeTo:  this.route})
    // }
  }

}
