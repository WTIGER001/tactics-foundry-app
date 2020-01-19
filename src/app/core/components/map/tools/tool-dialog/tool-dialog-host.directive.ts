import { Directive, ViewContainerRef } from '@angular/core';

@Directive({
  selector: '[toolDialogHost]'
})
export class ToolDialogHostDirective {

  constructor(public viewContainerRef: ViewContainerRef) { }

}
