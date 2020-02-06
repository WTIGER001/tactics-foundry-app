import { Component, OnInit, Input, SimpleChanges, OnChanges } from '@angular/core';
import { DatabaseManager } from 'src/app/core/database-manager';
import { Annotation, MapData, MarkerTypeAnnotation } from 'src/app/core/model';

@Component({
  selector: 'app-test-binding-parent',
  templateUrl: './test-binding-parent.component.html',
  styleUrls: ['./test-binding-parent.component.css']
})
export class TestBindingParentComponent  implements OnInit, OnChanges {
  @Input() mgr : DatabaseManager
  @Input() data : MapData
  items : Annotation[] = []

  feed : PouchDB.LiveFind.LiveFeed<Annotation>

  constructor() {

  }

  ngOnInit() {
    let db   = this.mgr.localdb

    // Create the index
    db.createIndex({
      index: { fields: ['type']}
    })

    db.find({
      selector : {
        type : 'annotation'
      }
    })

    this.feed = db.liveFind({
      selector: {type: 'annotation'},
      aggregate: true
    })

    this.feed.on('update', (update, aggregate) => {
      // update.action is 'ADD', 'UPDATE', or 'REMOVE'
      // update also contains id, rev, and doc
      console.log(update.action, update.id);

      if (update.action == 'ADD') {
        let a = new MarkerTypeAnnotation().copyFrom(update.doc)
        this.items.push(a)
      }


    })
  }


  ngOnChanges(changes: SimpleChanges) {
    // let current = changes.prop.currentValue
    // let previous = changes.prop.previousValue

    console.log("PARENT ChANGE",changes.prop)
  }
}
