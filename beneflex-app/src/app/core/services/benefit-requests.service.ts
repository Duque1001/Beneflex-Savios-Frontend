/**
 * Importaciones necesarias:
 * - Injectable → permite que el servicio se pueda inyectar.
 * - HttpClient → para hacer peticiones HTTP.
 * - Observable → manejo de respuestas asincrónicas.
 * - environment → contiene la URL de la API según entorno.
 */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';

// Servicio encargado de consultar las solicitudes del usuario autenticado.
@Injectable({
  providedIn: 'root' // Disponible globalmente
})
export class BenefitRequestsService {

  // URL de la API que devuelve las solicitudes del usuario, viene desde environment para poder cambiar entre dev/prod.
  private myRequestsUrl = environment.myRequestsApiUrl;

  // Inyección de HttpClient
  constructor(private http: HttpClient) {}

  // Obtiene las solicitudes del usuario logueado, no recibe userId porque el backend lo extrae del token.
  getMyRequests(): Observable<any[]> {
    return this.http.get<any[]>(this.myRequestsUrl);
  }
}
