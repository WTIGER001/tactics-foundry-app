import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './core/components/welcome/welcome.component';
import { TestBindingComponent } from './scratch/components/test-binding/test-binding.component';
import { TestBindingContainerComponent } from './scratch/components/test-binding-container/test-binding-container.component';
import { PlayerHomeComponent } from './core/components/player-home/player-home.component';


const routes: Routes = [
  { path: '', redirectTo: '/home', pathMatch: 'full' },

  // GAMES
  { path: 'home', component: PlayerHomeComponent },
  { path: 'test', component: TestBindingContainerComponent }


];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
