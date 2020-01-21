import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Annotation, CircleAnnotation } from 'src/app/core/model';
import { AnnotationPlugin } from '../../plugins/annotation-plugin';
import { LivePageComponent } from 'src/app/core/pages/live-page/live-page.component';

@Component({
  selector: 'layer-pick',
  templateUrl: './layer-pick.component.html',
  styleUrls: ['./layer-pick.component.css']
})
export class LayerPickComponent implements OnInit {
  @Input() item : Annotation = new CircleAnnotation() // TEMP
  @Output() updated = new EventEmitter<string>()
  constructor(public session: LivePageComponent) { }

  ngOnInit() {
  }

  setLayer(layer : 'player' |'gm'|'background') {
    this.item.layer = layer
    this.updated.emit(layer)
  }

}
