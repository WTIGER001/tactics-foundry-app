import { Plugin } from 'pixi-viewport'
import { Texture, Graphics, Renderer, SCALE_MODES } from 'pixi.js';

export class GridDistanceUtil {

    textures = new Map<string, Texture>()
    
    // Retrieves a texture that represents the size and distance that is specified. The texture has a size of 1 pxel per gridsquare
    get(sizePx: number, distanceMaxPx : number, distanceMinPx: number, renderer: Renderer) : Texture {
        const key = sizePx + "x" + distanceMaxPx + "x" +distanceMinPx
        let t = this.textures.get(key)
        if (!t) {
            t = this.calculate(sizePx, distanceMaxPx, distanceMinPx, renderer)
            this.textures.set(key ,t)
        }
        return t
    }

    clear() {
        this.textures.forEach( t => t.destroy())
        this.textures.clear()
    }

    /**
     * 
     * @param sizePx The center size, in pixels, this size applies to both dimensions
     * @param distanceMaxPx The maximum distance that the text should cover, measured from the center of the texture, inclusive
     * @param distanceMinPx The minimum distance that the texture should cover, measured from the center of the texture, exclusive
     */
    calculate(sizePx: number, distanceMaxPx : number, distanceMinPx: number, renderer: Renderer) : Texture {
        const distMaxInt = Math.ceil(distanceMaxPx)
        const distMinInt = Math.ceil(distanceMinPx)
        const dim = (distMaxInt *2 + sizePx)
        const rtn = new  Array<boolean[]>(dim)

        let cX = distMaxInt
        let cY = distMaxInt

        // Determine the coverage and Draw a texture
        const g = new Graphics
        g.beginFill(0xFFFFFF, 1)

        for (let i = 0; i<dim; i++) {
            rtn[i]= new  Array<boolean>(dim)
            for (let j = 0; j<dim; j++) {
                const  dist = this.shortestDistance(i, j, sizePx, cX, cY)
                if (dist <=distMaxInt && dist > distMinInt) {
                    g.drawRect(i, j, 1, 1)
                }
            }
        }

        g.endFill()
        let texture = renderer.generateTexture(g, SCALE_MODES.NEAREST, 1 )
        return texture
    }


    shortestDistance(x1 : number, y1 : number, size : number, cX : number, cY : number)  : number {
        const sz = Math.floor(size)
        let min = this.unitDistance(x1, y1, cX, cY) 
        for (let x = 0; x<sz; x++) {
            for (let y = 0; y<sz; y++) {
                const dist = this.unitDistance(x1, y1, cX + x, cY  + y)
                min = Math.min(min, dist)
            }
        }
        return min
    }

    unitDistance(x1 : number, y1 : number, x2 : number, y2 : number) : number {
        const dist = Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) )
        return Math.floor(dist) 
    }



    static highlight(size, centerX : number, centerY : number, distance : number, ppf : number) : GridDistanceResult {
        // Size the matrix
        const dim = (distance *2 + size)/5
        const rtn = new  Array<boolean[]>(dim)

        let cX = distance
        let cY = distance

        for (let i = 0; i<dim; i++) {
            rtn[i]= new  Array<boolean>(dim)
            for (let j = 0; j<dim; j++) {
                const  dist = this.calcDistance(i*5, j*5, size, cX, cY)
                rtn[i][j] = dist <= distance
            }
        }

        // pt_poly.union()

        return {
            distance : distance,
            startX : centerX - (distance *ppf), 
            startY : centerY - (distance *ppf), 
            valid : rtn
        }
    }

    static calcDistance(locationX, locationY, size, centerX, centerY) : number {
        // A token is placed at the centerX and centerY. It is Size feet long in each direction
        // The size dictates how many 5x5 grid squares there are. 
        // The distance is the shortest of all the center suqares and the location x /y
        const sz = Math.floor((size/5))
        let min = this.diagnonalDistance(locationX, locationY, centerX, centerY) 
        for (let x = 0; x<sz; x++) {
            for (let y = 0; y<sz; y++) {
                const dist = this.diagnonalDistance(locationX, locationY, centerX + (5*x), centerY + (5*y))
                min = Math.min(min, dist)
            }
        }
        return min
    }

    static diagnonalDistance(x1, y1, x2, y2 ) : number {
        const distFt = Math.sqrt( (x2-x1)*(x2-x1) + (y2-y1)*(y2-y1) )
        return Math.floor(distFt / 5) * 5
    }
}

export class GridDistanceResult {
    valid: boolean[][]
    startX : number
    startY : number
    distance : number
}
