import { isArray } from "util";
import { compileFactoryFunction } from '@angular/compiler/src/render3/r3_factory';

export abstract class ObjectType {
  public _id: string
  public _rev: string
  public type: string
  public name: string
  public sourceDB: string
  public lastUpdate: number
  public lastUpdatedBy: string

  // public type : string

  copyFrom(obj: any): any {
    Object.assign(this, obj)
    // Make a new copy of the arrays...maybe even the items too!
    Object.keys(obj).forEach(key => {
      const fld = obj[key]
      if (isArray(fld)) {
        this[key] = fld.slice(0)
      }
    })
    return this
  }

  copyTo(obj: any) {
    Object.assign(obj, this)
    // Make a new copy of the arrays...maybe even the items too!
    Object.keys(this).forEach(key => {
      const fld = this[key]
      if (isArray(fld)) {
        obj[key] = fld.slice(0)
      }
    })
  }
}

export interface IMultiDatabaseItem {
  sourceDB: string
}