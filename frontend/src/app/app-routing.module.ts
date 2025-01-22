import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {MainComponent} from "./views/main/main.component";
import { LayoutComponent } from './shared/layout/layout.component';
import { FilesComponent } from './views/files/files.component';

const routes: Routes = [
  // реализация ленивой загрузки модилей
  {
    path: '',
    component: LayoutComponent,
    children: [
      { path: '', redirectTo: 'stream', pathMatch: 'full' }, // Маршрут по умолчанию
      { path: 'stream', component: MainComponent },
      { path: 'files', component: FilesComponent },
      // { path: '', loadChildren: () => import('./views/settings/settings.module').then((m) => m.SettingsModule)},
      // { path: '', loadChildren: () => import('./views/tests/tests.module').then((m) => m.TestsModule)},
      // { path: '', loadChildren: () => import('./views/order/order.module').then((m) => m.OrderModule)},
      // { path: '', loadChildren: () => import('./views/personal/personal.module').then((m) => m.PersonalModule), canActivate: [AuthGuard]},
    ]
  }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
