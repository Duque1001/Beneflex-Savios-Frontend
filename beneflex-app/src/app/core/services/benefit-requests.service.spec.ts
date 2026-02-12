// Herramienta de Angular para configurar entorno de pruebas.
import { TestBed } from '@angular/core/testing';

// Servicio que se va a probar.
import { BenefitRequestsService } from './benefit-requests.service';

// Bloque principal de pruebas del servicio.
describe('BenefitRequestsService', () => {

  // Variable donde se almacenará la instancia del servicio
  let service: BenefitRequestsService;

  // beforeEach: Se ejecuta antes de cada prueba.
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BenefitRequestsService);
  });

  // Prueba básica: Verifica que el servicio se cree correctamente.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
