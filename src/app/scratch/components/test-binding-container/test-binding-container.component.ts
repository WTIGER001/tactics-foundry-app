import { Component, OnInit } from '@angular/core';
import { Annotation, MapData, MarkerTypeAnnotation } from 'src/app/core/model';
import { DatabaseManager } from 'src/app/core/database-manager';

@Component({
  selector: 'app-test-binding-container',
  templateUrl: './test-binding-container.component.html',
  styleUrls: ['./test-binding-container.component.css']
})
export class TestBindingContainerComponent implements OnInit {
  data = new MapData()
  dbmgr : DatabaseManager<Annotation>
  constructor() { 
    this.dbmgr = new DatabaseManager("testbinding")
  }

  ngOnInit() {
  }

  changename() {
    this.data.name = "CHANGED " + new Date().toDateString()
    console.log("----TRUTH---- Changing the map name")
  }

  addAnnotation() {
    let annotation = new MarkerTypeAnnotation()
    this.dbmgr.store(annotation)
    // this.data.annotations = [...this.data.annotations]
    console.log("----TRUTH---- Adding Annotation")
  }

  deleteAnnotation() {
    // this.data.annotations.pop()
    // // this.data.annotations = [...this.data.annotations]
    // this.dbmgr.delete(this.data.annotations[0])
    // console.log("----TRUTH---- Removing Annotation")
  }

  changeAnnotation() {
    // if (this.data.annotations.length > 0) {
    //   this.data.annotations[0].color = "RED " + new Date().toDateString()
    //   this.dbmgr.store(this.data.annotations[0])
    //   console.log("----TRUTH---- Changing the first Annotation")
    // }
  }

  changeAnnotationCenter() {
    // if (this.data.annotations.length > 0) {
    //   this.data.annotations[0].center = new CenterPoint(this.data.annotations[0].center.x +1, this.data.annotations[0].center.y +1 )
    //   console.log("----TRUTH---- Changing the first Annotation Center Point")
    // }
  }


}



