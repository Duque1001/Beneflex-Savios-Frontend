import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

// Forms: template-driven (ngModel) y reactive forms (FormGroup)
import { ReactiveFormsModule, FormsModule } from '@angular/forms';

// HTTP interceptores MSAL agrega token automáticamente
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

// Angular Material snackbar
import { MatSnackBarModule } from '@angular/material/snack-bar';

import { CommonModule } from '@angular/common';

import { AppRoutingModule } from './app-routing.module';

import { AppComponent } from './app.component';

// Componentes de layout
import { HeaderComponent } from './layout/header/header.component';
import { SidebarComponent } from './layout/sidebar/sidebar.component';
import { AuthLayoutComponent } from './layout/auth-layout/auth-layout.component';

// Páginas
import { VacacionesComponent } from './pages/vacaciones/vacaciones.component';
import { MisSolicitudesComponent } from './pages/mis-solicitudes/mis-solicitudes.component';
import { AprobarSolicitudesComponent } from './pages/aprobar-solicitudes/aprobar-solicitudes.component';

// Componentes compartidos
import { BenefitCardComponent } from './shared/benefit-card/benefit-card.component';
import { SolicitudModalComponent } from './shared/solicitud-modal/solicitud-modal.component';
import { ConfirmDialogComponent } from './shared/confirm-dialog/confirm-dialog.component';

// MSAL: autenticación y protección de rutas + interceptor de tokens
import {
  MsalModule,
  MsalService,
  MsalGuard,
  MsalBroadcastService,
  MSAL_INSTANCE,
  MSAL_GUARD_CONFIG,
  MsalGuardConfiguration,
  MsalInterceptor,
  MSAL_INTERCEPTOR_CONFIG,
  MsalInterceptorConfiguration
} from '@azure/msal-angular';

import {
  PublicClientApplication,
  InteractionType,
  BrowserCacheLocation
} from '@azure/msal-browser';

import { environment } from '../environments/environment';

// Crea instancia MSAL (cliente de Entra ID)
export function msalInstanceFactory() {
  return new PublicClientApplication({
    auth: {
      clientId: environment.msal.clientId,
      authority: `https://login.microsoftonline.com/${environment.msal.tenantId}`,
      redirectUri: window.location.origin
    },
    cache: {
      cacheLocation: BrowserCacheLocation.LocalStorage // guarda sesión en localStorage
    }
  });
}

// Config del guard: cómo autentica cuando entras a rutas protegidas
export function msalGuardConfigFactory(): MsalGuardConfiguration {
  return {
    interactionType: InteractionType.Redirect, // login por redirect
    authRequest: {
      scopes: ['openid', 'profile', 'email'] // scopes básicos de identidad
    }
  };
}

// Config del interceptor: protectedResourceMap: URLs a las que se les agrega token automáticamente.
export function msalInterceptorConfigFactory(): MsalInterceptorConfiguration {
  const protectedResourceMap = new Map<string, Array<string>>();

  // Cuando la app llame a esta base URL, MSAL adjunta token
  protectedResourceMap.set(environment.functionsApiBaseUrl, ['openid', 'profile', 'email']);

  return {
    interactionType: InteractionType.Redirect,
    protectedResourceMap
  };
}

@NgModule({
  // Componentes NO-standalone que pertenecen a este módulo
  declarations: [
    HeaderComponent,
    SidebarComponent,
    AuthLayoutComponent,
    VacacionesComponent,
    BenefitCardComponent,
    SolicitudModalComponent,
    MisSolicitudesComponent,
    ConfirmDialogComponent,
    AprobarSolicitudesComponent
  ],

  // Módulos y componentes standalone que se importan
  imports: [
    BrowserModule,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
    MatSnackBarModule,
    MsalModule,

    AppComponent,
  ],

  // Proveedores globales (MSAL + interceptor HTTP)
  providers: [
    { provide: MSAL_INSTANCE, useFactory: msalInstanceFactory },
    { provide: MSAL_GUARD_CONFIG, useFactory: msalGuardConfigFactory },
    { provide: MSAL_INTERCEPTOR_CONFIG, useFactory: msalInterceptorConfigFactory },

    MsalService,
    MsalGuard,
    MsalBroadcastService,

    // Interceptor: adjunta token a requests protegidos
    { provide: HTTP_INTERCEPTORS, useClass: MsalInterceptor, multi: true }
  ],

  // Componente raíz que se arranca
  bootstrap: [AppComponent]
})
export class AppModule {}