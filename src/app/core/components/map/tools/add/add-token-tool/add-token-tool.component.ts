import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { ToolItemComponent } from '../../tool-item/tool-item.component';
import { Character } from 'src/app/core/character/character';
import { TokenAnnotation } from 'src/app/core/model';

/**
 * Add a token, character or monster
 */
@Component({
  selector: 'add-token-tool',
  templateUrl: './add-token-tool.component.html',
  styleUrls: ['./add-token-tool.component.css']
})
export class AddTokenToolComponent implements OnInit {
  @Output() onClose = new EventEmitter()
  @Input() type: 'character' | 'token' | 'monster' = 'token'

  filterUi = false
  _searchTerm: string
  image = '/assets/pages/token-tool.png'
  imageOverlap: string
  height = '150px'

  items: Result[]
  all: Result[]
  selected: Result

  constructor(private session: LivePageComponent) {

  }

  ngOnInit() {
    if (this.type == 'token') {
      this.image = '/assets/pages/token-tool.png'
      this.imageOverlap = '-35px'
      this.loadTokens()
    } else if (this.type == 'character') {
      this.image = '/assets/pages/character.png'
      this.imageOverlap = '-35px'
      this.loadCharacters()
    } else if (this.type == 'monster') {
      this.image = '/assets/pages/monster-tool.png'
      this.imageOverlap = '-30px'
      this.height = '250px'
      this.loadMonster()
    }
  }

  isSelected(item: any) {
    return this.selected && this.selected == item
  }

  loadCharacters() {
    this.session.game$.subscribe(g => {
      // GMS can load any player and players can only add their own
      let owners: string[] = []
      if (this.session.isGM()) {
        owners = g.players.map(p => p._id)
      } else {
        owners.push(this.session.data.player._id)
      }

      this.session.data.coreDB.findIds(owners, ['_id', 'name', 'url', 'owner']).subscribe(response => {
        this.all = response.docs.map(doc => new Result(doc))
        this.filter()
      })
    })
  }

  loadMonster() {


  }

  loadTokens() {

  }

  select(item: Result) {
    // Create the token
    const t = new TokenAnnotation()
    t.name = item.name
    t.owner = item.owner
    t.url = item.url
    t.size = 5
    t.sourceDB = this.session.game._id
    t.layer = this.session.currentLayer

    if (this.type == 'character') {
      t.linkType = 'character'
      t.linkDb = 'core'
      t.linkId = item._id
    } else if (this.type == 'monster') {
      t.linkType = 'monster'
      t.linkDb = 'monster'
      t.linkId = item._id
    }

    this.session.layerMgr.addToCenter(t, true)

    // Save
    this.session.layerMgr.storeAnnotation(t)

    // REMOVE the offending one
    const indx = this.items.findIndex(a => a._id == item._id)
    if (indx >= 0) {
      this.items.splice(indx, 1)
    }
    this.filter()
  }

  set searchTerm(a : string) {
    this._searchTerm = a
    this.filter()
  }

  get searchTerm() : string {
    return this._searchTerm
  }

  onSearchChange(filterText : string) {
    // this.searchTerm = filterText
    // this.filter()
  }

  filter() {
    // Filter the text
    if (this.searchTerm && this.searchTerm.length > 0) {
      this.items = this.all.filter(a => a.name.toLowerCase().indexOf(this._searchTerm.toLowerCase()) >= 0)
    } else {
      this.items = [...this.all]
    }
  }

  clearSearch() {
    this.searchTerm = undefined
  }

  showFilter() {

  }

  closeTools() {

  }

  close() {
    this.onClose.emit()
  }

}

class Result {
  url: string
  name: string
  _id: string
  owner: string
  constructor(doc: any) {
    this.url = doc.url
    this.name = doc.name
    this._id = doc._id
    this.owner = doc.owner
  }

}
