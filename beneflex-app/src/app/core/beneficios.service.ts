// Injectable permite que el servicio esté disponible en toda la aplicación.
import { Injectable } from '@angular/core';

// HttpClient para hacer llamadas HTTP.
import { HttpClient } from '@angular/common/http';

// Observable y throwError → manejo de respuestas asincrónicas y control de errores.
import { Observable, throwError } from 'rxjs';

import { environment } from '../../environments/environment';
import { UserService } from './services/user.service';

/**
 * Servicio encargado de:
 * - Obtener beneficios del usuario autenticado
 * - Crear solicitudes de beneficio
 */
@Injectable({
  providedIn: 'root'
})
export class BeneficiosService {

  constructor(
    private http: HttpClient,
    private userService: UserService // Permite obtener el usuario actual
  ) {}

  // Obtiene los beneficios del usuario autenticado, envía el userId como parámetro en la URL.
  getBeneficios(): Observable<any> {

    // Obtiene el ID del usuario desde el UserService
    const userId = this.userService.getUser()?.id;

    // Si el usuario aún no está cargado, lanza error
    if (!userId) {
      return throwError(() => new Error('Usuario no cargado aún'));
    }

    // Construye la URL con query param
    const url = `${environment.benefitsApiUrl}?userId=${userId}`;

    return this.http.get(url);
  }

  // Crea una nueva solicitud de beneficio, envía userId + datos del formulario al backend.
  crearSolicitud(data: any): Observable<any> {

    const userId = this.userService.getUser()?.id;

    if (!userId) {
      return throwError(() => new Error('Usuario no cargado aún'));
    }

    return this.http.post(
      environment.createBenefitApiUrl,
      {
        userId,
        ...data // spread operator: agrega el resto de campos
      }
    );
  }
}
