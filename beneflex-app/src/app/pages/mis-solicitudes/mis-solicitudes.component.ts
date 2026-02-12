import { Component, OnInit } from '@angular/core';

// Servicio de notificaciones
import { NotificationService } from '../../shared/services/notification.service';

// Servicio donde está el usuario actual
import { UserService } from '../../core/services/user.service';

// Tipos y servicio para consultar/actualizar solicitudes
import { MyRequest, RequestsService, RequestStatus } from '../../core/services/requests.service';

// Utilidad: nombre del beneficio/ícono
import { benefitIconSrc } from '../../shared/utils/benefit-icon.util';

@Component({
  selector: 'app-mis-solicitudes',
  standalone: false,
  templateUrl: './mis-solicitudes.component.html',
  styleUrl: './mis-solicitudes.component.css'
})
export class MisSolicitudesComponent implements OnInit {

  // Estado de carga y lista de solicitudes
  cargando = false;
  solicitudes: MyRequest[] = [];

  // Estado y textos del popup de confirmación
  confirmVisible = false;
  confirmTitle = 'Confirmar cancelación';
  confirmMessage = '¿Estás seguro de que deseas cancelar esta solicitud?';

  // Guarda cuál solicitud se va a cancelar
  private requestToCancel: MyRequest | null = null;

  constructor(
    private requestsService: RequestsService, // API
    private userService: UserService,         // usuario actual
    private notify: NotificationService       // mensajes UI
  ) {}

  // Al iniciar, carga solicitudes
  ngOnInit(): void {
    this.cargar();
  }

  // Carga solicitudes del usuario y deja solo las PENDIENTES
  cargar(): void {
    const userId = this.userService.getUser()?.id;

    // Si no hay usuario aún, corta y muestra error
    if (!userId) {
      this.notify.error('Aún no se ha cargado tu usuario. Intenta nuevamente en unos segundos.');
      return;
    }

    this.cargando = true;

    this.requestsService.getMyRequests(Number(userId)).subscribe({
      next: (data: MyRequest[]) => {
        const all = Array.isArray(data) ? data : [];

        // Filtra solo pendientes
        this.solicitudes = all.filter(req => (req.status ?? 'PENDIENTE') === 'PENDIENTE');

        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error cargando mis solicitudes', err);
        this.cargando = false;
        this.notify.error('No se pudieron cargar tus solicitudes');
      }
    });
  }

  // Formatea fecha a "dd de mes de yyyy" en es-CO
  formatFechaLarga(dateStr?: string): string {
    if (!dateStr) return '—';
    const d = new Date(dateStr);
    if (isNaN(d.getTime())) return '—';

    return d.toLocaleDateString('es-CO', {
      day: '2-digit',
      month: 'long',
      year: 'numeric'
    });
  }

  // Devuelve el ícono según nombre del beneficio
  iconSrcFor(name?: string): string | null {
    return benefitIconSrc(name ?? '');
  }

  // Solo se puede cancelar si está PENDIENTE
  canCancel(req: MyRequest): boolean {
    return (req.status || 'PENDIENTE') === 'PENDIENTE';
  }

  // Abre popup y guarda la solicitud a cancelar
  onClickCancel(req: MyRequest): void {
    if (!this.canCancel(req)) return;

    this.requestToCancel = req;
    this.confirmVisible = true;
  }

  // Cierra popup sin hacer nada
  onCancelPopup(): void {
    this.confirmVisible = false;
    this.requestToCancel = null;
  }

  // Confirma cancelación: llama API y refresca lista
  onConfirmPopup(): void {
    if (!this.requestToCancel) return;

    const payload = {
      requestId: this.requestToCancel.id,
      status: 'CANCELADO' as RequestStatus,
      comment: ''
    };

    this.requestsService.updateRequestStatus(payload).subscribe({
      next: () => {
        this.notify.success('Solicitud cancelada correctamente');
        this.confirmVisible = false;
        this.requestToCancel = null;
        this.cargar(); // recarga pendientes
      },
      error: (err: any) => {
        console.error('Error cancelando solicitud', err);
        this.notify.error('No se pudo cancelar la solicitud');
        this.confirmVisible = false;
        this.requestToCancel = null;
      }
    });
  }
}
