import { AnnotationPlugin } from './annotation-plugin';
import { Annotation, RectangularAnnotation, SnapMode, Geom } from 'src/app/core/model';
import { Container, DisplayObject, Graphics, Sprite, Point } from 'pixi.js';
import { Handle } from './basic-plugin';
import { ShapeUtil } from '../map/shapeutil';

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

    snap(pt : Point,  overrideSnapVertex : boolean = false, overrideSnapCenter: boolean = false) : Point {
        if (this.annotation.snapMode == SnapMode.SNAP_CENTER || overrideSnapCenter) {
            let square = this.layerMgr.session.mapview.grid.getGridCell(pt)
            let center =Geom.center(square)
            return center
        } else if (this.annotation.snapMode == SnapMode.SNAP_VERTEX || overrideSnapVertex) {
            let vertex = this.layerMgr.session.mapview.grid.getGridVertex(pt)
            return vertex
        } 
        return pt
    }

    getMainObject() {
        return this.sprite
    }

    updatePositionFromDrag(x: number, y: number) {
        let pt = this.snap(new Point(x, y), this.ctrl, this.alt)

        this.annotation.x = pt.x
        this.annotation.y = pt.y

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
            // Need to lock the opposite point
            // TOP LEFT
            let pt = this.snap(new Point(this.handletl.x, this.handletl.y), this.handletl.ctrl, this.handletl.alt)

            this.annotation.x = pt.x
            this.annotation.y = pt.y
            this.annotation.w = (this.handlebr.x - pt.x) / this.ppf
            this.annotation.h = (this.handlebr.y - pt.y) / this.ppf

            // Keep Aspect
            if (this.handletl.shift || this.annotation.keepAspect) {
                let pt2 = ShapeUtil.keepAspect(this.annotation.w, this.annotation.h, this.annotation.aspect, true)
                this.annotation.w = pt2.x
                this.annotation.h = pt2.y
            }
        } else if (this.handlebr.dragging) {
            // BOTTOM RIGHT
            let pt = this.snap(new Point(this.handlebr.x, this.handlebr.y), this.handlebr.ctrl, this.handlebr.alt)

            this.annotation.w = (pt.x - this.handletl.x) / this.ppf
            this.annotation.h = (pt.y - this.handletl.y) / this.ppf

            let pt2 = ShapeUtil.keepAspect(this.annotation.w, this.annotation.h, this.annotation.aspect, this.annotation.keepAspect)
            this.annotation.w = pt2.x
            this.annotation.h = pt2.y

            if (this.handlebr.shift || this.annotation.keepAspect) {
                let pt2 = ShapeUtil.keepAspect(this.annotation.w, this.annotation.h, this.annotation.aspect, true)
                this.annotation.w = pt2.x
                this.annotation.h = pt2.y
            }
        } else if (this.handletr.dragging) {
            // TOP RIGHT
            let pt = this.snap(new Point(this.handletr.x, this.handletr.y), this.handletr.ctrl, this.handletr.alt)

            this.annotation.y = pt.y
            this.annotation.w = (pt.x - this.handletl.x) / this.ppf
            this.annotation.h = (this.handlebr.y - pt.y) / this.ppf
        } else if (this.handlebl.dragging) {
            //BOTTOM LEFT
            let pt = this.snap(new Point(this.handlebl.x, this.handlebl.y), this.handlebl.ctrl, this.handlebl.alt)

            this.annotation.x = pt.x
            this.annotation.w = (this.handlebr.x - pt.x) / this.ppf
            this.annotation.h = (pt.y - this.handletl.y) / this.ppf
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