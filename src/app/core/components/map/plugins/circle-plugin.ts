import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map/map.component';
import { MapData, Annotation, TokenAnnotation, TokenBar, CircleAnnotation, ShapeAnnotation } from 'src/app/core/model';
import { Point, Graphics, Sprite, Container, DisplayObject } from 'pixi.js';
import { Aura } from 'src/app/core/model/aura';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { AnnotationPlugin } from './annotation-plugin';
import {ShockwaveFilter} from '@pixi/filter-shockwave';

/**
 * This plugin is used to create, edit and display
 */
export class CirclePlugin extends AnnotationPlugin<CircleAnnotation> {
    selected = true
    enabled = true
    editable = true
    editing = true

    container: Container
    sprite: Graphics
    handle: Graphics

    public create() : DisplayObject {
        this.container = new Container()
        this.container.interactive = true

        this.sprite = new Graphics()
        this.sprite.interactive = true
        this.container.addChild(this.sprite)
        
        this.handle = new Graphics()
        this.handle.interactive = true
        this.handle.buttonMode = true
        this.container.addChild(this.handle)


        return this.container
    }

    public startEdit() {

    }

    getMainObject() {
        return this.sprite
    }

    updatePositionFromDrag(x: number, y:number) {
        this.annotation.x = x
        this.annotation.y = y
    }
  

    // wheel(event: WheelEvent): void
    // update(): void
    // resize(): void
    // reset(): void
    // pause(): void
    // resume(): void

    update() {
        this.sprite.clear()
        this.handle.clear()
        if (!this.enabled) {
            return;
        }

        let scale = this.map.viewport.scale.x

        // Draw the circle
        this.updateFill(this.annotation, this.sprite)
        this.updateLinestyle(this.annotation, this.sprite)

        //TODO: Maybe use the ppf
        this.sprite.drawCircle(this.annotation.x, this.annotation.y, this.annotation.radius)    
        this.finishFill(this.annotation, this.sprite)

        // Draww the handle
        if (this.editing) {
            let size = this.map.viewport.screenWidth * scale
            // this.handle.
        }
    }

    public finishFill(circle : CircleAnnotation | ShapeAnnotation, sprite: Graphics) {
        if (circle.fill) {
            this.sprite.endFill()
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