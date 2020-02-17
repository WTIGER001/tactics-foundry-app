import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map/map.component';
import { MapData, Annotation, TokenAnnotation, TokenBar, CircleAnnotation, ShapeAnnotation, Distance, Geom, RectangleAnnotation, Formatted } from 'src/app/core/model';
import { Point, Graphics, Sprite, Container, DisplayObject } from 'pixi.js';
import { Aura } from 'src/app/core/model/aura';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { AnnotationPlugin } from './annotation-plugin';
import { ShockwaveFilter } from '@pixi/filter-shockwave';
import { Handle } from './basic-plugin';
import { RectangularPlugin } from './abstract-rectangular-plugin';

/**
 * This plugin is used to create, edit and display
 */
export class RectanglePlugin extends RectangularPlugin<RectangleAnnotation> {
    createSprite() : Graphics | Sprite {
        let sprite = new Graphics()
        sprite.interactive = true
        sprite.buttonMode = true
        return sprite
    }

    updateSprite() {
        let sprite : Graphics = <Graphics> this.sprite

        sprite.clear()
        
        this.updateFill(this.annotation, sprite)
        this.updateLinestyle(this.annotation, sprite)

        sprite.drawRect(this.annotation.x, this.annotation.y, this.annotation.w * this.ppf, this.annotation.h * this.ppf)
        this.finishFill(this.annotation, sprite)
    }

}