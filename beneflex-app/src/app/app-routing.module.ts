import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

// Componentes de páginas
import { LandingComponent } from './pages/landing/landing.component';
import { VacacionesComponent } from './pages/vacaciones/vacaciones.component';
import { MisSolicitudesComponent } from './pages/mis-solicitudes/mis-solicitudes.component';

// Layout que envuelve las rutas protegidas
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

// Guard que protege rutas usando autenticación MSAL (Microsoft Entra ID)
import { MsalGuard } from '@azure/msal-angular';

// Definición de rutas principales de la aplicación.
const routes: Routes = [

  // Ruta raíz Landing (pantalla inicial, sin layout)
  { path: '', component: LandingComponent },

  // Ruta protegida usa layout con header + sidebar
  {
    path: 'app',
    component: AuthLayoutComponent,
    canActivate: [MsalGuard], // Solo usuarios autenticados pueden entrar
    children: [

      // /app muestra beneficios
      { path: '', component: VacacionesComponent },

      // /app/mis-solicitudes
      { path: 'mis-solicitudes', component: MisSolicitudesComponent },

      // /app/aprobaciones.
      {
        path: 'aprobaciones',
        loadComponent: () =>
          import('./pages/aprobar-solicitudes/aprobar-solicitudes.component')
            .then(m => m.AprobarSolicitudesComponent),
      },
    ],
  },

  // Ruta comodín: si no existe, redirige al inicio
  { path: '**', redirectTo: '' },
];

// Módulo de enrutamiento de la aplicación.
@NgModule({
  imports: [RouterModule.forRoot(routes)], // Registra rutas
  exports: [RouterModule],                 // Las expone al AppModule
})
export class AppRoutingModule {}
