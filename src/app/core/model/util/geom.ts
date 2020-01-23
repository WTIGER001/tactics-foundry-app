import { Rectangle, Point } from 'pixi.js';
import { Bounds } from 'pixi-viewport';
import { DistanceUnit } from '../distance-unit';

export class Geom {
  
    static centerHandle(x: number, y: number, size: number) {
      return new Rectangle(x - size, y-size, size+size, size +size)
    }

    static center(r: Rectangle | Bounds): Point {
        return new Point(r.x + r.width / 2, r.y + r.height / 2)
    }

    static centerOn(bounds: Rectangle, center: Point, ): Rectangle {
        let halfY = bounds.height / 2
        let halfX = bounds.width / 2
        return new Rectangle(center.x - halfX, center.y - halfY, bounds.width, bounds.height)
    }

    static toRect(x1 : number, y1 : number, x2 : number, y2: number) {
        return new Rectangle(x1, y1, x2-x1, y2-y1)
    }

    static bounds(points : Point[]) : Rectangle {
        // let maxY, maxX, minY, minX : number

        if (points.length == 0) {
            throw new Error("Empty Array, cannot calcualte bounds")
        }
        
        let xs = points.map( p=> p.x)
        let ys = points.map( p=> p.x)
        let maxY = Math.max(...ys)
        let maxX  = Math.max(...xs)
        let minY = Math.min(...ys)
        let minX= Math.min(...xs)
        
        return Geom.toRect(minX, minY, maxX, maxY)
    }

    static boundsXY(points : number[]) {
        let x :number[] = []
        let y :number[] = []
        points.forEach( (value : number, index: number) => {
            if (index%2 == 0) {
                x.push(value)
            } else {
                y.push(value)
            }
        })
        let maxY = Math.max(...y)
        let maxX  = Math.max(...x)
        let minY = Math.min(...y)
        let minX= Math.min(...x)
        
        return Geom.toRect(minX, minY, maxX, maxY)
    }

    static offset(bounds: Rectangle | Bounds, direction: number, distance: number, unit?: DistanceUnit): Rectangle {
        // 1, 4, 7 = LEFT
        // 9, 6, 3 = RIGHT
        // 7, 8, 9 = UP
        // 1, 2, 3 = DOWN
    
        let east = bounds.x + bounds.width
        let west = bounds.x
        let north = bounds.y
        let south = bounds.x + bounds.height
    
        const dist = unit ? unit.toFeet(distance) : distance
        // Shift LEFT or RIGHT
        if ([1, 4, 7].includes(direction)) {
          east = east - dist
          west = west - dist
        } else if ([9, 6, 3].includes(direction)) {
          east = east + dist
          west = west + dist
        }
    
        // Shift UP or DOWN
        if ([7, 8, 9].includes(direction)) {
          north = north + dist
          south = south + dist
        } else if ([1, 2, 3].includes(direction)) {
          north = north - dist
          south = south - dist
        }
        
        return this.toRect(west, north, east, south)
      }
    
    
      /**
       * Creates an equal buffer around an existing bounds
       * @param bounds Input Bounds
       * @param bufferSize Size of the buffer (assumed to be meters)
       * @param unit Unit of the bufferSize
       */
      public static buffer(bounds: Rectangle | Bounds, bufferSize: number, unit?: DistanceUnit): Rectangle {
        const buff = unit ? unit.toFeet(bufferSize) : bufferSize
        return new Rectangle(bounds.x - buff, bounds.y - buff, bounds.width + buff +buff, bounds.height + buff + buff)
      }
}