import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ComponentsModule } from './components/components.module';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    ComponentsModule,
    MatSlideToggleModule,
  ],
  exports: [
    ComponentsModule,
    MatSlideToggleModule
  ]
})
export class SharedModule { }
