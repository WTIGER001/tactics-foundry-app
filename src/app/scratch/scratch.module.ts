import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TestBindingComponent } from './components/test-binding/test-binding.component';
import { TestBindingContainerComponent } from './components/test-binding-container/test-binding-container.component';
import { TestBindingParentComponent } from './components/test-binding-parent/test-binding-parent.component';
import { TestBindingChildComponent } from './components/test-binding-child/test-binding-child.component';



@NgModule({
  declarations: [TestBindingComponent, TestBindingContainerComponent, TestBindingParentComponent, TestBindingChildComponent],
  imports: [
    CommonModule
  ]
})
export class ScratchModule { }
