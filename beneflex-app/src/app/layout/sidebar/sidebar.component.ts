/*import { Component } from '@angular/core';

// Servicio que contiene la información del usuario autenticado.
import { UserService } from '../../core/services/user.service';

// Define el componente Sidebar. Representa el menú lateral de la aplicación.

@Component({
  selector: 'app-sidebar',                 // Etiqueta HTML del componente
  standalone: false,                       // Pertenece a un módulo
  templateUrl: './sidebar.component.html', // Vista HTML
  styleUrls: ['./sidebar.component.css']   // Estilos
})
export class SidebarComponent {

  // Se inyecta el UserService como público para poder usarlo directamente en el HTML, mostrar opciones según el rol
  constructor(public userService: UserService) {}

}*/

import { Component, EventEmitter, Output } from '@angular/core';

// Servicio que contiene la información del usuario autenticado.
import { UserService } from '../../core/services/user.service';

// Define el componente Sidebar. Representa el menú lateral de la aplicación.
@Component({
  selector: 'app-sidebar',                 // Etiqueta HTML del componente
  standalone: false,                       // Pertenece a un módulo
  templateUrl: './sidebar.component.html', // Vista HTML
  styleUrls: ['./sidebar.component.css']   // Estilos
})
export class SidebarComponent {

  //Se emite cuando el usuario hace click en un item, util para cerrar el drawer en telefono.
  @Output() linkClicked = new EventEmitter<void>();

  // Se inyecta el UserService como público para poder usarlo directamente en el HTML, mostrar opciones según el rol
  constructor(public userService: UserService) {}
}

