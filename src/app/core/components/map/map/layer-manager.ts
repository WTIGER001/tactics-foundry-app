import { MapData, CircleAnnotation, ShapeAnnotation, ShapeType, PolygonAnnotation, TokenAnnotation, TokenBar } from 'src/app/core/model';
import { MapComponent } from './map.component'
import { GraphicsGeometry, Graphics, SpriteMaskFilter, Rectangle, Sprite, Container } from 'pixi.js';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { Aura } from 'src/app/core/model/aura';


/**
 * The Map Manager is responsible for managing the layers and the contents of a map. 
 * 
 * Layer Order:
 *  Fog of War
 *  Shapes
 *  Tokens
 *  Background Tokens
 *  Grid
 *  Background
 */
export class MapLayerManager {
    constructor(private map : MapComponent, private mapData : MapData) {

    }

    public createToken(token : TokenAnnotation) : PIXI.Container {
        // Create the main sprite from an image
        
        let container = new Container()

        let tokenSprite = Sprite.from("/assets/sprites/sample-token.png")
        tokenSprite.x = token.location.x
        tokenSprite.y = token.location.y
        tokenSprite.width = token.location.width
        tokenSprite.height = token.location.height
        // tokenSprite.anchor.set(0.5, 0.5)
        container.addChild(tokenSprite)

        // Create Each Bar
        token.bars.forEach( (b : TokenBar, i : number) => {

        })

        // Create Each aura
        token.auras.forEach( (aura:Aura, i : number) => {

        })

        // Need to dynamically update Below


        // Create the Selecton 
        let focusBox = new Graphics()
        focusBox.lineStyle(0.25, 0x0000FF, .8, 1)
        focusBox.drawRect(token.location.x, token.location.y, token.location.width, token.location.height)
        container.addChild(focusBox)

        // Create the info button
        let info = Sprite.from("/assets/sprites/info-button.png")
        info.anchor.set(0.5, 0)
        info.x = token.location.x + token.location.width/2
        info.y = token.location.y + 3
        container.addChild(info)

        return container
    }


    public updateToken(token: TokenAnnotation, sprite : Sprite) {
        

    }

    public makeShapeSprite(shape : ShapeAnnotation) : Graphics {
        return new Graphics()
    }

    public updateShape(shape : ShapeAnnotation, sprite: Graphics) {
        sprite.clear()

        // Format
        this.updateLinestyle(shape, sprite)
        this.updateFill(shape, sprite)

        // Draw Shape
        if (shape.shapetype == ShapeType.Polyline) {
            for (let i=0; i<shape.points.length-1; i++) {
                sprite.moveTo(shape.points[i].x, shape.points[i].y)
                sprite.lineTo(shape.points[i+1].x, shape.points[i+1].y)
            }
        } else {
            sprite.drawShape(shape.toShape())
        }

        if (shape.fill) {
            sprite.endFill()
        }
    }

    public updateLinestyle(circle : CircleAnnotation | ShapeAnnotation, sprite: Graphics) {
        if (circle.border) {
            let clr = LangUtil.colorNum(LangUtil.baseColor(circle.color))
            let alpha = LangUtil.colorAlpha(circle.color)
            if (circle.weight == 1) {
                sprite.lineStyle(1, clr, alpha, 0.5, true)
            } else {
                sprite.lineStyle(circle.weight /this.map.viewport.scale.x, clr, alpha, 0.5, false)
            }
        }
    }

    public updateFill(circle : CircleAnnotation | ShapeAnnotation, sprite : Graphics) {
        if (circle.fill) {
            let clr = LangUtil.colorNum(LangUtil.baseColor(circle.fillColor))
            let alpha = LangUtil.colorAlpha(circle.fillColor)
            sprite.beginFill(clr, alpha)
        }
    }
}