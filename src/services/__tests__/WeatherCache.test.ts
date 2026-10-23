import { WeatherCache } from '../WeatherCache';

// Mock de localStorage
const mockLocalStorage = (() => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => {
      store[key] = value.toString();
    },
    removeItem: (key: string) => {
      delete store[key];
    },
    clear: () => {
      store = {};
    },
    key: (index: number) => Object.keys(store)[index] || null,
    length: Object.keys(store).length,
  };
})();

describe('WeatherCache', () => {
  beforeAll(() => {
    // Reemplazar localStorage global con nuestro mock
    Object.defineProperty(window, 'localStorage', {
      value: mockLocalStorage,
      writable: true,
    });
  });

  beforeEach(() => {
    // Limpiar el mock antes de cada test
    mockLocalStorage.clear();
    jest.useFakeTimers();
  });

  afterEach(() => {
    jest.useRealTimers();
  });

  describe('operaciones básicas', () => {
    it('debería almacenar y recuperar datos del caché', () => {
      const testData = { city: 'Madrid', temperature: 22 };
      
      WeatherCache.set('madrid', testData);
      const retrieved = WeatherCache.get('madrid');
      
      expect(retrieved).toEqual(testData);
    });

    it('debería retornar null para claves no existentes', () => {
      expect(WeatherCache.get('no-existe')).toBeNull();
    });

    it('debería eliminar datos del caché', () => {
      WeatherCache.set('test', { data: 'test' });
      expect(WeatherCache.get('test')).not.toBeNull();
      
      WeatherCache.remove('test');
      expect(WeatherCache.get('test')).toBeNull();
    });

    it('debería verificar si una clave existe en el caché', () => {
      expect(WeatherCache.has('test')).toBe(false);
      
      WeatherCache.set('test', { data: 'test' });
      expect(WeatherCache.has('test')).toBe(true);
    });
  });

  describe('expiración', () => {
    it('debería expirar datos después del TTL', () => {
      const testData = { city: 'Madrid' };
      
      WeatherCache.set('madrid', testData, 1000); // TTL de 1 segundo
      
      // Antes de la expiración
      jest.advanceTimersByTime(500);
      expect(WeatherCache.get('madrid')).toEqual(testData);
      
      // Después de la expiración
      jest.advanceTimersByTime(600);
      expect(WeatherCache.get('madrid')).toBeNull();
    });

    it('debería calcular el tiempo restante correctamente', () => {
      const testData = { city: 'Madrid' };
      
      WeatherCache.set('madrid', testData, 1000);
      
      // 300ms después
      jest.advanceTimersByTime(300);
      const remaining = WeatherCache.getTimeRemaining('madrid');
      
      // Debería quedar aproximadamente 700ms
      expect(remaining).toBeGreaterThan(600);
      expect(remaining).toBeLessThanOrEqual(700);
    });

    it('debería retornar 0 para claves no existentes', () => {
      expect(WeatherCache.getTimeRemaining('no-existe')).toBe(0);
    });

    it('debería detectar datos expirados', () => {
      const testData = { city: 'Madrid' };
      const now = Date.now();
      
      const expiredEntry = {
        data: testData,
        timestamp: now - 2000, // 2 segundos atrás
        expiresIn: 1000, // Expiró hace 1 segundo
      };
      
      mockLocalStorage.setItem(
        'weather_cache_madrid',
        JSON.stringify(expiredEntry)
      );
      
      expect(WeatherCache.get('madrid')).toBeNull();
    });
  });

  describe('limpieza', () => {
    it('debería limpiar todas las entradas del caché', () => {
      WeatherCache.set('key1', { data: 'test1' });
      WeatherCache.set('key2', { data: 'test2' });
      WeatherCache.set('other', { data: 'test3' }); // Esta no tiene el prefijo correcto
      
      mockLocalStorage.setItem('other_key', 'test'); // Esta no debería ser eliminada
      
      WeatherCache.clear();
      
      expect(WeatherCache.get('key1')).toBeNull();
      expect(WeatherCache.get('key2')).toBeNull();
      expect(mockLocalStorage.getItem('other_key')).toBe('test'); // Esta debería permanecer
    });

    it('debería manejar localStorage vacío al limpiar', () => {
      expect(() => WeatherCache.clear()).not.toThrow();
    });
  });

  describe('manejo de errores', () => {
    it('debería manejar JSON inválido en localStorage', () => {
      mockLocalStorage.setItem('weather_cache_invalid', 'invalid json');
      
      expect(WeatherCache.get('invalid')).toBeNull();
      // No debería lanzar excepción
    });

    it('debería manejar localStorage.setItem que lanza error', () => {
      // Sobrescribir setItem temporalmente para que lance error
      const originalSetItem = mockLocalStorage.setItem;
      mockLocalStorage.setItem = jest.fn(() => {
        throw new Error('Storage full');
      });
      
      expect(() => {
        WeatherCache.set('test', { data: 'test' });
      }).not.toThrow();
      
      // Restaurar
      mockLocalStorage.setItem = originalSetItem;
    });

    it('debería manejar localStorage.getItem que lanza error', () => {
      // Sobrescribir getItem temporalmente para que lance error
      const originalGetItem = mockLocalStorage.getItem;
      mockLocalStorage.getItem = jest.fn(() => {
        throw new Error('Storage error');
      });
      
      expect(WeatherCache.get('test')).toBeNull();
      
      // Restaurar
      mockLocalStorage.getItem = originalGetItem;
    });
  });
});
