import { Component, OnInit, ViewChild, NgZone } from '@angular/core';
import { Character } from '../../character';
import { SkillsComponent } from '../../components/skills/skills.component';
import { DataService } from 'src/app/core/data.service';
import { Router, ActivatedRoute } from '@angular/router';
import { ImageUtil } from 'src/app/core/util/ImageUtil';
import { Subject } from 'rxjs';
import { debounce, debounceTime } from 'rxjs/operators';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { RouteContext } from 'src/app/core/model';
import { DbWatcher } from 'src/app/core/database-manager';

@Component({
  selector: 'character-page',
  templateUrl: './character-page.component.html',
  styleUrls: ['./character-page.component.css']
})
export class CharacterPageComponent implements OnInit {
  tab : string
  character = new Character()
  showImportDialog = false
  showCropDialog : boolean = false
  uploadfile : File
  limitedUpdates$ = new Subject<Character>()

  @ViewChild(SkillsComponent, {static: false}) sks : SkillsComponent;
  watcher : DbWatcher

  skillOptions = {
    hideUntrained : true,
    sortBy: 'name'
  }
  constructor(private data: DataService, private router : Router, private route : ActivatedRoute, private zone: NgZone) { }

  ngOnInit() {
    this.limitedUpdates$.pipe( debounceTime(500)).subscribe( chr => {
      this.data.store(chr).subscribe( res => {
        this.character._rev = res['rev']
      })
    })

    this.route.data.subscribe((data: { ctx: RouteContext }) => {
      let id = data.ctx.id
      this.watcher = this.data.coreDB.watchId(id, this.zone)
      this.watcher.onAdd( doc =>  this.character = Character.to(doc))
      this.watcher.onUpdate( doc => this.character = Character.to(doc))
      this.watcher.onRemove( doc => this.router.navigate([".."], { relativeTo: this.route }))
      this.watcher.start()
    }) 
  }

  select(tabName ?: string) {
    this.tab = tabName
  }

  search() {

  }

  saveCharacter() {
    this.limitedUpdates$.next(this.character)
  }

  updateTitle(newName : string) {
    this.character.name = newName
    this.saveCharacter()
  }

  updateSkills() {
    this.sks.updateOptions()
  }

  import() {
    this.showImportDialog = true
  }

  cancelImport() {
    this.showImportDialog = true
  }

  save(chr : Character[]) {
    this.showImportDialog = false

    // Merge everything from the input character, but keep the id
    const id = this.character._id
    const rev = this.character._rev

    LangUtil.copyFrom(this.character, chr[0])
    this.character._id = id
    this.character._rev = rev

    this.saveCharacter()
  }

  delete() {
    this.limitedUpdates$.complete()
    this.data.delete(this.character)
    this.router.navigate(["../"], { relativeTo: this.route })
  }

  uploadImg($event: File) {
    this.uploadfile = $event
    this.showCropDialog = true
    // ImageUtil.loadImg($event, {
    //   createThumbnail: true,
    //   thumbnailKeepAspect: true,
    //   thumbnailMaxHeight: 240,
    //   thumbnailMaxWidth: 420
    // }).subscribe(result => {
    //   this.character.url = result.thumbDataUrl
    //   this.data.store(this.character)
    // })
  }

  saveImage($event) {
    this.character.url = $event
    this.data.store(this.character)
    this.showCropDialog = false
  }

  cancelCrop(){
    this.uploadfile = undefined
    this.showCropDialog = false
  }
}
