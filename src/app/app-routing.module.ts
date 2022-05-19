import {NgModule} from "@angular/core";
import {RouterModule, Routes} from "@angular/router";
import {LoginPageComponent} from "./login-page/login-page.component";
import {MainLayoutComponent} from "./shared/layout/main-layout/main-layout.component";
import {MainPageComponent} from "./main-page/main-page.component";
import {EditComponent} from "./main-page/edit/edit.component";
import {WordsComponent} from "./main-page/edit/words/words.component";
import {GrammarComponent} from "./main-page/edit/grammar/grammar.component";
import {ChangesPageComponent} from "./changes-page/changes-page.component";
import {StatisticsPageComponent} from "./main-page/statistics-page/statistics-page.component";
import {AddEditorPageComponent} from "./main-page/add-editor-page/add-editor-page.component";

const routes: Routes = [
  {path: '', component: MainLayoutComponent, children: [
      {path: '', redirectTo: '/login', pathMatch: 'full'},
      {path: 'login', component: LoginPageComponent},
      {path: 'main', component: MainPageComponent, children: [
          {path: 'edit', component: EditComponent},
          {path: 'edit/words', component: WordsComponent},
          {path: 'edit/grammar', component: GrammarComponent},
          {path: 'history', component: ChangesPageComponent},
          {path: 'stat', component: StatisticsPageComponent},
          {path: 'add-editor', component: AddEditorPageComponent}
        ]},
    ]
  },
]

@NgModule({
  imports: [
    RouterModule.forRoot(routes)
  ],
  exports: [
    RouterModule
  ]
})
export class AppRoutingModule {

}
