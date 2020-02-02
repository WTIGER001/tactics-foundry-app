import { PathPlugin } from './polygon-plugin';
import { BasicPlugin, Handle } from './basic-plugin';
import { MapLayerManager } from '../map/layer-manager';
import { interaction, Container, Graphics, Text, Polygon, Texture, SCALE_MODES, Point } from 'pixi.js';
import { from } from 'rxjs';
import { pairwise } from 'rxjs/operators';
import { DropShadowFilter } from '@pixi/filter-drop-shadow';
import { TextBox } from './annotation-plugin';
import { Geom, MeasureMessage, ChatRecord } from 'src/app/core/model';

export class MeasurePlugin extends BasicPlugin {
    static readonly SNAP_NONE = 0
    static readonly SNAP_CENTER = 1
    static readonly SNAP_VERTEX = 2

    points: number[] = []
    handles: Handle[] = []
    textBoxes: TextBox[] = []
    container: Container = new Container()
    sprite: Graphics = new Graphics()
    enabled = true
    txtTexture: Texture
    lastTextBox: TextBox
    paused = false
    snapMode = 0
    interactive = true

    timestart  = 0
    timetotal = 10000
    constructor(l: MapLayerManager) {
        super(l)

        const g = new Graphics()
        g.beginFill(0xFFFFFF)
        g.drawRect(0, 0, 1, 1)
        g.endFill()

        this.txtTexture = this.map.app.renderer.generateTexture(g, SCALE_MODES.NEAREST, 1)
        this.lastTextBox = new TextBox(this.txtTexture)
        this.lastTextBox.txt.style = { fontSize: 24, fill: 0xFFFFFF, align: 'center' }

        this.lastTextBox.visible = false

        this.sprite = new Graphics()
        const drop = new DropShadowFilter({
            alpha: .5,
            blur: 3,
            color: 0x000000
        })
        this.sprite.filters = [drop]
        this.container.addChild(this.sprite)
        this.container.addChild(this.lastTextBox)
    }

    fromMessage(msg : ChatRecord<MeasureMessage>) {
        const measurement = msg.record

        if (this.mapData._id === measurement.map ) {
            this.viewport.plugins.add("measure_"+ msg._id, this)
            this.viewport.addChild(this.container)
    
            this.interactive = false
            this.points = measurement.points
            this.updateHandles()
            this.timestart = this.timetotal
            setTimeout(() => {
                this.clear()
                this.viewport.removeChild(this.container)
                this.viewport.plugins.remove("measure_"+ msg._id)
                this.viewport.cursor = 'auto'
            }, this.timetotal);
        } 
    }

    totalDistance(): number {
        let total = 0

        for (let i = 0; i < this.points.length - 2; i+=2) {
            const x1 = this.points[i]
            const y1 = this.points[i + 1]
            const x2 = this.points[i + 2]
            const y2 = this.points[i + 3]

            const dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / this.ppf
            total += dist
        }
        return total
    }

    undo() {
        if (this.points.length >= 2) {
            this.points.splice(this.points.length - 2)
            this.updateHandles()
        }
    }

    add() {
        this.viewport.plugins.add("measure", this)
        this.viewport.addChild(this.container)
        this.viewport.cursor = 'crosshair'
    }

    toggleSnap() {
        if (this.snapMode == 0) {
            this.snapMode += 1
        } else  if (this.snapMode == 1) {
            this.snapMode += 1
        } else  if (this.snapMode == 2) {
            this.snapMode = 0
        } 
    }


    pause() {
        if (this.paused) {
            this.paused = false
            this.viewport.cursor = 'crosshair'
        } else {
            this.paused = true
            this.viewport.cursor = 'auto'
        }
    }


    done() {
        this.clear()
        this.viewport.removeChild(this.container)
        this.viewport.plugins.remove("measure")
        this.viewport.cursor = 'auto'
    }

    clear() {
        this.points = []
        this.handles.forEach(h => this.container.removeChild(h.handle))
        this.textBoxes.forEach(t => this.container.removeChild(t))
    }

    down(event: interaction.InteractionEvent) {
        if (this.enabled && !this.paused && this.interactive) {
            let mouse = this.map.app.renderer.plugins.interaction.mouse.global
            let pt = this.map.viewport.toWorld(mouse)
            pt = this.snap(pt)
            this.points.push(pt.x, pt.y)
            this.updateHandles()
        }
    }

    snap(pt : Point) : Point{
        if (this.snapMode == MeasurePlugin.SNAP_NONE) {
            return pt
        } else if (this.snapMode == MeasurePlugin.SNAP_CENTER) {
            let square = this.layerMgr.session.mapview.grid.getGridCell(pt)
            let center =Geom.center(square)
            return center
        } else if (this.snapMode == MeasurePlugin.SNAP_VERTEX) {
            let vertex = this.layerMgr.session.mapview.grid.getGridVertex(pt)
            return vertex
        }
        return pt
    }

    updateHandles() {
        const cnt = this.points.length / 2
        if (cnt < this.handles.length) {
            // Remove unnecessary handles
            const removed = this.handles.splice(cnt)
            removed.forEach(h => this.container.removeChild(h.handle))
        } else if (cnt > this.handles.length) {
            // Add necessary necessary handles
            const num = cnt - this.handles.length
            for (let i = 0; i < num; i++) {
                const handle = new Handle();
                handle.circle = true
                handle.w = 10
                handle.onClick = (event) => {
                    const indx = this.handles.findIndex(h => h.handle == event.target)
                    if (indx >= 0  && this.interactive) {
                        this.points.splice(indx * 2, 2)
                        const removed = this.handles.splice(indx, 1)
                        this.container.removeChild(removed[0].handle)
                    }
                }
                handle.handle.interactive = this.interactive
                handle.handle.buttonMode = this.interactive
                this.handles.push(handle)
                this.container.addChild(handle.handle)
            }
        }

        // Create Text boxes
        let tcnt = cnt - 1
        if (tcnt < this.textBoxes.length) {
            // Remove unnecessary handles
            const removed = this.textBoxes.splice(tcnt)
            removed.forEach(t => this.container.removeChild(t))
        } else if (tcnt > this.textBoxes.length) {
            // Add necessary necessary handles
            const num = tcnt - this.textBoxes.length
            for (let i = 0; i < num; i++) {
                // const t = new Text("      ", { fontSize: 24, fill: 0x000000, align: 'center' })
                const tb = new TextBox(this.txtTexture)
                tb.txt.style = { fontSize: 24, fill: 0xFFFFFF, align: 'center' }
                this.textBoxes.push(tb)
                this.container.addChild(tb)
            }
        }

        // Set the postiongs
        this.handles.forEach((h, i) => {
            h.x = this.points[i * 2]
            h.y = this.points[i * 2 + 1]
        })
    }

    update() {
        if (this.timestart > 0) {
            this.timestart -= this.map.app.ticker.deltaTime *20
            const alpha = this.timestart / this.timetotal
            this.sprite.alpha = alpha
            this.handles.forEach(h => h.handle.alpha = alpha)
            this.textBoxes.forEach(t => {
                t.txt.alpha = alpha
                t.bg.alpha = .5 * alpha
            })
            this.lastTextBox.txt.alpha = alpha
            this.lastTextBox.bg.alpha = .5 * alpha
        }

        this.sprite.clear()
        if (this.enabled) {
            // Update the position of the points based on the handles
            this.handles.forEach((h, i) => {
                // SNAp
                let pt = this.snap(new Point(h.x, h.y))
                h.x = pt.x
                h.y = pt.y
                this.points[i * 2] = h.x
                this.points[i * 2 + 1] = h.y
                h.update(this, true)
            })

            // Update the text boxes
            this.textBoxes.forEach((t, i) => {
                const x1 = this.points[i * 2]
                const y1 = this.points[i * 2 + 1]
                const x2 = this.points[i * 2 + 2]
                const y2 = this.points[i * 2 + 3]

                const cx = (x1 + x2) / 2
                const cy = (y1 + y2) / 2

                // Calculate the distance
                const dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / this.ppf
                t.txt.text = dist.toFixed(1) + " ft"

                // Center the text
                t.txt.x = cx - t.width / 2
                t.txt.y = cy - t.height / 2
                t.update()
            })

            // Update the last text box
            // this.sprite.lineStyle(1, 0, 1, 0.5, false)
            if (this.points.length > 0 && !this.paused && this.interactive) {
                let mouse = this.map.app.renderer.plugins.interaction.mouse.global
                let pt = this.map.viewport.toWorld(mouse)

                const pts = this.points
                const x1 = pts[pts.length - 2]
                const y1 = pts[pts.length - 1]
                pt = this.snap(pt)
                const x2 = pt.x
                const y2 = pt.y


                const dist = Math.sqrt((x2 - x1) * (x2 - x1) + (y2 - y1) * (y2 - y1)) / this.ppf
                this.lastTextBox.txt.text = dist.toFixed(1) + " ft"

                const cx = (x1 + x2) / 2
                const cy = (y1 + y2) / 2
                this.lastTextBox.txt.x = cx - this.lastTextBox.width / 2
                this.lastTextBox.txt.y = cy - this.lastTextBox.height / 2
                this.lastTextBox.update()

                this.lastTextBox.visible = dist > 4
            } else {
                this.lastTextBox.visible = false
            }

            // Format and draw
            if (this.points.length > 0) {
                this.sprite.lineStyle(7, 0xFF0000, .8)
                this.drawPolyline()
            }
        }
    }



    drawPolyline() {
        let pts = this.points


        this.sprite.moveTo(this.points[0], this.points[1])
        for (let i = 2; i < pts.length; i += 2) {
            this.sprite.lineTo(this.points[i], this.points[i + 1])
        }
        if (pts.length > 0 && !this.paused && this.interactive) {
            let mouse = this.map.app.renderer.plugins.interaction.mouse.global
            let pt = this.map.viewport.toWorld(mouse)
            pt = this.snap(pt)
        
            this.sprite.moveTo(pts[pts.length - 2], pts[pts.length - 1])
            this.sprite.lineTo(pt.x, pt.y)
        }
    }

    drawBoundingPolygon() {
        /// Now for the complicated part. We need to draw a polygon that is the hit area for the line
        // for now we are going to keep x constant
        let pts = this.points

        let polyPoints = []
        const buffersize = 5
        for (let i = 0; i < pts.length; i += 2) {
            polyPoints.push(pts[i])
            polyPoints.push(pts[i + 1] - buffersize)
        }
        for (let i = pts.length - 2; i >= 0; i -= 2) {
            polyPoints.push(pts[i])
            polyPoints.push(pts[i + 1] + buffersize)
        }
        // this.updateFill(this.annotation, this.sprite)
        // this.sprite.drawPolygon(polyPoints)
        // this.finishFill(this.annotation, this.sprite)
        this.sprite.hitArea = new Polygon(polyPoints)
    }
}