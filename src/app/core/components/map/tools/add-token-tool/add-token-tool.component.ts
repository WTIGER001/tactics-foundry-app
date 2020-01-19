import { Component, OnInit } from '@angular/core';

/**
 * Add a token, character or monster
 */
@Component({
  selector: 'add-token-tool',
  templateUrl: './add-token-tool.component.html',
  styleUrls: ['./add-token-tool.component.css']
})
export class AddTokenToolComponent implements OnInit {

  filterUi = false
  searchTerm : string
  type : 'character' | 'token' | 'monster'

  constructor() { }

  ngOnInit() {

  }

}
