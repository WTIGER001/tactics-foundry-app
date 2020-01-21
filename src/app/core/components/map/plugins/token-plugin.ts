import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map/map.component';
import { MapData, Annotation, TokenAnnotation, TokenBar } from 'src/app/core/model';
import { Point, Graphics, Sprite, Container, DisplayObject } from 'pixi.js';
import { Aura } from 'src/app/core/model/aura';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { AnnotationPlugin } from './annotation-plugin';

export class TokenPlugin extends AnnotationPlugin<TokenAnnotation> {
    selected = true
    enabled = true
    editable = true

    container: Container
    bar: Graphics
    aura: Graphics
    info : Sprite
    tokenSprite : Sprite
    focusBox : Graphics

    public create() : DisplayObject{
               
        this.container = new Container()
        this.container.interactive = true

        if (this.annotation.url) {
            this.tokenSprite = Sprite.from(this.annotation.url)
        } else {
            this.tokenSprite = Sprite.from("/assets/sprites/sample-token.png")
        }
        this.tokenSprite.interactive = true
        this.tokenSprite.buttonMode = true
        this.tokenSprite.x = this.annotation.location.x
        this.tokenSprite.y = this.annotation.location.y
        this.tokenSprite.width = this.annotation.location.width
        this.tokenSprite.height = this.annotation.location.height
        
        // this.tokenSprite.anchor.set(0.5, 0.5)
        this.container.addChild(this.tokenSprite)

        // Create Each Bar
        this.bar = new Graphics()
        this.container.addChild(this.bar)

        // Create Each aura
        this.aura = new Graphics()
        this.container.addChild(this.aura)


        // Need to dynamically update Below


        // Create the Selecton 
        // this.focusBox = new Graphics()
        // this.focusBox.lineStyle(0.25, 0x0000FF, .8, 1)
        // this.focusBox.drawRect(this.annotation.location.x, this.annotation.location.y, this.annotation.location.width, this.annotation.location.height)
        // this.container.addChild(this.focusBox)

        // Create the info button
        // this.info = Sprite.from("/assets/sprites/info-button.png")
        // this.info.interactive = true
        // this.info.buttonMode = true
        // this.info.anchor.set(0.5, 0)
        // this.info.x = this.annotation.location.x +this. annotation.location.width/2
        // this.info.y = this.annotation.location.y + this.annotation.location.height + 3
        // this.info.width = 5
        // this.info.height = 5
        // this.container.addChild(this.info)

        return this.container
    }

    updatePositionFromDrag(x, y) {
        this.annotation.location.x = x
        this.annotation.location.y = y

        if (this.annotation.snap) {
            let gridSquare = this.layerMgr.session.mapview.grid.getGridCell(this.annotation.center())
            this.annotation.location.x = gridSquare.x
            this.annotation.location.y = gridSquare.y
            // this.annotation.location.width = gridSquare.width
            // this.annotation.location.height = gridSquare.height
        }
    }

    update() {
        if (!this.enabled) {
            return;
        }

        let scale = this.map.viewport.scale.x

        // Calculate the size
        let w : number 
        let h: number
        if (this.annotation.sizeH > 0 && this.annotation.sizeW > 0) {
            w = this.annotation.sizeW * this.mapData.ppf
            h = this.annotation.sizeH * this.mapData.ppf
        } else if (this.annotation.size > 0) {
            w = h = this.annotation.size * this.mapData.ppf
        } else [
            w = h = 5
        ]

        // Update Auras
        this.aura.clear()
        this.annotation.auras.forEach( (a : Aura, i : number) => {
            if (a.fill) {
                let clr = LangUtil.colorNum(LangUtil.baseColor( a.fillColor))
                let clrAlpha = LangUtil.colorAlpha(a.fillColor)
                this.aura.beginFill()
            }
            if (a.border) {
                let clr = LangUtil.colorNum(LangUtil.baseColor( a.color))
                let clrAlpha = LangUtil.colorAlpha(a.color)
                if (a.weight == 1) {
                    this.aura.lineStyle(1, clr, clrAlpha, 0.5, true)
                } else {
                    this.aura.lineStyle(a.weight/scale, clr, clrAlpha)
                }
            }
            this.aura.drawCircle(
                this.tokenSprite.x + this.tokenSprite.width/2, 
                this.tokenSprite.y + this.tokenSprite.height/2, 
                a.radius.asFeet())

            if (a.fill) {
                this.aura.endFill()
            }
        })

        // Update the Height
        this.tokenSprite.x = this.annotation.location.x
        this.tokenSprite.y = this.annotation.location.y
        this.tokenSprite.width = w
        this.tokenSprite.height = h

        // Update Bars
        this.bar.clear()
        // let visCnt = this.annotation.bars.map(b => b.visible?<number>1:<number>0).reduce( (total, num) => total + num);
        let barH = this.annotation.location.height / 10
        let barSpace = barH/3

        let barTotalH = (this.annotation.bars.length+1) * barH + this.annotation.bars.length * barSpace
        let cnt = 0
        this.annotation.bars.forEach( (b : TokenBar, i : number) => {
            // if (b.visible) {
                let bg = LangUtil.colorNum(LangUtil.baseColor( b.bgColor))
                let bgAlpha = LangUtil.colorAlpha(b.bgColor)
                let clr = LangUtil.colorNum(LangUtil.baseColor( b.color))
                let clrAlpha = LangUtil.colorAlpha(b.bgColor)
                let full = b.value / b.max

                this.bar.beginFill(bg, bgAlpha )
                this.bar.drawRect(
                    this.annotation.location.x, 
                    this.annotation.location.y - (barTotalH - cnt*(barH + barSpace)),
                    this.annotation.location.width,
                    barH)
                this.bar.endFill()

                this.bar.beginFill(clr, clrAlpha )
                this.bar.drawRect(
                    this.annotation.location.x, 
                    this.annotation.location.y - (barTotalH - cnt*(barH + barSpace)) ,
                    this.annotation.location.width * full,
                    barH)
                this.bar.endFill()

                cnt++
            // }

        })
    }

    
}