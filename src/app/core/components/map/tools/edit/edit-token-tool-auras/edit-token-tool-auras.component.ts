import { Component, OnInit, Output, Input, EventEmitter } from '@angular/core';
import { TokenAnnotation } from 'src/app/core/model';

@Component({
  selector: 'edit-token-tool-auras',
  templateUrl: './edit-token-tool-auras.component.html',
  styleUrls: ['./edit-token-tool-auras.component.css']
})
export class EditTokenToolAurasComponent implements OnInit {
  @Input() item : TokenAnnotation
  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  constructor() { }

  ngOnInit() {
  }

}
