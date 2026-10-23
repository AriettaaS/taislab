export interface GeocodingResult {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
}

export interface GeocodingError {
  message: string;
  code: string;
}

export class GeocodingService {
  private readonly baseUrl = 'https://geocoding-api.open-meteo.com/v1/search';

  async getCoordinates(cityName: string): Promise<GeocodingResult> {
    if (!cityName.trim()) {
      throw new Error('El nombre de la ciudad no puede estar vacío');
    }

    const url = new URL(this.baseUrl);
    url.searchParams.append('name', cityName);
    url.searchParams.append('count', '1');

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(Error de geocodificación:  );
      }

      const data = await response.json();

      if (!data.results || data.results.length === 0) {
        throw new Error(Ciudad no encontrada: "");
      }

      const firstResult = data.results[0];
      
      return {
        name: firstResult.name,
        latitude: firstResult.latitude,
        longitude: firstResult.longitude,
        country: firstResult.country,
        country_code: firstResult.country_code,
      };
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(Error al obtener coordenadas: );
      }
      throw new Error('Error desconocido al obtener coordenadas');
    }
  }

  isValidCityName(cityName: string): boolean {
    return cityName.trim().length > 0;
  }
}
