import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { DomoticaComponent } from './pages/domotica/domotica.component';
import { FabricacionComponent } from './pages/fabricacion/fabricacion.component';
import { MantenimientoComponent } from './pages/mantenimiento/mantenimiento.component';
import { RepotenciacionComponent } from './pages/repotenciacion/repotenciacion.component';
import { AdminComponent } from './pages/admin/admin.component';
import { DisenoInventorComponent } from './pages/diseno-inventor/diseno-inventor.component';

export const routes: Routes = [
  { path: '', redirectTo: 'home', pathMatch: 'full' },
  { path: 'home', component: HomeComponent },
  { path: 'catalogo', component: CatalogoComponent },
  { path: 'domotica', component: DomoticaComponent },
  { path: 'fabricacion', component: FabricacionComponent },
  { path: 'repotenciacion', component: RepotenciacionComponent },
  { path: 'mantenimiento', component: MantenimientoComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'diseno-inventor', component: DisenoInventorComponent },
  { path: '**', redirectTo: 'home' }
];
