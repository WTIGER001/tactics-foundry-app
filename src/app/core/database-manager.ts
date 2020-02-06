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
import * as BlobUtil from 'blob-util'
import { Player } from './model';

export class DatabaseManager {
 
  public localdb: PouchDB.Database
  public remotedb: PouchDB.Database
  protected syncFilter: any
  protected syncFilterIds: string[] = []
  protected syncHandler: PouchDB.Replication.Sync<{}>
  protected changes$: Subject<PouchDB.Core.IdMeta> = new Subject()
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

    this.localdb.setMaxListeners(40)
    this.remotedb.setMaxListeners(40)
    this.createIndexes()
    this.registerFilter()
    this.startSync()
  }

  private createIndexes() {
    // Create the type index
    this.localdb.createIndex({
      index: { 
        fields: ['objType'], 
        name: "type-index"
      } 
    })
  }

  private registerFilter() {
    let filter = this.createIdFilter()
    this.remotedb.putIfNotExists(filter)
  }

  findId(id : string, fields ?:string[]) {
    let query : any= {
      selector : {
        _id : {
          $eq : id
        }
      }
    }
    if (fields) {
      query.fields = fields
    }
    return from(this.localdb.find(query))
  }

  findIds(ids : string[], fields ?:string[]) {
    let query : any= {
      selector : {
        owner : {
          $in : ids
        }
      }
    }
    if (fields) {
      query.fields = fields
    }
    return from(this.localdb.find(query))
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

    // Create the sync handler
    this.syncHandler = this.localdb.sync(this.remotedb, options)
      .on('change', (change) => {
        change.change.docs.forEach( item => {
            this.changes$.next(item)
        })
      }).on('paused', function (info) {

        // replication was paused, usually because of a lost connection
      // }).on('active', function (info) {
      //   // replication was resumed
      //   console.log("DATABASE SYNC ACTIVE ---------------------------------------------------------",", this.dbname, " ---> ", info)

      }).on('error', function (err) {
        // totally unhandled error (shouldn't happen)
        console.log("DATABASE SYNC ERR ---------------------------------------------------------", this.dbname, " ---> ", err)

      });
    this.ready$.next(true)
  }

  public pauseSync() {

  }

  public getAttachment(docId : string, attId : string) : Observable<Buffer |Blob> {
   return  from(this.localdb.getAttachment(docId, attId))
  }

  public getAttachmentImgUrl(docId : string, attId : string) : Observable<string> {
    return this.getAttachment(docId, attId).pipe(map( data => BlobUtil.createObjectURL(<Blob>data)))
  }

  public storeAttachment(doc : ObjectType, attachmentName : string, data : string | Blob, mimetype : string) : Observable<PouchDB.Core.Response>{
    return from(this.localdb.putAttachment(doc._id, attachmentName, data, mimetype))
  }

  /** Stores the item and upates the rev when complete */
  public store(item: any): Observable<unknown> {
    // Add trackikng to all items
    item.lastUpdate = new Date().valueOf()

    let obs = from(this.localdb.upsert(item._id, (doc: any) => {
      // Make Changes to the doc object and
      const rev = doc._rev
      item.copyTo(doc)
      doc._rev = rev
      return doc
    }))

    obs.subscribe(res => {
      item._rev  = res.rev
    }, error => {
      console.log("ERROR ON STORE", error)
    })

    return obs
  }

  /** Deletes an object */
  public delete(obj: any) {
    this.localdb.remove(obj)

  }

  public get(id: string): Promise<any> {
    return this.localdb.get(id)
  }

  /**
   * Gets the object from the database as an observable and keeps emiting when there are changes. This never finishes. The object can be null
   * @param id Id of the object to get
   */
  public get$(id: string): Observable<Player> {
    let inital = from(this.localdb.get(id))
      .pipe(
        map(doc => {
          /// Not sure what to do if it is deleted
          if (!doc) {
            return null
          }
          return Player.to(doc)
        })
      )
    let changes = this.changes$.pipe(
      filter(change => {
        return change._id === id
      }),
      map(change => {
        /// Not sure what to do if it is deleted
        if (change['deleted']) {
          return null
        }
        return null
      })
    )

    return merge(inital, changes)
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

    return new DbWatcher(this.localdb, query, zone);
  }

  public watchFields(fields : {field: string, value: string}[], zone: NgZone ) {
    const arr = fields.map( a => {
      let part = {}
      part[a.field] = {$eq : a.value}
      return part
    })

    const selector = {
      $and : arr
    }
    return this.watchSelector(selector, zone)
  }

  public watchType(objType: string, zone: NgZone): DbWatcher {

    if (!objType) {
      throw new Error("Invalid Argument, ID is missing")
    }
    return new DbWatcher(this.localdb, {
      selector: {
        objType: { $eq: objType }
      },
      aggregate: false
    }, zone);
  }

  public watchId(id: string, zone: NgZone): DbWatcher {

    if (!id) {
      throw new Error("Invalid Argument, ID is missing")
    }
    let query = {
      selector: {
        _id: { $eq: id }
      },
      aggregate: false
    }

    let watcher = new DbWatcher(this.localdb, query, zone);
    return watcher
  }

  public watchSelector(selector: PouchDB.Find.Selector, zone: NgZone): DbWatcher {

    if (!selector) {
      throw new Error("Invalid Argument, selector is missing")
    }

    let query: any = {
      aggregate: false
    }
    query.selector = selector

    let watcher = new DbWatcher(this.localdb, query, zone);
    return watcher
  }

  public builder() : QueryBuilder {
    return new QueryBuilder(this.localdb)
  }

}

export class DbWatcher {
  private feed: PouchDB.LiveFind.LiveFeed

  private started = false
  constructor(
    private db: PouchDB.Database,
    private query: PouchDB.LiveFind.RequestDef<{}>,
    private zone: NgZone) {
  }

  start() {
    // Cancel previously running feed
    if (this.feed) { this.cancel() }

    // Start the new Feed
    this.feed = this.db.liveFind(this.query)

    this.feed.on('update', (update, aggregate) => {
      let runner = () => {
        if (update.action == 'ADD') {
          if (this.filterFn(update.doc)) {
            this.onAddFn(update.doc)
          }
        } else if (update.action == 'UPDATE') {
          if (this.filterFn(update.doc)) {
            this.onUpdateFn(update.doc)
          }
        } else if (update.action == 'REMOVE') {
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
  public onRemove(fn: (item: RemovedDocument) => void) {
    this.onRemoveFn = fn
  }
  public filter(fn: (item: any) => boolean) {
    this.filterFn = fn
  }
}

export interface RemovedDocument {
  _id: string
  _rev: string
  _deleted: boolean
}

class QueryBuilder {
  _conditions : Condition[] = []
  _fields: string[] = []
  _sort: SortCondition[] = []

  constructor(private db : PouchDB.Database) {

  }
  public add(field: string, value : any, condition : string = '$eq') : QueryBuilder {
    this._conditions.push(new Condition(field, value, condition))
    return this
  }

  public fields(...field : string[])  : QueryBuilder {
    this._fields.push(...field)
    return this
  }

  public sort(field : string, direction : 'asc' | 'desc' = 'asc') : QueryBuilder {
    this._sort.push(new SortCondition(field, direction))
    return this
  }

  public buildQuery() : any {
    let selector : any = {}
    this._conditions.forEach( c => {
      selector[c.field] = {}
      selector[c.field][c.condition] = c.value
    })

    let query: any = []
    query.selector = selector
    if (this._fields.length > 0) {
      query.fields = this._fields
    }

    if (this._sort.length > 0) {
      const sortConditions = []
      this._sort.forEach( s=> {
        const v = {}
        v[s.field] = s.direction
        sortConditions.push(v)
      })
      query.sort = sortConditions
    }
    return query
  }

  public watch(zone : NgZone, aggregate: boolean = false): DbWatcher {
    const query = this.buildQuery()
    query.aggregate = aggregate

    let watcher = new DbWatcher(this.db, query, zone);
    return watcher
  }
}

class Condition {
  constructor(public field: string, public value : any, public condition : string = '$eq' ) {}
}

class SortCondition {
  constructor(public field : string, public direction : 'asc' | 'desc' = 'asc') {

  }
}