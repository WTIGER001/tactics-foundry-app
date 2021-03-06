import { RectanglePlugin } from './rectangle-plugin';
import { MapLayerManager } from '../map/layer-manager';
import { Sprite, Text, TextStyle, Texture } from 'pixi.js';
import { ImageAnnotation, TextAnnotation } from 'src/app/core/model';
import { RectangularPlugin } from './abstract-rectangular-plugin';

// Need to make this editable. See https://github.com/limikael/PixiTextInput/blob/master/src/PixiTextInput.js for ideas 
export class TextPlugin extends RectangularPlugin<ImageAnnotation> {
    style : TextStyle = new TextStyle()
    text : string = "MISSING"

    constructor(l : MapLayerManager) {
        super(l);
    }

    createSprite() : Text {
        let sprite = new Text(this.annotation.name, this.style)
        sprite.interactive = true
        sprite.buttonMode = true
        return sprite
    }

    updateSprite() {
        let a = <TextAnnotation> this.annotation
        let sprite = <Text> this.sprite

        this.sprite.x = this.annotation.x
        this.sprite.y = this.annotation.y
        sprite.text = this.annotation.name
        sprite.style = a.style
        // this.sprite.width =  this.annotation.w * this.ppf
        // this.sprite.height =  this.annotation.h * this.ppf
    }
    
}