import { Component, OnInit } from '@angular/core';

/**
 * Servicio que llama al backend:
 * - getPendientes(): trae solicitudes pendientes
 * - updateRequestStatus(): aprueba/rechaza
 * - Tipos de respuesta/payload.
 */
import {
  ApprovalRequestsService,
  PendingRequestApi,
  UpdateRequestStatusPayload
} from '../../core/services/approval-requests.service';

// Servicio para mostrar mensajes al usuario (toast/alertas).
import { NotificationService } from '../../shared/services/notification.service';

// Utilidad que mapea nombre del beneficio ruta del ícono.
import { benefitIconSrc } from '../../shared/utils/benefit-icon.util';
import { Router } from '@angular/router';

// Modelo para la UI (formato limpio para mostrar en pantalla), convierte nombres, fechas, nulls, íconos, etc.
type PendingRequestUI = {
  id: number;
  employeeName: string;
  benefitName: string;
  iconSrc: string | null;
  requestedDays: number | null;
  startDateRaw: string | null;
  startDateUI: string; // dd-mm-aaaa
  status: string;
};

// Decisión permitida para aprobar/rechazar
type Decision = 'APROBADO' | 'RECHAZADO';

@Component({
  selector: 'app-aprobar-solicitudes',
  standalone: false,
  templateUrl: './aprobar-solicitudes.component.html',
  styleUrl: './aprobar-solicitudes.component.css'
})
export class AprobarSolicitudesComponent implements OnInit {

  // Control de loading y data
  cargando = false;
  solicitudes: PendingRequestUI[] = [];

  // Navegación entre solicitudes
  currentIndex = 0;
  comentario = '';

  // Estado del modal de confirmación
  confirmVisible = false;
  pendingDecision: Decision | null = null;
  confirmText = '';

  constructor(
    private service: ApprovalRequestsService,   // API approvals
    private notify: NotificationService,        // mensajes UI
    private router: Router
  ) {}

  // Al iniciar el componente, carga pendientes
  ngOnInit(): void {
    this.cargarPendientes();
  }

  // Llama API, transforma respuesta a formato UI y reinicia estado
  cargarPendientes(): void {
    this.cargando = true;

    this.service.getPendientes().subscribe({
      next: (data: PendingRequestApi[]) => {
        const arr = Array.isArray(data) ? data : [];

        // Mapea del formato API (snake_case) a formato UI (camelCase)
        this.solicitudes = arr.map((x) => {
          const benefitName = x.benefit_name?.trim() || '—';

          return {
            id: Number(x.id),
            employeeName: x.employee_name?.trim() || '—',
            benefitName,
            iconSrc: benefitIconSrc(benefitName),     // calcula el ícono
            requestedDays: (x.requested_days ?? null),
            startDateRaw: x.start_date ?? null,
            startDateUI: this.toDDMMYYYY(x.start_date), // formatea fecha
            status: (x.status || 'PENDIENTE').toUpperCase(),
          };
        });

        // Reset de navegación y comentario
        this.currentIndex = 0;
        this.comentario = '';
        this.cargando = false;
      },
      error: (err: any) => {
        console.error('Error cargando pendientes', err);
        this.cargando = false;
        this.notify.error('No se pudieron cargar las aprobaciones pendientes');
      }
    });
  }

  // Devuelve el ícono asociado a un beneficio (por nombre)
  iconSrcFor(benefitName?: string | null): string | null {
    return benefitIconSrc((benefitName ?? '').trim());
  }

  // Convierte fecha ISO a dd-mm-aaaa
  private toDDMMYYYY(iso?: string | null): string {
    if (!iso) return '—';

    const m = /^(\d{4})-(\d{2})-(\d{2})/.exec(iso);
    let d: Date;

    if (m) {
      d = new Date(Number(m[1]), Number(m[2]) - 1, Number(m[3]));
    } else {
      d = new Date(iso);
    }

    if (isNaN(d.getTime())) return '—';

    return `${String(d.getDate()).padStart(2, '0')}-${String(d.getMonth() + 1).padStart(2, '0')}-${d.getFullYear()}`;
  }

  // Total de pendientes
  get total(): number {
    return this.solicitudes.length;
  }

  // Solicitud actual según el índice.
  get current(): PendingRequestUI | null {
    if (!this.total) return null;
    if (this.currentIndex < 0) this.currentIndex = 0;
    if (this.currentIndex >= this.total) this.currentIndex = this.total - 1;
    return this.solicitudes[this.currentIndex];
  }

  // Flags para habilitar/deshabilitar navegación
  get isFirst(): boolean {
    return this.currentIndex <= 0;
  }
  get isLast(): boolean {
    return this.total ? this.currentIndex >= this.total - 1 : true;
  }

  // Navega a la anterior
  prev(): void {
    if (this.isFirst) return;
    this.currentIndex -= 1;
    this.comentario = '';
  }

  // Navega a la siguiente
  next(): void {
    if (this.isLast) return;
    this.currentIndex += 1;
    this.comentario = '';
  }

  // Abre modal confirmando la decisión
  openConfirm(decision: Decision): void {
    const req = this.current;
    if (!req) return;

    this.pendingDecision = decision;
    this.confirmText =
      decision === 'APROBADO'
        ? '¿Estás seguro de APROBAR esta solicitud?'
        : '¿Estás seguro de RECHAZAR esta solicitud?';

    this.confirmVisible = true;
  }

  // Cierra modal y limpia estado
  closeConfirm(): void {
    this.confirmVisible = false;
    this.pendingDecision = null;
    this.confirmText = '';
  }

  /**
   * Confirma la acción:
   * - arma payload
   * - llama API
   * - notifica
   * - elimina la solicitud de la lista y ajusta índice
   */
  confirmYes(): void {
    const req = this.current;
    const decision = this.pendingDecision;

    if (!req || !decision) {
      this.closeConfirm();
      return;
    }

    const payload: UpdateRequestStatusPayload = {
      requestId: req.id,
      status: decision,
      comment: (this.comentario || '').trim()
    };

    this.cargando = true;

    this.service.updateRequestStatus(payload).subscribe({
      next: () => {
        this.cargando = false;
        this.closeConfirm();

        this.notify.success(
          decision === 'APROBADO'
            ? `Solicitud #${req.id} aprobada`
            : `Solicitud #${req.id} rechazada`
        );

        // Quita la solicitud procesada
        this.solicitudes.splice(this.currentIndex, 1);

        // Ajusta el índice si quedaste al final
        if (this.currentIndex >= this.solicitudes.length) {
          this.currentIndex = Math.max(0, this.solicitudes.length - 1);
        }

        this.comentario = '';
      },
      /*error: (err: any) => {
        console.error('Error actualizando estado', err);
        this.cargando = false;
        this.closeConfirm();
        this.notify.error('No se pudo actualizar el estado de la solicitud');
      }*/
      error: (err: any) => {
        console.error('Error actualizando estado', err);

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
            : 'No se pudo actualizar el estado de la solicitud';

        this.notify.error(msg);

        this.cargarPendientes();
      }
    });
  }
}
