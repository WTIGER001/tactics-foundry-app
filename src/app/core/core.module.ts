import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule} from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ColorPickerModule } from 'ngx-color-picker';

import { PlayerHomeComponent } from './pages/player-home/player-home.component'
import { WelcomeComponent } from './pages/welcome/welcome.component';
import { JoingameComponent } from './components/joingame/joingame.component';
import { PlayeridComponent } from './components/playerid/playerid.component';
import { DisplaynameComponent } from './components/displayname/displayname.component';
import { DataService } from './data.service';
import { DetailPageComponent } from './components/detail-page/detail-page.component';
import { ContenteditableModule } from '@ng-stack/contenteditable';
import { SearchInputComponent } from './components/search-input/search-input.component';
import { TabBarComponent } from './components/tab-bar/tab-bar.component';
import { TabItemComponent } from './components/tab-item/tab-item.component';
import { CharactersPageComponent } from './pages/characters-page/characters-page.component';
import { GamesPageComponent } from './pages/games-page/games-page.component';
import { PicturebtnComponent } from './components/picturebtn/picturebtn.component';
import { GamePageComponent } from './pages/game-page/game-page.component';
import { MapsPageComponent } from './pages/maps-page/maps-page.component';
import { MapInfoPageComponent } from './pages/map-info-page/map-info-page.component';
import { MapPageComponent } from './pages/map-page/map-page.component';
import { ImagePickerComponent } from './components/image-picker/image-picker.component';
import { UploadButtonComponent } from './components/upload-button/upload-button.component';
import { EditableTitleComponent } from './components/editable-title/editable-title.component';


@NgModule({
  declarations: [
    WelcomeComponent, 
    JoingameComponent, 
    PlayeridComponent, 
    DisplaynameComponent,
    PlayerHomeComponent,
    DetailPageComponent,
    SearchInputComponent,
    TabBarComponent,
    TabItemComponent,
    CharactersPageComponent,
    GamesPageComponent,
    PicturebtnComponent,
    GamePageComponent,
    MapsPageComponent,
    MapInfoPageComponent,
    MapPageComponent,
    ImagePickerComponent,
    UploadButtonComponent,
    EditableTitleComponent
  ],
  imports: [
    CommonModule, 
    FormsModule,
    FontAwesomeModule, 
    NgxBarcodeModule, 
    ContenteditableModule, 
    RouterModule, 
    ColorPickerModule
  ], 
  providers: [
    DataService
  ]
})
export class CoreModule { 
  root(environment) {

  }
}
