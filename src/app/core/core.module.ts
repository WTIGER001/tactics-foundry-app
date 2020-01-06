import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxBarcodeModule } from 'ngx-barcode';
import { PlayerHomeComponent } from './components/player-home/player-home.component'
import { WelcomeComponent } from './components/welcome/welcome.component';
import { JoingameComponent } from './components/joingame/joingame.component';
import { PlayeridComponent } from './components/playerid/playerid.component';
import { DisplaynameComponent } from './components/displayname/displayname.component';
import { DataService } from './data.service';


@NgModule({
  declarations: [
    WelcomeComponent, 
    JoingameComponent, 
    PlayeridComponent, 
    DisplaynameComponent,
    PlayerHomeComponent],
  imports: [
    CommonModule, 
    FormsModule,
    FontAwesomeModule, 
    NgxBarcodeModule
  ], 
  providers: [
    DataService
  ]
})
export class CoreModule { }
