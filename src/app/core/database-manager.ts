import { Subject, Observable, merge } from 'rxjs';
import PouchDB from 'pouchdb';
import PouchDbUupsert from 'pouchdb-upsert'
import PouchDBFind from 'pouchdb-find';
import PouchDBLiveFind from 'pouchdb-live-find';
import { ObjectType } from './model/object-type';
import * as converter from './model/object-converter'
import { from } from 'rxjs';
import { filter, map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';

export class DatabaseManager<T extends ObjectType> {
  public localdb: PouchDB.Database
  public remotedb: PouchDB.Database
  private syncFilter: any
  private syncFilterIds: string[] = []
  private syncHandler: PouchDB.Replication.Sync<{}>
  private changes$: Subject<any> = new Subject()

  constructor(public dbname: string, filteredIds: string[] = [], remoteAddressPrefix: string = environment?environment.remoteAddress:'http://69.133.98.109:5984/') {
    this.syncFilterIds = [...filteredIds]

    // Register Plugins
    PouchDB.plugin(PouchDbUupsert)
    PouchDB.plugin(PouchDBFind)
    PouchDB.plugin(PouchDBLiveFind)

    // Create the Databases and begin to sync
    this.localdb = new PouchDB(dbname);
    this.remotedb = new PouchDB(remoteAddressPrefix + dbname)
    this.registerFilter()
    this.startSync()
  }

  private registerFilter() {
    let filter = this.createIdFilter()
    this.remotedb.putIfNotExists(filter)
  }

  private startSync() {
    // Create the options for live sync
    let options: any = {
      live: true,
      retry: true
    }

    // Add the id filtering if there are any ids to filter
    if (this.syncFilterIds && this.syncFilterIds.length > 0) {
      options.filter = 'app/by_id'
      options.query_params = { ids: this.syncFilterIds }
    }

    // Create the sync handler
    this.syncHandler = this.localdb.sync(this.remotedb, options)
      .on('change', function (change) {
        console.log("DATABASE SYNC CHANGE ", this.dbname, " ---> ", change)
        // yo, something changed!
        this.changes$.next(change)
      }).on('paused', function (info) {
        // console.log("DATABASE SYNC PAUSED ", this.dbname, " ---> ", info)

        // replication was paused, usually because of a lost connection
        // }).on('active', function (info) {
        //   // replication was resumed
        //   console.log("DATABASE SYNC ACTIVE ", this.dbname, " ---> ", info)

      }).on('error', function (err) {
        // totally unhandled error (shouldn't happen)
        console.log("DATABASE SYNC ERR ", this.dbname, " ---> ", err)

      });

    // this.changes$.subscribe( change => {
    // console.debug(`DB CHANGE from $this.dbname : `, change)
    // })
  }

  public pauseSync() {

  }

  /** Stores the item and upates the rev when complete */
  public store(item: T) : Observable<unknown>{
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

    obs.subscribe( res => {
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

  // Create the index



}