import { MapLayerManager } from '../map/layer-manager'
import { Plugin, Viewport } from 'pixi-viewport'
import { MapComponent } from '../map/map.component'
import { MapData, Geom } from 'src/app/core/model'
import { Graphics, interaction } from 'pixi.js'

export class BasicPlugin  extends Plugin {
    
    layerMgr: MapLayerManager
    _saved = true

    get saved() : boolean {
        return this._saved
    }

    set saved(s : boolean) {
        this._saved = s
    }

    constructor(l: MapLayerManager) {
        super(l.session.mapview.viewport)
        this.layerMgr = l
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

}


/**
 * This is a grab handle for  resizing
 */
export class Handle {
    enabled = true
    public handle = new Graphics()
    x: number
    y: number
    w = 10 * (window.devicePixelRatio/2)
    color = 0
    downTime = 0

    onClick : (event : interaction.InteractionEvent) => void = () =>{}
    onMove : (event : interaction.InteractionEvent) => void = () =>{}

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
            .on("mouseout", this.onMouseOut, this)
            .on('click', this.click, this)
            .on('tap',this.click, this)
    }

    update(plugin : BasicPlugin, enabled : boolean ) {
        this.handle.clear()
        if (enabled) {

            this.handle.beginFill(this.color, 1)
            this.handle.lineStyle(1, 0xFFFFFF, 1, 1, true)
            const r = Geom.centerHandle(this.x, this.y, this.w / plugin.scale)
            this.handle.drawShape(r)
            this.handle.endFill()
        }
    }

    click(event : interaction.InteractionEvent) {
        const time = new Date().getTime()
        if (time - this.downTime < 500) {
            this.onClick(event)
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
        this.downTime = new Date().getTime()

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
            this.onMove(event)
        }
    }



}