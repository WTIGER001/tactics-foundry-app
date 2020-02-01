import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TestBindingContainerComponent } from './scratch/components/test-binding-container/test-binding-container.component';
import { PlayerHomeComponent } from './core/pages/player-home/player-home.component';
import { CharactersPageComponent } from './core/character/pages/characters-page/characters-page.component';
import { GamesPageComponent } from './core/pages/games-page/games-page.component';
import { GamePageComponent } from './core/pages/game-page/game-page.component';
import { MapInfoPageComponent } from './core/pages/map-info-page/map-info-page.component';
import { MapsPageComponent } from './core/pages/maps-page/maps-page.component';
import { DefaultGuard } from 'src/default.guard';
import { LivePageComponent } from './core/pages/live-page/live-page.component';
import { CharacterPageComponent } from './core/character/pages/character-page/character-page.component';
import { GameJoinPageComponent } from './core/pages/game-join-page/game-join-page.component';
import { GameInvitePageComponent } from './core/pages/game-invite-page/game-invite-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // GAMES
  { path: 'home', component: PlayerHomeComponent},
  { path: 'my-settings', component: CharactersPageComponent, canActivate : [DefaultGuard]  },
  { path: 'test', component: TestBindingContainerComponent, canActivate : [DefaultGuard]  },
  
  { path: 'characters', component: CharactersPageComponent , canActivate : [DefaultGuard] },
  { path: 'characters/:id', component: CharacterPageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard] },

  { path: 'games', component: GamesPageComponent },
  { path: 'games/:id', component: GamePageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard]   },
  { path: 'games/:id/live', component: LivePageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard] },
  { path: 'games/:id/invite', component: GameInvitePageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard] },
  { path: 'join', component: GameJoinPageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard] },

  { path: 'games/:id/maps', component: MapsPageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard]   },
  { path: 'games/:id/maps/:id', component: MapInfoPageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard]   },

  { path: 'games/:id/characters', component: CharactersPageComponent,  resolve: { 'ctx': DefaultGuard } , canActivate : [DefaultGuard]  },
  { path: 'games/:id/characters/:id', component: CharacterPageComponent,  resolve: { 'ctx': DefaultGuard } , canActivate : [DefaultGuard]  },

  { path: 'templates', component: CharactersPageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard]  },
  { path: 'game', component: GamePageComponent,  resolve: { 'ctx': DefaultGuard } , canActivate : [DefaultGuard] },
  { path: 'new-map', component: MapInfoPageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard]  },
  { path: 'maps', component: MapsPageComponent,  resolve: { 'ctx': DefaultGuard }, canActivate : [DefaultGuard]  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
