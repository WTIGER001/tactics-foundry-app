import { Component, OnInit, Input } from '@angular/core';
import { DiceRoll } from 'src/app/core/model';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'roll-message',
  templateUrl: './roll-message.component.html',
  styleUrls: ['./roll-message.component.css']
})
export class RollMessageComponent implements OnInit {

  @Input() message : DiceRoll
  
  constructor(private data : DataService) { }

  ngOnInit() {
  }

  isFav(expression : string) : boolean {
    return false
  }

  toggleFav(expression : string) {

  }
}
