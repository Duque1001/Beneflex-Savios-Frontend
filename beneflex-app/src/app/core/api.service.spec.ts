// TestBed: Utilidad de Angular para configurar el entorno de pruebas.
import { TestBed } from '@angular/core/testing';

// Servicio que se va a probar.
import { ApiService } from './api.service';

// Bloque de pruebas del ApiService.
describe('ApiService', () => {

  // Variable donde se almacenará la instancia del servicio
  let service: ApiService;

  // Se ejecuta antes de cada prueba.
  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ApiService);
  });

  // Prueba básica: Verifica que el servicio se cree correctamente.
  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
