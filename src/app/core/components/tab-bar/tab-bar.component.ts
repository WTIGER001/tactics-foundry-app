import { Component, OnInit, ContentChild, TemplateRef, ContentChildren, QueryList } from '@angular/core';
import { TabItemComponent } from '../tab-item/tab-item.component';

@Component({
  selector: 'tabs',
  templateUrl: './tab-bar.component.html',
  styleUrls: ['./tab-bar.component.css']
})
export class TabBarComponent  {
  @ContentChildren(TabItemComponent) tabs: QueryList<TabItemComponent>;
  
  // contentChildren are set
  ngAfterContentInit() {
    // get all active tabs
    let activeTabs = this.tabs.filter((tab)=>tab.active);
    
    // if there is no active tab set, activate the first
    if(activeTabs.length === 0) {
      this.selectTab(this.tabs.first);
    }
  }
  
  selectTab(tab: TabItemComponent){
    // deactivate all tabs
    this.tabs.toArray().forEach(tab => tab.active = false);
    
    // activate the tab the user has clicked on.
    tab.active = true;
  }

}
