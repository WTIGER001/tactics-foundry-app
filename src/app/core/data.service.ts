/**
 * The Data Service is responsible for providing the model-level persistence and search capabilities. 
 */

import { Injectable } from '@angular/core';
import { DatabaseManager } from './database-manager';
import { Player, MapData, Game, Annotation, ObjectType } from './model';
import { BehaviorSubject, ReplaySubject, Observable, from } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { IdUtil } from './util/IdUtil';
import { map } from 'rxjs/operators';

const PLAYER_DB = 'players'
const TOKEN_DB = 'tokens'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public newUser = true
  public coreDB: DatabaseManager<Player | Game>
  // public gameDBs: Map<string, DatabaseManager<Game | Annotation | MapData>> = new Map()
  public DBs: Map<string, DatabaseManager<any>> = new Map()

  /** Holds the player Id in an observable object. Defaults to a new id */
  public playerId$: BehaviorSubject<string> = new BehaviorSubject(IdUtil.genid())

  /** Reference to the PouchDb database for the player */
  public dbMgr: DatabaseManager<Player>

  /** Observable subject for the current player */
  public player$: ReplaySubject<Player> = new ReplaySubject(1)
  public player: Player
  public games$: BehaviorSubject<Game[]> = new BehaviorSubject([])

  constructor(private localStorage: StorageMap) {


    this.startup()

  }

  /**
   * During startup the data service will try to do the following: 
   * - Locate the playerid from the local storage database
   * - Connect to the Player Database and begin to sync
   * - Get the player object
   * - Get all the games that the player is part of
   * - Get all the players that are participating in games that the player is part of
   * - Get all the game systems needed
   * - Get the token db
   */
  private startup() {



    this.lookupUserId()


  }

  signout() {
    this.localStorage.clear().subscribe(() => {
      // this.player$.next(null);
      // this.playerId$.next(modelutil.genid())
      location.reload();
    })
  }


  public createPlayer(displayName: string, playerid: string = this.playerId$.getValue()) {
    let p = new Player()
    p._id = playerid
    p.displayName = displayName

    console.log("New Player: ", p);

    // Write the player to the storage
    this.localStorage.set('playerid', playerid).subscribe(() => {
      // COMPLETE
      console.log("New Player iD written to local storage");
    })

    // Write the player to the local database
    if (!this.coreDB) {
      console.log("Creating Player Database");
      this.coreDB = new DatabaseManager<Player>(PLAYER_DB, [playerid])
    }
    console.log("Storing Player");
    this.coreDB.store(p).subscribe(res => {
      this.getPlayer(playerid)
    })

  }

  private getPlayer(playerid: string) {
    // Retrieves the player (and all changes). The returned object is a Player object
    this.coreDB.get$(playerid).subscribe(player => {
      if (player === null) {
        // No PLayer was found. Usually this is beacaus the database is not synced yet. So keep waiting
        console.log("player observable -> No player found");

      } else {
        console.log("player observable -> player found -- EMITTING", player);
        this.player$.next(<Player>player)
        this.player = <Player>player
      }
    })
  }

  private lookupUserId() {
    // Look up the player id from local storage
    this.localStorage.get('playerid').subscribe(playerid => {
      if (playerid) {
        // Update the new user
        this.newUser = false

        // Announce to others what the player id is.
        this.playerId$.next(<string>playerid)

        // Now load the player and all assets
        this.loadPlayer(<string>playerid);
      } else {
        this.newUser = true
      }
    })

    this.player$.subscribe(player => {

    })
  }

  private loadPlayer(playerid: string) {
    // Create and sync to the player database
    this.coreDB = new DatabaseManager<Player>(PLAYER_DB, [playerid])
    this.DBs.set(PLAYER_DB, this.coreDB)

    // Retrieves the player (and all changes). The returned object is a Player object
    this.coreDB.get$(playerid).subscribe(player => {
      if (player === null) {
        // No PLayer was found. Usually this is beacaus the database is not synced yet. So keep waiting
        console.log("LOAD PLAYER --> NULLL")
      } else {
        console.log("LOAD PLAYER --> FOUND, ", player)
        this.loadGames2(player._id)
        this.player$.next(<Player>player)
        this.player = <Player>player
      }
    })

  }

  private loadGames2(playerId) {
    this.getGames$(playerId).subscribe(games => {
      games.forEach(game => {
        console.log("LOAD PLAYER GAME ", game._id)
        this.DBs.set(game._id, new DatabaseManager<Game>(game._id))
      })
    })
  }

  private getGames$(playerId): Observable<Game[]> {
    return from(this.coreDB.localdb.find({
      selector : {
        $and :[
          {type: { $eq : Game.TYPE}},
          {players : {
            $elemMatch : {
              _id: playerId
            }
          }}
        ]
      },
    })).pipe(
      map(results => {
        let games = []
        results.docs.forEach(doc => {
          games.push(Game.to(doc))
        })
        return games
      })
    )
  }

  private handleError(err: Error, attemptedAction: string) {

  }

  public getDb(item: ObjectType): DatabaseManager<any> {
    // Atempt to use the database that created this object (if we know what it is)
    if (item['sourceDB']) {
      let sourceDB = item['sourceDB']
      let db = this.DBs.get(sourceDB)
      if (db) {
        return db
      }
    }

    if (item.type == Player.TYPE) {
      return this.coreDB
    }
    if (item.type == Game.TYPE) {
      return this.coreDB
    }

    throw new Error(`CANT FIND DB for ${item.type}`)

  }

  public delete(item: ObjectType) {
    let db = this.getDb(item)
    if (db) {
      db.delete(item)
    }
  }

  public store(item: ObjectType): Observable<unknown> {
    // Atempt to use the database that created this object (if we know what it is)
    if (item['sourceDB']) {
      let sourceDB = item['sourceDB']
      let db = this.DBs.get(sourceDB)
      if (db) {
        return db.store(item)
      }
    }

    // Player (in CoreDB)
    if (item.type == Player.TYPE) {
      return this.coreDB.store(<Player>item)
    }

    // Game (in CoreDB)
    if (item.type == Game.TYPE) {
      // Games can be new
      if (!item._id) {
        item._id = (item.type + "_" + IdUtil.genid()).toLowerCase()
      }

      if (!this.player) {
        throw new Error("No Player")
      }
      item.lastUpdatedBy = this.player._id

      // Make sure the player has the id in his games list
      // if (!this.player.games) {
      //   console.log("Creating Game Set")
      //   this.player.games = new Set()
      // }
      return this.coreDB.store(<Game>item)

      // console.log("Checking for game")


      // if (!this.player.games.has(item._id)) {
      //   console.log("Adding Game to player")

      //   this.player.games.add(item._id)
      //   this.coreDB.store(this.player)
      // }

      // // Now save the game. The ame may be new 
      // console.log("Saving Game ", item._id)

      // let db = this.DBs.get(item._id)
      // if (!db) {
      //   db = new DatabaseManager<Game>(item._id)
      //   this.DBs.set(item._id, db)
      // }

      // return db.store(<Game>item)
    }



    if (item.type == MapData.TYPE) {
      // Games can be new
      if (!item._id) {
        item._id = (item.type + "_" + IdUtil.genid()).toLowerCase()
      }

      if (!this.player) {
        throw new Error("No Player")
      }

      // Make sure the player has the id in his games list
      if (!this.player.games) {
        console.log("Creating Game Set")
        this.player.games = new Set()
      }

      console.log("Checking for game")

      if (!this.player.games.has(item._id)) {
        console.log("Adding Game to player")

        this.player.games.add(item._id)
        this.coreDB.store(this.player)
      }

      // Now save the game. The ame may be new 
      console.log("Saving Game ", item._id)

      let db = this.DBs.get(item._id)
      if (!db) {
        db = new DatabaseManager<Game>(item._id)
        this.DBs.set(item._id, db)
      }

      return db.store(<Game>item)
    }

    if (item.type == MapData.TYPE) {
      // Determine the db 
      let map = <MapData>item;
      let dbName = map.parentId
      let db = this.DBs.get(dbName)
      if (db) {
        return db.store(item)
      } else {
        throw new Error(`Source Database not found ${map.parentId}`)
      }

    }
    console.error("INVALID OBJECT.... NO DATABASE", item)

  }


  public get$(databaseId: string, objectId: string): Observable<any> {
    let dbMgr = this.DBs.get(databaseId)
    if (dbMgr) {
      return <Observable<any>>dbMgr.get$(objectId)
    }

    return null
  }

}
