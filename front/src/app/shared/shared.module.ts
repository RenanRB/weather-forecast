import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatIconModule } from '@angular/material/icon';
import { MatGridListModule } from '@angular/material/grid-list';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatInputModule } from '@angular/material/input';
import { MatSnackBarModule } from '@angular/material/snack-bar';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ],
  exports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatSlideToggleModule,
    MatIconModule,
    MatGridListModule,
    MatAutocompleteModule,
    MatInputModule,
    ReactiveFormsModule,
    MatSnackBarModule,
  ]
})
export class SharedModule { }
