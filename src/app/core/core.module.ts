import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { NgxBarcodeModule } from 'ngx-barcode';
import { ColorPickerModule } from 'ngx-color-picker';
import { EmojifyModule } from 'angular-emojify';
import { PlatformModule } from '@angular/cdk/platform';

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
import { SelectPlayersPageComponent } from './pages/select-players-page/select-players-page.component';
import { LongPressDirective } from './directives/long-press.directive';
import { LivePageComponent } from './pages/live-page/live-page.component';
import { MapComponent } from './components/map/map/map.component';
import { FullChatComponent } from './components/chat/full-chat/full-chat.component';
import { ChatPreviewComponent } from './components/chat/chat-preview/chat-preview.component';
import { ChatTextComponent } from './components/chat/chat-text/chat-text.component';
import { ChatRollsComponent } from './components/chat/chat-rolls/chat-rolls.component';
import { RollMessageComponent } from './components/chat/roll-message/roll-message.component';
import { TextMessageComponent } from './components/chat/text-message/text-message.component';
import { PingMessageComponent } from './components/chat/ping-message/ping-message.component';
import { MessageComponent } from './components/chat/message/message.component';
import { DiceCanvasComponent } from './components/chat/dice-canvas/dice-canvas.component';
import { GridToolComponent } from './components/map/tools/gm/grid-tool/grid-tool.component';
import { FogToolComponent } from './components/map/tools/gm/fog-tool/fog-tool.component';
import { CalibrateToolComponent } from './components/map/tools/gm/calibrate-tool/calibrate-tool.component'
import { LineStyleComponent } from './components/util/line-style/line-style.component';
import { LineWeightComponent } from './components/util/line-weight/line-weight.component';
import { AddToolComponent } from './components/map/tools/add/add-tool/add-tool.component';
import { AddTokenToolComponent } from './components/map/tools/add/add-token-tool/add-token-tool.component';
import { ToolTabsComponent } from './components/map/tools/tool-tabs/tool-tabs.component';
import { ToolTabComponent } from './components/map/tools/tool-tab/tool-tab.component';
import { FavoritesToolComponent } from './components/map/tools/add/favorites-tool/favorites-tool.component';
import { FormatToolDialogComponent } from './components/map/tools/format-tool-dialog/format-tool-dialog.component';
import { ToolDialogComponent } from './components/map/tools/tool-dialog/tool-dialog.component';
import { EditCircleToolComponent } from './components/map/tools/edit/edit-circle-tool/edit-circle-tool.component';
import { ToolDialogHostDirective } from './components/map/tools/tool-dialog/tool-dialog-host.directive';
import { PlaceholderDirective } from './directives/placeholder.directive';
import { ToolsComponent } from './components/map/tools/tools/tools.component';
import { ToolService } from './components/map/tools/tool.service';
import { LayerPickComponent } from './components/map/tools/layer-pick/layer-pick.component';
import { EditTokenToolComponent } from './components/map/tools/edit/edit-token-tool/edit-token-tool.component';
import { EditTokenToolPersonalComponent } from './components/map/tools/edit/edit-token-tool-personal/edit-token-tool-personal.component';
import { EditTokenToolBarsComponent } from './components/map/tools/edit/edit-token-tool-bars/edit-token-tool-bars.component';
import { EditTokenToolAurasComponent } from './components/map/tools/edit/edit-token-tool-auras/edit-token-tool-auras.component';
import { EditTokenToolImageComponent } from './components/map/tools/edit/edit-token-tool-image/edit-token-tool-image.component';
import { FavToolComponent } from './components/map/tools/fav-tool/fav-tool.component';
import { AddsubDirective } from './directives/addsub.directive';
import { FocusSelectDirective } from './directives/focus-select.directive';
import { ColorDialogComponent } from './components/color-dialog/color-dialog.component';
import { ColorCellComponent } from './components/color-cell/color-cell.component';
import { ToolItemComponent } from './components/map/tools/tool-item/tool-item.component';


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
    EditableTitleComponent,
    SelectPlayersPageComponent,
    LongPressDirective,
    LivePageComponent,
    MapComponent,
    FullChatComponent,
    ChatPreviewComponent,
    ChatTextComponent,
    ChatRollsComponent,
    RollMessageComponent,
    TextMessageComponent,
    PingMessageComponent,
    MessageComponent,
    DiceCanvasComponent,
    GridToolComponent,
    FogToolComponent,
    CalibrateToolComponent,
    LineStyleComponent,
    LineWeightComponent,
    AddToolComponent,
    AddTokenToolComponent,
    ToolTabsComponent,
    ToolTabComponent,
    FavoritesToolComponent,
    FormatToolDialogComponent,
    ToolDialogComponent,
    EditCircleToolComponent,
    ToolDialogHostDirective,
    PlaceholderDirective,
    ToolsComponent,
    LayerPickComponent,
    EditTokenToolComponent,
    EditTokenToolPersonalComponent,
    EditTokenToolBarsComponent,
    EditTokenToolAurasComponent,
    EditTokenToolImageComponent,
    FavToolComponent,
    AddsubDirective,
    FocusSelectDirective,
    ColorDialogComponent,
    ColorCellComponent,
    ToolItemComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    FontAwesomeModule,
    NgxBarcodeModule,
    ContenteditableModule,
    RouterModule,
    ColorPickerModule,
    EmojifyModule,
    PlatformModule
  ],
  providers: [
    DataService, 
    ToolService
  ],
  entryComponents: [
    ToolDialogComponent,
    FormatToolDialogComponent,
    AddTokenToolComponent
  ]
})
export class CoreModule {
  root(environment) {

  }
}
