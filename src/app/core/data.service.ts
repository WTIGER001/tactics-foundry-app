/**
 * The Data Service is responsible for providing the model-level persistence and search capabilities. 
 */

import { Injectable } from '@angular/core';
import { DatabaseManager } from './database-manager';
import { Player, MapData, Game, Annotation, ObjectType, ChatRecord, PingMessage, MeasureMessage, Message } from './model';
import { BehaviorSubject, ReplaySubject, Observable, from } from 'rxjs';
import { StorageMap } from '@ngx-pwa/local-storage';
import { IdUtil } from './util/IdUtil';
import { map, filter, tap, take, first, mergeMap } from 'rxjs/operators';
import { Character } from './character/character';
import { GameDataManager } from './game-data-manager';

const PLAYER_DB = 'players'
const TOKEN_DB = 'tokens'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  
  static readonly COREDB_NAME = 'players'

  public newUser = true
  // public coreDB: DatabaseManager<Player | Game>
  // public gameDBs: Map<string, DatabaseManager<Game | Annotation | MapData>> = new Map()
  public gameDBs: Map<string, GameDataManager> = new Map()
  private _coredb: DatabaseManager

  /** Holds the player Id in an observable object. Defaults to a new id */
  public playerId$: BehaviorSubject<string> = new BehaviorSubject(IdUtil.genid())

  /** Reference to the PouchDb database for the player */
  public dbMgr: DatabaseManager

  /** Observable subject for the current player */
  public player$: ReplaySubject<Player> = new ReplaySubject(1)
  public player: Player
  public games$: BehaviorSubject<Game[]> = new BehaviorSubject([])

  constructor(private localStorage: StorageMap) {


    this.startup()

  }

  public get coreDB() : DatabaseManager{
    return this._coredb
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

  public setPlayerId(playerid: string) {
     this.localStorage.set('playerid', playerid).subscribe( () => {
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
      this._coredb = new DatabaseManager(PLAYER_DB, [playerid])
      
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
    console.log("Loading Player ", playerid)
    // Create and sync to the player database
    this._coredb =new DatabaseManager(DataService.COREDB_NAME, [playerid])

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
        this.gameDBs.set(game._id, new GameDataManager(game._id))
      })
    })
  }

  private getGames$(playerId): Observable<Game[]> {
    return from(this.coreDB.localdb.find({
      selector: {
        type : Game.TYPE
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

  public createDbIfNeeded(id: string) : Observable<GameDataManager>{
    if (id === DataService.COREDB_NAME) {
      return this.coreDB.ready$.pipe(
        filter( ready => ready),
        tap( ready => console.log("Recieved Ready ", ready) ),
        take(1),
        map( ready => null)
      )
    } 

    let db = this.gameDBs.get(id)
    if (!db) {
      db = new GameDataManager(id);
      this.gameDBs.set(id, db)
    }
    return db.ready$.pipe(
      filter( ready => ready),
      tap( ready => console.log("Recieved Ready ", ready) ),
      take(1),
      map( ready => db)
    )
  }

  public getDbById(id : string, create : boolean = false ) : GameDataManager {
    return this.gameDBs.get(id)
  }

  public getDb(item: ObjectType): DatabaseManager {
    // Atempt to use the database that created this object (if we know what it is)
    if (item['sourceDB']) {
      let sourceDB = item['sourceDB']
      let db = this.gameDBs.get(sourceDB)
      if (db) {
        return db
      }
    }

    if (item.objType == Player.TYPE) {
      return this.coreDB
    }
    if (item.objType == Game.TYPE) {
      return this.coreDB
    }
    if (item.objType == Character.TYPE) {
      return this.coreDB
    }

    throw new Error(`CANT FIND DB for ${item.objType}`)

  }

  public delete(item: ObjectType) {
    let db = this.getDb(item)
    if (db) {
      db.delete(item)
    }
  }

  public store(item: ObjectType): Observable<unknown> {
    // console.log("Storing , ", item);
    // Preprocessing
    if (!this.player) {
      throw new Error("No Player")
    }

    item.lastUpdatedBy = this.player._id
    item.lastUpdate = new Date().valueOf()

    // Atempt to use the database that created this object (if we know what it is)
    if (item.sourceDB) {
      console.log("Storing in sourceDB, ", item['sourceDB']);
      if (!item._id) {
        item._id = (item.objType + "_" + IdUtil.genid()).toLowerCase()
      }
      let sourceDB = item.sourceDB
      let db = this.gameDBs.get(sourceDB)
      if (db) {
        return db.store(item)
      }
    }

    // Player (in CoreDB)
    if (item.objType == Player.TYPE) {
      return this.coreDB.store(<Player>item)
    }

    // Game (in CoreDB)
    if (item.objType == Game.TYPE) {
      // Games can be new
      if (!item._id) {
        item._id = (item.objType + "_" + IdUtil.genid()).toLowerCase()
      }
      return this.coreDB.store(<Game>item)
    }

    if (item.objType == Character.TYPE) {
      // Games can be new
      if (!item._id) {
        item._id = (item.objType + "_" + IdUtil.genid()).toLowerCase()
      }
      return this.coreDB.store(<Character>item)
    }

    if (item.objType == MapData.TYPE) {
      // Determine the db 
      let map = <MapData>item;
      let dbName = map.parentId
      let db = this.gameDBs.get(dbName)
      if (db) {
        return db.store(item)
      } else {
        throw new Error(`Source Database not found ${map.parentId}`)
      }

    }
    console.error("INVALID OBJECT.... NO DATABASE", item)

  }

  public get$(databaseId: string, objectId: string): Observable<any> {
    let dbMgr = this.gameDBs.get(databaseId)
    if (dbMgr) {
      return <Observable<any>>dbMgr.get$(objectId)
    }

    return null
  }

  /**
   * 
   * @param gameid Activates a map in the live session
   * @param mapdata 
   */
  public activate(gameid: string, mapdata: MapData) {
    // First get the 'live_session'
    // Then activate the map and reset all the map center and map zoom.

  }

  public join(gameId : string) : Observable<string> {
     // Look for game
     return this.coreDB.findId(gameId).pipe(
      first(),
      filter( res => {
        if (res.docs && res.docs.length == 1) {
          let game = Game.to(res.docs[0])
          let found = game.players.find( p => p._id == this.player._id) 
          if (found) {
            throw new Error("You are already a player in this game!")
            return false
          } else {
            return true
          }
        } else {
          throw new Error("Game Not Found!")
          return false
        }
      }), 
      mergeMap( res => {
        let game = Game.to(res.docs[0])
        game.players.push({_id : this.player._id, role:'Player', displayName: this.player.displayName})
        return this.store(game)
      }),
      map( res => res["_id"])
    )
  }

  public sendMessage(gameId : string, msg : Message) {
    let c =new ChatRecord()
    c.sourceDB = gameId
    c.record = msg
    c.displayName = this.player.displayName
    c.lastUpdate = new Date().valueOf()
    c.lastUpdatedBy = this.player._id;
    this.store(c)
  }
}
