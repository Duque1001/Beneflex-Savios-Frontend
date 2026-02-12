/**
 * Normaliza un texto para facilitar comparaciones:
 * - Convierte a minúsculas
 * - Quita tildes
 * - Elimina caracteres especiales
 * - Deja solo letras/números y espacios
 */
function normalize(text: string): string {
  return (text ?? '')
    .toLowerCase()                       // todo en minúscula
    .normalize('NFD')                    // separa letras de tildes
    .replace(/[\u0300-\u036f]/g, '')     // elimina tildes
    .replace(/[^a-z0-9]+/g, ' ')         // deja solo letras y números
    .trim();                             // elimina espacios extremos
}

// Retorna la ruta del ícono según el nombre del beneficio, si no encuentra coincidencia, devuelve null.
export function benefitIconSrc(benefitName: string): string | null {
  const n = normalize(benefitName); // normaliza para comparar sin errores

  if (n.includes('vacacion'))
    return 'assets/benefits/Vacaciones.png';

  if (n.includes('cumple'))
    return 'assets/benefits/DiaCumpleaños.png';

  if (
    n.includes('prepara') ||
    n.includes('prepara tu viaje') ||
    (n.includes('viaje') && n.includes('prepara'))
  )
    return 'assets/benefits/DiaPreparaTuViaje.png';

  if (n.includes('medio') && n.includes('diligenc'))
    return 'assets/benefits/MedioDiaDiligencia.png';

  if (n.includes('medio') && n.includes('free'))
    return 'assets/benefits/MedioDiaFree.png';

  if (n.includes('medio') && n.includes('flex'))
    return 'assets/benefits/MedioDiaFlex.png';

  if (n.includes('familia'))
    return 'assets/benefits/DiaFamilia.png';

  if (n.includes('flex'))
    return 'assets/benefits/DiaFlex.png';

  // Si no coincide con ninguno
  return null;
}
