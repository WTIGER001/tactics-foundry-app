import { Rectangle, Point } from 'pixi.js';

export class Geom {
    static center(r: Rectangle): Point {
        return new Point(r.x + r.width / 2, r.y + r.height / 2)
    }

    static centerOn(bounds: Rectangle, center: Point, ): Rectangle {
        let halfY = bounds.height / 2
        let halfX = bounds.width / 2
        return new Rectangle(center.x - halfX, center.y - halfY, bounds.width, bounds.height)
    }
}