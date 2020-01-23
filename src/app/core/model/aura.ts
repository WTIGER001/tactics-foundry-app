import { Distance, DistanceUnit } from './distance-unit';
import { IdUtil } from '../util/IdUtil'

export enum AuraVisible {
    NotVisible = 0,
    Visible = 1,
    OnSelect = 2, 
    OnHover = 3
  }
  export enum AuraVisibleTo {
    Everyone = 0,
    Player = 1,
    PlayerAndGm = 2
  }
  
  export class Aura {
    id : string = IdUtil.saltedIdType('aura')
    name: string
    border : boolean = false;
    color: string = '#00000069'
    fill : boolean = true
    fillColor: string = '#b520204e'
    radius: number = 10;
    radiusUnit: string = "ft"
    visible: number = AuraVisible.Visible
    visibleTo : number = AuraVisibleTo.Everyone
    weight: number = 1
    style: string
  }