/**
 * The Data Service is responsible for providing the model-level persistence and search capabilities. 
 */

import { Injectable } from '@angular/core';
import { DatabaseManager } from './database-manager';
import { Player, MapData, Game, Annotation } from './model';
import { BehaviorSubject, ReplaySubject } from 'rxjs';
import * as modelutil from './model/modelutil';
import { StorageMap } from '@ngx-pwa/local-storage';

const PLAYER_DB = 'players'

@Injectable({
  providedIn: 'root'
})
export class DataService {
  public newUser = true
  private playerDB: DatabaseManager<Player>
  private gameDBs: Map<string, DatabaseManager<Game | Annotation | MapData>> = new Map()


  /** Holds the player Id in an observable object. Defaults to a new id */
  public playerId$: BehaviorSubject<string> = new BehaviorSubject(modelutil.genid())

  /** Reference to the PouchDb database for the player */
  public dbMgr: DatabaseManager<Player>

  /** Observable subject for the current player */
  public player$: ReplaySubject<Player> = new ReplaySubject(1)

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

  public createPlayer(displayName : string, playerid : string = this.playerId$.getValue()) {
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
    if (!this.playerDB) {
      console.log("Creating Player Database");
      this.playerDB = new DatabaseManager<Player>(PLAYER_DB, [playerid])
    }
    console.log("Storing Player");
    this.playerDB.store(p).subscribe( res => {
      this.getPlayer(playerid)
    })

  }

  private getPlayer(playerid: string) {
      // Retrieves the player (and all changes). The returned object is a Player object
      this.playerDB.get$(playerid).subscribe(player => {
        if (player === null) {
          // No PLayer was found. Usually this is beacaus the database is not synced yet. So keep waiting
          console.log("player observable -> No player found");
  
        } else {
          console.log("player observable -> player found -- EMITTING", player);
          this.player$.next(player)
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
      player.games
    })
  }

  private loadPlayer(playerid: string) {
    // Create and sync to the player database
    this.playerDB = new DatabaseManager<Player>(PLAYER_DB, [playerid])

    // Retrieves the player (and all changes). The returned object is a Player object
    this.playerDB.get$(playerid).subscribe(player => {
      if (player === null) {
        // No PLayer was found. Usually this is beacaus the database is not synced yet. So keep waiting
        console.log("LOAD PLAYER --> NULLL")
      } else {
        console.log("LOAD PLAYER --> FOUND, ", player)

        this.player$.next(player)
      }
    })


  }

  private handleError(err: Error, attemptedAction: string) {

  }
}
