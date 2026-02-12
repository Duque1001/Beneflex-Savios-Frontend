/**
 * Importaciones:
 * - Injectable → permite inyectar el servicio.
 * - HttpClient → para hacer llamadas HTTP.
 * - HttpParams → para enviar parámetros en la URL.
 * - Observable → manejo asincrónico de respuestas.
 * - environment → contiene URLs según entorno.
 */
import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Tipo que define los estados permitidos de una solicitud.
export type RequestStatus =
  | 'PENDIENTE'
  | 'APROBADO'
  | 'RECHAZADO'
  | 'CANCELADO';

// Interface que representa una solicitud del usuario, se usa para tipar la respuesta de la API.
export interface MyRequest {
  id: number;                 // ID de la solicitud
  benefit_name?: string;      // Nombre del beneficio
  requested_days?: number;    // Días solicitados
  status?: RequestStatus;     // Estado actual
  start_date?: string;        // Fecha de inicio
  created_at?: string;        // Fecha de creación
}

/**
 * Servicio encargado de:
 * - Consultar solicitudes del usuario
 * - Actualizar estado de una solicitud
 */
@Injectable({ providedIn: 'root' })
export class RequestsService {

  constructor(private http: HttpClient) {}

  // Obtiene las solicitudes del usuario, envía el userId como parámetro en la URL
  getMyRequests(userId: number): Observable<MyRequest[]> {
    const params = new HttpParams().set('userId', String(userId));

    return this.http.get<MyRequest[]>(
      environment.myRequestsApiUrl,
      { params }
    );
  }

  // Actualiza el estado de una solicitud (aprobar, rechazar, cancelar), se envía el payload por POST al backend.
  updateRequestStatus(
    payload: {
      requestId: number;
      status: RequestStatus;
      comment?: string;
    }
  ): Observable<any> {

    return this.http.post(
      environment.updateRequestStatusApiUrl,
      payload
    );
  }
}
