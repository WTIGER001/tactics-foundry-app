import { Component, OnInit } from '@angular/core';
import { DataService } from 'src/app/core/data.service';
import { SettingsService, Setting, ShowMoveSetting, ShowCustomMoveSetting } from 'src/app/core/settings.service';
import { settings } from 'cluster';

@Component({
  selector: 'edit-token-tool-measure',
  templateUrl: './edit-token-tool-measure.component.html',
  styleUrls: ['./edit-token-tool-measure.component.css']
})
export class EditTokenToolMeasureComponent implements OnInit {
  configs: Config[] = []
  custom : CustomConfig 
  constructor(private settings: SettingsService) { }

  ngOnInit() {
    this.configs.push(
      new Config("1 Move ", this.settings.gameTokenShowMove1),
      new Config("Reach", this.settings.gameTokenShowReach),
      new Config("2 Moves", this.settings.gameTokenShowMove2),
      new Config("Reach Weapon", this.settings.gameTokenShowReachWeapon),
      new Config("Run", this.settings.gameTokenShowRun),
    )
    this. custom  = new CustomConfig(this.settings.gameTokenShowCustomMove)
  }

}

class CustomConfig {
  color: string
  enabled: boolean
  value : number

  constructor(private setting: Setting<ShowCustomMoveSetting>) {
    this.setting.value.subscribe(v => {
      this.color = v.color
      this.enabled = v.enabled
      this.value = v.distance 
    })
  }

  updateColor(clr : string) {
    this.color = clr
    this.update()
  }
  update() {
    this.setting.set({ color: this.color, enabled: this.enabled, distance : this.value  })
  }
  
}

class Config {
  color: string
  enabled: boolean
  constructor(public label: string, private setting: Setting<ShowMoveSetting>) {
    this.setting.value.subscribe(v => {
      this.color = v.color
      this.enabled = v.enabled
    })
  }
  updateColor(clr : string) {
    this.color = clr
    this.update()
  }
  update() {
    this.setting.set({ color: this.color, enabled: this.enabled })
  }
}