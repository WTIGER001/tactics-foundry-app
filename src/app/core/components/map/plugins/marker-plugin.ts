import { AnnotationPlugin } from './annotation-plugin';
import { MarkerTypeAnnotation } from 'src/app/core/model';
import { Sprite, Graphics, Container, Texture } from 'pixi.js';

export class MarkerPlugin extends AnnotationPlugin<MarkerTypeAnnotation> {
    sprite : Sprite
    container : Container
    url : string
    create(): PIXI.DisplayObject {
        this.url = this.annotation.url
        this.sprite = Sprite.from(this.annotation.url)
        this.sprite.interactive = true
        this.sprite.buttonMode = true
        this.sprite.x = this.annotation.x
        this.sprite.y = this.annotation.y
        this.sprite.anchor.x = this.annotation.ax / this.annotation.w
        this.sprite.anchor.y = this.annotation.ay / this.annotation.h
        this.container = new Container
        this.container.interactive = true
        this.container.addChild(this.sprite)
        return this.container
    }

    updatePositionFromDrag(x : number, y : number) {
        console.log(" MARKER DRAGGING ", x, y)
        this.annotation.x = x
        this.annotation.y = y
    }

    update() {
        this.sprite.x = this.annotation.x
        this.sprite.y = this.annotation.y
        this.sprite.width = this.annotation.w * this.annotation.scale / this.scale
        this.sprite.height = this.annotation.h * this.annotation.scale / this.scale
        if (this.url != this.annotation.url) {
            this.url = this.annotation.url
            const t = Texture.from(this.url)
            this.sprite.texture = t
        }
    }
}