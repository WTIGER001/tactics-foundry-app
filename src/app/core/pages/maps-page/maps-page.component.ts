import { Component, OnInit, OnDestroy } from '@angular/core';
import { Game, ObjectType, MapData } from '../../model';
import { DataService } from '../../data.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-maps-page',
  templateUrl: './maps-page.component.html',
  styleUrls: ['./maps-page.component.css']
})
export class MapsPageComponent implements OnInit, OnDestroy {
  sortBy: 'date' | 'alpa' = 'date'
  game : Game = new Game()
  feed : PouchDB.LiveFind.LiveFeed<MapData>
  maps : MapData[] = []
  tab: number = 0
  constructor(private data: DataService, private route: ActivatedRoute, private router: Router) { }

  ngOnInit() {
    this.route.data.subscribe((data: { asset: ObjectType }) => {
      console.log("GOT DATA ", data)
      this.game = Game.to(<Game>data.asset)
      if (this.game) {
        this.liveMapFeed(this.game._id)
      }
    })
  }

  ngOnDestroy() {
    this.feed.cancel()
  }

  toggleSort() {
    if (this.sortBy == 'alpa') {
      this.sortBy = 'date'
    } else {
      this.sortBy = 'alpa'
    }
    this.sort()
  }
  
  liveMapFeed(id : string) {
    console.log(id)
    let db   = this.data.DBs.get(id).localdb

    // Create the index (push this up!)
    db.createIndex({
      index: { fields: ['type']}
    })

    db.find({
      selector : {
        type : MapData.TYPE
      }
    })

    this.feed = db.liveFind({
      selector: {type: MapData.TYPE},
      aggregate: true
    })

    this.feed.on('update', (update, aggregate) => {
      // update.action is 'ADD', 'UPDATE', or 'REMOVE'
      // update also contains id, rev, and doc
      console.log(update.action, update.id);

      if (update.action == 'ADD') {
        console.log("Adding a Map ", update.doc);
        let a = new MapData().copyFrom(update.doc)
        this.maps.push(a)
        this.sort()
      }
    })
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
    map.game = this.game._id
    map.parentId = this.game._id

    this.data.store(map).subscribe(() => {
      this.router.navigate(['/games', map.game, 'maps', map._id, 'edit'])
    })
  }

  open(map : MapData, $event) {
    let ctrl = $event.ctrlKey
    if (ctrl) {
      this.router.navigate([map._id, 'edit'], {relativeTo: this.route})
    } else {
      this.router.navigate([map._id], {relativeTo:  this.route})
    }
  }

}
