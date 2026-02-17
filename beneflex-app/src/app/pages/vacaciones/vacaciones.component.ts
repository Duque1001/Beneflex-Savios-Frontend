import { Component, OnInit } from '@angular/core';

// Servicio que consulta beneficios y crea solicitudes (llama backend)
import { BeneficiosService } from '../../core/beneficios.service';

// Modelo UI para pintar tarjetas de beneficios
import { BeneficioCard } from '../../core/models/beneficio-card.model';

// Servicio para mostrar toasts/mensajes
import { NotificationService } from '../../shared/services/notification.service';

// Servicio que guarda el usuario actual
import { UserService } from '../../core/services/user.service';

// Utilidad: nombre del beneficio/ícono
import { benefitIconSrc } from '../../shared/utils/benefit-icon.util';
import { Router } from '@angular/router';

@Component({
  selector: 'app-vacaciones',
  standalone: false,
  templateUrl: './vacaciones.component.html',
  styleUrl: './vacaciones.component.css'
})
export class VacacionesComponent implements OnInit {

  // Lista de tarjetas de beneficios para mostrar
  beneficios: BeneficioCard[] = [];

  // Beneficio actualmente seleccionado
  beneficioSeleccionado: BeneficioCard | null = null;

  // Controla visibilidad del modal
  modalVisible = false;

  // Reintentos: evita loop infinito esperando que el usuario cargue
  private readonly MAX_RETRIES = 20;
  private retries = 0;

  constructor(
    private beneficiosService: BeneficiosService, // API beneficios/solicitudes
    private notify: NotificationService,          // mensajes UI
    private userService: UserService,             // usuario actual
    private router: Router
  ) {}

  // Al iniciar, carga beneficios
  ngOnInit(): void {
    this.cargarBeneficios();
  }

  /**
   * Carga beneficios del usuario:
   * - espera a que UserService tenga userId (get-me)
   * - llama API
   * - mapea respuesta a BeneficioCard (UI)
   */
  cargarBeneficios(): void {
    const userId = this.userService.getUser()?.id;

    // Si aún no hay usuario, reintenta cada 500ms hasta MAX_RETRIES
    if (!userId) {
      this.retries++;

      if (this.retries > this.MAX_RETRIES) {
        console.error('No se pudo cargar el usuario (get-me). Se superó el límite de reintentos.');
        this.notify.error('No se pudo cargar tu usuario. Recarga la página e intenta de nuevo.');
        return;
      }

      console.warn(`Usuario no cargado aún. Reintentando... (${this.retries}/${this.MAX_RETRIES})`);
      setTimeout(() => this.cargarBeneficios(), 500);
      return;
    }

    // Si ya hay usuario, resetea reintentos
    this.retries = 0;

    // Hack de compatibilidad: Si existe getBeneficiosPorUsuario() lo usa, si no, usa getBeneficios().
    const obs$ = (this.beneficiosService as any).getBeneficiosPorUsuario
      ? (this.beneficiosService as any).getBeneficiosPorUsuario(Number(userId))
      : this.beneficiosService.getBeneficios();

    obs$.subscribe({
      next: (data: any) => {
        console.log('Beneficios recibidos RAW:', data);

        // Normaliza respuesta: a veces viene como array, a veces dentro de data
        const arr = Array.isArray(data) ? data : (data?.data ?? []);

        // Mapea a formato UI
        this.beneficios = arr.map((x: any) => {
          const title = String(x.name ?? '');
          return {
            id: Number(x.id),
            title,

            // Para "Vacaciones" fuerza entero (por si backend envía decimales)
            days:
              title === 'Vacaciones'
                ? Math.floor(Number(x.available_days ?? 0))
                : Number(x.available_days ?? 0),

            usedDays: Number(x.used_days ?? 0),
            iconSrc: benefitIconSrc(title)
          } as BeneficioCard;
        });

        console.log('Beneficios mapeados UI:', this.beneficios);
      },
      error: (err: any) => {
        console.error('Error cargando beneficios', err);
        this.notify.error('No se pudieron cargar los beneficios');
      }
    });
  }

  // Abre modal con el beneficio seleccionado
  abrirModal(beneficio: BeneficioCard): void {
    this.beneficioSeleccionado = beneficio;
    this.modalVisible = true;
  }

  // Cierra modal y limpia selección
  cerrarModal(): void {
    this.modalVisible = false;
    this.beneficioSeleccionado = null;
  }

  // Envía una solicitud al backend: arma el request con userId + datos del modal y llama crearSolicitud().
  enviarSolicitud(payload: any): void {
    if (!this.beneficioSeleccionado) return;

    const userId = this.userService.getUser()?.id;
    if (!userId) {
      this.notify.error('No se ha cargado tu usuario. Vuelve a intentar.');
      return;
    }

    const request = {
      userId: Number(userId),
      benefitId: Number(this.beneficioSeleccionado.id),
      requestedDays: Number(payload.dias),
      startDate: payload.fecha,
      endDate: null,
      comment: payload.comentario
    };

    console.log('Request enviado:', request);

    this.beneficiosService.crearSolicitud(request).subscribe({
      next: () => {
        // Cierra modal, recarga beneficios y notifica éxito
        this.modalVisible = false;
        this.beneficioSeleccionado = null;
        this.cargarBeneficios();
        this.notify.success('Solicitud creada correctamente');
      },
      error: (err: any) => {
        console.error('Error creando solicitud', err);

        // status 0 suele ser red/CORS (request ni llega al backend)
        if (err?.status === 0) {
          this.notify.error('Bloqueado por CORS o red');
          return;
        }

        // Intenta extraer mensaje útil del backend (Azure Function)
        const backendMsg =
          err?.error?.message ||
          err?.error?.error?.message ||
          err?.error?.error ||
          err?.error ||
          null;

        const msg =
          (typeof backendMsg === 'string' && backendMsg.trim().length > 0)
            ? backendMsg
            : 'No se pudo crear la solicitud';

        this.notify.error(msg);

        this.cargarBeneficios();
      }
    });
  }
}
