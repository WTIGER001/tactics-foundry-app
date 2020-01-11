import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './core/pages/welcome/welcome.component';
import { TestBindingComponent } from './scratch/components/test-binding/test-binding.component';
import { TestBindingContainerComponent } from './scratch/components/test-binding-container/test-binding-container.component';
import { PlayerHomeComponent } from './core/pages/player-home/player-home.component';
import { CharactersPageComponent } from './core/pages/characters-page/characters-page.component';
import { GamesPageComponent } from './core/pages/games-page/games-page.component';
import { GamePageComponent } from './core/pages/game-page/game-page.component';
import { MapInfoPageComponent } from './core/pages/map-info-page/map-info-page.component';
import { MapsPageComponent } from './core/pages/maps-page/maps-page.component';
import { CharacterPageComponent } from './characters/pages/character-page/character-page.component';
import { DefaultGuard } from 'src/default.guard';
import { MapPageComponent } from './core/pages/map-page/map-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // GAMES
  { path: 'home', component: PlayerHomeComponent },
  { path: 'my-settings', component: CharactersPageComponent },
  { path: 'test', component: TestBindingContainerComponent },
  
  { path: 'characters', component: CharactersPageComponent },
  { path: 'characters/:id', component: CharacterPageComponent,  resolve: { 'asset': DefaultGuard } },

  { path: 'games', component: GamesPageComponent },
  { path: 'games/:id', component: GamePageComponent,  resolve: { 'asset': DefaultGuard }  },

  { path: 'games/:id/maps', component: MapsPageComponent,  resolve: { 'asset': DefaultGuard }  },
  { path: 'games/:id/maps/:id', component: MapPageComponent,  resolve: { 'asset': DefaultGuard }  },
  { path: 'games/:id/maps/:id/edit', component: MapInfoPageComponent,  resolve: { 'asset': DefaultGuard }  },

  { path: 'games/:id/characters', component: CharactersPageComponent,  resolve: { 'asset': DefaultGuard }  },
  { path: 'games/:id/characters/:id', component: CharacterPageComponent,  resolve: { 'asset': DefaultGuard }  },

  { path: 'templates', component: CharactersPageComponent },
  { path: 'game', component: GamePageComponent },
  { path: 'new-map', component: MapInfoPageComponent },
  { path: 'maps', component: MapsPageComponent }



];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
