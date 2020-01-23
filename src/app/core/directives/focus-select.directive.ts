import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[focus-select]'
})
export class FocusSelectDirective {

  @HostListener('click') 
  click() {
    this.el.nativeElement.select()
  }
  
  constructor(private el: ElementRef) {
  }

  ngOnInit() {
  }
}
