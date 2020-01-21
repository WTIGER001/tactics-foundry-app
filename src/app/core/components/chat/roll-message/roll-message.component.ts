import { Component, OnInit, Input } from '@angular/core';
import { DiceRoll, DiceResult } from 'src/app/core/model';
import { DataService } from 'src/app/core/data.service';

@Component({
  selector: 'roll-message',
  templateUrl: './roll-message.component.html',
  styleUrls: ['./roll-message.component.css']
})
export class RollMessageComponent implements OnInit {

  @Input() message: DiceRoll

  constructor(private data: DataService) { }

  ngOnInit() {
    this.message = DiceRoll.to(this.message)
  }

  isFav(expression: string): boolean {
    return false
  }

  toggleFav(expression: string) {

  }

  getDiceFontClass(r: DiceResult) {
    return "df-d" + r.type + "-" + r.value
  }


  getNoClass(r: DiceResult): boolean {
    switch (r.type) {
      case 2:
      case 4:
      case 6:
      case 8:
      case 10:
      case 12:
      case 20:
        return false
    }
    return true
  }


}
