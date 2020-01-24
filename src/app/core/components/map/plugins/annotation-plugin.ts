import { Plugin, Viewport } from 'pixi-viewport';
import { Annotation, MapData, Geom, Formatted } from 'src/app/core/model';
import { Container, DisplayObject, Graphics, interaction } from 'pixi.js';
import { MapLayerManager } from '../map/layer-manager';
import { MapComponent } from '../map/map.component';
import { LangUtil } from 'src/app/core/util/LangUtil';

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

    get ppf(): number {
        return this.mapData.ppf
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

    public finishFill(item: Formatted, sprite: Graphics) {
        if (item.fill) {
            sprite.endFill()
        }
    }

    public updateLinestyle(item: Formatted, sprite: Graphics) {
        if (item.border) {
            let clr = LangUtil.colorNum(LangUtil.baseColor(item.color))
            let alpha = LangUtil.colorAlpha(item.color)
            if (item.weight == 1) {
                sprite.lineStyle(1, clr, alpha, 0.5, true)
            } else {
                sprite.lineStyle(item.weight / this.map.viewport.scale.x, clr, alpha, 0.5, false)
            }
        }
    }

    public updateFill(item: Formatted, sprite: Graphics) {
        if (item.fill) {
            let clr = LangUtil.colorNum(LangUtil.baseColor(item.fillColor))
            let alpha = LangUtil.colorAlpha(item.fillColor)
            sprite.beginFill(clr, alpha)
        }
    }


    /** DRAG SUPPORT */
    data
    dragData
    dragging = false
    isHovering = false
    offsetX
    offsetY


    onMouseOver(event) {
        this.isHovering = true
    }

    onMouseOut(event) {
        this.isHovering = false
    }

    onDragStart(event : interaction.InteractionEvent) {
        this.layerMgr.selection$.next(this.annotation)

        // Need to know the position of the mouse relative to the ur corner. That needs t be saved as an offset
        // console.log(event.data.getLocalPosition(this.object),this.annotation['x'], this.annotation['y']) 

        const pos = event.data.getLocalPosition(this.object)
        this.offsetX = this.annotation.x - pos.x
        this.offsetY = this.annotation.y - pos.y

        // store a reference to the data
        // the reason for this is because of multitouch
        // we want to track the movement of this particular touch
        // event.stopPropagationHint = true
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
            
            this.updatePositionFromDrag(newPosition.x + this.offsetX, newPosition.y + this.offsetY)
            this.layerMgr.session.limitedUpdates$.next(this.annotation)
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
    w = 7.5 * window.devicePixelRatio
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