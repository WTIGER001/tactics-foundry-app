import { MapLayerManager } from '../map/layer-manager'
import { Plugin, Viewport } from 'pixi-viewport'
import { MapComponent } from '../map/map.component'
import { MapData } from 'src/app/core/model'

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