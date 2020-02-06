import { Annotation, CircleAnnotation, Formatted, TokenAnnotation } from 'src/app/core/model';
import { ImageUtil } from 'src/app/core/util/ImageUtil';
import { Application, Graphics, Sprite } from 'pixi.js';
import { LangUtil } from 'src/app/core/util/LangUtil';

export class AnnotationPreviews {
    app : Application
    constructor(private width : number = 100, private height : number = 100) {
        this.app = new Application({
            resolution: devicePixelRatio, 
            autoDensity: true, 
            width : width, 
            height: height, 
            transparent: true,
            preserveDrawingBuffer: true
        });
        this.app.stop()
    }

    destroy() {
        this.app.destroy(true, {children: true, texture: true, baseTexture: true})
    }

    preview(annotation : Annotation) : string {
        if (CircleAnnotation.is(annotation)) {
            return this.previewCircle(annotation)
        } else if (TokenAnnotation.is(annotation)) {
            return this.previewToken(annotation)
        }
        return null
     }

     previewToken(token : TokenAnnotation) : string {
        // All tokens are in the 5 ft grid system and are square
        this.app.stage.removeChildren()
        const sprite = Sprite.from(token.url)
        this.app.stage.addChild(sprite)
    
        sprite.x = 0
        sprite.y = 0
        sprite.width = this.width
        sprite.height = this.height

        // Render and capture
        this.app.render()
        return this.app.renderer.view.toDataURL()
     }

    previewCircle(circle : CircleAnnotation) : string {
        this.app.stage.removeChildren()

        // Calculate the radius and center
        const x : number = this.width/2
        const y : number = this.height/2
        const r : number = this.width/2 - 2

        // Draw the circle
        const g = new Graphics()
        this.app.stage.addChild(g)
        
        this.beginFill(circle, g)
        this.linestyle(circle, g)
        g.drawCircle(x, y, r)
        this.endFill(circle, g)

        // Render and capture
        this.app.render()
        return this.app.renderer.view.toDataURL()
    }


    public endFill(item: Formatted, sprite: Graphics) {
        if (item.fill) {
            sprite.endFill()
        }
    }

    public linestyle(item: Formatted, sprite: Graphics) {
        if (item.border) {
            let clr = LangUtil.colorNum(LangUtil.baseColor(item.color))
            let alpha = LangUtil.colorAlpha(item.color)
            if (item.weight == 1) {
                sprite.lineStyle(1, clr, alpha, 0.5, true)
            } else {
                sprite.lineStyle(item.weight, clr, alpha, 0.5, false)
            }
        }
    }

    public beginFill(item: Formatted, sprite: Graphics) {
        if (item.fill) {
            let clr = LangUtil.colorNum(LangUtil.baseColor(item.fillColor))
            let alpha = LangUtil.colorAlpha(item.fillColor)
            sprite.beginFill(clr, alpha)
        }
    }

}