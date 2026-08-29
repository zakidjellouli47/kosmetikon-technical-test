import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { RouterModule, Routes } from '@angular/router';

import { AppComponent } from './app.component';
import { RawMaterialListComponent } from './components/raw-material-list/raw-material-list.component';
import { RawMaterialFormComponent } from './components/raw-material-form/raw-material-form.component';
import { ConfirmModalComponent } from './components/confirm-modal/confirm-modal.component';

const routes: Routes = [
  { path: '', redirectTo: '/materials', pathMatch: 'full' },
  { path: 'materials', component: RawMaterialListComponent },
  { path: 'materials/new', component: RawMaterialFormComponent },
  { path: 'materials/edit/:id', component: RawMaterialFormComponent }
];

@NgModule({
  declarations: [
    AppComponent,
    RawMaterialListComponent,
    RawMaterialFormComponent,
    ConfirmModalComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    HttpClientModule,
    RouterModule.forRoot(routes)
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }