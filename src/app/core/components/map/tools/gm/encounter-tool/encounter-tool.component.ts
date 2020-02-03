import { Component, OnInit } from '@angular/core';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';
import { ToolsComponent } from '../../tools/tools.component';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'encounter-tool',
  templateUrl: './encounter-tool.component.html',
  styleUrls: ['./encounter-tool.component.css']
})
export class EncounterToolComponent implements OnInit {

  constructor(private tools: ToolsComponent, private session : LivePageComponent) { }

  ngOnInit() {


  }

  open() {
    this.tools.showTabs('encounterbuilder')
  }

  nextTurn() {
    let encounter = this.session.encounter$.getValue()
    if (encounter) {
      encounter.nextTurn()
      this.session.data.store(encounter)
    }
  }

  nextRound() {
    let encounter = this.session.encounter$.getValue()
    if (encounter) {
      encounter.nextRound()
      this.session.data.store(encounter)
    }
  }

  end() {
    let encounter = this.session.encounter$.getValue()
    if (encounter) {
      encounter.active = false
      this.session.data.store(encounter)
    }
  }

}
