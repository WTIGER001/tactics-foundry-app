
// import * as modelutil from '../modelutil';
import { ObjectType } from '../object-type';
import { Point, Rectangle, Circle, Polygon } from 'pixi.js';
import { Aura, AuraVisible } from '../aura';
import { Geom } from '../util/geom';
import { IdUtil } from '../../util/IdUtil';
import { Marker } from '../../marker.service';

export enum AnchorPostitionChoice {
    TopLeft = 0,
    TopCenter,
    TopRight,
    MiddleLeft,
    MiddleCenter,
    MiddleRight,
    BottomLeft,
    BottomCenter,
    BottomRight,
    Custom
}

export enum ShapeType {
    Rectangle = 0,
    Cirle,
    Arc,
    Polygon,
    Polyline
}


export abstract class Annotation extends ObjectType {
    static readonly TYPE = 'annotation'

    type = Annotation.TYPE
    _id = IdUtil.saltedIdType(Annotation.TYPE)
    subtype: string
    name = "New Annotation [Please Change]"
    color = "Green"
    layer: 'player' | 'gm' | 'background' = 'player'
    // center = new CenterPoint(1, 2)

    sourceDB: string
    description?: string
    map: string
    owner: string

    group: string
    mapLink: string
    points: any[]
    snap: boolean
    background: boolean = false

    x: number
    y: number

    static to(obj: any): Annotation {
        let rtn: Annotation
        if (MarkerTypeAnnotation.is(obj)) {
            rtn = new MarkerTypeAnnotation().copyFrom(obj)
        }
        if (CircleAnnotation.is(obj)) {
            rtn = new CircleAnnotation().copyFrom(obj)
        }
        if (RectangleAnnotation.is(obj)) {
            rtn = new RectangleAnnotation().copyFrom(obj)
        }
        if (PolygonAnnotation.is(obj)) {
          rtn = new PolygonAnnotation().copyFrom(obj)
        }
        if (ImageAnnotation.is(obj)) {
          rtn = new ImageAnnotation().copyFrom(obj)
        }
        if (TokenAnnotation.is(obj)) {
            rtn = new TokenAnnotation().copyFrom(obj)
        }
        if (MarkerTypeAnnotation.is(obj)) {
            rtn = new MarkerTypeAnnotation().copyFrom(obj)
        }

        if (rtn) {
            return rtn
        }

        throw new Error("Unable to convert to a type of annotation: Invalid Object")
    }

    static is(obj: any): obj is Annotation {
        if (obj) {
            return obj.type === Annotation.TYPE
        } 
        return false
    }

    /**
     * Copies the points from the actual sprite into the data structure
     */
    copyPoints() { }

    // abstract center(): Point
}

/**
 * Represents a standard marker. There is a list of standardized markers that special users control. 
 * Ideally these would be put into a sprite sheet
 */
export class MarkerTypeAnnotation extends Annotation {
    public static readonly SUBTYPE = 'markerType'
    readonly subtype: string = MarkerTypeAnnotation.SUBTYPE

    w : number
    h : number
    ax : number = 0
    ay : number = 0
    url : string
    scale: number = 1

    static is(obj: any): obj is ShapeAnnotation {
        return Annotation.is(obj) && obj.subtype == MarkerTypeAnnotation.SUBTYPE
    }
}

/**
 * Represents a regular image sprite
 */
export class ImageAnnotation extends Annotation {
    public static readonly SUBTYPE = 'image'
    readonly subtype: string = ImageAnnotation.SUBTYPE

    opacity: number = 1
    url?: string
    displayRange: [number, number] = [-20, 200]
    aspect: number // width / height
    keepAspect: boolean = false
    location: Rectangle
    w : number
    h : number
    unit: string = 'ft'

    // center(): Point {
    //     return Geom.center(this.location)
    // }

    static is(obj: any): obj is ShapeAnnotation {
        return Annotation.is(obj) && obj.subtype == ImageAnnotation.SUBTYPE
    }
}

export class TokenAnnotation extends Annotation {
    public static readonly SUBTYPE = 'token'
    readonly subtype: string = TokenAnnotation.SUBTYPE

    opacity: number = 1
    url?: string
    displayRange: [number, number] = [-20, 200]
    snap = true;
    itemId: string
    itemType: string
    instanceId: number
    linkType : string
    linkId : string
    linkDb : string

    dead = false
    bars: TokenBar[] = []
    fly = 0
    badge: string
    size: number //FT
    sizeW: number
    sizeH: number

    auras: Aura[] = []

    showName: AuraVisible = AuraVisible.NotVisible
    showReach: AuraVisible = AuraVisible.NotVisible
    showSpeed: AuraVisible = AuraVisible.NotVisible
    showFly: AuraVisible = AuraVisible.Visible

    reach: number
    speed: number


    // center(): Point {
    //     return Geom.center(this.location)
    // }

    static is(obj: any): obj is TokenAnnotation {
        if (!obj) { return false }
        return obj.type === Annotation.TYPE && obj.subtype == TokenAnnotation.SUBTYPE
    }
}

export abstract class ShapeAnnotation extends Annotation {
    public static readonly SUBTYPE = 'shape'
    readonly subtype: string = ShapeAnnotation.SUBTYPE

    shapetype: ShapeType

    border: boolean
    color: string
    weight: number
    style: string
    fill: boolean
    fillColor: string

    abstract toShape(): PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.Rectangle | PIXI.RoundedRectangle

    static is(obj: any): obj is ShapeAnnotation {
        return Annotation.is(obj) && obj.subtype == ShapeAnnotation.SUBTYPE
    }
}

export class CircleAnnotation extends ShapeAnnotation {
    shapetype = ShapeType.Cirle

    radius: number = 0 // pixels
    unit: string
    x: number
    y: number

    center(): Point {
        return new Point(this.x, this.y)
    }

    toShape(): Circle {
        return new Circle(this.x, this.y, this.radius)
    }

    static is(obj: any): obj is CircleAnnotation {
        return ShapeAnnotation.is(obj) && obj.shapetype == ShapeType.Cirle
    }
}


export class RectangleAnnotation extends ShapeAnnotation {
    shapetype = ShapeType.Rectangle

    x: number
    y: number
    w: number
    h: number
    unit: string

    // center(): Point {
    //     return Geom.center(this.toShape())
    // }

    toShape(): Rectangle {
        return new Rectangle(this.x, this.y, this.w, this.h)
    }

    static is(obj: any): obj is CircleAnnotation {
        return ShapeAnnotation.is(obj) && obj.shapetype == ShapeType.Rectangle
    }
}


export class PolygonAnnotation extends ShapeAnnotation {
    shapetype = ShapeType.Polygon
    points: number[] = []

    center(): Point {
        return Geom.center(Geom.boundsXY(this.points))
    }

    toShape(): Polygon {
        return new Polygon(this.points)
    }
    static is(obj: any): obj is CircleAnnotation {
        return ShapeAnnotation.is(obj) && obj.shapetype == ShapeType.Polygon
    }
}

export class PolylineAnnotation extends ShapeAnnotation {
    shapetype = ShapeType.Polyline
    points: number[]

    center(): Point {
        return Geom.center(Geom.boundsXY(this.points))
    }

    toShape(): Polygon {
        return new Polygon(this.points)
    }
}



export class CenterPoint {
    constructor(public x: number, public y: number) {

    }
}

/**
 * Bar for a token, charater or monster
 */
export class TokenBar {
    name: string = "New Bar"
    source: string
    warnRange: number = 0.25
    bgColor: string = '#444444'
    color: string = '#000000'
    warnColor: string = 'red'
    visible: AuraVisible = AuraVisible.Visible
    value: number = 100
    max: number = 100
}

export interface Formatted {
    border: boolean
    color: string
    weight: number
    fill: boolean
    fillColor: string
}