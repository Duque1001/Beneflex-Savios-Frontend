/*import { Component } from '@angular/core';

// Representa el encabezado superior de la aplicación.
@Component({
  selector: 'app-header',                // Etiqueta HTML para usar el componente
  standalone: false,                     // Pertenece a un módulo (no es standalone)
  templateUrl: './header.component.html', // Vista HTML asociada
  styleUrl: './header.component.css'     // Estilos del componente
})
export class HeaderComponent {
  // renderiza la estructura visual definida en su HTML.
}*/

import { Component, EventEmitter, Output } from '@angular/core';

// Representa el encabezado superior de la aplicación.
@Component({
  selector: 'app-header',                // Etiqueta HTML para usar el componente
  standalone: false,                     // Pertenece a un módulo (no es standalone)
  templateUrl: './header.component.html', // Vista HTML asociada
  styleUrl: './header.component.css'     // Estilos del componente
})
export class HeaderComponent {

  //Evento para abrir/cerrar el sidebar
  @Output() menuToggle = new EventEmitter<void>();
}
