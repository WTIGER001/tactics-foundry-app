import { Injectable, ComponentFactoryResolver } from '@angular/core';
import { SwRegistrationOptions } from '@angular/service-worker';
import { GridToolComponent } from './gm/grid-tool/grid-tool.component';
import { FogToolComponent } from './gm/fog-tool/fog-tool.component';
import { CalibrateToolComponent } from './gm/calibrate-tool/calibrate-tool.component';
import { AddToolComponent } from './add/add-tool/add-tool.component';
import { FavoritesToolComponent } from './add/favorites-tool/favorites-tool.component';
import { AddTokenToolComponent } from './add/add-token-tool/add-token-tool.component';

@Injectable({
  providedIn: 'root'
})
export class ToolService {
  // The currently active 
  activeItem
  openItems
  
  anchor
  registry = new Map<string, ToolItem | ToolItem[]>()



  constructor(cfr : ComponentFactoryResolver) { 
    this.registry.set('GM', [
      {label: 'Grid', icon: 'border-all', component : GridToolComponent},
      {label: 'Fog', icon: 'fog', component : FogToolComponent},
      {label: 'Calibrate', icon: 'pencil-ruler', component : CalibrateToolComponent}
    ])

    this.registry.set('add', [
      {label: 'New', icon: 'plus-hexagon', component : AddToolComponent},
      {label: 'Favorites', icon: 'star', component : FavoritesToolComponent}
    ])

    this.registry.set('add-token', 
      {label: undefined, icon: undefined, component : AddTokenToolComponent}
    )

  }

  setAnchor(anchor : any) {
    this.anchor = anchor
  }

  open(key : string) : any {
    
  }

  /**
   * Opens a dialog item
   */
  create(component : any) : any {

  }

  /**
   * Loads commpones
   * @param component 
   * @param param1 
   */
  openTabs(component : any[]) : any {

  }

  showDialog(component : any) : any {

  }
  
}

export class TabSet {
  name : string
  items : ToolItem[] = []
}

export class ToolItem {
  public component : any
  public label: string
  public icon : string
}
