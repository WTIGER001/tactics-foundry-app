import { Plugin } from 'pixi-viewport';
import { MapLayerManager } from '../map/layer-manager';
import { interaction, Sprite, Rectangle, Application, Texture, Circle, Polygon, Graphics, Container, BLEND_MODES, SCALE_MODES } from 'pixi.js';
import { FogOfWar } from 'src/app/core/model/map-model/fow';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { ImageUtil } from 'src/app/core/util/ImageUtil';

export class FogPlugin extends Plugin {
    protected layerMgr : MapLayerManager

    stale = false
    lastUpdate : number = 0

    constructor(l : MapLayerManager) {
        super(l.session.mapview.viewport)
        this.layerMgr = l
    }

    wheel() {
        return false
    }

    get fow() : FogOfWar {
        return this.layerMgr.session.mapdata.fog
    }

    updateMap() {
        const c = 
        this.fow.reveals.push({hide: false, type:'circle', item: new Circle(0, 0, 50)})
        this.fow.reveals.push({hide: true, type:'circle', item: new Circle(400, 400, 50)})
        this.updateFow()
    }

    add() {
        // this.layerMgr.session.mapview.fogLayer.addChild(this.fogSprite)
        this.layerMgr.session.mapview.viewport.plugins.add('fog', this)
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
        // Remove everything from the fog layer
        this.lastUpdate = this.fow.lastUpdate
        this.fogLayer.removeChildren()
        const m = this.layerMgr.session.mapdata

        let factor = this.layerMgr.session.mapdata.ppf

        let colorStr = this.layerMgr.session.isGM() ? this.fow.gmcolor : this.fow.color
        let alpha = LangUtil.colorAlpha(colorStr)
        let color = LangUtil.colorNum(LangUtil.baseColor(colorStr))

        if (this.fow.hideAll) {
            const g = new Graphics()
            g.beginFill(color, alpha)
            g.drawRect(0,0, m.width, m.height)
            g.endFill()
            this.fogLayer.addChild(g)
        }

        this.drawReveals(color, alpha, factor)
    }

    drawReveals(color : number, alpha: number, factor : number) {
        this.fow.reveals.forEach(r => {
            const g = new Graphics()
            console.log("Processing Reveal / Hide ", r)
            if (r.hide) {
                // g.blendMode = BLEND_MODES.SRC_OVER
                g.beginFill(color, alpha)
            } else {
                // g.blendMode = BLEND_MODES.DST_OUT
                g.beginFill(color, alpha)
            }
            g.drawShape(r.item)
            g.endFill()

            
            let text = this.layerMgr.session.mapview.app.renderer.generateTexture(g, SCALE_MODES.NEAREST, 1)
            const sprite = new Sprite(text)
            sprite.blendMode = BLEND_MODES.SRC_OVER

            if (r.type =='circle') {
                const c = <Circle>r.item
                sprite.x = c.x - c.radius 
                sprite.y = c.y - c.radius 
                // sprite.width = c.radius *2 
                // sprite.height = c.radius *2 
            }
            
            this.fogLayer.addChild(sprite)
          })
    }

    // drawShapes(ctx: CanvasRenderingContext2D, color: string, factor: number) {
    //     this.fow.reveals.forEach(r => {
    //       console.log("Processing Reveal / Hide ", r)
    //       if (r.hide) {
    //         ctx.globalCompositeOperation = 'source-over'
    //         ctx.fillStyle = color
    //       } else {
    //         ctx.globalCompositeOperation = 'destination-out'
    //         ctx.fillStyle = '#fff'
    //       }
    //       if (r.type == 'polygon') {
    //         const poly = <Polygon>r.item
    //         ctx.beginPath()
    //         ctx.moveTo(poly.points[0], poly.points[1])
    //         for (let i =2; i < poly.points.length; i+=2) {
    //             ctx.lineTo(poly.points[i],poly.points[i] )
    //           }
    //         ctx.fill()
    //       } else if (r.type == 'circle') {
    //           const circle = <Circle>r.item
    //           ctx.beginPath()
    //           ctx.arc(circle.x, circle.y, circle.radius * factor, 0, Math.PI * 2)
    //           ctx.fill()
    //       } else if (r.type == 'rectangle') {
    //           const rect = <Rectangle>r.item
    //           ctx.fillRect( rect.x, rect.y, rect.width* factor, rect.height* factor)
    //       } 
    //     })
    //   }

    update() {
        if (this.lastUpdate != this.fow.lastUpdate) {
            this.updateFow()
        }
    }
}