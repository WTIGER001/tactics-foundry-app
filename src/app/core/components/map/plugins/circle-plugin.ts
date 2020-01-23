import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map/map.component';
import { MapData, Annotation, TokenAnnotation, TokenBar, CircleAnnotation, ShapeAnnotation, Distance, Geom } from 'src/app/core/model';
import { Point, Graphics, Sprite, Container, DisplayObject } from 'pixi.js';
import { Aura } from 'src/app/core/model/aura';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { AnnotationPlugin, Handle } from './annotation-plugin';
import {ShockwaveFilter} from '@pixi/filter-shockwave';

/**
 * This plugin is used to create, edit and display
 */
export class CirclePlugin extends AnnotationPlugin<CircleAnnotation> {
    readonly HANDLE_SIZE = 5; 
    selected = true
    enabled = true
    editable = true
    editing = true

    container: Container
    sprite: Graphics
    handle : Handle
    handleAngle = 0

    public create() : DisplayObject {
        this.container = new Container()
        this.container.interactive = true

        this.sprite = new Graphics()
        this.sprite.interactive = true
        this.container.addChild(this.sprite)
        
        this.handle = new Handle()
        this.container.addChild(this.handle.handle)

        //Place the handle at 45deg (from north)
        this.handleAngle = 5.49779
        let rDist = this.annotation.radius * this.mapData.ppf
        this.handle.x = this.annotation.x + Math.cos(this.handleAngle) * rDist
        this.handle.y = this.annotation.y + Math.sin(this.handleAngle) * rDist

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

        // Update the handle
        let rDist = this.annotation.radius * this.mapData.ppf
        this.handle.x = this.annotation.x + Math.cos(this.handleAngle) * rDist
        this.handle.y = this.annotation.y + Math.sin(this.handleAngle) * rDist
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

        let scale = this.map.viewport.scale.x

        // Draw the circle
        this.updateFill(this.annotation, this.sprite)
        this.updateLinestyle(this.annotation, this.sprite)
        // console.log("UPDATE ", this.annotation.x, " ", this.annotation.y," ",  this.handle.x, " ", this.handle.y);

        // Calculate the new radius based on the location of the handle
        const xD = (this.annotation.x - this.handle.x) / this.mapData.ppf
        const yD = (this.annotation.y - this.handle.y) / this.mapData.ppf
        this.annotation.radius = Math.sqrt(xD*xD + yD*yD)
        this.annotation.radius = +(this.annotation.radius.toFixed(1))

        this.handleAngle = Math.atan2(yD, xD) - Math.PI // Corrects the wierd quadrant flipping of atan2

        //TODO: Maybe use the ppf
        let r = this.annotation.radius >0 ? this.annotation.radius : 5 
        let rDist = r * this.mapData.ppf
        this.sprite.drawCircle(this.annotation.x, this.annotation.y, rDist)    
        this.finishFill(this.annotation, this.sprite)


        const editing = this.dragging || this.layerMgr.isSelected(this.annotation)
        this.handle.update(this, editing)
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