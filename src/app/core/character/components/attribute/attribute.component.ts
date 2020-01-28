import { Component, OnInit, Input } from '@angular/core';
import { Attribute } from '../../character';

@Component({
  selector: 'attribute',
  templateUrl: './attribute.component.html',
  styleUrls: ['./attribute.component.css']
})
export class AttributeComponent implements OnInit {
  @Input() item : Attribute
  constructor() { }

  ngOnInit() {
  }

}
