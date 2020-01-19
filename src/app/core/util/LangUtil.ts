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

    static colorNum(color : string): number {
      if (color.length > 7 || color.length<6) {
        throw new Error("Invalid HEX Color " + color)
      }
      let clr = color
      if (color.startsWith('#')) {
        return parseInt(color.replace(/^#/, ''), 16);
      }
      parseInt(color, 16);
    }

    public static baseColor(hexColor: string, defaultValue ?: string): string {
      if ( !hexColor) {
        return defaultValue
      }
      return hexColor.substr(0, 7)
    }

    public static red(hexColor : string) {
      let b = LangUtil.baseColor(hexColor)
      let r = b.substr(1,2)
      return parseInt(r, 16)
    }
    public static green(hexColor : string) {
      let b = LangUtil.baseColor(hexColor)
      let r = b.substr(3,2)
      return parseInt(r, 16)
    }
    public static blue(hexColor : string) {
      let b = LangUtil.baseColor(hexColor)
      let r = b.substr(5,2)
      return parseInt(r, 16)
    }
    

  
    public static colorAlpha(hex: string): number {
      if (!hex) {
        return 1
      }
      if (hex.length == 9) {
        let alphaHex = hex.substr(7, 2)
        let base255 = parseInt(alphaHex, 16)
        let alpha = base255 / 255
        return alpha
      }
      return 1
    }

}