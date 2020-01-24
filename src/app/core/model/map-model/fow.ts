import { Polygon, Rectangle, Circle } from 'pixi.js'

/**
  Fog Of War data model. This holds all the configuration information that is stored and used
 */
export class FogOfWar {
    public static readonly TYPE = 'fow'
    public static readonly FOLDER = 'fow'
  
    enabled = false
    color: string = '#000'
    gmcolor: string = '#242424e0'
    blur: number = 7
    reveals: FowShape[] = []
    hideAll = true;
    lastUpdate : number = 0

    add( item : FowShape)  {
      this.reveals.push(item)
      this.lastUpdate = new Date().getTime()
    }

    markUpdate() {
      this.lastUpdate = new Date().getTime()
    }
  }
  
  /**
    Fog of War shape data model.
   */
  export class FowShape {
    type: string
    hide = false
    item: Polygon | Rectangle | Circle
    constructor(shape: Polygon | Rectangle | Circle) {
      if (!shape) {
        return
      }
      this.item = shape      

      if (shape instanceof Polygon) {
        this.type = 'polygon'
      }
      if (shape instanceof Rectangle) {
        this.type = 'rectangle'
      }
      if (shape instanceof Circle) {
        this.type = 'circle'
      }
    }
  }
  