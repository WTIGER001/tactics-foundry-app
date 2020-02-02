import { Component, OnInit, Output, EventEmitter, Input, Directive, ViewChild, AfterViewInit } from '@angular/core';
import { AbstractValueAccessor } from '../util/value-accessor';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

@Component({
  selector: 'number-spinner',
  templateUrl: './number-spinner.component.html',
  styleUrls: ['./number-spinner.component.css'], 
  providers: [
    { provide: NG_VALUE_ACCESSOR, useExisting: NumberSpinnerComponent, multi: true }
  ]
})
export class NumberSpinnerComponent extends AbstractValueAccessor implements OnInit, AfterViewInit {
  @Output() valueChange = new EventEmitter<number>()
  @Input() bgDetail = false
  @Input() bgGrey = true

  @ViewChild('left', {static: false}) left 
  @ViewChild('right', {static: false}) right 
  
  @Input() bg: string = "var(--mygrey)"
  value : number

  constructor() { 
    super()
    // this.registerOnChange( v => {
    //   this.change.emit(v)
    // })
  }

  ngOnInit() {
    
  }


  ngAfterViewInit() {
    // if (this.bg) {
    //   this.left.nativeElement.style.background = this.bg
    //   this.right.nativeElement.style.background = this.bg
    // }
  }

  plus() {
    this.value = Number(this.value) + 1
  }

  minus() {
    this.value = Number(this.value) - 1
  }

  refresh() {
  
  }

  writeSpinnerValue(value : number) {
    this.value = value
  }
}

// const CUSTOM_VALUE_ACCESSOR = new Provider(
//   NG_VALUE_ACCESSOR, {useExisting: forwardRef(() => LabelsValueAccessor), multi: true});

// @Directive({
//   selector: 'labels',
//   host: {'(valueChange)': 'onChange($event)'}, 
//   providers: [CUSTOM_VALUE_ACCESSOR]
// })
// export class LabelsValueAccessor implements ControlValueAccessor {
//   onChange = (_) => {};
//   onTouched = () => {};

//   constructor(private host: NumberSpinnerComponent) {

//   }

//   writeValue(value: any): void {
//     this.host.writeSpinnerValue(value);
//   }

//   registerOnChange(fn: (_: any) => void): void { this.onChange = fn; }
//   registerOnTouched(fn: () => void): void { this.onTouched = fn; }
// }