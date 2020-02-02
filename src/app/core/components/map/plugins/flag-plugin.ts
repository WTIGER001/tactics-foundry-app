import { Annotation, MapData, PingMessage, ChatRecord } from 'src/app/core/model';
import { AnnotationPlugin } from './annotation-plugin';
import { MapLayerManager } from '../map/layer-manager';
import { Plugin, Viewport } from 'pixi-viewport';
import { interaction, Sprite, Container, Graphics, Point, Text, TextStyle } from 'pixi.js';
import { MapComponent } from '../map/map.component';
import { ShockwaveFilter } from '@pixi/filter-shockwave';
import { BasicPlugin } from './basic-plugin';
import { Subject } from 'rxjs';

export class FlagPlugin extends BasicPlugin {
    planted = new Subject<PingMessage>()
    expireTime = 5000
    mouseDownStart
    icon = '/assets/icons/red-flag.png'
    filter : ShockwaveFilter
    filter2 : ShockwaveFilter

    adding = false
    sprite : Sprite
    container : Container

    text : Text
    constructor(l : MapLayerManager) {
        super(l)
        this.viewport.plugins.add('flag', this)
    }

    addFlag(x, y) {
        this.adding = false
        this.container = new Container()
        this.container.x = 0
        this.container.y = 0
        this.container.width = this.mapData.width
        this.container.height = this.mapData.height

        this.sprite= Sprite.from(this.icon)
        this.sprite.x = x
        this.sprite.y = y
        this.sprite.width = 20
        this.sprite.height = 20
        this.sprite.anchor.set(0.091,0.78)
        this.container.addChild(this.sprite)
        this.viewport.addChild(this.container)

        let g = new Graphics()
        g.drawRect(0,0,this.mapData.width, this.mapData.height)
        this.container.addChild(g)

        this.filter = new ShockwaveFilter([x,y], {
            radius : -1,
            wavelength : 50,
            amplitude : 25,
            speed: this.mapData.width*10, 
        })

        this.filter2 = new ShockwaveFilter([x,y], {
            radius : -1,
            wavelength : 50,
            amplitude : 25,
            speed: this.mapData.width*10, 
        }, -.1)
    
        let style = new TextStyle()
        style.fill = 0xffffff
        style.fontSize = 20
        style.fontWeight = '400'
        style.dropShadow =true
        style.dropShadowDistance =1

        this.map.app.stage.filters = [this.filter, this.filter2]
        setTimeout(() => {
            this.map.app.stage.filters = []
            this.viewport.removeChild(this.container)
            this.map.app.stage.removeChild(this.text)
        }, this.expireTime);
    }

    add() {
        this.adding = true
        this.layerMgr.session.mapview.viewport.cursor = 'crosshair'
    }

    remove() {
        this.viewport.plugins.remove('flag')
    }

    down(event : interaction.InteractionEvent) {
        if (this.adding) {
            this.viewport.cursor = 'auto'
            let mouse = this.map.app.renderer.plugins.interaction.mouse.global
            let pt = this.map.viewport.toWorld(mouse)
            this.addFlag(pt.x, pt.y)

            // let flag = new Flag
            const msg = new PingMessage()
            msg.map = this.mapData._id
            msg.mapname = this.mapData.name
            msg.x = pt.x;
            msg.y = pt.y
            this.planted.next(msg)
        }
    }

    fromMessage(msg : ChatRecord<any>) {
        if (msg && PingMessage.is(msg.record) && this.mapData._id === msg.record.map) {
            this.addFlag(msg.record.x, msg.record.y)
        }
    }

    update() {
        if (this.filter) {
            let offsetX = -this.viewport.left
            let offsetY = -this.viewport.top
            let screen = this.viewport.toScreen(this.sprite.x, this.sprite.y)
            let moust = this.map.app.renderer.plugins.interaction.mouse.global
            moust = this.viewport.toWorld(moust)
            let center = [ screen.x , screen.y ]

            this.sprite.width = Math.min(105/this.scale, (this.mapData.width /10) * 350/400)
            this.sprite.height = Math.min(120/this.scale, this.mapData.width /10)
            this.filter.center = center
            this.filter.time += this.map.app.ticker.deltaTime / 1000
            this.filter2.center = center
            this.filter2.time += (this.map.app.ticker.deltaTime / 1000) 

            if (this.filter.time > .2) {
                this.filter.time = 0
            }
            if (this.filter2.time > .2) {
                this.filter2.time = 0
            }
        }
    }

}