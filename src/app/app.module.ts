import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '../environments/environment';

import { FontAwesomeModule, FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { Icons } from './icon-library';
import { CoreModule } from './core/core.module';
import { StorageModule } from '@ngx-pwa/local-storage';
import { ScratchModule } from './scratch/scratch.module';
import * as shortid from 'shortid';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,      
    AppRoutingModule,
    ServiceWorkerModule.register('ngsw-worker.js', { enabled: environment.production }),
    FontAwesomeModule,
    CoreModule,
    StorageModule.forRoot({ IDBNoWrap: true }), 
    ScratchModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { 
  constructor(library: FaIconLibrary) {
    new Icons(library);
  }
}
