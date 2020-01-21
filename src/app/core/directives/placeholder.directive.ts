import { Directive, ViewContainerRef, AfterViewInit, ComponentFactoryResolver } from '@angular/core';

@Directive({
  selector: '[placeholder]'
})
export class PlaceholderDirective implements AfterViewInit{
  constructor(public viewContainerRef: ViewContainerRef, private cfr : ComponentFactoryResolver) { 
    console.log("CONSTRUT" ,this.viewContainerRef);
    
  }

  ngAfterViewInit() {
    console.log("AFTER" ,this.viewContainerRef);
  }

  public createHere(component : any) : any {
    const cf = this.cfr.resolveComponentFactory(component)
    console.log(this.viewContainerRef);
    this.viewContainerRef.clear()
    const ref = this.viewContainerRef.createComponent(cf);
    return ref.instance
  }
}
