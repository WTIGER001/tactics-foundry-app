import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tab',
  templateUrl: './tab-item.component.html',
  styleUrls: ['./tab-item.component.css']
})
export class TabItemComponent  {
  @Input('title') title: string;
  @Input() active = false;
}
