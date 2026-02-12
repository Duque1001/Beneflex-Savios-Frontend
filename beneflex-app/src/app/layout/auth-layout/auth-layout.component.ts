import { Component } from '@angular/core';

/**
 * Define el componente de layout autenticado.
 * Este componente envuelve las páginas protegidas
 * (header + sidebar + contenido dinámico).
 */
@Component({
  selector: 'app-auth-layout',                 // Nombre del selector HTML
  templateUrl: './auth-layout.component.html', // Archivo HTML asociado
  styleUrl: './auth-layout.component.css',     // Archivo CSS asociado
  standalone: false,                           // No es standalone (pertenece a un módulo)
})
export class AuthLayoutComponent {
  // ctúa como contenedor visual (layout).
}
