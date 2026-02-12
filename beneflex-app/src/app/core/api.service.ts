/**
 * Injectable permite que el servicio esté disponible
 * en toda la aplicación (inyección de dependencias).
 */
import { Injectable } from '@angular/core';

// HttpClient permite hacer llamadas HTTP al backend.
import { HttpClient } from '@angular/common/http';

// Observable maneja respuestas asincrónicas.
import { Observable } from 'rxjs';

// environment contiene la URL base de la API según entorno.
import { environment } from '../../environments/environment';

// Modelo tipado del beneficio.
import { Beneficio } from './models/beneficio.model';

// Servicio encargado de comunicarse con la API para operaciones relacionadas con beneficios.
@Injectable({
  providedIn: 'root'
})
export class ApiService {

  // URL base de la API
  private baseUrl = environment.benefitsApiUrl;

  // Inyección de HttpClient
  constructor(private http: HttpClient) { }

  // Obtiene la lista de beneficios. Llama al endpoint GET /benefits
  getBeneficios(): Observable<Beneficio[]> {
    return this.http.get<Beneficio[]>(
      `${this.baseUrl}/benefits`
    );
  }

  /**
   * Crea una nueva solicitud de beneficio.
   * Llama al endpoint POST /benefit-requests
   * Envia los datos necesarios en el body.
   */
  crearSolicitud(payload: {
    benefitId: number;  // ID del beneficio
    startDate: string;  // Fecha de inicio
    days: number;       // Días solicitados
    comment?: string;   // Comentario opcional
  }): Observable<any> {

    return this.http.post(
      `${this.baseUrl}/benefit-requests`,
      payload
    );
  }
}
