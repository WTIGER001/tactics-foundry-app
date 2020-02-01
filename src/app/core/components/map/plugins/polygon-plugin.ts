import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map/map.component';
import { MapData, Annotation, TokenAnnotation, TokenBar, CircleAnnotation, ShapeAnnotation, Distance, Geom, RectangleAnnotation, Formatted, PolygonAnnotation, PolylineAnnotation } from 'src/app/core/model';
import { Point, Graphics, Sprite, Container, DisplayObject, interaction, Polygon } from 'pixi.js';
import { Aura } from 'src/app/core/model/aura';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { AnnotationPlugin } from './annotation-plugin';
import { ShockwaveFilter } from '@pixi/filter-shockwave';
import { runInThisContext } from 'vm';
import { ThrowStmt } from '@angular/compiler';
import { Handle } from './basic-plugin';

/**
 * This plugin is used to create, edit and display
 */
export class PathPlugin extends AnnotationPlugin<PolygonAnnotation | PolylineAnnotation> {
    selected = true
    enabled = true
    editable = true
    editing = true

    container: Container
    sprite: Graphics
    handles: Handle[] = []
    insertHandles: Handle[] = []

    public create(): DisplayObject {
        this.container = new Container()
        this.container.interactive = true

        this.sprite = new Graphics()
        this.sprite.interactive = true
        this.sprite.buttonMode = true
        this.container.addChild(this.sprite)

        this.updateHandles()

        if (!this.saved) {
            this.viewport.cursor = 'crosshair'
        }

        return this.container
    }

    public startEdit() {

    }

    getMainObject() {
        return this.sprite
    }


    updateModel() {
        this.updateHandles()
    }

    updateHandles() {
        const cnt = this.annotation.points.length / 2
        if (cnt < this.handles.length) {
            // Remove unnecessary handles
            const removed = this.insertHandles.splice(cnt - 1)
            removed.forEach(h => this.container.removeChild(h.handle))
        } else if (cnt > this.handles.length) {
            // Add necessary necessary handles
            const num = cnt - this.handles.length
            for (let i = 0; i < num; i++) {
                const handle = new Handle();
                handle.onClick = (event) => {
                    const indx = this.handles.findIndex(h => h.handle == event.target)
                    if (indx >= 0) {
                        if (this.saved) {
                            this.annotation.points.splice(indx * 2, 2)
                            const removed = this.handles.splice(indx, 1)
                            this.container.removeChild(removed[0].handle)
                        } else {
                            this.viewport.cursor = 'auto'
                            this.saved = true
                            this.remove()
                        }
                        this.layerMgr.storeAnnotation(this.annotation)
                    }
                }
                this.handles.push(handle)
                this.container.addChild(handle.handle)
            }
        }

        // Set the postiongs
        this.handles.forEach((h, i) => {
            h.x = this.annotation.points[i * 2]
            h.y = this.annotation.points[i * 2 + 1]
        })

        // Now the proposed handles
        const insertCnt = cnt > 2 ? cnt : cnt - 1
        if (insertCnt < this.insertHandles.length && insertCnt > 0) {
            const removed = this.insertHandles.splice(insertCnt - 1)
            removed.forEach(h => this.container.removeChild(h.handle))
        } else if (insertCnt > this.insertHandles.length && insertCnt > 0) {
            const num = insertCnt - this.insertHandles.length
            for (let i = 0; i < num; i++) {
                const handle = new Handle();
                handle.handle.alpha = .5
                handle.onClick = (event) => {
                    const indx = this.insertHandles.findIndex(h => h.handle == event.target)
                    let h = this.insertHandles[indx]
                    this.annotation.points.splice((indx + 1) * 2, 0, h.x, h.y)
                    this.updateHandles()
                }
                // handle.onMove = (event) => {
                //     const indx = this.insertHandles.findIndex(h => h.handle == event.target)
                //     this.annotation.points.splice((indx + 1) * 2, 0, handle.x, handle.y)
                //     this.updateHandles()
                // }
                this.insertHandles.push(handle)
                this.container.addChild(handle.handle)

                if (PolylineAnnotation.is(this.annotation) && i == num-1) {
                    handle.handle.visible = false
                } 
            }
        }

    }

    updatePositionFromDrag(x: number, y: number) {
        const bounds = Geom.boundsXY(this.annotation.points)
        const xD = bounds.x - x
        const yD = bounds.y - y
        for (let i = 0; i < this.annotation.points.length; i += 2) {
            this.annotation.points[i] = this.annotation.points[i] - xD
            this.annotation.points[i + 1] = this.annotation.points[i + 1] - yD
        }
        this.handles.forEach((h, i) => {
            h.x = this.annotation.points[i * 2]
            h.y = this.annotation.points[i * 2 + 1]
        })
    }

    removePoint(event: interaction.InteractionEvent) {
        console.log("CLICKING", this)

        if (!this.saved) {
            // this.layerMgr.storeAnnotation(this.annotation)
            this.saved = true
        } else {
            const indx = this.handles.findIndex(h => h.handle == event.target)
            if (indx >= 0) {
                this.annotation.points.splice(indx * 2, 2)
                this.handles.splice(indx, 1)
            }
        }
    }

    addPoint(event: interaction.InteractionEvent) {
        console.log("CLICKING", this)
        let handle = event.target
        if (handle) {
            const indx = this.insertHandles.findIndex(h => h.handle == event.target)
            this.annotation.points.splice(indx, 0, handle.x, handle.y)
            this.updateHandles()
        }
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
        const editing = !this.dragging && (this.layerMgr.isSelected(this.annotation) || !this.saved)

        this.handles.forEach((h, i) => {
            this.annotation.points[i * 2] = h.x
            this.annotation.points[i * 2 + 1] = h.y
            h.update(this, editing)
        })

        this.insertHandles.forEach((h, i) => {
            let x1, y1, x2, y2: number
            if (this.annotation.points.length - 1 == i * 2) {
                if (PolygonAnnotation.is(this.annotation)) {
                x1 = this.annotation.points[0]
                y1 = this.annotation.points[1]
                x2 = this.annotation.points[i * 2]
                y2 = this.annotation.points[i * 2 + 1]
                }
            } else {
                x1 = this.annotation.points[i * 2]
                y1 = this.annotation.points[i * 2 + 1]
                x2 = this.annotation.points[i * 2 + 2]
                y2 = this.annotation.points[i * 2 + 3]
            }

            // Determine the middle
            h.x = (x1 + x2) / 2
            h.y = (y1 + y2) / 2
            h.update(this, editing)
        })

        // Format and draw

        this.updateLinestyle(this.annotation, this.sprite)


        if (PolylineAnnotation.is(this.annotation)) {
            this.drawPolyline()
        } else if (PolygonAnnotation.is(this.annotation)) {
            this.drawPolygon()
        }

    }
    drawPolygon() {
        let pts = this.annotation.points

        if (this.annotation.points.length >= 6) {
            this.updateFill(this.annotation, this.sprite)
            this.sprite.drawPolygon(this.annotation.points)
            this.finishFill(this.annotation, this.sprite)
        } else if (this.annotation.points.length == 4) {
            // this.sprite.lineStyle(2, 0, 1, 0.5, false)
            this.sprite.moveTo(this.annotation.points[0], this.annotation.points[1])
            this.sprite.lineTo(this.annotation.points[2], this.annotation.points[3])
            // this.drawdash(this.sprite, pts[0], pts[1], pts[2], pts[3])
        }

        //Now draw the construction lines to the mouse (we use the first handle and the last handle)
        if (!this.saved) {
            let mouse = this.map.app.renderer.plugins.interaction.mouse.global
            let pt = this.map.viewport.toWorld(mouse)

            // this.sprite.lineStyle(1, 0, 1, 0.5, false)
            if (pts.length >= 4) {
                this.sprite.moveTo(pts[pts.length-2], pts[pts.length-1])
                this.sprite.lineTo(pt.x, pt.y)
                this.sprite.moveTo(pts[0], pts[1])
                this.sprite.lineTo(pt.x, pt.y)
            } else if (pts.length == 2) {
                this.sprite.moveTo(pts[0], pts[1])
                this.sprite.lineTo(pt.x, pt.y)
            }
        }
    }


    drawPolyline() {
        let pts = this.annotation.points

        this.sprite.moveTo(this.annotation.points[0], this.annotation.points[1])
        for (let i=2; i < pts.length; i+=2) {
            this.sprite.lineTo(this.annotation.points[i], this.annotation.points[i+1])
        }

        //Now draw the construction lines to the mouse (we use the first handle and the last handle)
        if (!this.saved) {
            let mouse = this.map.app.renderer.plugins.interaction.mouse.global
            let pt = this.map.viewport.toWorld(mouse)

            // this.sprite.lineStyle(1, 0, 1, 0.5, false)
            if (pts.length > 0) {
                this.sprite.moveTo(pts[pts.length-2], pts[pts.length-1])
                this.sprite.lineTo(pt.x, pt.y)
            }
        }

        /// Now for the complicated part. We need to draw a polygon that is the hit area for the line
        // for now we are going to keep x constant
        let polyPoints = []
        const buffersize = 5 
        for (let i=0; i<pts.length; i+=2) {
            polyPoints.push(pts[i])
            polyPoints.push(pts[i+1] -buffersize)
        }
        for (let i=pts.length-2; i>=0; i-=2) {
            polyPoints.push(pts[i])
            polyPoints.push(pts[i+1] +buffersize)
        }
        // this.updateFill(this.annotation, this.sprite)
        // this.sprite.drawPolygon(polyPoints)
        // this.finishFill(this.annotation, this.sprite)
        this.sprite.hitArea = new Polygon(polyPoints)
    }

    down(event: PIXI.interaction.InteractionEvent): void {
        if (!this.saved) {
            let mouse = this.map.app.renderer.plugins.interaction.mouse.global
            let pt = this.map.viewport.toWorld(mouse)
            this.annotation.points.push(pt.x, pt.y)
            this.updateHandles()
        }
    }

    up(event: PIXI.interaction.InteractionEvent): void {

    }

}