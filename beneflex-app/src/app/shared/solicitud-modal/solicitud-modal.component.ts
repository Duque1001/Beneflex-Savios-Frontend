import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

/**
 * Imports de Reactive Forms:
 * - FormBuilder: crea el FormGroup fácil
 * - Validators: validadores base (required, min)
 * - AbstractControl/ValidationErrors/ValidatorFn: para validadores personalizados
 */
import {
  FormBuilder,
  FormGroup,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn
} from '@angular/forms';

import { BeneficioCard } from '../../core/models/beneficio-card.model';

// Notificaciones para errores de validación
import { NotificationService } from '../../shared/services/notification.service';

@Component({
  selector: 'app-solicitud-modal',
  standalone: false,
  templateUrl: './solicitud-modal.component.html',
  styleUrls: ['./solicitud-modal.component.css']
})
export class SolicitudModalComponent implements OnInit {

  // Beneficio seleccionado para saber nombre/días disponibles
  @Input() beneficio!: BeneficioCard | null;

  // Controla si el modal se muestra
  @Input() visible = false;

  // Eventos al padre: cerrar modal y confirmar solicitud
  @Output() cerrar = new EventEmitter<void>();
  @Output() confirmar = new EventEmitter<any>();

  // Formulario reactivo
  form!: FormGroup;

  // Fecha mínima permitida en el input date (hoy)
  minDate = this.formatLocalDate(new Date());

  constructor(
    private fb: FormBuilder,          // construye el form
    private notify: NotificationService // muestra mensajes
  ) {}

  ngOnInit() {
    // Crea el formulario con validaciones
    this.form = this.fb.group({
      // fecha: obligatoria + no pasado + solo día hábil
      fecha: ['', [Validators.required, this.noPastDateValidator(), this.businessDayValidator()]],

      // dias: obligatorio + mínimo 0.5 (medio día)
      dias: [null, [Validators.required, Validators.min(0.5)]],

      // comentario: opcional
      comentario: ['']
    });

    /**
     * Si el usuario escoge sábado/domingo:
     * - limpia el campo
     * - marca touched para que se vea el error
     * - muestra notificación
     */
    this.form.get('fecha')?.valueChanges.subscribe((value) => {
      if (!value) return;

      const selected = this.parseLocalDate(value);
      if (!selected) return;

      const day = selected.getDay(); // 0=domingo, 6=sábado
      if (day === 0 || day === 6) {
        this.form.get('fecha')?.setValue('', { emitEvent: false });
        this.form.get('fecha')?.markAsTouched();
        this.form.get('fecha')?.updateValueAndValidity();

        this.notify.error('Debe seleccionar un día laboral hábil');
      }
    });
  }

  // Date 'YYYY-MM-DD' en hora local
  private formatLocalDate(d: Date): string {
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }

  // 'YYYY-MM-DD' Date local (00:00) para comparar sin problema de zona horaria
  private parseLocalDate(value: string): Date | null {
    const parts = value.split('-').map(Number);
    if (parts.length !== 3) return null;

    const [y, m, d] = parts;
    const date = new Date(y, m - 1, d);
    date.setHours(0, 0, 0, 0);

    return isNaN(date.getTime()) ? null : date;
  }

  // Validador: permite HOY y futuro; bloquea fechas anteriores
  private noPastDateValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const selected = this.parseLocalDate(value);
      if (!selected) return null;

      const today = new Date();
      today.setHours(0, 0, 0, 0);

      return selected < today ? { pastDate: true } : null;
    };
  }

  // Validador: bloquea sábado/domingo
  private businessDayValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;
      if (!value) return null;

      const selected = this.parseLocalDate(value);
      if (!selected) return null;

      const day = selected.getDay();
      return (day === 0 || day === 6) ? { notBusinessDay: true } : null;
    };
  }

  // Máximo de días que tiene el beneficio
  get maxDias(): number {
    return this.beneficio?.days ?? 0;
  }

  /**
   * Genera opciones del select según días disponibles:
   * - agrega 0.5 si hay medio día
   * - agrega 1..N según días completos
   */
  get diasDisponibles(): number[] {
    if (!this.beneficio || this.beneficio.days <= 0) return [];

    const dias: number[] = [];
    const total = this.beneficio.days;

    if (total % 1 !== 0) dias.push(0.5);

    for (let i = 1; i <= Math.floor(total); i++) {
      dias.push(i);
    }

    return dias;
  }

  // Cierra modal: resetea form y emite cerrar
  onCerrar() {
    this.form.reset();
    this.cerrar.emit();
  }

  /**
   * Confirma:
   * - marca todo touched para mostrar errores
   * - valida y muestra mensaje específico
   * - emite datos al padre si es válido
   */
  onConfirmar() {
    this.form.markAllAsTouched();
    this.form.updateValueAndValidity();

    if (this.form.invalid) {
      if (this.form.get('fecha')?.errors?.['pastDate']) {
        this.notify.error('No se puede elegir fechas pasadas');
      } else if (this.form.get('fecha')?.errors?.['notBusinessDay']) {
        this.notify.error('Debe seleccionar un día laboral hábil');
      } else {
        this.notify.error('Debes completar toda la información obligatoria para confirmar la solicitud');
      }
      return;
    }

    // Envía los valores del form al componente padre
    this.confirmar.emit({
      ...this.form.value,
      beneficio: this.beneficio,
    });

    // Limpia y cierra modal
    this.form.reset();
    this.cerrar.emit();
  }
}
