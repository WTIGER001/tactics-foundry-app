import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, AfterContentInit, OnDestroy, NgZone } from '@angular/core';
import { TokenAnnotation } from 'src/app/core/model';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { DataService } from 'src/app/core/data.service';
import { Character } from 'src/app/core/character/character';
import { DbWatcher } from 'src/app/core/database-manager';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'edit-token-tool',
  templateUrl: './edit-token-tool.component.html',
  styleUrls: ['./edit-token-tool.component.css']
})
export class EditTokenToolComponent implements OnInit, AfterContentInit, OnDestroy {
  @ViewChild(ToolTabsComponent, {static: false}) tabs : ToolTabsComponent
  @Input() item : TokenAnnotation
  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  @Output() onClose = new EventEmitter()
  chr : Character
  watcher :DbWatcher

  constructor(private data : DataService, private zone : NgZone, private session : LivePageComponent) { }

  ngOnInit() {
    if (this.item.linkType == 'character') {
      this.watcher = this.data.coreDB.watchId(this.item.linkId, this.zone)
      this.watcher.onAdd( doc => this.chr = Character.to(doc))
      this.watcher.onUpdate(doc => this.chr = Character.to(doc))
      this.watcher.onRemove( rem => {
        // IDK
      })
      this.watcher.start()
    }
  }

  storeAndUpdateCharacter() {
    // this.data.store(this.chr).subscribe( rev => {
    //   this.chr._rev = rev['rev']
    // })
    this.data.store(this.chr)
  }

  ngOnDestroy() {
    if (this.watcher) {
      this.watcher.cancel()
    }
  }

  // Called when something is updated
  updated() {
    this.onUpdate.emit(this.item)
    this.session.limitedUpdates$.next(this.item)
  }

  ngAfterContentInit() {
    
  }
  close() {
    this.onClose.emit()
  }
}
