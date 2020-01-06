import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { Annotation } from 'src/app/core/model';

/**
 * TEst binding a child
 */
@Component({
  selector: 'app-test-binding-child',
  templateUrl: './test-binding-child.component.html',
  styleUrls: ['./test-binding-child.component.css']
})
export class TestBindingChildComponent implements OnInit, OnChanges {
  @Input() item : Annotation

  constructor() { }

  ngOnInit() {
  }

  ngOnChanges(changes: SimpleChanges) {
    // let current = changes.prop.currentValue
    // let previous = changes.prop.previousValue

    console.log("PARENT ChANGE",changes.prop)
  }
}
