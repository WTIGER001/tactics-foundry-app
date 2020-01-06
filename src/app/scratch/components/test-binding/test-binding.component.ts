/**
 * This is a component to test out some ideas on a model. We want to test out a few options:
 * 
 * ngOnChanges and child components
 */
import { Component, OnInit, OnChanges, SimpleChanges, Input, IterableDiffers, DoCheck, IterableDiffer, AfterContentInit, KeyValueDiffers, KeyValueDiffer } from '@angular/core';
import { MapData, Annotation } from 'src/app/core/model';

@Component({
  selector: 'app-test-binding',
  templateUrl: './test-binding.component.html',
  styleUrls: ['./test-binding.component.css']
})
export class TestBindingComponent implements OnInit, OnChanges, AfterContentInit  {
  @Input() data : MapData
  @Input() annotations: Annotation[] = []
  differ: IterableDiffer<Annotation>
  kvdifferes : KeyValueDiffer<unknown, unknown>[] = []
  constructor(private differs: IterableDiffers, private differsKV: KeyValueDiffers) {
  }


  ngOnInit() {
    console.log("ngOnInit")
    console.log("INPUT", this.data)
    this.differ = this.differs.find(this.annotations).create();

  }

  ngAfterContentInit() {
        console.log("ngAfterContentInit")
  }


  ngOnChanges(changes: SimpleChanges) {
    // let current = changes.prop.currentValue
    // let previous = changes.prop.previousValue

    console.log("ChANGE",changes.prop)
  }

  ngDoCheck() {
    // console.log("do check")

    if (this.data && this.annotations && this.differ) {
      const changes = this.differ.diff(this.annotations)
      if (changes) {
        changes.forEachAddedItem(record => {
          console.log("---> FOUND NEW ANNOTATION --> ", record)
          let diff = this.differsKV.find(record.item).create()
          this.kvdifferes.splice(record.currentIndex, 0, diff)
        })
        changes.forEachRemovedItem((record) => {
          console.log("---> FOUND REMOVED ANNOTATION --> ", record)
          this.kvdifferes.splice(record.previousIndex, 1)
        })
      }

      this.kvdifferes.forEach( (differ, index) => {
        // console.log("Diffing index ", index)
        let a = this.annotations[index]
        const map = new Map(Object.entries(a));
        const achanges = differ.diff(map)
        if (achanges) {
          achanges.forEachItem( rec => {
            console.log("---> FOUND ANNOTATION CHANGE --> ", rec)
          })
        }
      })
    }
  }

  private createDifferKv(a : Annotation) {

  }
 

}


