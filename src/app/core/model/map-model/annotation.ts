
import * as modelutil from '../modelutil';
import { ObjectType } from '../object-type';
import { Point, Rectangle, Circle, Polygon } from 'pixi.js';
import { Aura, AuraVisible } from '../aura';
import { Geom } from '../util/geom';

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

    _id = modelutil.id(this)
    type = Annotation.TYPE
    subtype: string
    name = "New Annotation [Please Change]"
    color = "Green"
    // center = new CenterPoint(1, 2)

    sourceDB : string
    description?: string
    map: string

    group: string
    mapLink: string
    points: any[]
    snap: boolean
    background : boolean = false

    // static to(doc : any) : Annotation {
    //     return new Annotation().copyFrom(doc)
    // }

    static to(obj: any): Annotation {
        let rtn: Annotation
        if (MarkerTypeAnnotation.is(obj)) {
          rtn = new MarkerTypeAnnotation().copyFrom(obj)
        }
        // if (ShapeAnnotation.is(obj)) {
        //   rtn = new ShapeAnnotation().copyFrom(obj)
        // }
        // if (ImageAnnotation.is(obj)) {
        //   rtn = new ImageAnnotation().copyFrom(obj)
        // }
        // if (TokenAnnotation.is(obj)) {
        //   rtn = new TokenAnnotation().copyFrom(obj)
        // }
        // if (rtn) {
        //   if (rtn.points) {
        //     rtn.points = LangUtil.map2Array(rtn.points)
        //   }
        //   return rtn
        // }
    
        throw new Error("Unable to convert to a type of annotation: Invalid Object")
      }

    static is(obj: any): obj is Annotation {
        return obj.objType !== undefined && obj.objType === Annotation.TYPE
    }

    /**
     * Copies the points from the actual sprite into the data structure
     */
    copyPoints() {}

    abstract center(): Point 
}

/**
 * Represents a standard marker. There is a list of standardized markers that special users control. 
 * Ideally these would be put into a sprite sheet
 */
export class MarkerTypeAnnotation extends Annotation {
    public static readonly SUBTYPE = 'markerType'
    readonly subtype: string = MarkerTypeAnnotation.SUBTYPE

    markerType: string
    centerPt : Point

    center() : Point {
        return this.centerPt
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
    location : Rectangle

    center() : Point {
        return Geom.center(this.location)
      }
}

export class TokenAnnotation extends Annotation {
    public static readonly SUBTYPE = 'token'
    readonly subtype: string = TokenAnnotation.SUBTYPE
  location : Rectangle
  opacity: number = 1
  url?: string
  displayRange: [number, number] = [-20, 200]
  snap = true;
  itemId: string
  itemType: string
  instanceId: number

  dead = false
  bars : TokenBar[] = []
  flyHeight = 0
  badge: string
 
  auras: Aura[] = []

  showName : AuraVisible = AuraVisible.NotVisible
  showReach: AuraVisible = AuraVisible.NotVisible
  showSpeed: AuraVisible = AuraVisible.NotVisible
  showFly: AuraVisible = AuraVisible.Visible

  reach : number
  speed: number


  center() : Point {
    return Geom.center(this.location)
  }
}

export abstract class  ShapeAnnotation extends Annotation {
    public static readonly SUBTYPE = 'shape'
    readonly subtype: string = ShapeAnnotation.SUBTYPE

    shapetype: ShapeType

    border: boolean
    color: string
    weight: number
    style: string
    fill: boolean
    fillColor: string

    abstract toShape() : PIXI.Circle | PIXI.Ellipse | PIXI.Polygon | PIXI.Rectangle | PIXI.RoundedRectangle
}

export class CircleAnnotation extends ShapeAnnotation{
    shapetype = ShapeType.Cirle

    radius: number = 0 // pixels
    x: number
    y: number

    center(): Point {
        return new Point(this.x, this.y)
    }

    toShape() : Circle {
        return new Circle(this.x, this.y, this.radius)
    }
}

export class RectangleAnnotation extends ShapeAnnotation {
    shapetype = ShapeType.Rectangle

    x: number
    y: number
    w : number
    h : number

    center() : Point {
        return Geom.center(this.toShape())
    }

    toShape() : Rectangle {
        return new Rectangle(this.x, this.y, this.w, this.h)
    }
}


export class PolygonAnnotation extends ShapeAnnotation {
    shapetype = ShapeType.Polygon
    points : number[]

    center() : Point {
        return Geom.center(Geom.boundsXY(this.points))
    }

    toShape() : Polygon {
        return new Polygon(this.points)
    }
}

export class PolylineAnnotation extends ShapeAnnotation {
    shapetype = ShapeType.Polyline
    points : number[]

    center() : Point {
        return Geom.center(Geom.boundsXY(this.points))
    }

    toShape() : Polygon {
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
    color: string = 'blue'
    warnColor: string = 'red'
    visible :AuraVisible = AuraVisible.NotVisible
    value: number = 100
    max: number = 100
  }