/**
 * Importaciones necesarias:
 * - Injectable → permite inyectar el servicio en otros componentes.
 * - HttpClient → para hacer llamadas HTTP al backend.
 * - Observable → maneja respuestas asincrónicas.
 * - environment → contiene la URL base según entorno (dev/prod).
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Servicio encargado de consultar beneficios desde la API.
@Injectable({ providedIn: 'root' })
export class BenefitsService {

  // Construye la URL base del endpoint de beneficios.
  private apiUrl = `${environment.benefitsApiUrl}/benefits`;

  // Inyección de HttpClient
  constructor(private http: HttpClient) {}

  // Obtiene los beneficios de un usuario específico, envía el userId en la ruta.
  getByUser(userId: number): Observable<any[]> {
    return this.http.get<any[]>(
      `${this.apiUrl}/user/${userId}`
    );
  }
}
