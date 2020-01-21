import { Component, OnInit, Input } from '@angular/core';

@Component({
  selector: 'tool-tab',
  templateUrl: './tool-tab.component.html',
  styleUrls: ['./tool-tab.component.css']
})
export class ToolTabComponent implements OnInit {
  active= false

  @Input() label : string = ""
  @Input() icon : string
  @Input() noPadding = false

  constructor() { }

  ngOnInit() {

  }

  public addTab(label : string, icon : string, component : any) {
    
  }

}
