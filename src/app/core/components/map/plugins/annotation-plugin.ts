import { Plugin, Viewport } from 'pixi-viewport';
import { Annotation, MapData, Geom } from 'src/app/core/model';
import { Container, DisplayObject, Graphics } from 'pixi.js';
import { MapLayerManager } from '../map/layer-manager';
import { MapComponent } from '../map/map.component';

export abstract class AnnotationPlugin<T extends Annotation> extends Plugin {
    annotation: T
    layer: Container
    object: DisplayObject
    layerMgr: MapLayerManager
    constructor(l: MapLayerManager) {
        super(l.session.mapview.viewport)
        this.layerMgr = l
    }

    setAnnotation(a: T) {
        this.layer = this.layerMgr.getLayer(a.layer)
        if (this.annotation) {
            this.annotation = a
            this.fixLayer()
            this.updateModel()
        } else {
            this.annotation = a
            this.add()
        }
        this.object['model'] = this.annotation
    }

    get map(): MapComponent {
        return this.layerMgr.session.mapview
    }

    get viewport(): Viewport {
        return this.layerMgr.session.mapview.viewport
    }

    get mapData(): MapData {
        return this.layerMgr.session.mapdata
    }

    get scale() : number {
        return this.map.viewport.scale.x
    }

    getMainObject() {
        return this.object
    }

    getDisplayObject(): DisplayObject {
        return this.object
    }

    abstract create(): DisplayObject;

    updateModel() {

    }

    public add() {
        this.object = this.create()
        this.object.name = this.annotation._id
        this.layer.addChild(this.object)
        this.viewport.plugins.add(this.annotation._id, this)

        this.object
            .on('mousedown', this.onDragStart, this)
            .on('touchstart', this.onDragStart, this)
            .on('mouseup', this.onDragEnd, this)
            .on('mouseupoutside', this.onDragEnd, this)
            .on('touchend', this.onDragEnd, this)
            .on('touchendoutside', this.onDragEnd, this)
            .on('mousemove', this.onDragMove, this)
            .on('touchmove', this.onDragMove, this)
            .on("mouseover", this.onMouseOver, this)
            .on("mouseout", this.onMouseOut, this);
    }

    public remove() {
        if (!this.layer.removeChild(this.object)) {
            this.removeFromAllLayers()
        }

        try {
            let index = this.layer.getChildIndex(this.object)
            if (index >=0) {
                this.layer.removeChildAt(index)
            }
        } catch (error) {
            
        }

        this.viewport.plugins.remove(this.annotation._id)
    }

    private fixLayer() {
        const correct = this.layer.getChildByName(this.annotation._id)
        if (!correct) {
            // Remove it from all layers
            this.removeFromAllLayers()

            // Now add it to the correct one
            this.layer.addChild(this.object)
        }
    }

    private removeFromAllLayers() {
        this.layerMgr.layers.forEach(l => l.removeChild(this.object))
    }

    // public updateShape(shape: ShapeAnnotation, sprite: Graphics) {
    //     sprite.clear()

    //     // Format
    //     this.updateLinestyle(shape, sprite)
    //     this.updateFill(shape, sprite)

    //     // Draw Shape
    //     if (shape.shapetype == ShapeType.Polyline) {
    //         for (let i = 0; i < shape.points.length - 1; i++) {
    //             sprite.moveTo(shape.points[i].x, shape.points[i].y)
    //             sprite.lineTo(shape.points[i + 1].x, shape.points[i + 1].y)
    //         }
    //     } else {
    //         sprite.drawShape(shape.toShape())
    //     }

    //     if (shape.fill) {
    //         sprite.endFill()
    //     }
    // }

    // public updateLinestyle(sprite: Graphics) {
    //     if (circle.border) {
    //         let clr = LangUtil.colorNum(LangUtil.baseColor(circle.color))
    //         let alpha = LangUtil.colorAlpha(circle.color)
    //         if (circle.weight == 1) {
    //             sprite.lineStyle(1, clr, alpha, 0.5, true)
    //         } else {
    //             sprite.lineStyle(circle.weight / this.map.viewport.scale.x, clr, alpha, 0.5, false)
    //         }
    //     }
    // }

    // public updateFill(circle: CircleAnnotation | ShapeAnnotation, sprite: Graphics) {
    //     if (circle.fill) {
    //         let clr = LangUtil.colorNum(LangUtil.baseColor(circle.fillColor))
    //         let alpha = LangUtil.colorAlpha(circle.fillColor)
    //         sprite.beginFill(clr, alpha)
    //     }
    // }


    /** DRAG SUPPORT */
    data
    dragData
    dragging = false
    isHovering = false


    onMouseOver(event) {
        this.isHovering = true
    }

    onMouseOut(event) {
        this.isHovering = false
    }

    onDragStart(event) {
        this.layerMgr.selection$.next(this.annotation)

        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        event.stopPropagationHint = true
        event.stopPropagation()
        this.dragData = event.data;
        // this.object.alpha = 0.5;
        this.dragging = true;
    }

    onDragEnd(event) {
        if (this.dragging) {
            event.stopPropagationHint = true
            event.stopPropagation()
        }
        let me: any = <any>this
        // this.object.alpha = 1;
        this.dragging = false;
        me.dragData = null;
        
    }

    onDragMove(event) {
        if (this.dragging) {
            var newPosition = this.dragData.getLocalPosition(this.object.parent);
            // me.position.x = newPosition.x;
            // me.position.y = newPosition.y;
            
            this.updatePositionFromDrag(newPosition.x, newPosition.y)
            // this.layerMgr.session.limitedUpdates$.next(this.annotation)
        }
    }


    updatePositionFromDrag(x: number, y: number) {
    
    }


}


/**
 * This is a grab handle for  resizing
 */
export class Handle {
    enabled = true
    handle = new Graphics()
    x: number
    y: number
    w = 7.5
    color = 0

    constructor() {
        this.handle = new Graphics()
        this.handle.interactive = true
        this.handle.buttonMode = true
        this.handle
            .on('mousedown', this.onDragStart, this)
            .on('touchstart', this.onDragStart, this)
            .on('mouseup', this.onDragEnd, this)
            .on('mouseupoutside', this.onDragEnd, this)
            .on('touchend', this.onDragEnd, this)
            .on('touchendoutside', this.onDragEnd, this)
            .on('mousemove', this.onDragMove, this)
            .on('touchmove', this.onDragMove, this)
            .on("mouseover", this.onMouseOver, this)
            .on("mouseout", this.onMouseOut, this);
    }

    update(plugin : AnnotationPlugin<Annotation>, enabled : boolean ) {
        this.handle.clear()
        if (enabled) {

            this.handle.beginFill(this.color, 1)
            this.handle.lineStyle(1, 0xFFFFFF, 1, 0.5, true)
            const r = Geom.centerHandle(this.x, this.y, this.w / plugin.scale)
            this.handle.drawShape(r)
            this.handle.endFill()
        }
    }

    /** DRAG SUPPORT */
    data
    dragData
    dragging = false
    isHovering = false


    onMouseOver(event) {
        this.isHovering = true
    }

    onMouseOut(event) {
        this.isHovering = false
    }

    onDragStart(event) {
     
        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        event.stopPropagationHint = true
        event.stopPropagation()
        this.dragData = event.data;
        this.dragging = true;
    }

    onDragEnd(event) {
        if (this.dragging) {
            event.stopPropagationHint = true
            event.stopPropagation()
        }
        let me: any = <any>this
        this.dragging = false;
        me.dragData = null;
        
    }

    onDragMove(event) {
        if (this.dragging) {
            var newPosition = this.dragData.getLocalPosition(this.handle.parent);
            // me.position.x = newPosition.x;
            // me.position.y = newPosition.y;
            
            this.x = newPosition.x
            this.y = newPosition.y
        }
    }



}