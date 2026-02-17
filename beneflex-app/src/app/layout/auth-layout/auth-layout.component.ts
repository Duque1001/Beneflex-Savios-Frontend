/*import { Component } from '@angular/core';

@Component({
  selector: 'app-auth-layout',                 // Nombre del selector HTML
  templateUrl: './auth-layout.component.html', // Archivo HTML asociado
  styleUrl: './auth-layout.component.css',     // Archivo CSS asociado
  standalone: false,                           // No es standalone (pertenece a un módulo)
})
export class AuthLayoutComponent {
  // ctúa como contenedor visual (layout).
}*/

import { Component, HostListener, OnInit } from '@angular/core';

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
export class AuthLayoutComponent implements OnInit {

  //En desktop se mantiene abierto, en telefonos/tablet se maneja como drawer.
  sidebarOpen = true;

  ngOnInit(): void {
    this.syncSidebarWithViewport();
  }

  @HostListener('window:resize')
  onResize() {
    this.syncSidebarWithViewport();
  }

  toggleSidebar(): void {

    // En desktop no tiene sentido "cerrar"
    if (!this.isMobile()) {
      return;
    }
    this.sidebarOpen = !this.sidebarOpen;
  }

  closeSidebar(): void {
    if (this.isMobile()) {
      this.sidebarOpen = false;
    }
  }

  onSidebarLinkClicked(): void {

    // Al navegar en móvil, cerramos el menú para que el contenido se vea completo
    this.closeSidebar();
  }

  private syncSidebarWithViewport(): void {
    this.sidebarOpen = !this.isMobile();
  }

  private isMobile(): boolean {
    return window.innerWidth <= 768;
  }
}

