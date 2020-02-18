import { CircleAnnotation, RectangleAnnotation, Formatted, Geom, ImageAnnotation } from 'src/app/core/model';
import { MapComponent } from './map.component';
import { Point, Rectangle } from 'pixi.js';

export class ShapeUtil {
    /**
     * Centers an image in the view.
     * @param map Map
     * @param width of Image
     * @param height of Image
     */
    static centerImage(map: MapComponent, width: number, height: number): Rectangle {
        const center: Point = map.getCenter()
        const bounds = map.viewport.getVisibleBounds()

        let w = width
        let h = height
        let pt = ShapeUtil.resize(width, height, bounds.width / 10 / map.mapdata.ppf, bounds.height / 10 / map.mapdata.ppf)
        const r = new Rectangle(0, 0, pt.x, pt.y)
        const location = Geom.centerOn(r, center)

        return location
    }


    static keepAspect( w: number, h: number, aspect : number, keepAspect : boolean) : Point {
        if (!aspect || !keepAspect) {
            return new Point(w, h)
        }

        const normalizedWDiff = w 
        const normalizedHDiff = h / aspect 
        if (normalizedWDiff > normalizedHDiff) {
            let newW = w
            let newH = w / aspect
            return new Point(newW, newH)
        } else {
            let newW = h * aspect
            let newH = h
            return new Point(newW, newH)
        }
    }

    static resize(w: number, h: number, maxW: number, maxH : number) : Point {
        let aspect = w/h
        let wDiff = maxW - w
        let hDiff = maxH - h

        // This is already smaller
        if (wDiff < 0 && hDiff < 0) {
            return new Point(w, h)
        }

        const normalizedWDiff = wDiff 
        const normalizedHDiff = hDiff * aspect 
        if (normalizedWDiff > normalizedHDiff) {
            let newW = maxW
            let newH = maxW* aspect
            return new Point(newW, newH)
        } else {
            let newW = maxH / aspect
            let newH = maxH
            return new Point(newW, newH)
        }
    }

    static createCircle(map: MapComponent): CircleAnnotation {
        const circle = new CircleAnnotation()
        circle.x = 300
        circle.y = 300
        circle.border = true
        circle.color = '#FFFFFF'
        circle.weight = 1
        circle.fill = true
        circle.fillColor = "#FF000088"
        circle.name = "TEST"
        circle.radius = 20

        const center: Point = map.getCenter()
        circle.x = center.x
        circle.y = center.y

        const bounds = map.viewport.getVisibleBounds()
        const small = Math.min(bounds.width, bounds.height)
        circle.radius = small / 10
        if (circle.radius < 0) {
            console.log("CIRCLE MATH ", bounds, " ", small)
            circle.radius = 5
        }
        circle.radius = circle.radius / map.mapdata.ppf

        return circle
    }

    static createRectangle(map: MapComponent): RectangleAnnotation {
        const rect = new RectangleAnnotation()
        this.defaultFormat(rect)
        rect.name = "New Rectangle"
        const center: Point = map.getCenter()
        const bounds = map.viewport.getVisibleBounds()
        const r = new Rectangle(0, 0, bounds.width / 10 / map.mapdata.ppf, bounds.height / 10 / map.mapdata.ppf)
        const location = Geom.centerOn(r, center)
        rect.x = location.x
        rect.y = location.y
        rect.w = location.width
        rect.h = location.height
        return rect
    }


    static centerRect(map: MapComponent): Rectangle {
        const center: Point = map.getCenter()
        const bounds = map.viewport.getVisibleBounds()
        const r = new Rectangle(0, 0, bounds.width / 10 / map.mapdata.ppf, bounds.height / 10 / map.mapdata.ppf)
        const location = Geom.centerOn(r, center)
        return location
    }


    static defaultFormat(item: Formatted) {
        item.border = true
        item.color = '#FFFFFF'
        item.weight = 1
        item.fill = true
        item.fillColor = "#FF000088"
    }

}