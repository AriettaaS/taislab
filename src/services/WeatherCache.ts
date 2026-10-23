export interface CacheEntry<T> {
  data: T;
  timestamp: number;
  expiresIn: number; // milisegundos
}

export class WeatherCache {
  private static readonly CACHE_KEY_PREFIX = 'weather_cache_';
  private static readonly DEFAULT_TTL = 10 * 60 * 1000; // 10 minutos

  static get<T>(key: string): T | null {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) {
        return null;
      }

      const entry: CacheEntry<T> = JSON.parse(cached);
      
      if (this.isExpired(entry)) {
        this.remove(key);
        return null;
      }

      return entry.data;
    } catch (error) {
      console.error('Error al recuperar de caché:', error);
      return null;
    }
  }

  static set<T>(key: string, data: T, ttl: number = this.DEFAULT_TTL): void {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + key;
      const entry: CacheEntry<T> = {
        data,
        timestamp: Date.now(),
        expiresIn: ttl,
      };

      localStorage.setItem(cacheKey, JSON.stringify(entry));
    } catch (error) {
      console.error('Error al guardar en caché:', error);
    }
  }

  static remove(key: string): void {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + key;
      localStorage.removeItem(cacheKey);
    } catch (error) {
      console.error('Error al eliminar de caché:', error);
    }
  }

  static clear(): void {
    try {
      const keysToRemove: string[] = [];
      
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.CACHE_KEY_PREFIX)) {
          keysToRemove.push(key);
        }
      }

      keysToRemove.forEach(key => localStorage.removeItem(key));
    } catch (error) {
      console.error('Error al limpiar caché:', error);
    }
  }

  static isExpired<T>(entry: CacheEntry<T>): boolean {
    return Date.now() - entry.timestamp > entry.expiresIn;
  }

  static has(key: string): boolean {
    return this.get(key) !== null;
  }

  static getTimeRemaining(key: string): number {
    try {
      const cacheKey = this.CACHE_KEY_PREFIX + key;
      const cached = localStorage.getItem(cacheKey);
      
      if (!cached) {
        return 0;
      }

      const entry: CacheEntry<any> = JSON.parse(cached);
      const elapsed = Date.now() - entry.timestamp;
      const remaining = entry.expiresIn - elapsed;

      return Math.max(0, remaining);
    } catch (error) {
      console.error('Error al obtener tiempo restante:', error);
      return 0;
    }
  }
}
