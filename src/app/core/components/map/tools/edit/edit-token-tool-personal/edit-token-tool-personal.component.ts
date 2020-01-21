import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { TokenAnnotation } from 'src/app/core/model';

@Component({
  selector: 'edit-token-tool-personal',
  templateUrl: './edit-token-tool-personal.component.html',
  styleUrls: ['./edit-token-tool-personal.component.css']
})
export class EditTokenToolPersonalComponent implements OnInit {
  @Input() item : TokenAnnotation
  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  constructor() { }

  ngOnInit() {
  }

  updated() {
    this.onUpdate.emit(this.item)
  }

}
