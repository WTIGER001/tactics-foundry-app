import { MapComponent } from '../map.component'
import { MapData, DistanceUnit, GridOptions, Geom } from 'src/app/core/model'
import { Rectangle, Point, Container, Graphics, GraphicsGeometry, Polygon, LineStyle } from 'pixi.js'
import { LangUtil } from 'src/app/core/util/LangUtil'
import { Plugin } from 'pixi-viewport'


export class GridLayer extends Plugin {
    cellRect: Rectangle
    highlighting = false
    graphics: Graphics

    constructor(private map: MapComponent, public mapData: MapData) {
        super(map.viewport)
    }

    /**
     * Creates a new bounds with the object
     * @param bounds Bounds to snap
     */
    // snapBounds(bounds: Rectangle, center: Point): Rectangle {
    //     let unit = DistanceUnit.getUnit(this.options.spacingUnit)
    //     let space = unit.toFeet(this.options.spacing)

    //     let dLat = bounds.height
    //     let dLng = bounds.width

    //     let nLat = dLat / space
    //     let nLng = dLng / space

    //     nLat = Math.round(nLat)
    //     nLng = Math.round(nLng)

    //     // Use the mouse to get the grid cell... If the nlat is odd then use the center if even then use the bottom
    //     let cell = this.getGridCell(center)
    //     let newLat, newLng
    //     if (nLat % 2 == 1) {
    //         newLat = Geom.center(cell).y
    //     } else {
    //         newLat = cell.y
    //     }
    //     if (nLng % 2 == 1) {
    //         newLng = Geom.center(cell).x
    //     } else {
    //         newLng = cell.x
    //     }

    //     return Rect.centerOn(bounds, latLng(newLat, newLng))
    // }

    getMapBounds(): Rectangle {
        /// This is the world height and width
        let r = new Rectangle(0, 0, this.mapData.width, this.mapData.height)
        return r;
    }

    /**
     * Gets the nearest vertex to the selected point. 
     * @param ll Point to search for
     */
    getGridVertex(ll: Point): Point {
        const bounds = this.getMapBounds()
        let options = this.mapData.gridOptions

        let unit = DistanceUnit.getUnit(options.spacingUnit)
        let offsetEW = unit.toFeet((options.offsetEW || 0))
        let offsetNS = unit.toFeet((options.offsetNS || 0))
        let space = unit.toFeet(options.spacing)

        let startCol = ll.x - offsetEW
        let col = Math.floor(startCol / space)
        let startRow = ll.y - offsetNS
        let row = Math.floor(startRow / space)

        let west = (col * space) + offsetEW
        let east = west + space
        let south = (row * space) + offsetNS
        let north = south + space

        // 
        // let all = [ latLng(north, east), latLng(north, west), latLng(south, east), latLng([south, west) ]

        let lat = Math.abs(ll.y - north) > Math.abs(ll.y - south) ? south : north
        let lng = Math.abs(ll.x - east) > Math.abs(ll.x - west) ? west : east

        return new Point(lng, lat)
    }


    /**
     * Find the cell that this point includes
     * @param ll Point to search for
     */
    getGridCell(ll: Point): Rectangle {
        const bounds = this.getMapBounds()
        let options = this.mapData.gridOptions

        let unit = DistanceUnit.getUnit(options.spacingUnit)
        let offsetEW = unit.toFeet((options.offsetEW || 0))
        let offsetNS = unit.toFeet((options.offsetNS || 0))
        let space = unit.toFeet(options.spacing)

        let startCol = ll.x - offsetEW
        let col = Math.floor(startCol / space)
        let startRow = ll.y - offsetNS
        let row = Math.floor(startRow / space)

        let west = (col * space) + offsetEW
        let east = west + space
        let south = (row * space) + offsetNS
        let north = south + space

        let bnds = new Rectangle(west, south, east - west, north - south)
        return bnds
    }

    // highlightCell(event: MouseEvent) {
    //     if (this.highlighting) {
    //         let screen = new Point(event.screenX, event.screenY)
    //         let world = this.map.viewport.toWorld(screen)
    //         let cell = this.getGridCell(world)
    //         if (!this.cellRect) {
    //             this.cellRect = rectangle(cell, { color: 'red' }).addTo(this._map)
    //         } else {
    //             this.cellRect.setBounds(cell)
    //         }
    //     }
    // }

    // onAdd(map: Map): this {
    //     this.map = map
    //     map.on('viewreset move', this.refresh, this)
    //     map.on('mousemove', this.highlightCell, this)
    //     this.refresh()
    //     return this
    // }


    // refresh() {
    //     this.removeChildren();
    //     this.makelines()
    // }


    update() {
        // CHeck to make sure nothing has changed
        // offsets, ppf, or bounds 
        this.makelines()
    }

    makelines() {
        let options = this.mapData.gridOptions

        if (!this.graphics) {
            // this.map.viewport.removeChild(this.graphics)
            this.graphics = new Graphics();
            this.map.viewport.addChild(this.graphics)
        }
        this.graphics.clear()
        if (options.enabled) {
            const bounds = this.getMapBounds()

            let unit = DistanceUnit.getUnit(options.spacingUnit)
            let offsetEW = unit.toFeet((options.offsetEW || 0))
            let offsetNS = unit.toFeet((options.offsetNS || 0))
            let space = unit.toFeet(options.spacing)

            let distanceEW = bounds.width
            let distanceNS = bounds.height

            let startEW = bounds.x + offsetEW
            let startNS = bounds.y + offsetNS

            let lineCountEW = Math.ceil(distanceNS / space) + 1
            let lineCountNS = Math.round(distanceEW / space) + 1

            // Set the options
            let colorPart = LangUtil.baseColor(options.color)
            let color = LangUtil.colorNum(colorPart)
            let alpha = LangUtil.colorAlpha(options.color)

            this.graphics.lineStyle(options.lineWeight / (this.map.viewport.scale.x * 3), color, alpha, 0.5, true)

            // Draw the border
            this.graphics.drawRect(bounds.x, bounds.y, bounds.width, bounds.height)

            for (let i = 0; i < lineCountEW; i++) {
                let lat = i * space + (offsetNS || 0)
                if (bounds.contains(0, lat)) {
                    this.graphics.moveTo(bounds.x, lat)
                    this.graphics.lineTo(bounds.width, lat)
                }
            }

            for (let i = 0; i < lineCountNS; i++) {
                let lng = i * space + (offsetEW || 0)
                if (bounds.contains(lng, 0)) {
                    this.graphics.moveTo(lng, bounds.y)
                    this.graphics.lineTo(lng, bounds.height)
                }
            }
            this.graphics.zIndex = 5
            this.graphics.position.x = 0;
            this.graphics.position.y = 0;
        }
    }
}
