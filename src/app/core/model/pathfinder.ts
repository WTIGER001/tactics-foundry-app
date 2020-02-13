import { interaction } from 'pixi.js';
import { AbilityScore } from '../character/character';

export class Pathfinder {
    public static readonly PointCostMap = new Map<number, number>([
        [7, -4],
        [8, -2],
        [9, -1],
        [10, 0],
        [11, 1],
        [12, 2],
        [13, 3],
        [14, 5],
        [15, 7],
        [16, 10],
        [17, 13],
        [18, 17]
    ])

    constructor() {

    }

    public static pointCost(... abilities : AbilityScore[]) :number {
        let total = 0
        abilities.forEach( ability => {
            let cost = 0
            if (this.PointCostMap.has(Number(ability.score))) {
                total += this.PointCostMap.get(Number(ability.score))
            } 
        })
        return total
    }
}