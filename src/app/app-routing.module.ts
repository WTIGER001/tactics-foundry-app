import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './core/components/welcome/welcome.component';
import { TestBindingComponent } from './scratch/components/test-binding/test-binding.component';
import { TestBindingContainerComponent } from './scratch/components/test-binding-container/test-binding-container.component';
import { PlayerHomeComponent } from './core/components/player-home/player-home.component';
import { CharactersPageComponent } from './core/pages/characters-page/characters-page.component';
import { GamesPageComponent } from './core/pages/games-page/games-page.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // GAMES
  { path: 'home', component: PlayerHomeComponent },
  { path: 'test', component: TestBindingContainerComponent },
  { path: 'my-characters', component: CharactersPageComponent },
  { path: 'my-games', component: GamesPageComponent },
  { path: 'my-settings', component: CharactersPageComponent },
  { path: 'my-templates', component: CharactersPageComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
