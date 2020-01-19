import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { FormatToolDialogComponent } from '../format-tool-dialog/format-tool-dialog.component';
import { ToolTabsComponent } from '../tool-tabs/tool-tabs.component';
import { CircleAnnotation } from 'src/app/core/model';
import { ToolDialogComponent } from '../tool-dialog/tool-dialog.component';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'edit-circle-tool',
  templateUrl: './edit-circle-tool.component.html',
  styleUrls: ['./edit-circle-tool.component.css']
})
export class EditCircleToolComponent implements OnInit {
  @ViewChild(ToolDialogComponent, {static :false}) formatDialog: ToolDialogComponent
  @Input() circle : CircleAnnotation = new CircleAnnotation()

  constructor(private tabs : ToolTabsComponent, private data : DataService) { 

  }

  ngOnInit() {

  }

  showFormatDialog() {
    const dialog : FormatToolDialogComponent = this.tabs.showDialog(FormatToolDialogComponent)
    dialog.item = this.circle
    dialog.onUpdate.subscribe( () => {
      this.save()
    })
  }

  isFavorite() {
    return false;
  }

  isRestricted() {
    return false
  }

  save() {
    

  }
}
