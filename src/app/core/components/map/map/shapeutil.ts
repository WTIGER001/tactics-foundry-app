import { CircleAnnotation, RectangleAnnotation, Formatted, Geom } from 'src/app/core/model';
import { MapComponent } from './map.component';
import { Point, Rectangle } from 'pixi.js';

export class ShapeUtil {


    static createCircle(map: MapComponent) : CircleAnnotation {
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

    static createRectangle(map: MapComponent) : RectangleAnnotation {
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

    static defaultFormat(item: Formatted) {
      item.border = true
      item.color = '#FFFFFF'
      item.weight = 1
      item.fill = true
      item.fillColor = "#FF000088"
    }

}