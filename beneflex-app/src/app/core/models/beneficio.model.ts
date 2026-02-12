// Define la estructura de un beneficio como viene del backend.

export interface Beneficio {

  // Identificador único del beneficio
  id: number;

  // Nombre del beneficio
  name: string;

  // Máximo de días permitidos por año
  max_days_per_year: number;

  // Días actualmente disponibles para el usuario
  available_days: number;
}
