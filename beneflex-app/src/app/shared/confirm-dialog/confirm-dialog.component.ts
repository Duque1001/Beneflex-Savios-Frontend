/**
 * Importa decoradores:
 * - Input recibe datos del componente padre
 * - Output emite eventos al padre
 * - EventEmitter dispara eventos personalizados
 */
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-confirm-dialog',                 // Etiqueta HTML del componente
  standalone: false,
  templateUrl: './confirm-dialog.component.html', // Vista asociada
  styleUrl: './confirm-dialog.component.css',
})
export class ConfirmDialogComponent {

  // Controla si el modal se muestra o no
  @Input() visible = false;

  // Título del diálogo
  @Input() title = 'Confirmación';

  // Mensaje principal
  @Input() message = '¿Estás seguro?';

  // Texto del botón confirmar
  @Input() confirmText = 'Sí';

  // Texto del botón cancelar
  @Input() cancelText = 'No';

  // Evento que el componente padre escucha cuando el usuario cancela.
  @Output() cancel = new EventEmitter<void>();

  // Evento que el componente padre escucha cuando el usuario confirma.
  @Output() confirm = new EventEmitter<void>();

  // Emite evento de cancelación
  onCancel() {
    this.cancel.emit();
  }

  // Emite evento de confirmación
  onConfirm() {
    this.confirm.emit();
  }
}
