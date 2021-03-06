
import shortid from 'shortid'
import { ObjectType } from './object-type'

export function id(item : ObjectType ) {
    let time  = new Date().valueOf()
    let salt = genid()
    return item.objType + "_" +  salt +  "_" + time
}

export function genid() {
    let id = shortid.generate()
    while (id.startsWith("_")) {
        id = shortid.generate()
    }
    return id
}



