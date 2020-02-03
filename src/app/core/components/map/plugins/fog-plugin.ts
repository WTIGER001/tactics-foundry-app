import { Plugin } from 'pixi-viewport';
import { MapLayerManager } from '../map/layer-manager';
import { interaction, Sprite, Rectangle, Application, Texture, Circle, Polygon, Graphics, Container, BLEND_MODES, SCALE_MODES } from 'pixi.js';
import { FogOfWar } from 'src/app/core/model/map-model/fow';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { ImageUtil } from 'src/app/core/util/ImageUtil';
import { BasicPlugin } from './basic-plugin';

export class FogPlugin extends BasicPlugin {
    fog = new Sprite()
    stale = false
    lastUpdate : number = 0

    constructor(l : MapLayerManager) {
        super(l)
    }

    wheel() {
        return false
    }

    get fow() : FogOfWar {
        return this.layerMgr.session.mapdata.fog
    }

    updateMap() {
        this.fow.reveals.push({hide: false, type:'circle', item: new Circle(0, 0, 50)})
        this.fow.reveals.push({hide: true, type:'circle', item: new Circle(400, 400, 50)})
        this.updateFow()
    }

    add() {
        this.layerMgr.session.mapview.fogLayer.addChild(this.fog)
        this.layerMgr.session.mapview.viewport.plugins.add('fog', this)
        this.updateMap()
    }

    remove() {
        this.fogLayer.removeChildren()
        this.layerMgr.session.mapview.viewport.plugins.remove('fog')
    }

    get app() : Application {
        return this.layerMgr.session.mapview.app
    }

    get fogLayer() : Container {
        return this.layerMgr.session.mapview.fogLayer
    }

    updateFow() {
        this.lastUpdate = this.fow.lastUpdate
        const m = this.layerMgr.session.mapdata

        const canvas = ImageUtil.offscreen()
        canvas.width = m.width
        canvas.height = m.height

        const ctx = canvas.getContext('2d')
        ctx.save()

        // Create the base rectangle
        ctx.fillStyle = '#fff'
        if (this.fow.hideAll) {
            ctx.fillRect(0, 0, canvas.width, canvas.height)
        }

        ctx['filter'] = `blur(${this.fow.blur}px)`
        this.drawShapes(ctx)

        const data = canvas.toDataURL()
        let t = Texture.from(data)
        this.fog.texture = t
        this.fog.tint = 0x000000
        if (this.layerMgr.session.isGM()) {
            this.fog.alpha = this.fow.gmAlpha
        }
        this.fog.x = 0
        this.fog.y = 0
        this.fog.width = m.width
        this.fog.height = m.height

        this.fog.visible = this.fow.enabled
        
        ctx.restore()
    }

    drawShapes(ctx: CanvasRenderingContext2D) {
        this.fow.reveals.forEach(r => {
          if (r.hide) {
            ctx.globalCompositeOperation = 'source-over'
            ctx.fillStyle = '#fff'
          } else {
            ctx.globalCompositeOperation = 'destination-out'
            ctx.fillStyle = '#fff'
          }
          if (r.type == 'polygon') {
            const poly = <Polygon>r.item
            ctx.beginPath()
            ctx.moveTo(poly.points[0], poly.points[1])
            for (let i =2; i < poly.points.length; i+=2) {
                ctx.lineTo(poly.points[i],poly.points[i+1] )
              }
            ctx.fill()
          } else if (r.type == 'circle') {
              const circle = <Circle>r.item
              ctx.beginPath()
              ctx.arc(circle.x, circle.y, circle.radius, 0, Math.PI * 2)
              ctx.fill()
          } else if (r.type == 'rectangle') {
              const rect = <Rectangle>r.item
              ctx.fillRect( rect.x, rect.y, rect.width , rect.height)
          } 
        })
      }

    update() {
        if (this.lastUpdate != this.fow.lastUpdate) {
            this.updateFow()
        }
    }
}