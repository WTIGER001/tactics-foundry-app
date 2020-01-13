import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router'
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { CoreModule} from '../core/core.module'
import { CharacterPageComponent } from './pages/character-page/character-page.component';



@NgModule({
  declarations: [
    CharacterPageComponent
  ],
  imports: [
    CommonModule, 
    RouterModule, 
    FormsModule, 
    CoreModule
  ]
})
export class CharactersModule { }
