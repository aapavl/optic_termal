import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainComponent } from './views/main/main.component'
import { HttpClientModule } from '@angular/common/http';
import { SharedModule } from './shared/shared.module';
import { LayoutComponent } from './shared/layout/layout.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import {MAT_SNACK_BAR_DEFAULT_OPTIONS, MatSnackBarModule} from "@angular/material/snack-bar";
import { FilesComponent } from './views/files/files.component';


@NgModule({
  declarations: [
    AppComponent,
    LayoutComponent,
    MainComponent,
    FilesComponent,
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    SharedModule,
    MatSnackBarModule,
    AppRoutingModule,
    BrowserAnimationsModule
  ],
  providers: [
    { provide: MAT_SNACK_BAR_DEFAULT_OPTIONS, useValue: {duration: 2500}}
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
