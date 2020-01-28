import { Component, OnInit, OnDestroy, NgZone } from '@angular/core';
import { Character } from '../../character';
import { DataService } from 'src/app/core/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { DbWatcher } from 'src/app/core/database-manager';

@Component({
  selector: 'app-characters-page',
  templateUrl: './characters-page.component.html',
  styleUrls: ['./characters-page.component.css']
})
export class CharactersPageComponent implements OnInit, OnDestroy {
  watcher : DbWatcher
  characters: Character[] = []
  showImportDialog = false
  constructor(private data : DataService, private router : Router, private route: ActivatedRoute, private zone: NgZone) { 

  }

  ngOnInit() {
    this.data.player$.subscribe( pid => {
      this.live(pid._id)
    })
  }

  open(chr : Character) {
    this.router.navigate([chr._id], {relativeTo: this.route})
  }
  ngOnDestroy() {
    if (this.watcher) { this.watcher.cancel()}

  }

  newCharacter() {
    // Generate a new ID
    let chr = new Character()

    chr.name = "New Character" 
    chr.owner = this.data.playerId$.getValue() 
    
    this.data.store(chr).subscribe(() => {
      this.router.navigate(['/characters', chr._id])
    })
  }

  live(playerid: string) {
    // this.watcher = this.data.coreDB.watchFields([{field: 'type', value:Character.TYPE}, {field:'owner', value:this.data.playerId$.getValue()}], this.zone)
    this.watcher = this.data.coreDB.watchFields([ {field:'owner', value:this.data.playerId$.getValue()}], this.zone)
    this.watcher.onAdd( item =>  {
      this.characters.push(Character.to(item))
    })
    this.watcher.onUpdate( item => {
      let indx = this.characters.findIndex( c => c._id === item._id)
      if (indx >=0 ) {
        this.characters[indx] = Character.to(item)
      }
    })
    this.watcher.onRemove(item => {
      let indx = this.characters.findIndex( c => c._id === item._id)
        if (indx >=0 ) {
          this.characters.splice(indx, 1)
        }
    })
    this.watcher.start()
  }

  import() {
    this.showImportDialog = true
  }

  cancelImport() {
    this.showImportDialog = true
  }

  save(chr : Character[]) {
    this.showImportDialog = false
    chr.forEach( c => {
      c.owner = this.data.playerId$.getValue() 
      this.data.store(c)
    })
  }

}
