import { Component, OnInit } from '@angular/core';
import { ToolDialogComponent } from '../../tool-dialog/tool-dialog.component';

/**
 * Add a token, character or monster
 */
@Component({
  selector: 'add-token-tool',
  templateUrl: './add-token-tool.component.html',
  styleUrls: ['./add-token-tool.component.css']
})
export class AddTokenToolComponent implements OnInit {
  results = []
  filterUi = false
  searchTerm : string
  type : 'character' | 'token' | 'monster' = 'token'

  constructor( private parent: ToolDialogComponent) {
    
  }

  ngOnInit() {
    if (this.type == 'token') {
     this.parent.image = '/assets/pages/token-tool.png'
      this.parent.imageOverlap = '-35px'
    } else if (this.type == 'character') {
      this.parent.image = '/assets/pages/character.png'
      this.parent.imageOverlap = '-35px'
    } else if (this.type == 'monster') {
      this.parent.image = '/assets/pages/monster-tool.png'
      this.parent.imageOverlap = '-35px'
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


}
