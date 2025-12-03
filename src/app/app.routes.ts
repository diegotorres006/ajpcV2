import { Routes } from '@angular/router';
import { HomeComponent } from './pages/home/home.component';
import { AcercadeComponent } from './pages/acercade/acercade.component';
import { ContactoComponent } from './pages/contacto/contacto.component';
import { ProductosComponent } from './pages/productos/productos.component';
import { MantenimientoComponent } from './pages/mantenimiento/mantenimiento.component';
import { CatalogoComponent } from './pages/catalogo/catalogo.component';
import { MantenimientolistComponent } from './pages/Mantenimientolist/mantenimientolist.component';
import { RepotenciacionComponent } from './pages/Repotenciacionlist/repotenciacion.component';
import { FabricacionComponent } from './pages/fabricacionlist/fabricacion.component';
import { DomoticaComponent } from './pages/domotica/domotica.component';


export const routes: Routes = [
    {
      path: '',
      component: HomeComponent,
    },



    {
      path: 'home',
      component: HomeComponent,
    },

    {
      path: 'acerca',
      component: AcercadeComponent,
    },

    {
      path: 'productos',
      component: ProductosComponent,
    },

    {
      path: 'mantenimientolist',
      component: MantenimientolistComponent,
    },

    {
      path: 'catalogo',
      component: CatalogoComponent,
    },

    {
     path: 'contacto',
      component: ContactoComponent,
  },
    {
      path: 'repotenciacionlist',
      component: RepotenciacionComponent,
    },
    {
      path: 'fabricacionlist',
      component: FabricacionComponent,
    },
    {
      path: 'mantenimiento',
      component: MantenimientoComponent,
    },

     {
      path: 'mantenimiento',
      component: MantenimientoComponent,
    },
    {
      path: 'domotica',
      component: DomoticaComponent,
    },

  ];
