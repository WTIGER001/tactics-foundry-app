import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map/map.component';
import { MapData, Annotation, TokenAnnotation, TokenBar } from 'src/app/core/model';
import { Point, Graphics, Sprite, Container } from 'pixi.js';
import { Aura } from 'src/app/core/model/aura';
import { LangUtil } from 'src/app/core/util/LangUtil';

export class TokenPlugin extends Plugin {
    graphics : Graphics
    selected = true
    enabled = true
    editable = true

    container: Container
    bar: Graphics
    aura: Graphics
    info : Sprite
    tokenSprite : Sprite
    focusBox : Graphics


    constructor(private map: MapComponent, public mapData: MapData, public token : TokenAnnotation) {
        super(map.viewport)
        this.graphics = new Graphics()
    }

    public add() {
        this.create()
        this.map.viewport.addChild(this.container)
        this.map.viewport.plugins.add(this.token._id, this, 100)
    }

    public remove() {
        this.map.viewport.removeChild(this.container)
        this.map.viewport.plugins.remove(this.token._id)
    }

    public create() {
               
        this.container = new Container()
        this.container.interactive = true

        this.tokenSprite = Sprite.from("/assets/sprites/sample-token.png")
        this.tokenSprite.interactive = true
        this.tokenSprite.buttonMode = true
        this.tokenSprite.x = this.token.location.x
        this.tokenSprite.y = this.token.location.y
        this.tokenSprite.width = this.token.location.width
        this.tokenSprite.height = this.token.location.height
        
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
        this.focusBox = new Graphics()
        this.focusBox.lineStyle(0.25, 0x0000FF, .8, 1)
        this.focusBox.drawRect(this.token.location.x, this.token.location.y, this.token.location.width, this.token.location.height)
        this.container.addChild(this.focusBox)

        // Create the info button
        this.info = Sprite.from("/assets/sprites/info-button.png")
        this.info.interactive = true
        this.info.buttonMode = true
        this.info.anchor.set(0.5, 0)
        this.info.x = this.token.location.x +this. token.location.width/2
        this.info.y = this.token.location.y + this.token.location.height + 3
        this.info.width = 5
        this.info.height = 5
        this.container.addChild(this.info)

        return this.container
    }

    down(event: PIXI.interaction.InteractionEvent): void {
      
    }

    up(event: PIXI.interaction.InteractionEvent): void {
    
    }

    move(event: PIXI.interaction.InteractionEvent): void {

    }

    // wheel(event: WheelEvent): void
    // update(): void
    // resize(): void
    // reset(): void
    // pause(): void
    // resume(): void

    update() {
        this.graphics.clear()
        if (!this.enabled) {
            return;
        }

        let scale = this.map.viewport.scale.x

        // Update Auras
        this.aura.clear()
        this.token.auras.forEach( (a : Aura, i : number) => {
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
        this.tokenSprite.x = this.token.location.x
        this.tokenSprite.y = this.token.location.y
        this.tokenSprite.width = this.token.location.width
        this.tokenSprite.height = this.token.location.height

        // Update Bars
        this.bar.clear()
        // let visCnt = this.token.bars.map(b => b.visible?<number>1:<number>0).reduce( (total, num) => total + num);
        let barH = this.token.location.height / 10
        let barSpace = barH/3

        let barTotalH = (this.token.bars.length+1) * barH + this.token.bars.length * barSpace
        let cnt = 0
        this.token.bars.forEach( (b : TokenBar, i : number) => {
            // if (b.visible) {
                let bg = LangUtil.colorNum(LangUtil.baseColor( b.bgColor))
                let bgAlpha = LangUtil.colorAlpha(b.bgColor)
                let clr = LangUtil.colorNum(LangUtil.baseColor( b.color))
                let clrAlpha = LangUtil.colorAlpha(b.bgColor)
                let full = b.value / b.max

                this.bar.beginFill(bg, bgAlpha )
                this.bar.drawRect(
                    this.token.location.x, 
                    this.token.location.y - (barTotalH - cnt*(barH + barSpace)),
                    this.token.location.width,
                    barH)
                this.bar.endFill()

                this.bar.beginFill(clr, clrAlpha )
                this.bar.drawRect(
                    this.token.location.x, 
                    this.token.location.y - (barTotalH - cnt*(barH + barSpace)) ,
                    this.token.location.width * full,
                    barH)
                this.bar.endFill()

                cnt++
            // }

        })



        // Update the Focus Box
        this.focusBox.clear()
        if (this.selected) {
            this.focusBox.lineStyle(1/scale, 0x0000FF, .8, 1)
            this.focusBox.drawRect(this.token.location.x, this.token.location.y, this.token.location.width, this.token.location.height)
        }
        
        // Update the Info Icon
        if (this.selected) {
            this.info.width =  this.tokenSprite.width
            this.info.height =  this.tokenSprite.width
            this.info.y = this.token.location.y + this.token.location.height + 1
        } else {
            this.container.removeChild(this.info)
        }
    }

    
}