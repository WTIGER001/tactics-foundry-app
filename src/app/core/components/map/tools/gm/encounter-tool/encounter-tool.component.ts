import { Component, OnInit } from '@angular/core';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { ToolsComponent } from '../../tools/tools.component';

@Component({
  selector: 'encounter-tool',
  templateUrl: './encounter-tool.component.html',
  styleUrls: ['./encounter-tool.component.css']
})
export class EncounterToolComponent implements OnInit {

  constructor(private tools: ToolsComponent) { }

  ngOnInit() {
  }

  open() {
    this.tools.showTabs('encounterbuilder')
  }

}
