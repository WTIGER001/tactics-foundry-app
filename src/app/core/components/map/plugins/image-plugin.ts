import { RectanglePlugin } from './rectangle-plugin';
import { MapLayerManager } from '../map/layer-manager';
import { Sprite } from 'pixi.js';
import { ImageAnnotation } from 'src/app/core/model';
import { RectangularPlugin } from './abstract-rectangular-plugin';


export class ImagePlugin extends RectangularPlugin<ImageAnnotation> {

    constructor(l : MapLayerManager) {
        super(l)
    }

    createSprite() {
        let sprite = new Sprite()
        if (this.annotation.url) {
            sprite = Sprite.from(this.annotation.url)
        } else {
            sprite = Sprite.from("/assets/missing.png")
        }
        sprite.interactive = true
        sprite.buttonMode = true
        return sprite
    }

    updateSprite() {
        let a = <ImageAnnotation> this.annotation

        this.sprite.x = this.annotation.x
        this.sprite.y = this.annotation.y
        this.sprite.width =  this.annotation.w * this.ppf
        this.sprite.height =  this.annotation.h * this.ppf
    }

}