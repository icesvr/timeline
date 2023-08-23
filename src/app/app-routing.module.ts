import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {OlaTimeComponent} from './components/olaTime/time.component'
const routes: Routes = [];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
