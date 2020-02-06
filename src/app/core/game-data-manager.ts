import { Game, ObjectType, Annotation, FavoriteAnnotation, SessionCommand, ChatRecord, MapData } from './model';
import { DatabaseManager, RemovedDocument } from './database-manager';
import { Character } from './character/character';
import { ReplaySubject, Observable, Subject, concat, from } from 'rxjs';
import { Encounter } from './encounter/encounter';
import { filter } from 'rxjs/operators';
import { ResetableSubject } from './util/resetable-subject';

export class GameDataManager extends DatabaseManager {
     public readonly gameId : string

    // Arrays of items. Not observeable
    public annotations : Annotation[] = []
    public favorites : FavoriteAnnotation[] = []
    public chats : ChatRecord<any>[] = []
    public commands : SessionCommand[] = []
    public maps : MapData[] = []
    public encounters : Encounter[] = []

    public cmd$ = new ReplaySubject<SessionCommand>(1) // only the latest one matters
    public chat$ = new Subject<ChatRecord<any>>()
    public annotations$  = new Subject<Annotation | RemovedDocument>()
    public encounter$ = new ReplaySubject<Encounter>()
    
    /// May need to use differs to private differs: IterableDiffers, private differsKV: KeyValueDiffers
    constructor(gameId : string) {
        super(gameId)

        // Listen for all changes
        this.changes$.subscribe( doc => this.receiveChanges(doc))

        // Populate all the data
        this.localdb.find({selector:{}})
            .then(results => results.docs.forEach(doc => this.handleItem(<ObjectType>doc)))
            .catch(error => this.reportError("Error finding data", error))
    }

    private reportError(description : string, error ?: Error) {
        console.log(description, error);
    }

    private receiveChanges(doc : any) {
        this.handleItem(doc)
    }

    handleItem(doc : ObjectType | RemovedDocument) {
        if (this.isRemovedDocument(doc)) {
            this.processRemove(doc)
        } else {
            // Iterate  through everything that a game can store
            switch(doc.objType) {
                case Annotation.TYPE : this.handleAnnotation(doc); break;
                case FavoriteAnnotation.TYPE : this.handleFavorite(doc); break;
                case ChatRecord.TYPE : this.handleChat(doc); break;
                case SessionCommand.TYPE : this.handleSessionCommand(doc); break;
                case MapData.TYPE : this.handleMapData(doc); break;
                case Encounter.TYPE : this.handleEncounter(doc); break;
            }
        }
    }

    processRemove(doc : RemovedDocument) {

        if ( this.removeFrom(doc._id, this.annotations)) {
            this.annotations$.next(doc)
            return true
        }
        if ( this.removeFrom(doc._id, this.favorites)) return true
        if ( this.removeFrom(doc._id, this.chats)) return true
        if ( this.removeFrom(doc._id, this.maps)) return true
        if ( this.removeFrom(doc._id, this.commands)) return true
        if ( this.removeFrom(doc._id, this.encounters)) {
            this.encounter$.next(null)
            return true
        } 

        return false
    }

    private removeFrom(id : string, array : ObjectType[]) : boolean {
        const indx = array.findIndex( item => item._id === id)
        if (indx >= 0) {
            array.splice(indx, 1)
            return true
        }
        return false
    }

    private isRemovedDocument(doc : any) : doc is RemovedDocument {
        return doc._id && doc._rev && doc._deleted
    }

    private handleEncounter(doc : ObjectType) {
        const item = Encounter.to(doc)
        this.processItem(item, this.encounters)
        this.encounter$.next(item)
    }

    private handleChat(doc : ObjectType) {
        const item = ChatRecord.to(doc)
        this.processItem(item, this.chats)
    }

    private handleSessionCommand(doc : ObjectType) {
        const item = SessionCommand.to(doc)
        this.processItem(item, this.commands)
        this.cmd$.next(item)
    }

    private handleMapData(doc : ObjectType) {
        const item = MapData.to(doc)
        this.processItem(item, this.maps)
    }

    private handleFavorite(doc : ObjectType) {
        const item = FavoriteAnnotation.to(doc)
        this.processItem(item, this.favorites)
    }

    private handleAnnotation(doc : ObjectType) {
        const item = Annotation.to(doc)
        this.processItem(item, this.annotations)
        this.annotations$.next(item)
    }

    private  processItem<T extends ObjectType>(item : T, array: T[] ) {
        const indx = array.findIndex( a => a._id == item._id)
        if (indx >= 0) {
            // The object exists. Now check which on is 'newer'
            if (item.lastUpdate > array[indx].lastUpdate) {
                array[indx] = item
            } else if (item.lastUpdate > array[indx].lastUpdate) {
                // NOOP THese are the same
            } else {
                this.reportError(`Received older object ${array[indx]} newer than  ${item}`);
            }
        } else {
            array.push(item)
        }
    }

    public getAnnotations$(mapId : string) : Observable<Annotation | RemovedDocument> {
        return concat(from(this.annotations),this.annotations$)
            .pipe(
                filter(a =>  (Annotation.is(a) &&a.map === mapId) || this.isRemovedDocument(a))
            )
    }

    public getAnnotations2$() : ResetableSubject<any> {
        const sub = new ResetableSubject()
        
    }

}