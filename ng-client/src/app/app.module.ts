import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import { MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdListModule } from '@angular/material';

import { AppComponent } from './app.component';
import { ProductsList } from './product-list.component'


@NgModule({
  declarations: [
    AppComponent,
    ProductsList
  ],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MdButtonModule, MdCardModule, MdMenuModule, MdToolbarModule, MdIconModule, MdListModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
