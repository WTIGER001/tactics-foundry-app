import { Subject, Observable, merge, ReplaySubject, BehaviorSubject } from 'rxjs';
import PouchDB from 'pouchdb';
import PouchDbUupsert from 'pouchdb-upsert'
import PouchDBFind from 'pouchdb-find';
import PouchDBLiveFind from 'pouchdb-live-find';
import { ObjectType } from './model/object-type';
import * as converter from './model/object-converter'
import { from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { NgZone } from '@angular/core';

export class DatabaseManager<T extends ObjectType> {
  public localdb: PouchDB.Database
  public remotedb: PouchDB.Database
  private syncFilter: any
  private syncFilterIds: string[] = []
  private syncHandler: PouchDB.Replication.Sync<{}>
  private changes$: Subject<any> = new Subject()
  public ready$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);

  constructor(public dbname: string, filteredIds: string[] = [], remoteAddressPrefix: string = environment ? environment.remoteAddress : 'https://bauerstuff.com/') {
    this.syncFilterIds = [...filteredIds]

    // Register Plugins
    PouchDB.plugin(PouchDbUupsert)
    PouchDB.plugin(PouchDBFind)
    PouchDB.plugin(PouchDBLiveFind)

    // Create the Databases and begin to sync
    this.localdb = new PouchDB(dbname, {adapter : 'idb'});
    this.remotedb = new PouchDB(remoteAddressPrefix + dbname)
    this.createIndexes()
    this.registerFilter()
    this.startSync()
  }

  private createIndexes() {
    console.log("Creating Index on ", this.dbname)
    // Create the type index
    this.localdb.createIndex({
      index: { 
        fields: ['type'], 
        name: "type-index"
      } 
    })
  }

  private registerFilter() {
    let filter = this.createIdFilter()
    this.remotedb.putIfNotExists(filter)
  }

  private startSync() {
    console.log("STARTING SYNC ON ", this.dbname)


    // Create the options for live sync
    let options: PouchDB.Replication.SyncOptions = {
      live: true,
      retry: true, 
      pull : {
        live : true,
        retry: true
      }, 
      push : {
        live: true, 
        retry: true
      }
    }

    // Add the id filtering if there are any ids to filter
    // if (this.syncFilterIds && this.syncFilterIds.length > 0) {
    //   // options.filter = 'app/by_id'
    //   // options.query_params = { ids: this.syncFilterIds }
    // }

    // Create the sync handler
    this.syncHandler = this.localdb.sync(this.remotedb, options)
      .on('change', function (change) {
        let types = []
        change.change.docs.forEach( (d:any)=> {
          types.push(d.type)
        })
        console.log("DATABASE SYNC CHANGE ---------------------------------------------------------", this.dbname, " ---> ", change.direction, " ", types)
        // yo, something changed!
        this.changes$.next(change)
      }).on('paused', function (info) {
        // console.log("DATABASE SYNC PAUSED ---------------------------------------------------------", this.dbname, " ---> ", info)

        // replication was paused, usually because of a lost connection
      // }).on('active', function (info) {
      //   // replication was resumed
      //   console.log("DATABASE SYNC ACTIVE ---------------------------------------------------------",", this.dbname, " ---> ", info)

      }).on('error', function (err) {
        // totally unhandled error (shouldn't happen)
        console.log("DATABASE SYNC ERR ---------------------------------------------------------", this.dbname, " ---> ", err)

      });
    console.log("READY DATABASE MANGAGER ", this.dbname)
    this.ready$.next(true)
  }

  public pauseSync() {

  }

  /** Stores the item and upates the rev when complete */
  public store(item: T): Observable<unknown> {
    // Add trackikng to all items
    item.lastUpdate = new Date().valueOf()

    // this.localdb.upsert<T>(item._id, (doc: {} & T) => {
    //   // Make Changes to the doc object and
    //   item.copyTo(doc)

    //   return doc
    // }).then(res => {
    //   console.log("Stored Object Successfully, ", res)
    // }).catch(err => {
    //   // Do something
    //   console.log("Error on Store, ", err)
    // })

    let obs = from(this.localdb.upsert<T>(item._id, (doc: {} & T) => {
      // Make Changes to the doc object and
      item.copyTo(doc)

      return doc
    }))

    obs.subscribe(res => {
      console.log("Stored Object Successfully, ", res)
    })

    return obs
  }

  /** Deletes an object */
  public delete(obj: T) {
    this.localdb.remove(obj)

  }

  public get(id: string): Promise<T> {
    return this.localdb.get(id)
  }

  /**
   * Gets the object from the database as an observable and keeps emiting when there are changes. This never finishes. The object can be null
   * @param id Id of the object to get
   */
  public get$(id: string): Observable<T> {
    let inital = from(this.localdb.get(id))
      .pipe(
        map(doc => {
          /// Not sure what to do if it is deleted
          if (!doc) {
            return null
          }
          return <T>converter.To(doc)
        })
      )
    let changes = this.changes$.pipe(
      filter(change => {
        return change._id === id
      }),
      map(change => {
        /// Not sure what to do if it is deleted
        if (change.deleted) {
          return null
        }
        return <T>converter.To(change.doc)
      })
    )

    return merge<T>(inital, changes)
  }

  /** Restarts the Sync on the database */
  public restartSync() {
    // Cancel the sync
    if (this.syncHandler) {
      this.syncHandler.cancel()
    }

    // Sync
    this.startSync()
  }

  /**
   * Shuts down the database. Once this is called then the DatabaseManager class is expected to be discarded. No other calls are accepted. 
   */
  public shutdown() {
    // Cancel the sync
    if (this.syncHandler) {
      this.syncHandler.cancel()
    }

    // Close the database
    this.localdb.close()
  }

  /**
   * Creates a replication filter so that ONLY the items with one of the selected IDs are replicated. This 
   * is used to filter the player database for only the players that are involved in the game
   * 
   * @param ids Complete list of ids to accept
   */
  private createIdFilter(): any {
    // let filterFunc = function(doc, req) {
    //   let idsToKeep : string[]= req.query.ids
    //   return idsToKeep.findIndex(doc.id) >= 0
    // }

    // let filter = {
    //   _id: "_design/app",
    //   filters: {
    //     by_id: function (doc, req) {

    //       return req.query.ids.findIndex(doc.id) >= 0
    //     }.toString()
    //   }
    // }

    let filter = {
      _id: "_design/app",
      filters: {
        by_id: function (doc, req) {
          return true
        }.toString()
      }
    }

    return filter

  }

  public watchQuery(query: PouchDB.LiveFind.RequestDef<{}>, zone: NgZone): DbWatcher {

    if (!query) {
      throw new Error("Invalid Argument, query is missing")
    }
    console.log("WATCHING TYPE : ", query)

    return new DbWatcher(this.localdb, query, zone);
  }

  public watchType(type: string, zone: NgZone): DbWatcher {

    if (!type) {
      throw new Error("Invalid Argument, ID is missing")
    }
    console.log("WATCHING TYPE : ", type)
    return new DbWatcher(this.localdb, {
      selector: {
        type: { $eq: type }
      },
      aggregate: true
    }, zone);
  }

  public watchId(id: string, zone: NgZone): DbWatcher {

    if (!id) {
      throw new Error("Invalid Argument, ID is missing")
    }
    console.log("WATCHING ID : ", id)
    let query = {
      selector: {
        _id: { $eq: id }
      },
      aggregate: true
    }

    let watcher = new DbWatcher(this.localdb, query, zone);
    return watcher
  }

  public watchSelector(selector: PouchDB.Find.Selector, zone: NgZone): DbWatcher {

    if (!selector) {
      throw new Error("Invalid Argument, selector is missing")
    }

    console.log("WATCHING SELECTOR : ", selector)
    let query: any = {
      aggregate: true
    }
    query.selector = selector

    let watcher = new DbWatcher(this.localdb, query, zone);
    return watcher
  }

}

export class DbWatcher {
  private feed: PouchDB.LiveFind.LiveFeed

  private started = false
  constructor(
    private db: PouchDB.Database,
    private query: PouchDB.LiveFind.RequestDef<{}>,
    private zone: NgZone) {
      console.log("QUERY: ", query.selector);
      
  }

  start() {
    // Cancel previously running feed
    console.log("WATCHING ");
    if (this.feed) { this.cancel() }

    // Start the new Feed
    this.feed = this.db.liveFind(this.query)

    this.feed.on('update', (update, aggregate) => {
      let runner = () => {
        if (update.action == 'ADD') {
          console.log("Adding ", update.doc);
          if (this.filterFn(update.doc)) {
            this.onAddFn(update.doc)
          }
        } else if (update.action == 'UPDATE') {
          console.log("Updating ", update.doc);
          if (this.filterFn(update.doc)) {
            this.onUpdateFn(update.doc)
          }
        } else if (update.action == 'REMOVE') {
          console.log("Removing ", update.doc);
          if (this.filterFn(update.doc)) {
            this.onRemoveFn(update.doc)
          }
        }
      }

      if (this.zone) {
        this.zone.run(runner)
      } else {
        runner.call(this)
      }
    })
  }

  public cancel() {
    console.log("DONE WATCHING ");
    if (this.feed) {
      this.feed.cancel()
      this.feed = undefined
    }
  }

  private onAddFn = (item: any) => { }
  private onUpdateFn = (item: any) => { }
  private onRemoveFn = (item: any) => { }
  private filterFn = (item: any) => { return true }

  public onAdd(fn: (item: any) => void) {
    this.onAddFn = fn
  }
  public onUpdate(fn: (item: any) => void) {
    this.onUpdateFn = fn
  }
  public onRemove(fn: (item: any) => void) {
    this.onRemoveFn = fn
  }
  public filter(fn: (item: any) => boolean) {
    this.filterFn = fn
  }


}