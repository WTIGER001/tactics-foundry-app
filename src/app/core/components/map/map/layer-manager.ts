import { MapData, CircleAnnotation, ShapeAnnotation, ShapeType, PolygonAnnotation, TokenAnnotation, TokenBar, Annotation, Distance, RectangleAnnotation, MarkerTypeAnnotation, PolylineAnnotation } from 'src/app/core/model';
import { MapComponent } from './map.component'
import { GraphicsGeometry, Graphics, SpriteMaskFilter, Rectangle, Sprite, Container, DisplayObject, Polygon, Point } from 'pixi.js';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { Aura, AuraVisible } from 'src/app/core/model/aura';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { Viewport } from 'pixi-viewport';
import { pairwise, mergeMap } from 'rxjs/operators';
import { AnnotationPlugin } from '../plugins/annotation-plugin';
import { CirclePlugin } from '../plugins/circle-plugin';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { SelectionPlugin } from '../plugins/selection-plugin';
import { RemovedDocument } from 'src/app/core/database-manager';
import { OutlineFilter } from '@pixi/filter-outline';
import { ShockwaveFilter } from '@pixi/filter-shockwave';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { GlowFilter } from '@pixi/filter-glow';
import { TokenPlugin } from '../plugins/token-plugin';
import { RectanglePlugin } from '../plugins/rectangle-plugin';
import { FogPlugin } from '../plugins/fog-plugin';
import { PathPlugin } from '../plugins/polygon-plugin';
import { FlagPlugin } from '../plugins/flag-plugin';
import { MarkerPlugin } from '../plugins/marker-plugin';
import { TokenMeasurePlugin } from '../plugins/token-measure-plugin';


export type LayerType = 'player' | 'background' |'gm' |'decal' |'fog'

/**
 * The Map Manager is responsible for managing the layers and the contents of a map. 
 * 
 * For every annotation we have to create / track:
 * - annotation
 * - _id
 * - displayobject (container, etc)
 * - plugin
 * 
 * On update we start with the annotation and need to get to the id, item and plugin.
 * Plugins should know about their models
 * 
 * Only things that change based on the scale need to be plugins. 
 * - Tokens (tokens, characters, monsters) - Focus box and auras, eventually switch to a marker
 * - Markers - fixed size on zoom so scale is important
 * - Circles, polygons, lines, rectangles (i.e. shapes) - Update the line thickness
 * - Flags to send out ripples
 * - Images --- nope they are just images
 */
export class MapLayerManager {

    public modelMap = new Map<Annotation, AnnotationPlugin<Annotation>>()
    public modelIdMap = new Map<string, Annotation>()
    public layers = new Map<string, Container>()
    public selection$ = new BehaviorSubject<Annotation>(null)
    private selectionsSuspended = false
    fogPlugin: FogPlugin
    flagPlugin: FlagPlugin


    constructor(public session: LivePageComponent) {
        this.layers.set('background', this.session.mapview.backgroundLayer)
        this.layers.set('player', this.session.mapview.playerLayer)
        this.layers.set('gm', this.session.mapview.gmLayer)
        this.layers.set('decal', this.session.mapview.decalLayer)
        this.layers.set('fog', this.session.mapview.fogLayer)

        session.mapId$.pipe( mergeMap( mapId => session.gameMgr.getAnnotations$(mapId))).subscribe( a => {
            this.updateAnnotation(a)
        })
        session.gameMgr.annotation_rem$.subscribe( a => this.removeAnnotation(a))


        session.mapData$.subscribe(m => this.clearAnnotations())

        new SelectionPlugin(this)
        this.fogPlugin = new FogPlugin(this)
        this.fogPlugin.add()
        this.flagPlugin = new FlagPlugin(this)
        this.flagPlugin.planted.subscribe(msg => {
            this.session.data.sendMessage(this.session.game._id, msg)
        })
        new TokenMeasurePlugin(this, this.session.settings).add()

        this.selection$.pipe(pairwise()).subscribe(item => {
            let color = LangUtil.colorNum("#BBBBBB")
            if (item[0]) {
                const plugin = this.modelMap.get(item[0])
                if (plugin) {
                    const obj = plugin.getMainObject()
                    if (obj) {
                        obj.filters = []
                    }
                }
            }
            if (item[1]) {
                // Get the item
                const plugin = this.modelMap.get(item[1])
                if (plugin) {
                    const obj = plugin.getMainObject()
                    if (obj) {
                        obj.filters = [
                            new OutlineFilter(),
                            // new DropShadowFilter()
                            // new GlowFilter()
                        ]
                    }
                }
            }
        })

        // If the 
    }


    public clearAnnotations() {



    }


    select(a: Annotation) {
        if (this.selectionsSuspended == false) {
            // console.log("Selecting ", a);
            this.selection$.next(a)
        }
    }

    suspendSelections(value: boolean) {
        this.selectionsSuspended = value
    }

    isSelectionSuspended(): boolean {
        return this.selectionsSuspended
    }

    public addToCenter(t: TokenAnnotation, avoidCollisions: boolean = true) {
        const map: MapComponent = this.session.mapview
        const proposedLocation: Point = map.getCenter()

        let gridSquare = map.grid.getGridCell(proposedLocation)
        // let finder = new GridSearchCircularPattern()
        let finder = new SpiralPattern()
        finder.start(gridSquare)
        let limit = 100
        let cnt = 9
        while (this.hasToken(gridSquare) && cnt < limit) {
            gridSquare = finder.next()
            cnt++
        }

        t.x = gridSquare.x
        t.y = gridSquare.y
    }

    public hasToken(gridSquare: Rectangle): boolean {
        let found = false
        this.modelMap.forEach((k, a) => {
            const diffX = Math.abs(a.x - gridSquare.x)
            const diffY = Math.abs(a.y - gridSquare.y)

            if (
                Math.abs(a.x - gridSquare.x) < 0.001 &&
                Math.abs(a.y - gridSquare.y) < 0.001
            ) {
                found = true
            }
        })
        return found
    }

    
    public create(annotation: Annotation): AnnotationPlugin<Annotation> {
        if (CircleAnnotation.is(annotation)) {
            return new CirclePlugin(this)
        } else if (TokenAnnotation.is(annotation)) {
            return new TokenPlugin(this)
        } else if (RectangleAnnotation.is(annotation)) {
            return new RectanglePlugin(this)
        } else if (PolygonAnnotation.is(annotation)) {
            return new PathPlugin(this)
        } else if (MarkerTypeAnnotation.is(annotation)) {
            return new MarkerPlugin(this)
        } else if (PolylineAnnotation.is(annotation)) {
            return new PathPlugin(this)
        }
        console.log("Invalid Annotation Type " + annotation.objType)
    }

    storeAnnotation(a: Annotation) {
        a.map = this.session.mapdata._id
        a.sourceDB = this.session.game._id
        this.session.limitedUpdates$.next(a)
        // this.session.data.store(a)
    }


    public addAnnotation(a: Annotation) {
        // Create the correct plugin
        const plugin: AnnotationPlugin<Annotation> = this.create(a)

        // Track the model and the item
        this.trackAnnotation(plugin, a)

        // Settting the annotation
        plugin.setAnnotation(a)
    }


    public updateAnnotation(a: Annotation) {
        // Theoretically every 'update' should have been proceeded with an 'add'
        // The new annotation will have a higher rev field that we need to keep up to 
        // date to ensure that we can continue to update the annotation in the data store. 
        let old = this.modelIdMap.get(a._id)
        if (old) {
            let item = this.modelMap.get(old)
            this.modelMap.delete(old)

            // Replace
            this.trackAnnotation(item, a)

            // Now update
            item.setAnnotation(a)

            // CHeck the selection 
            if (this.selection$.getValue() && this.selection$.getValue()._id == a._id) {
                // just reselect it
                this.select(a)
            }
        } else {
            // Create the correct plugin
            const plugin: AnnotationPlugin<Annotation> = this.create(a)

            // Track the model and the item
            this.trackAnnotation(plugin, a)

            // Settting the annotation
            plugin.setAnnotation(a)
        }
    }

    public removeAnnotation(a: RemovedDocument) {
        let old = this.modelIdMap.get(a._id)
        let item = this.modelMap.get(old)
        this.modelMap.delete(old)
        this.modelIdMap.delete(a._id)
        item.remove()

        if (this.selection$.getValue() && this.selection$.getValue()._id == a._id) {
            this.select(null)
        }
    }

    private trackAnnotation(plugin: AnnotationPlugin<Annotation>, a: Annotation) {
        this.modelMap.set(a, plugin)
        this.modelIdMap.set(a._id, a)
    }

    public getAnnotation(item: DisplayObject): Annotation {
        if (item && item['model']) {
            return <Annotation>item['model']
        }
        return null;
    }

    public getLayer(layerName: string): Container {
        // return this.session.mapview.viewport
        switch (layerName) {
            case 'background': return this.session.mapview.backgroundLayer;
            case 'player': return this.session.mapview.playerLayer;
            case 'gm': return this.session.mapview.gmLayer;
            case 'decal': return this.session.mapview.decalLayer;
            case 'fog': return this.session.mapview.fogLayer;
            default:
                console.log("INVALID OR MISSING LAYER, defaulting to Player ", layerName)
                return this.session.mapview.playerLayer
        }
    }


    isSelected(annotation: Annotation): boolean {
        return this.selection$.getValue() && this.selection$.getValue()._id === annotation._id
    }
}

class SpiralPattern {
    layer = 1
    leg = 0
    x = 0
    y = 0
    center: Rectangle

    start(center: Rectangle) {
        this.center = center
        this.layer = 1
        this.leg = this.x = this.y = 0
    }

    nextUnit() {
        switch (this.leg) {
            case 0: ++this.x; if (this.x == this.layer)++this.leg; break;
            case 1: ++this.y; if (this.y == this.layer)++this.leg; break;
            case 2: --this.x; if (-this.x == this.layer)++this.leg; break;
            case 3: --this.y; if (-this.y == this.layer) { this.leg = 0; ++this.layer; } break;
        }
    }

    next(): Rectangle {
        this.nextUnit()

        const realX = this.center.x + (this.x * this.center.width)
        const realY = this.center.y + (this.y * this.center.height)
        return new Rectangle(realX, realY, this.center.width, this.center.height)
    }
}

class PlusPattern {
    pattern = new SpiralPattern()
    start(center: Rectangle) {
        this.pattern.start(center)
    }

    next(): Rectangle {
        this.pattern.next()
        return this.pattern.next()
    }
}


class XPattern {
    pattern = new SpiralPattern()
    start(center: Rectangle) {
        this.pattern.start(center)
        this.pattern.next()
    }

    next(): Rectangle {
        this.pattern.next()
        return this.pattern.next()
    }
}