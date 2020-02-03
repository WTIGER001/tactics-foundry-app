import { Plugin } from 'pixi-viewport';
import { MapLayerManager } from '../map/layer-manager';
import { DisplayObject } from 'pixi.js';

export class SelectionPlugin extends Plugin {
    public layerMgr : MapLayerManager

    constructor(l: MapLayerManager) {
        super(l.session.mapview.viewport)
        this.layerMgr = l
        l.session.mapview.viewport.plugins.add('selection', this, 10000)
    }

    up(event) {
        // console.log("DOWN ", event)
        if (event.target && event.type != 'pointerout') {

            // Find parent
            let item : DisplayObject = event.target
            console.log("Selection Plugin", event.type, event);
            
            let model = this.layerMgr.getAnnotation(item)
            let cnt = 0
            let max = 100
            while (!model && item && cnt < max) {
                cnt++
                item = item.parent
                model = this.layerMgr.getAnnotation(item)
            }

            if (!model) {
                this.layerMgr.select(null)
            } else {
                this.layerMgr.select(model)
            }
        }
    }
}