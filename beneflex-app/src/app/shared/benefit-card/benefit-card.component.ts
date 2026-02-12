/**
 * Importa decoradores necesarios:
 * - Input recibe datos del componente padre
 * - Output emite eventos al componente padre
 * - EventEmitter dispara eventos personalizados
 */
import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-benefit-card',                  // Etiqueta HTML del componente
  standalone: false,
  templateUrl: './benefit-card.component.html',  // Vista asociada
  styleUrl: './benefit-card.component.css'       // Estilos
})
export class BenefitCardComponent {

  // Ruta del ícono
  @Input() iconSrc: string | null = null;

  // Título del beneficio
  @Input() title!: string;

  // Días disponibles
  @Input() days!: number;

  // Evento que el componente padre puede escuchar, se dispara cuando el usuario hace clic en "Solicitar".
  @Output() solicitar = new EventEmitter<void>();

  // Método que emite el evento al padre
  onSolicitar() {
    this.solicitar.emit();
  }
}
