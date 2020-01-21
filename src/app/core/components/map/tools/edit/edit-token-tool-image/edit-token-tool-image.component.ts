import { Component, OnInit, EventEmitter, Output, Input } from '@angular/core';
import { TokenAnnotation } from 'src/app/core/model';

@Component({
  selector: 'edit-token-tool-image',
  templateUrl: './edit-token-tool-image.component.html',
  styleUrls: ['./edit-token-tool-image.component.css']
})
export class EditTokenToolImageComponent implements OnInit {
  @Input() item : TokenAnnotation
  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  constructor() { }

  ngOnInit() {
  }

}
