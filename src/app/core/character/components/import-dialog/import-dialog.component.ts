import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { LangUtil } from 'src/app/core/util/LangUtil';
import { mergeMap } from 'rxjs/operators';
import { HeroLabCharacter } from './hero-lab';
import { Character } from '../../character';

@Component({
  selector: 'import-dialog',
  templateUrl: './import-dialog.component.html',
  styleUrls: ['./import-dialog.component.css']
})
export class ImportDialogComponent implements OnInit {
  @Output() onSave = new EventEmitter<Character[]>()
  @Output() onCancel = new EventEmitter()
  @Input() multiple = false
  show : string
  constructor() { }

  ngOnInit() {
  }

  uploadFile(file: FileList | File) {
    if (this.multiple) {
      const files = <FileList> file
      for(let i=0; i<files.length; i++) {
        this.handleFile(files[i])
      }
    } else {
      this.handleFile(<File>file)
    }
  }

  handleFile(file : File) {
    LangUtil.readFile(file).pipe(
      mergeMap(txt => {
        // if (this.show == 'hero') {
          return HeroLabCharacter.importData(txt)
        // } 
        // else if (this.show == 'pcgen') {
        //   return PCGenXml.importData(txt)
        // }
      })
    ).subscribe(chrs => {
      // chrs.forEach(chr => {
      //   this.saveFile(files[0], chr)
      // })
      this.onSave.emit(chrs)
    })
  }

  cancel() {
    this.onCancel.emit()
  }

}
