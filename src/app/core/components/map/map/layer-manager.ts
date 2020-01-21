import { MapData, CircleAnnotation, ShapeAnnotation, ShapeType, PolygonAnnotation, TokenAnnotation, TokenBar, Annotation, Distance } from 'src/app/core/model';
import { MapComponent } from './map.component'
import { GraphicsGeometry, Graphics, SpriteMaskFilter, Rectangle, Sprite, Container, DisplayObject } from 'pixi.js';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { Aura, AuraVisible } from 'src/app/core/model/aura';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { Viewport } from 'pixi-viewport';
import { pairwise } from 'rxjs/operators';
import { AnnotationPlugin } from '../plugins/annotation-plugin';
import { CirclePlugin } from '../plugins/circle-plugin';
import { ReplaySubject, BehaviorSubject } from 'rxjs';
import { SelectionPlugin } from '../plugins/selection-plugin';
import { RemovedDocument } from 'src/app/core/database-manager';
import {OutlineFilter} from '@pixi/filter-outline';
import {ShockwaveFilter} from '@pixi/filter-shockwave';
import {DropShadowFilter} from '@pixi/filter-drop-shadow';
import {GlowFilter} from '@pixi/filter-glow';
import { TokenPlugin } from '../plugins/token-plugin';

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

    constructor(public session: LivePageComponent) {
        this.layers.set('background', this.session.mapview.backgroundLayer)
        this.layers.set('player', this.session.mapview.playerLayer)
        this.layers.set('gm', this.session.mapview.gmLayer)
        this.layers.set('decal', this.session.mapview.decalLayer)

        session.annotation_add$.subscribe(a => this.addAnnotation(a))
        session.annotation_update$.subscribe(a => this.updateAnnotation(a))
        session.annotation_remove$.subscribe(a => this.removeAnnotation(a))
        session.mapData$.subscribe(m => this.clearAnnotations())

        new SelectionPlugin(this)
        

        this.selection$.pipe(pairwise()).subscribe( item => {
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


    public test() {
        
        let token = new TokenAnnotation()
        token.location = new Rectangle(200, 300, 5, 5)
        let bar = new TokenBar()
        bar.color = "#FFFFFFFF"
        bar.bgColor = "#000000FF"
        bar.value = 50
        bar.max = 100
        bar.visible = AuraVisible.Visible
        token.bars.push(bar)


        let bar2 = new TokenBar()
        bar2.color = "#FFFFFFFF"
        bar2.bgColor = "#AAAAAAFF"
        bar2.value = 75
        bar2.max = 100
        bar2.visible = AuraVisible.Visible
        token.bars.push(bar2)


        let bar3 = new TokenBar()
        bar3.color = "#FFFFFF88"
        bar3.bgColor = "#000000FF"
        bar3.value = 25
        bar3.max = 100
        bar3.visible = AuraVisible.Visible
        token.bars.push(bar3)
        let t = new TokenPlugin(this)

        let a = new Aura()
        a.border = true
        a.fill = false
        a.color = "#FFFFFF88"
        a.weight = 1
        a.radius = new Distance(15, 'ft')
        token.auras.push(a)

        this.addAnnotation(token)
    }
    public clearAnnotations() {

    }

    public addAnnotation(a: Annotation) {
        console.log("Adding Annotation ", a)

        // Create the correct plugin
        const plugin : AnnotationPlugin<Annotation> = this.create(a)
        console.log("Created Plugin ", plugin)

        // Track the model and the item
        this.trackAnnotation(plugin, a)

        // Settting the annotation
        plugin.setAnnotation(a)
    }

    public create(annotation: Annotation): AnnotationPlugin<Annotation> {
        if (CircleAnnotation.is(annotation)) {
            return new CirclePlugin(this)
        } else if (TokenAnnotation.is(annotation)) {
            return new TokenPlugin(this)
        }
        console.log("Invalid Annotation Type " + annotation.type)
    }

    storeAnnotation(a : Annotation) {
        a.map = this.session.mapdata._id
        a.sourceDB = this.session.game._id
        this.session.data.store(a)
    }

    public updateAnnotation(a: Annotation) {
        // Theoretically every 'update' should have been proceeded with an 'add'
        // The new annotation will have a higher rev field that we need to keep up to 
        // date to ensure that we can continue to update the annotation in the data store. 
        let old = this.modelIdMap.get(a._id)
        let item = this.modelMap.get(old)
        this.modelMap.delete(old)

        // Replace
        this.trackAnnotation(item, a)

        // Now update
        item.setAnnotation(a)

        // CHeck the selection 
        if (this.selection$.getValue() && this.selection$.getValue()._id == a._id) {
            // just reselect it
            this.selection$.next(a)
        }

    }

    public removeAnnotation(a: RemovedDocument) {
        let old = this.modelIdMap.get(a._id)
        let item = this.modelMap.get(old)
        this.modelMap.delete(old)
        this.modelIdMap.delete(a._id)
        item.remove()

        if (this.selection$.getValue() && this.selection$.getValue()._id == a._id) {
            this.selection$.next(null)
        }
    }

    private trackAnnotation(plugin : AnnotationPlugin<Annotation>, a : Annotation) {
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
            default:
                console.log("INVALID OR MISSING LAYER, defaulting to Player ", layerName)
                return this.session.mapview.playerLayer
        }
    }


    public createToken(token: TokenAnnotation): PIXI.Container {
        // Create the main sprite from an image

        let container = new Container()

        let tokenSprite = Sprite.from("/assets/sprites/sample-token.png")
        tokenSprite.x = token.location.x
        tokenSprite.y = token.location.y
        tokenSprite.width = token.location.width
        tokenSprite.height = token.location.height
        // tokenSprite.anchor.set(0.5, 0.5)
        container.addChild(tokenSprite)

        // Create Each Bar
        token.bars.forEach((b: TokenBar, i: number) => {

        })

        // Create Each aura
        token.auras.forEach((aura: Aura, i: number) => {

        })

        // Need to dynamically update Below


        // Create the Selecton 
        let focusBox = new Graphics()
        focusBox.lineStyle(0.25, 0x0000FF, .8, 1)
        focusBox.drawRect(token.location.x, token.location.y, token.location.width, token.location.height)
        container.addChild(focusBox)

        // Create the info button
        let info = Sprite.from("/assets/sprites/info-button.png")
        info.anchor.set(0.5, 0)
        info.x = token.location.x + token.location.width / 2
        info.y = token.location.y + 3
        container.addChild(info)

        return container
    }



    public makeShapeSprite(shape: ShapeAnnotation): Graphics {
        return new Graphics()
    }

}