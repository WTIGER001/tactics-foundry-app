import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map/map.component';
import { MapData, Annotation, TokenAnnotation, TokenBar, CircleAnnotation, ShapeAnnotation, Distance, Geom, RectangleAnnotation, Formatted } from 'src/app/core/model';
import { Point, Graphics, Sprite, Container, DisplayObject } from 'pixi.js';
import { Aura } from 'src/app/core/model/aura';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { AnnotationPlugin, Handle } from './annotation-plugin';
import { ShockwaveFilter } from '@pixi/filter-shockwave';

/**
 * This plugin is used to create, edit and display
 */
export class RectanglePlugin extends AnnotationPlugin<RectangleAnnotation> {
    selected = true
    enabled = true
    editable = true
    editing = true

    container: Container
    sprite: Graphics
    handletl: Handle
    handletr: Handle
    handlebl: Handle
    handlebr: Handle

    public create(): DisplayObject {
        this.container = new Container()
        this.container.interactive = true

        this.sprite = new Graphics()
        this.sprite.interactive = true
        this.container.addChild(this.sprite)

        this.handletl = new Handle()
        this.handletr = new Handle()
        this.handlebl = new Handle()
        this.handlebr = new Handle()
        this.container.addChild(this.handletl.handle)
        this.container.addChild(this.handletr.handle)
        this.container.addChild(this.handlebl.handle)
        this.container.addChild(this.handlebr.handle)

        //Place the handle at 45deg (from north)

        this.handletl.x = this.handlebl.x = this.annotation.x
        this.handletl.y = this.handletr.y = this.annotation.y
        this.handletr.x = this.handlebr.x = this.annotation.x + this.annotation.w * this.ppf
        this.handlebl.y = this.handlebr.y = this.annotation.y + this.annotation.h * this.ppf

        return this.container
    }

    public startEdit() {

    }

    getMainObject() {
        return this.sprite
    }

    updatePositionFromDrag(x: number, y: number) {
        this.annotation.x = x
        this.annotation.y = y

        // Update the handle
        this.handletl.x = this.handlebl.x = this.annotation.x
        this.handletl.y = this.handletr.y = this.annotation.y
        this.handletr.x = this.handlebr.x = this.annotation.x + this.annotation.w * this.ppf
        this.handlebl.y = this.handlebr.y = this.annotation.y + this.annotation.h * this.ppf
    }


    // wheel(event: WheelEvent): void
    // update(): void
    // resize(): void
    // reset(): void
    // pause(): void
    // resume(): void

    update() {
        this.sprite.clear()

        if (!this.enabled) {
            return;
        }

        // Calculate the new radius based on the location of the handle
        if (this.handletl.dragging) {
            this.annotation.x = this.handletl.x
            this.annotation.y = this.handletl.y

            // W and H are now calculate from br handle
            this.annotation.w = (this.handlebr.x - this.handletl.x) / this.ppf
            this.annotation.h = (this.handlebr.y - this.handletl.y) / this.ppf
        } else if (this.handlebr.dragging) {
            // W and H are now calculate from br handle
            this.annotation.w = (this.handlebr.x - this.handletl.x) / this.ppf
            this.annotation.h = (this.handlebr.y - this.handletl.y) / this.ppf
        } else if (this.handletr.dragging) {
            this.annotation.y = this.handletr.y

            this.annotation.w = (this.handletr.x - this.handletl.x) / this.ppf
            this.annotation.h = (this.handlebr.y - this.handletr.y) / this.ppf
        } else if (this.handlebl.dragging) {
            this.annotation.x = this.handlebl.x

            this.annotation.w = (this.handlebr.x - this.handlebl.x) / this.ppf
            this.annotation.h = (this.handlebl.y - this.handletl.y) / this.ppf
            console.log(this.annotation.h, this.handletl.y, this.handlebl.y);
            
        }

        this.annotation.w = +(this.annotation.w.toFixed(1))
        this.annotation.h = +(this.annotation.h.toFixed(1))

        // Format and draw
        this.updateFill(this.annotation, this.sprite)
        this.updateLinestyle(this.annotation, this.sprite)

        this.sprite.drawRect(this.annotation.x, this.annotation.y, this.annotation.w * this.ppf, this.annotation.h * this.ppf)

        this.finishFill(this.annotation, this.sprite)

        // Update handles
        const editing = this.dragging || this.layerMgr.isSelected(this.annotation)

        // Update the other handles

        this.handletl.x = this.handlebl.x = this.annotation.x
        this.handletl.y = this.handletr.y = this.annotation.y
        this.handletr.x = this.handlebr.x = this.annotation.x + this.annotation.w * this.ppf
        this.handlebl.y = this.handlebr.y = this.annotation.y + this.annotation.h * this.ppf

        this.handlebl.update(this, editing)
        this.handlebr.update(this, editing)
        this.handletl.update(this, editing)
        this.handletr.update(this, editing)
    }



}