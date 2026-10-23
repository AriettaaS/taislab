import { GeocodingService } from '../GeocodingService';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('GeocodingService', () => {
  let geocodingService: GeocodingService;

  beforeEach(() => {
    geocodingService = new GeocodingService();
  });

  describe('isValidCityName', () => {
    it('debería retornar true para nombres de ciudad válidos', () => {
      expect(geocodingService.isValidCityName('Madrid')).toBe(true);
      expect(geocodingService.isValidCityName('Ciudad de México')).toBe(true);
      expect(geocodingService.isValidCityName('   París   ')).toBe(true);
    });

    it('debería retornar false para nombres de ciudad inválidos', () => {
      expect(geocodingService.isValidCityName('')).toBe(false);
      expect(geocodingService.isValidCityName('   ')).toBe(false);
      expect(geocodingService.isValidCityName('  \n\t  ')).toBe(false);
    });
  });

  describe('getCoordinates', () => {
    it('debería lanzar error para nombre de ciudad vacío', async () => {
      await expect(geocodingService.getCoordinates('')).rejects.toThrow(
        'El nombre de la ciudad no puede estar vacío'
      );
    });

    it('debería lanzar error para ciudad no encontrada', async () => {
      await expect(geocodingService.getCoordinates('Ciudad no encontrada')).rejects.toThrow(
        'Ciudad no encontrada'
      );
    });

    it('debería retornar coordenadas para ciudad válida', async () => {
      const result = await geocodingService.getCoordinates('Madrid');
      
      expect(result).toEqual({
        name: 'Madrid',
        latitude: 40.4165,
        longitude: -3.7026,
        country: 'Spain',
        country_code: 'ES',
      });
    });

    it('debería manejar errores de red', async () => {
      // Sobrescribir el handler temporalmente
      server.use(
        http.get('https://geocoding-api.open-meteo.com/v1/search', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(geocodingService.getCoordinates('Madrid')).rejects.toThrow(
        'Error de geocodificación: 500'
      );
    });

    it('debería manejar errores de respuesta JSON inválida', async () => {
      server.use(
        http.get('https://geocoding-api.open-meteo.com/v1/search', () => {
          return HttpResponse.json({ invalid: 'response' });
        })
      );

      await expect(geocodingService.getCoordinates('Test')).rejects.toThrow(
        'Ciudad no encontrada'
      );
    });
  });
});
