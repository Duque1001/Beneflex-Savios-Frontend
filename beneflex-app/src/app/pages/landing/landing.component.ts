import { Component } from '@angular/core';

//* MsalService: Servicio de Microsoft Authentication Library (MSAL) para autenticación con Microsoft Entra ID (Azure AD).
import { MsalService } from '@azure/msal-angular';

// Router: Permite navegar entre rutas.
import { Router } from '@angular/router';

// Componente Landing (pantalla inicial).
@Component({
  selector: 'app-landing',                   // Selector HTML
  templateUrl: './landing.component.html',   // Vista HTML
  styleUrl: './landing.component.css',       // Estilos
  standalone: false,
})
export class LandingComponent {

  constructor(
    private msal: MsalService,  // Servicio de autenticación
    private router: Router      // Router
  ) {}

  // Redirige al usuario a Microsoft Entra ID para autenticarse.
  ingresar() {

    this.msal.loginRedirect({
      scopes: ['openid', 'profile', 'email'], // Permisos básicos de identidad
      redirectStartPage: window.location.origin + '/app',
      // Después del login, redirige a /app
    });
  }
}
