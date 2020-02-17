import { AnnotationPlugin } from './annotation-plugin';
import { Annotation, RectangularAnnotation } from 'src/app/core/model';
import { Container, DisplayObject, Graphics, Sprite } from 'pixi.js';
import { Handle } from './basic-plugin';

export abstract class RectangularPlugin<T extends RectangularAnnotation> extends AnnotationPlugin<T> {
    selected = true
    enabled = true
    editable = true
    editing = true

    container: Container
    sprite: Graphics | Sprite
    handletl: Handle
    handletr: Handle
    handlebl: Handle
    handlebr: Handle

    public create(): DisplayObject {
        this.container = new Container()
        this.container.interactive = true

        this.sprite = this.createSprite()
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

    abstract createSprite() : Graphics | Sprite 

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

    update() {
        if (!this.enabled) {
            return;
        }

        // Calculate the new radius based on the location of the handle
        if (this.handletl.dragging) {
            this.annotation.x = this.handletl.x
            this.annotation.y = this.handletl.y

            this.annotation.w = (this.handlebr.x - this.handletl.x) / this.ppf
            this.annotation.h = (this.handlebr.y - this.handletl.y) / this.ppf
        } else if (this.handlebr.dragging) {
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
        }

        this.annotation.w = +(this.annotation.w.toFixed(1))
        this.annotation.h = +(this.annotation.h.toFixed(1))

        // Format and draw
        this.updateSprite()
        
        // Update handles
        const editing = !this.dragging && (this.layerMgr.isSelected(this.annotation)  || !this.autostore)

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


    protected updatePositions() {

    }


    abstract updateSprite()

}