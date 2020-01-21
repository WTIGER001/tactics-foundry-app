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
        if (event.target) {

            // Find parent
            let item : DisplayObject = event.target
            let model = this.layerMgr.getAnnotation(item)
            let cnt = 0
            let max = 100
            while (!model && item && cnt < max) {
                cnt++
                item = item.parent
                model = this.layerMgr.getAnnotation(item)
            }

            if (!model) {
                this.layerMgr.selection$.next(null)
            } else {
                this.layerMgr.selection$.next(model)
            }
        }
        // IT has gotten here because nothing is selected
        // this.layerMgr.selection$.next(null)
    }
}