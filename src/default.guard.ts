import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable, from } from 'rxjs';
import { ObjectType } from './app/core/model';
import { DataService } from './app/core/data.service';
import { DatabaseManager } from './app/core/database-manager';
import { id } from './app/core/model/modelutil';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DefaultGuard implements CanActivate, Resolve<ObjectType> {

  /**
   * Need to determine how to wait for the dataaservice to be completely initialized and redirect if there is no player id. And how to handle errors. 
   * @param data 
   */
  constructor(private data : DataService) {
    
  }

  canActivate(
    next: ActivatedRouteSnapshot,
    state: RouterStateSnapshot): Observable<boolean | UrlTree> | Promise<boolean | UrlTree> | boolean | UrlTree {
    return true;
  }

  /**
   * 
   * @param route Route
   * @param state State
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<ObjectType> {
    const url = route.url
    const gameid = route.paramMap.get("gameid")
    const gs = route.paramMap.get("gsid")
    const sessionId = route.paramMap.get("sessionid")
    const id = route.paramMap.get("id")

    // Path structure
    // Patern is /game/[gameid]/[item]/[itemid] or /game/[gameid]/session/[sessionid]/[item]/[itemid]

    // Determine what the user is trying to look up
    console.log("DEFAULT GUARD ", url)
    let obs$ : Observable<any>

    // The user has gone to a home or management screen. Do nothing (e.g /home)
    if (url.length == 1) {
      return null
    }

    // The user has gone to something with an id (e.g /game/game_AbfhHu78)
    if (url.length == 2) {
      let type = url[0].path
      let id = url[1].path

      console.log("GEtting Item ", url)

      obs$ =  this.getItem$(type, id)
    }

    // The user has gone to a special route for an item (e.g /game/game_AbfhHu78/new-map)
    if (url.length == 3) {
      let type = url[0].path
      let id = url[1].path

      obs$ =  this.getItem$(type, id)
    }

    // The user has gone to an item in a game or other container (e.g /game/game_AbfhHu78/maps/map_12345678)
    if (url.length == 4) {
      let parenttype = url[0].path
      let parentid = url[1].path
      let type = url[2].path
      let id = url[3].path

      obs$ =  this.getParentItem$(parenttype, parentid, type, id)
    }

    // The user has gone to an item in a game or other container (e.g /game/game_AbfhHu78/maps/map_12345678/add_annotation)
    if (url.length == 5) {
      let parenttype = url[0].path
      let parentid = url[1].path
      let type = url[2].path
      let id = url[3].path

      obs$ =  this.getParentItem$(parenttype, parentid, type, id)
    }

     // The user has gone to an item in a game or other container with a session (e.g /game/game_AbfhHu78/session/session_12345678/map/map_12345678)
     if (url.length == 6) {
      let parenttype = url[0].path
      let parentid = url[1].path
      let sessiontype = url[2].path
      let sessionid = url[3].path
      let type = url[4].path
      let id = url[5].path

      obs$ =  this.getSessionItem$(parenttype, parentid, sessiontype, sessionid, type, id)
    }

    // (e.g /game/game_AbfhHu78/session/session_12345678/map/map_12345678/add_annotation)
    if (url.length == 7) {
      let parenttype = url[0].path
      let parentid = url[1].path
      let sessiontype = url[2].path
      let sessionid = url[3].path
      let type = url[4].path
      let id = url[5].path

      obs$ =  this.getSessionItem$(parenttype, parentid, sessiontype, sessionid, type, id)
    }

    if (obs$) {
      return obs$.pipe(
        take(1)
      )
    }


    throw new Error(`Path Error... Path is too long  ${url.length}`)
  }

  getItemDb(type: string, itemId : string) : DatabaseManager<any> {
    // The type indicates the location of the database... maybe
    if (type == "games") {
      // There is a database for every game
      return this.data.coreDB
    } else if (type == 'characters') {
      // All top level characters are stored in the player database
      return this.data.coreDB
    } else if (type == 'tokens') {
      // All top level tokens are stored in the token database
      return this.data.coreDB
    } else if (type == 'monsters') {
      // All top level monsters are stored in the monster database
      return this.data.coreDB
    }
    throw new Error(`Unsupported type  ${type} ${itemId}`)
  }

  getItem$(type: string, itemId : string) : Observable<any> {
    let db = this.getItemDb(type, itemId)
    if (db) {
      return db.get$(itemId);
    } else {
      console.error("Error reading ", itemId)
      return from([])
    }
  }


  getParentItem$(parentType : string, parentId : string, type : string, id: string): Observable<any>  {
    let db = this.getItemDb(parentType, parentId)
    return db.get$(id);
  }

  getSessionItem$(parentType : string, parentId : string, sessionType: string, sessionId: string, type : string, id: string) : Observable<any>  {
    let db = this.getItemDb(parentType, parentId)
    return db.get$(id);
  }



}
