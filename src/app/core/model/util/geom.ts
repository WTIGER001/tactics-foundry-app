import { Rectangle, Point } from 'pixi.js';
import { Bounds } from 'pixi-viewport';

export class Geom {
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
}