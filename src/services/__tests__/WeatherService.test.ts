import { WeatherService } from '../WeatherService';
import { server } from '../../mocks/server';
import { http, HttpResponse } from 'msw';

describe('WeatherService', () => {
  let weatherService: WeatherService;

  beforeEach(() => {
    weatherService = new WeatherService();
  });

  describe('areValidCoordinates', () => {
    it('debería retornar true para coordenadas válidas', () => {
      expect(weatherService.areValidCoordinates(40.4165, -3.7026)).toBe(true);
      expect(weatherService.areValidCoordinates(0, 0)).toBe(true);
      expect(weatherService.areValidCoordinates(-90, -180)).toBe(true);
      expect(weatherService.areValidCoordinates(90, 180)).toBe(true);
    });

    it('debería retornar false para coordenadas inválidas', () => {
      expect(weatherService.areValidCoordinates(91, 0)).toBe(false);
      expect(weatherService.areValidCoordinates(-91, 0)).toBe(false);
      expect(weatherService.areValidCoordinates(0, 181)).toBe(false);
      expect(weatherService.areValidCoordinates(0, -181)).toBe(false);
    });
  });

  describe('validateTemperatureRange', () => {
    it('debería retornar true para rango de temperatura válido', () => {
      expect(weatherService.validateTemperatureRange(15, 22)).toBe(true);
      expect(weatherService.validateTemperatureRange(20, 20)).toBe(true);
    });

    it('debería retornar false para rango de temperatura inválido', () => {
      expect(weatherService.validateTemperatureRange(25, 20)).toBe(false);
    });
  });

  describe('validateHumidity', () => {
    it('debería retornar true para humedad válida', () => {
      expect(weatherService.validateHumidity(0)).toBe(true);
      expect(weatherService.validateHumidity(50)).toBe(true);
      expect(weatherService.validateHumidity(100)).toBe(true);
    });

    it('debería retornar false para humedad inválida', () => {
      expect(weatherService.validateHumidity(-1)).toBe(false);
      expect(weatherService.validateHumidity(101)).toBe(false);
    });
  });

  describe('validatePrecipitation', () => {
    it('debería retornar true para precipitación válida', () => {
      expect(weatherService.validatePrecipitation(0)).toBe(true);
      expect(weatherService.validatePrecipitation(5.5)).toBe(true);
      expect(weatherService.validatePrecipitation(100)).toBe(true);
    });

    it('debería retornar false para precipitación inválida', () => {
      expect(weatherService.validatePrecipitation(-0.1)).toBe(false);
      expect(weatherService.validatePrecipitation(-5)).toBe(false);
    });
  });

  describe('getForecast', () => {
    it('debería lanzar error para coordenadas inválidas', async () => {
      await expect(weatherService.getForecast(91, 0)).rejects.toThrow(
        'Coordenadas inválidas'
      );
      await expect(weatherService.getForecast(0, 181)).rejects.toThrow(
        'Coordenadas inválidas'
      );
    });

    it('debería retornar pronóstico para coordenadas válidas', async () => {
      const forecast = await weatherService.getForecast(40.4165, -3.7026);
      
      expect(Array.isArray(forecast)).toBe(true);
      expect(forecast).toHaveLength(7);
      
      // Verificar estructura del primer elemento
      const firstDay = forecast[0];
      expect(firstDay).toHaveProperty('date');
      expect(firstDay).toHaveProperty('temperature');
      expect(firstDay.temperature).toHaveProperty('min');
      expect(firstDay.temperature).toHaveProperty('max');
      expect(firstDay.temperature).toHaveProperty('unit', '°C');
      expect(firstDay).toHaveProperty('humidity');
      expect(firstDay).toHaveProperty('precipitation');
      
      // Verificar valores específicos del mock
      expect(firstDay.temperature.max).toBe(15);
      expect(firstDay.temperature.min).toBe(8);
      expect(firstDay.humidity).toBe(65);
      expect(firstDay.precipitation).toBe(0);
    });

    it('debería manejar errores de red', async () => {
      server.use(
        http.get('https://api.open-meteo.com/v1/forecast', () => {
          return new HttpResponse(null, { status: 500 });
        })
      );

      await expect(weatherService.getForecast(40.4165, -3.7026)).rejects.toThrow(
        'Error del servicio meteorológico: 500'
      );
    });

    it('debería manejar errores de respuesta JSON inválida', async () => {
      server.use(
        http.get('https://api.open-meteo.com/v1/forecast', () => {
          return HttpResponse.json({ invalid: 'response' });
        })
      );

      await expect(weatherService.getForecast(40.4165, -3.7026)).rejects.toThrow(
        'Formato de respuesta inválido del servicio meteorológico'
      );
    });

    it('debería manejar respuestas con datos faltantes', async () => {
      server.use(
        http.get('https://api.open-meteo.com/v1/forecast', () => {
          return HttpResponse.json({
            daily: {
              time: ['2024-01-01'],
              // Falta temperature_2m_max, temperature_2m_min, etc.
            },
          });
        })
      );

      await expect(weatherService.getForecast(40.4165, -3.7026)).rejects.toThrow(
        'Formato de respuesta inválido del servicio meteorológico'
      );
    });
  });
});
