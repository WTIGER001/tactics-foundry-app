import { isArray } from 'util';

export class LangUtil {
    static compareStrings( a: string, b: string, order: 'desc' | 'asc' = 'asc') {
        if (a.toLowerCase() == b.toLowerCase()) {
            return 0
          } else if (a.toLowerCase() < b.toLowerCase()) {
            return order == 'asc'? -1: 1;
          } else {
            return order == 'asc'? 1: -1;
        }
    }

    static copyFrom<T>(dest: T, src: any): T {
       Object.assign(dest, src)
      // Make a new copy of the arrays...maybe even the items too!
      Object.keys(src).forEach(key => {
        const fld = src[key]
        if (isArray(fld)) {
          dest[key] = fld.slice(0)
        }
      })
      return dest
    }
}