import { interaction, Container, Graphics, Circle, Sprite } from 'pixi.js';
import { BasicPlugin, Handle } from './basic-plugin';
import { TokenAnnotation } from 'src/app/core/model';
import { MapLayerManager } from '../map/layer-manager';
import { GridDistanceUtil, GridDistanceResult } from '../map/grid-distance';
import { SettingsService, Setting, ShowMoveSetting, ShowCustomMoveSetting } from 'src/app/core/settings.service';
import { LangUtil } from 'src/app/core/util/LangUtil';

export class TokenMeasurePlugin extends BasicPlugin {
    container: Container = new Container()

    token: TokenAnnotation

    move1: Setting<ShowMoveSetting>
    move2: Setting<ShowMoveSetting>
    run: Setting<ShowMoveSetting>
    reach: Setting<ShowMoveSetting>
    reachWeapon: Setting<ShowMoveSetting>
    showCustom: Setting<ShowMoveSetting>
    custom: Setting<ShowCustomMoveSetting>

    textures = new GridDistanceUtil()
    m1Sprite: Sprite
    m2Sprite: Sprite
    runSprite: Sprite
    reachSprite: Sprite
    reachWeaponSprite: Sprite
    customSprite: Sprite

    constructor(l: MapLayerManager, settings: SettingsService) {
        super(l)

        this.move1 = settings.gameTokenShowMove1
        this.move2 = settings.gameTokenShowMove2
        this.run = settings.gameTokenShowRun
        this.reach = settings.gameTokenShowReach
        this.reachWeapon = settings.gameTokenShowReachWeapon
        this.custom = settings.gameTokenShowCustomMove

        this.m1Sprite = new Sprite()
        this.m2Sprite = new Sprite()
        this.runSprite = new Sprite()
        this.reachSprite = new Sprite()
        this.reachWeaponSprite = new Sprite()
        this.customSprite = new Sprite()

        // this.container.addChild(this.g)
        this.container.addChild(this.m1Sprite)
        this.container.addChild(this.m2Sprite)
        this.container.addChild(this.runSprite)
        this.container.addChild(this.reachSprite)
        this.container.addChild(this.reachWeaponSprite)
        this.container.addChild(this.customSprite)

        this.layerMgr.selection$.subscribe(token => {
            if (TokenAnnotation.is(token)) {
                this.token = token
            } else {
                this.token = undefined
            }
        })
    }

    updateTokens() {

    }

    add() {
        this.viewport.plugins.add("tokenmeasure", this)
        this.viewport.addChild(this.container)
    }

    done() {
        this.viewport.plugins.remove("tokenmeasure")
    }

    update() {
        if (this.token) {
            this.container.visible = true
            const size: number = (this.token.size || 5) / 1
            const speed: number = (this.token.speed || 30) / 1
            const reach: number = (this.token.reach / 1 || size)
            this.updateItem(this.m1Sprite, this.move1.value.getValue().enabled, this.move1.value.getValue().color, speed, size - 5)
            this.updateItem(this.m2Sprite, this.move2.value.getValue().enabled, this.move2.value.getValue().color, speed * 2, speed)
            this.updateItem(this.runSprite, this.run.value.getValue().enabled, this.run.value.getValue().color, speed * 4, speed * 2)
            this.updateItem(this.reachSprite, this.reach.value.getValue().enabled, this.reach.value.getValue().color, reach, size - 5)
            this.updateItem(this.reachWeaponSprite, this.reachWeapon.value.getValue().enabled, this.reachWeapon.value.getValue().color, reach * 2, reach)
            this.updateItem(this.customSprite, this.custom.value.getValue().enabled, this.custom.value.getValue().color, this.custom.value.getValue().distance, size - 5)
        } else {
            this.container.visible = false
        }

    }

    updateItem(sprite: Sprite, enabled: boolean, color: string, distance: number, mindistance: number) {
        if (enabled && this.token) {
            const size = Math.ceil((this.token.size || 5) / 5)
            const max = distance > 0 ? Math.ceil(distance / 5) : 0
            const min = mindistance > 0 ? Math.ceil(mindistance / 5) : 0
            sprite.texture = this.textures.get(size, max, min, this.map.app.renderer)

            sprite.visible = true
            sprite.tint = LangUtil.colorNum(LangUtil.baseColor(color))
            sprite.alpha = LangUtil.colorAlpha(color)
            const dist = max * 5 * this.ppf
            const x = this.token.x - dist
            const y = this.token.y - dist
            let w = this.token.size * this.mapData.ppf + dist + dist
            sprite.x = x
            sprite.y = y
            sprite.width = w
            sprite.height = w
        } else {
            sprite.visible = false
        }
    }

    remove() {

    }
}


export class Config {
    color: number;
    alpha: number;
    enabled: boolean
}