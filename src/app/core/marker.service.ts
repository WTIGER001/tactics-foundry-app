import { Injectable } from '@angular/core';
import MarkerJson from '../../assets/markers/markers.json';

@Injectable({
  providedIn: 'root'
})
export class MarkerService {
  categories : MarkerCategory[] = []
  defaultMarker : Marker
  markers : Map<string, Marker> = new Map()
  constructor() { 
    // Load
    this.categories =  MarkerJson.categories 
    this.defaultMarker = MarkerJson.defaultMarker
    this.categories.forEach( c => {
      this.markers.forEach(m => {
        this.markers.set(m.name.toLowerCase(), m)
      })
    })
  }

  get(name : string) : Marker {
    return this.markers.get(name.toLowerCase())
  }

  getPixiAnchor(m : Marker) : number[] {
    return [m.ax/m.w, m.ay/m.h]
  }
}

export class MarkerCategory {
  order : number = 100000
  markers : Marker[]
}

export class Marker {
  name: string
  url : string
  ax : number
  ay: number
  w: number
  h: number
}