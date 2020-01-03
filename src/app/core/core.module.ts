import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeComponent } from './welcome/welcome.component';
import { JoingameComponent } from './joingame/joingame.component';
import { ChangeplayeridComponent } from './changeplayerid/changeplayerid.component';
import { PlayeridComponent } from './playerid/playerid.component';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';



@NgModule({
  declarations: [WelcomeComponent, JoingameComponent, ChangeplayeridComponent, PlayeridComponent],
  imports: [
    CommonModule, 
    FontAwesomeModule
  ]
})
export class CoreModule { }
