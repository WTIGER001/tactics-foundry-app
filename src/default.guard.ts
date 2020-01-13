import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree, Resolve } from '@angular/router';
import { Observable, from } from 'rxjs';
import { ObjectType, RouteContext } from './app/core/model';
import { DataService } from './app/core/data.service';
import { DatabaseManager } from './app/core/database-manager';
import { id } from './app/core/model/modelutil';
import { take, map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class DefaultGuard implements CanActivate, Resolve<RouteContext> {

  /**
   * Need to determine how to wait for the dataaservice to be completely initialized and redirect if there is no player id. And how to handle errors. 
   * @param data 
   */
  constructor(private data: DataService) {

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
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<RouteContext> {
    const url = route.url
    const gameid = route.paramMap.get("gameid")
    const gs = route.paramMap.get("gsid")
    const sessionId = route.paramMap.get("sessionid")
    const id = route.paramMap.get("id")

    // Path structure
    // Patern is /game/[gameid]/[item]/[itemid] or /game/[gameid]/session/[sessionid]/[item]/[itemid]

    // Determine what the user is trying to look up
    console.log("DEFAULT GUARD ", url)
    let obs$: Observable<any>

    let ctx = new RouteContext

    // The user has gone to a home or management screen. Do nothing (e.g /home)
    if (url.length == 1) {
      ctx.special = url[0].path
    }

    // The user has gone to something with an id (e.g /game/game_AbfhHu78)
    if (url.length == 2) {
      ctx.type = url[0].path
      ctx.id = url[1].path
    }

    // The user has gone to a special route for an item (e.g /game/game_AbfhHu78/new-map)
    if (url.length == 3) {
      ctx.type = url[0].path
      ctx.id = url[1].path
      ctx.special = url[2].path
    }

    // The user has gone to an item in a game or other container (e.g /game/game_AbfhHu78/maps/map_12345678)
    if (url.length == 4) {
      ctx.parentType = url[0].path
      ctx.parentId = url[1].path
      ctx.type = url[2].path
      ctx.id = url[3].path
    }

    // The user has gone to an item in a game or other container (e.g /game/game_AbfhHu78/maps/map_12345678/add_annotation)
    if (url.length == 5) {
      ctx.parentType = url[0].path
      ctx.parentId = url[1].path
      ctx.sessionType = url[2].path
      ctx.sessionId = url[3].path
      ctx.type = url[4].path
      ctx.id = url[5].path
    }

    // The user has gone to an item in a game or other container with a session (e.g /game/game_AbfhHu78/session/session_12345678/map/map_12345678)
    if (url.length == 6) {
      ctx.parentType = url[0].path
      ctx.parentId = url[1].path
      ctx.sessionType = url[2].path
      ctx.sessionId = url[3].path
      ctx.type = url[4].path
      ctx.id = url[5].path
      ctx.special = url[6].path
    }

    // (e.g /game/game_AbfhHu78/session/session_12345678/map/map_12345678/add_annotation)
    if (url.length >= 7) {
      ctx.parentType = url[0].path
      ctx.parentId = url[1].path
      ctx.sessionType = url[2].path
      ctx.sessionId = url[3].path
      ctx.type = url[4].path
      ctx.id = url[5].path
      ctx.special = url[6].path
    }

    // TODO: Context is constructed. Now we have to wait for the databases to be created... 
    // let db = this.getItemDb(ctx)

    let dbid = this.getDbId(ctx)
    return this.data.createDbIfNeeded(dbid).pipe(map(dbmge => ctx))
    // return ctx
  }

  getDbId(ctx: RouteContext) {
    let type = ctx.type
    let hasParentGame = ctx.parentId && ctx.parentType == 'games'
    if (hasParentGame) {
      return ctx.parentId
    } else if (!ctx.id) {
      return DataService.COREDB_NAME
    } else if (type == 'characters') {
      return DataService.COREDB_NAME
    } else if (type == "games") {
      return DataService.COREDB_NAME
    } else if (type == "settings") {
      return DataService.COREDB_NAME
    } else if (type == "templates") {
      return DataService.COREDB_NAME
    } else if (type == "system") {
      return 'system'
    } else if (type == "tokens") {
      return 'tokens'
    }
    throw new Error("BAD CTX ")
  }



}
