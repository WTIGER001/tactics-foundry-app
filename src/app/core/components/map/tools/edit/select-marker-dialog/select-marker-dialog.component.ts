import { Component, OnInit, EventEmitter, Output } from '@angular/core';
import { MarkerService, Marker, MarkerCategory } from 'src/app/core/marker.service';

@Component({
  selector: 'select-marker-dialog',
  templateUrl: './select-marker-dialog.component.html',
  styleUrls: ['./select-marker-dialog.component.css']
})
export class SelectMarkerDialogComponent implements OnInit {
  categories : MarkerCategory[] = []
  @Output() onSelect = new EventEmitter<Marker>()

  constructor(markerService : MarkerService) { 
    this.categories = markerService.categories
  }

  ngOnInit() {
  }

  select(item : Marker) {
    this.onSelect.emit(item)
  }

}
