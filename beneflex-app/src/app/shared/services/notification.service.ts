import { Injectable } from '@angular/core';

// MatSnackBar: Componente de Angular Material para mostrar notificaciones tipo "toast" en pantalla.
import { MatSnackBar } from '@angular/material/snack-bar';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  // Inyección del servicio de notificaciones
  constructor(private snack: MatSnackBar) { }

  // Muestra mensaje de éxito, dura 3 segundos.
  success(message: string) {
    this.snack.open(message, 'OK', {
      duration: 3000,
      panelClass: ['snackbar-success']
    });
  }

  // Muestra mensaje de error, dura 4 segundos.
  error(message: string) {
    this.snack.open(message, 'Cerrar', {
      duration: 4000,
      panelClass: ['snackbar-error']
    });
  }
}
