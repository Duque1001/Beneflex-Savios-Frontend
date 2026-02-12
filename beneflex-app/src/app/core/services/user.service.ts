// Injectable → permite que el servicio esté disponible en toda la app.
import { Injectable } from '@angular/core';

// BehaviorSubject: Permite almacenar un valor y notificar cambios automáticamente
import { BehaviorSubject } from 'rxjs';

// Interface que define la estructura del usuario en la app.
export interface AppUser {
  id: number;      // ID del usuario
  name: string;    // Nombre completo
  email: string;   // Correo
  role: string;    // Rol (ej: USER, LIDER, ADMIN)
}

/**
 * Servicio encargado de:
 * - Guardar el usuario actual en memoria
 * - Permitir que otros componentes lo escuchen
 */
@Injectable({ providedIn: 'root' })
export class UserService {

  /**
   * BehaviorSubject que almacena el usuario actual.
   * Inicia en null (nadie logueado).
   */
  private readonly userSubject = new BehaviorSubject<AppUser | null>(null);

  // Observable público para que otros componentes puedan suscribirse a cambios del usuario.
  readonly user$ = this.userSubject.asObservable();

  // Actualiza el usuario actual.
  setUser(user: AppUser | null) {
    this.userSubject.next(user);
  }

  // Devuelve el usuario actual (sin suscripción).
  getUser(): AppUser | null {
    return this.userSubject.value;
  }

  // Verifica si el usuario tiene rol "LIDER".
  isLeader(): boolean {
    const role = (this.userSubject.value?.role ?? '')
      .normalize('NFD')                 // separa letras y tildes
      .replace(/[\u0300-\u036f]/g, '')  // elimina tildes
      .toUpperCase();                   // convierte a mayúsculas

    return role === 'LIDER';
  }
}
