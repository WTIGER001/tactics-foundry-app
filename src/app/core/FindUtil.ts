import { DatabaseManager } from './database-manager';
import { Game, ObjectType } from './model';
import { NgZone } from '@angular/core';
import { faAngleDoubleUp } from '@fortawesome/pro-solid-svg-icons';

export class FindUtil {
    static liveOneId(id : string, db : DatabaseManager<any>) : PouchDB.LiveFind.LiveFeed {
        return db.localdb.liveFind({
            selector: {
              _id : { $eq: id}
            },
            aggregate: true
          })
    }

    static handleLiveOneId(id : string, db : DatabaseManager<any>, zone: NgZone, handler : LiveHandler) : LiveFeedWrapper {
        let feed = FindUtil.liveOneId(id, db)
        let wrapper = new LiveFeedWrapper(feed, zone)
        wrapper.handle(handler)
        return wrapper
    }




}

export class LiveFeedWrapper {
    constructor( public feed : PouchDB.LiveFind.LiveFeed, private zone : NgZone) {}

    public handle(handler : LiveHandler) {
        this.feed.on('update', (update, aggregate) => {
          this.zone.run(() => {
            if (update.action == 'ADD') {
              console.log(" Handler Adding", update.doc);
              handler.onAdd(update.doc)
            } else if (update.action == 'UPDATE') {
              console.log(" Handler Updating ", update.doc);
              handler.onUpdate(update.doc)
            } else if (update.action == 'REMOVE') {
              console.log(" Handler Removing ", update.doc);
              handler.onRemove(update.doc)
            }
          })
        })
    }

    public cancel() {
        this.feed.cancel()
    }
}

export class LiveHandler {
    onAdd(docs : ObjectType[])  {}
    onUpdate(docs : ObjectType[])  {}
    onRemove(docs : ObjectType[])  {}
}