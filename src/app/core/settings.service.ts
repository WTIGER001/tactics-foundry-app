import { Injectable } from '@angular/core';
import { Observable, Subject, ReplaySubject, BehaviorSubject } from 'rxjs';
import PouchDB from 'pouchdb';

@Injectable({
  providedIn: 'root'
})
export class SettingsService {
  // ALL KEYS
  obsMap = new Map<string, Subject<any>>()

  db : PouchDB.Database

  public gameMapZoomListen :Setting<boolean>
  public gameMapShowGrid :Setting<boolean>
  public gameMapShowScale :Setting<boolean>
  public chatAlertOnRoll :Setting<boolean>

  public gameTokenShowMove1 : Setting<ShowMoveSetting>
  public gameTokenShowMove2 : Setting<ShowMoveSetting>
  public gameTokenShowRun: Setting<ShowMoveSetting>
  public gameTokenShowReach : Setting<ShowMoveSetting>
  public gameTokenShowReachWeapon : Setting<ShowMoveSetting>
  public gameTokenShowCustomMove : Setting<ShowCustomMoveSetting>

  constructor() { 
    this.db = new PouchDB("settings");


    this.gameMapZoomListen = new Setting<boolean>("gameMapZoomListen", true, this.db)
    this.gameMapShowGrid = new Setting<boolean>("gameMapShowGrid", true, this.db)
    this.gameMapShowScale = new Setting<boolean>("gameMapShowScale", true, this.db)
    this.chatAlertOnRoll = new Setting<boolean>("chatAlertOnRoll", true, this.db)

    this.gameTokenShowMove1 = new Setting<ShowMoveSetting>("gameTokenShowMove1",{enabled: false, color: "#00000044"}, this.db )
    this.gameTokenShowMove2 = new Setting<ShowMoveSetting>("gameTokenShowMove2",{enabled: false, color: "#FF000044"}, this.db )
    this.gameTokenShowRun = new Setting<ShowMoveSetting>("gameTokenShowRun",{enabled: false, color: "#00FF0044"}, this.db )
    this.gameTokenShowReach = new Setting<ShowMoveSetting>("gameTokenShowReach",{enabled: false, color: "#0000FF44"}, this.db )
    this.gameTokenShowReachWeapon = new Setting<ShowMoveSetting>("gameTokenShowReachWeapon",{enabled: false, color: "#FFFF0044"}, this.db )
    this.gameTokenShowCustomMove = new Setting<ShowCustomMoveSetting>("gameTokenShowCustom",{enabled: false, color: "#FFFF0044", distance: 5}, this.db )
  }
}

export class  ShowMoveSetting{
  enabled : boolean = false
  color : string 
}


export class  ShowCustomMoveSetting{
  enabled : boolean = false
  color : string 
  distance: number
}

export class Setting<T> {
  value : BehaviorSubject<T>
  defaultVal : T
  constructor(public readonly key : string, defaultValue : T, private db : PouchDB.Database) {
    this.value = new BehaviorSubject<T>(defaultValue)
    this.defaultVal = defaultValue
    this.db.get(this.key).then( doc => {
      // const val = doc.
      this.value.next(doc['data'])
    })
  }

  set(value : T) {
    this.value.next(value)
    this.db.upsert(this.key, (doc: any) => {
      doc.data = this.value.getValue()
      return doc
    }).then(  yay => {

    }).catch (boo => {
      console.log(boo)
    })
  }

  reset() {
    this.value.next(this.defaultVal)
    this.db.upsert(this.key, (doc: any) => {
      doc.data = this.defaultVal
      return doc
    })
  }

}