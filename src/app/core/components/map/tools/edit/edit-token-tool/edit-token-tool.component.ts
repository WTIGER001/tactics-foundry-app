import { Component, OnInit, Input, Output, EventEmitter, ViewChild, AfterViewInit, AfterContentInit } from '@angular/core';
import { TokenAnnotation } from 'src/app/core/model';
import { ToolTabsComponent } from '../../tool-tabs/tool-tabs.component';

@Component({
  selector: 'edit-token-tool',
  templateUrl: './edit-token-tool.component.html',
  styleUrls: ['./edit-token-tool.component.css']
})
export class EditTokenToolComponent implements OnInit, AfterContentInit {
  @ViewChild(ToolTabsComponent, {static: false}) tabs : ToolTabsComponent
  @Input() item : TokenAnnotation
  @Output() onUpdate = new EventEmitter<TokenAnnotation>()
  @Output() onClose = new EventEmitter()
  
  constructor() { }

  ngOnInit() {

  }

  // Called when something is updated
  updated() {
    this.onUpdate.emit(this.item)
  }

  ngAfterContentInit() {
    
  }
  close() {
    this.onClose.emit()
  }
}
