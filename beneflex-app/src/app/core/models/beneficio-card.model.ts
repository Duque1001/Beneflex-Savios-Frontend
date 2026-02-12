// Define la estructura de una tarjeta de beneficio en el frontend.

export interface BeneficioCard {

  // Identificador único del beneficio
  id: number;

  // Nombre que se muestra en la tarjeta
  title: string;

  // Días disponibles del beneficio
  days: number;

  // Días ya usados (opcional)
  usedDays?: number;

  // Ruta o URL del ícono
  iconSrc: string | null;
}
