import {NgModule} from '@angular/core';
import {BrowserModule} from '@angular/platform-browser';

import {AppComponent} from './app.component';
import {MainLayoutComponent} from './shared/layout/main-layout/main-layout.component';
import {AppRoutingModule} from "./app-routing.module";
import {LoginPageComponent} from './login-page/login-page.component';
import {FormsModule, ReactiveFormsModule} from "@angular/forms";
import { MainPageComponent } from './main-page/main-page.component';
import { EditComponent } from './main-page/edit/edit.component';
import { WordsComponent } from './main-page/edit/words/words.component';
import { GrammarComponent } from './main-page/edit/grammar/grammar.component';
import { ChangesPageComponent } from './changes-page/changes-page.component';
import { StatisticsPageComponent } from './main-page/statistics-page/statistics-page.component';
import { AddEditorPageComponent } from './main-page/add-editor-page/add-editor-page.component';

@NgModule({
  declarations: [
    AppComponent,
    MainLayoutComponent,
    LoginPageComponent,
    MainPageComponent,
    EditComponent,
    WordsComponent,
    GrammarComponent,
    ChangesPageComponent,
    StatisticsPageComponent,
    AddEditorPageComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    ReactiveFormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {
}
