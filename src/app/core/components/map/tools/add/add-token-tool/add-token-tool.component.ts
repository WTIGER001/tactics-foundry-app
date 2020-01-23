import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';
import { ToolItemComponent } from '../../tool-item/tool-item.component';

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
  @Input() type : 'character' | 'token' | 'monster' = 'token'

  results = []
  filterUi = false
  searchTerm : string
  image = '/assets/pages/token-tool.png'
  imageOverlap : string
  height = '150px'

  constructor(  private session : LivePageComponent) {
    
  }

  ngOnInit() {
    if (this.type == 'token') {
      this.image = '/assets/pages/token-tool.png'
       this.imageOverlap = '-35px'
     } else if (this.type == 'character') {
       this.image = '/assets/pages/character.png'
       this.imageOverlap = '-35px'
     } else if (this.type == 'monster') {
       this.image = '/assets/pages/monster-tool.png'
       this.imageOverlap = '-30px'
       this.height = '250px'
     }
  }

  isSelected(item : any) {}

  onSearchChange(filterText: string){

  }

  clearSearch() {

  }

  showFilter() {

  }

  closeTools() {

  }

  close() {
    this.onClose.emit()
  }

}
