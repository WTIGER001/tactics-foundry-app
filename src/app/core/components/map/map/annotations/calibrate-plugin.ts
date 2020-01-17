import { Plugin } from "pixi-viewport";
import { MapComponent } from '../map.component';
import { MapData } from 'src/app/core/model';
import { Point, Graphics } from 'pixi.js';

export class CalibratePlugin extends Plugin {
    first : Point
    firstDone = false
    second : Point
    secondDone = false
    graphics : Graphics
    enabled = true

    constructor(private map: MapComponent, public mapData: MapData) {
        super(map.viewport)
        this.graphics = new Graphics()
    }

    public add() {
        this.map.viewport.addChild(this.graphics)
        this.map.viewport.plugins.add('calibrate', this, 100)
    }

    public remove() {
        this.map.viewport.removeChild(this.graphics)
        this.map.viewport.plugins.remove('calibrate')
    }

    onSecond : () => void 

    down(event: PIXI.interaction.InteractionEvent): void {
        if (!this.firstDone) {
            // Record the first 
            //  this.first = event.currentTarget.x
            let mouse = this.map.app.renderer.plugins.interaction.mouse.global
            this.first = this.map.viewport.toWorld(mouse)
            this.second= this.map.viewport.toWorld(mouse)
        } else {
            // Record the second
            let mouse = this.map.app.renderer.plugins.interaction.mouse.global
            this.second = this.map.viewport.toWorld(mouse)
        }
    }

    up(event: PIXI.interaction.InteractionEvent): void {
        if (!this.firstDone) {
             this.firstDone = true
             this.onSecond()
        } else {
            this.secondDone = true
        }
    }

    // move(event: PIXI.interaction.InteractionEvent): void
    // wheel(event: WheelEvent): void
    // update(): void
    // resize(): void
    // reset(): void
    // pause(): void
    // resume(): void



    update() {
        this.graphics.clear()
        if (!this.enabled) {
            return;
        }

        let height = 40 / this.map.viewport.scale.x
        let h = height/2

        if (this.first) {
            this.graphics.lineStyle(1, 0xFF0000, .7, 0.5,  true)
            // this.graphics.drawCircle(this.first.x, this.first.y, 10)
            this.graphics.moveTo(this.first.x, this.first.y-h)
            this.graphics.lineTo(this.first.x, this.first.y+h)
        }
        if (this.second){
            this.graphics.lineStyle(1, 0xFF0000, .7, 0.5, true)
            // this.graphics.drawCircle(this.second.x, this.first.y, 10)
            this.graphics.moveTo(this.second.x, this.first.y-h)
            this.graphics.lineTo(this.second.x, this.first.y+h)
        }
        if (this.first && this.second) {
            this.graphics.lineStyle(1, 0xFF0000, .7, 0.5, true)
            this.graphics.moveTo(this.first.x, this.first.y)
            this.graphics.lineTo(this.second.x, this.first.y)
        }
    }
}