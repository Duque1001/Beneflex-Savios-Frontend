import { Component, OnDestroy, OnInit, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClient } from '@angular/common/http';

/**
 * RxJS:
 * - Subject: señal para cortar suscripciones en ngOnDestroy
 * - filter: filtra eventos
 * - takeUntil: cancela la suscripción cuando destroy$ emite
 */
import { Subject, filter, takeUntil } from 'rxjs';

// Estado de interacción MSAL (login/redirect en progreso o no)
import { InteractionStatus } from '@azure/msal-browser';

// Servicios MSAL para autenticación y broadcast de eventos
import { MsalBroadcastService, MsalService } from '@azure/msal-angular';

import { environment } from '../environments/environment';

// UserService: guarda el usuario app (get-me) en memoria
import { UserService } from './core/services/user.service';
import { AppUser } from './core/services/user.service';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet], // permite usar <router-outlet> en el template
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  private msal = inject(MsalService);
  private msalBroadcast = inject(MsalBroadcastService);
  private http = inject(HttpClient);
  private userService = inject(UserService);

  // Señal para cancelar observables al destruir el componente
  private readonly destroy$ = new Subject<void>();

  // Evita llamar get-me más de una vez por sesión
  private loadedMe = false;

  // Inicializa MSAL, procesa el redirect del login, selecciona cuenta activa, y luego carga el usuario desde /me cuando no haya interacción en progreso.
  async ngOnInit() {
    // Inicializa MSAL (necesario antes de usar login/redirect)
    await this.msal.instance.initialize();

    // Procesa el resultado del loginRedirect
    const result = await this.msal.instance.handleRedirectPromise();

    // Si el redirect trajo una cuenta, la deja activa
    if (result?.account) {
      this.msal.instance.setActiveAccount(result.account);
    } else {
      // Si no, intenta usar la primera cuenta en caché
      const accounts = this.msal.instance.getAllAccounts();
      if (accounts.length) this.msal.instance.setActiveAccount(accounts[0]);
    }

    // Escucha cuando MSAL termina cualquier interacción. Ahí sí es seguro llamar /me porque ya hay cuenta/token listo.
    this.msalBroadcast.inProgress$
      .pipe(
        filter((status) => status === InteractionStatus.None),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        const account = this.msal.instance.getActiveAccount();

        // Solo carga /me si hay cuenta y aún no se ha cargado
        if (account && !this.loadedMe) {
          this.loadedMe = true;
          this.loadMe();
        }
      });
  }

  // Llama al endpoint /me (o get-me) para traer el usuario de la app, luego lo guarda en UserService para usar id/rol en toda la app.
  private loadMe() {
    this.http.get<AppUser>(environment.meApiUrl).subscribe({
      next: (user) => {
        this.userService.setUser(user);
        console.log('Usuario cargado:', user); // solo debug
      },
      error: (err) => {
        console.error('Error cargando usuario (get-me):', err);
        // Permite reintentar si falla
        this.loadedMe = false;
      }
    });
  }

  // Limpia suscripción para evitar memory leaks
  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
