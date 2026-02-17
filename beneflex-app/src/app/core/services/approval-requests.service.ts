/**
 * Importaciones necesarias:
 * - Injectable → permite que el servicio pueda inyectarse en otros componentes.
 * - HttpClient → para hacer llamadas HTTP al backend.
 * - Observable → tipo que representa respuestas asincrónicas.
 * - environment → contiene las URLs de las APIs según entorno (dev/prod).
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Tipo que define cómo viene una solicitud pendiente desde la API.
export type PendingRequestApi = {
  id: number;                // ID de la solicitud
  employee_name?: string;    // Nombre del empleado
  benefit_name?: string;     // Nombre del beneficio
  requested_days?: number;   // Días solicitados
  start_date?: string;       // Fecha de inicio
  status?: string;           // Estado actual
};

// Tipo que define el cuerpo (payload) que se envía cuando se aprueba o rechaza una solicitud.
export type UpdateRequestStatusPayload = {
  requestId: number;                     // ID de la solicitud a actualizar
  status: 'APROBADO' | 'RECHAZADO';      // Nuevo estado permitido
  comment: string;                       // Comentario del aprobador
};

/**
 * Servicio encargado de:
 * - Consultar solicitudes pendientes
 * - Aprobar o rechazar solicitudes
 */
@Injectable({
  providedIn: 'root' // Disponible globalmente en toda la app
})
export class ApprovalRequestsService {

  // Inyección de HttpClient para consumir APIs
  constructor(private http: HttpClient) {}

  // Obtiene todas las solicitudes pendientes desde la API.
  getPendientes(): Observable<PendingRequestApi[]> {
    return this.http.get<PendingRequestApi[]>(
      environment.pendingRequestsApiUrl
    );
  }

  // Envía al backend la aprobación o rechazo de una solicitud, usa método POST para actualizar estado.
  updateRequestStatus(
    payload: UpdateRequestStatusPayload
  ): Observable<any> {

    return this.http.post(
      environment.updateRequestStatusApiUrl,
      payload
    );
  }
}



