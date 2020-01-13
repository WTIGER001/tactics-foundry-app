import shortid from 'shortid'
import { ObjectType } from '../model'

export class IdUtil {
    static saltedId(item : ObjectType ) {
        let time  = new Date().valueOf()
        let salt = IdUtil.genid()
        return item.type + "_" + salt + "_" + time
    }

    static saltedIdType(type : string ) {
        let time  = new Date().valueOf()
        let salt = IdUtil.genid()
        return type + "_" + salt + "_" + time
    }
    
    static  genid(prefix : string = "") {
        let id = shortid.generate()
        while (id.startsWith("_")) {
            id = shortid.generate()
        }

        if (prefix.length > 0) {
            return prefix +"_" + id
        }
        return id
    }
    
}