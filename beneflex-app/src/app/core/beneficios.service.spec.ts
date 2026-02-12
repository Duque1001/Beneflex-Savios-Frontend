// TestBed: Utilidad de Angular para configurar el entorno de pruebas.
import { TestBed } from '@angular/core/testing';

// Servicio que se va a probar.
import { BeneficiosService } from './beneficios.service';

// Bloque de pruebas del servicio.
describe('BeneficiosService', () => {

  // Variable que almacenará la instancia del servicio
  let service: BeneficiosService;

  // Se ejecuta antes de cada prueba.
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BeneficiosService);
  });

  // Verifica que el servicio se cree correctamente.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
