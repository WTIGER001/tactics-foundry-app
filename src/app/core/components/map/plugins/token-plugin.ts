import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map/map.component';
import { MapData, Annotation, TokenAnnotation, TokenBar, DistanceUnit, Distance } from 'src/app/core/model';
import { Point, Graphics, Sprite, Container, DisplayObject } from 'pixi.js';
import { Aura, AuraVisible } from 'src/app/core/model/aura';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { AnnotationPlugin } from './annotation-plugin';

export class TokenPlugin extends AnnotationPlugin<TokenAnnotation> {
    selected = true
    enabled = true
    editable = true

    container: Container
    bar: Graphics
    aura: Graphics
    info: Sprite
    tokenSprite: Sprite
    focusBox: Graphics

    public create(): DisplayObject {

        this.container = new Container()
        this.container.interactive = true

        // Create Each aura
        this.aura = new Graphics()
        this.container.addChild(this.aura)


        // Create Each Bar
        this.bar = new Graphics()
        this.container.addChild(this.bar)

        if (this.annotation.url) {
            this.tokenSprite = Sprite.from(this.annotation.url)
        } else {
            this.tokenSprite = Sprite.from("/assets/sprites/sample-token.png")
        }
        this.tokenSprite.interactive = true
        this.tokenSprite.buttonMode = true
        this.tokenSprite.x = this.annotation.x
        this.tokenSprite.y = this.annotation.y

        // this.tokenSprite.anchor.set(0.5, 0.5)
        this.container.addChild(this.tokenSprite)

        return this.container
    }

    updatePositionFromDrag(x, y) {
        console.log("DRagging Still", x, y);
        
        this.annotation.x = x
        this.annotation.y = y

        if (this.annotation.snap) {
            const pt = new Point(this.annotation.x, this.annotation.y)
            let gridSquare = this.layerMgr.session.mapview.grid.getGridCell(pt)
            this.annotation.x = gridSquare.x
            this.annotation.y = gridSquare.y
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
        let w: number
        let h: number
        if (this.annotation.sizeH > 0 && this.annotation.sizeW > 0) {
            w = this.annotation.sizeW * this.mapData.ppf
            h = this.annotation.sizeH * this.mapData.ppf
        } else if (this.annotation.size > 0) {
            w = h = this.annotation.size * this.mapData.ppf
        } else[
            w = h = 5
        ]

        // Update Auras

        // Determine which bars should be visible. 
        const visibleAuras = this.annotation.auras.filter(b => {
            if (b.visible == AuraVisible.NotVisible) {
                return false
            }
            if (b.visible == AuraVisible.Visible) {
                return true
            }
            if (b.visible == AuraVisible.OnHover) {
                return this.isHovering || this.layerMgr.isSelected(this.annotation)
            }
            if (b.visible == AuraVisible.OnSelect) {
                return this.layerMgr.isSelected(this.annotation)
            }
        })


        this.aura.clear()
        visibleAuras.forEach((a: Aura, i: number) => {
            if (a.fill) {
                let clr = LangUtil.colorNum(LangUtil.baseColor(a.fillColor))
                let clrAlpha = LangUtil.colorAlpha(a.fillColor)
                this.aura.beginFill(clr, clrAlpha)
            }
            if (a.border) {
                let clr = LangUtil.colorNum(LangUtil.baseColor(a.color))
                let clrAlpha = LangUtil.colorAlpha(a.color)
                if (a.weight == 1) {
                    this.aura.lineStyle(1, clr, clrAlpha, 0.5, true)
                } else {
                    this.aura.lineStyle(a.weight / scale, clr, clrAlpha)
                }
            }

            const dist = Distance.toFeet2(a.radius, a.radiusUnit) * this.mapData.ppf

            this.aura.drawCircle(
                this.tokenSprite.x + this.tokenSprite.width / 2,
                this.tokenSprite.y + this.tokenSprite.height / 2,
                dist)

            if (a.fill) {
                this.aura.endFill()
            }
        })

        // Update the Height
        this.tokenSprite.x = this.annotation.x
        this.tokenSprite.y = this.annotation.y
        this.tokenSprite.width = w
        this.tokenSprite.height = h

        // Update Bars
        this.bar.clear()

        // Determine which bars should be visible. 
        const visibleBars = this.annotation.bars.filter(b => {
            if (b.visible == AuraVisible.NotVisible) {
                return false
            }
            if (b.visible == AuraVisible.Visible) {
                return true
            }
            if (b.visible == AuraVisible.OnHover) {
                return this.isHovering || this.layerMgr.isSelected(this.annotation)
            }
            if (b.visible == AuraVisible.OnSelect) {
                return this.layerMgr.isSelected(this.annotation)
            }
        })

        // let visCnt = this.annotation.bars.map(b => b.visible?<number>1:<number>0).reduce( (total, num) => total + num);
        let barH = h / 10
        let barSpace = barH / 3

        let barTotalH = (visibleBars.length + 1) * barH + visibleBars.length * barSpace
        let cnt = 0
        visibleBars.forEach((b: TokenBar, i: number) => {
            let bg = LangUtil.colorNum(LangUtil.baseColor(b.bgColor))
            let bgAlpha = LangUtil.colorAlpha(b.bgColor)
            let clr = LangUtil.colorNum(LangUtil.baseColor(b.color))
            let clrAlpha = LangUtil.colorAlpha(b.bgColor)
            let full = b.value / b.max

            this.bar.beginFill(bg, bgAlpha)
            this.bar.drawRect(
                this.annotation.x,
                this.annotation.y - (barTotalH - cnt * (barH + barSpace)),
                w,
                barH)
            this.bar.endFill()

            this.bar.beginFill(clr, clrAlpha)
            this.bar.drawRect(
                this.annotation.x,
                this.annotation.y - (barTotalH - cnt * (barH + barSpace)),
                w * full,
                barH)
            this.bar.endFill()

        })
    }


}