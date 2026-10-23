export interface DailyForecast {
  date: string;
  temperature: {
    min: number;
    max: number;
    unit: '°C';
  };
  humidity: number; // porcentaje
  precipitation: number; // mm
}

export interface WeatherError {
  message: string;
  code: string;
}

export class WeatherService {
  private readonly baseUrl = 'https://api.open-meteo.com/v1/forecast';

  async getForecast(latitude: number, longitude: number): Promise<DailyForecast[]> {
    if (!this.areValidCoordinates(latitude, longitude)) {
      throw new Error('Coordenadas inválidas');
    }

    const url = new URL(this.baseUrl);
    url.searchParams.append('latitude', latitude.toString());
    url.searchParams.append('longitude', longitude.toString());
    url.searchParams.append('daily', 'temperature_2m_max,temperature_2m_min,relative_humidity_2m_mean,precipitation_sum');
    url.searchParams.append('timezone', 'auto');
    url.searchParams.append('forecast_days', '7');

    try {
      const response = await fetch(url.toString());

      if (!response.ok) {
        throw new Error(Error del servicio meteorológico:  );
      }

      const data = await response.json();

      if (!data.daily || !data.daily.time) {
        throw new Error('Formato de respuesta inválido del servicio meteorológico');
      }

      const forecasts: DailyForecast[] = [];
      const daily = data.daily;

      for (let i = 0; i < daily.time.length; i++) {
        forecasts.push({
          date: daily.time[i],
          temperature: {
            min: daily.temperature_2m_min[i],
            max: daily.temperature_2m_max[i],
            unit: '°C',
          },
          humidity: daily.relative_humidity_2m_mean[i],
          precipitation: daily.precipitation_sum[i],
        });
      }

      return forecasts;
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(Error al obtener pronóstico: );
      }
      throw new Error('Error desconocido al obtener pronóstico');
    }
  }

  areValidCoordinates(latitude: number, longitude: number): boolean {
    return (
      latitude >= -90 && latitude <= 90 &&
      longitude >= -180 && longitude <= 180
    );
  }

  validateTemperatureRange(min: number, max: number): boolean {
    return min <= max;
  }

  validateHumidity(humidity: number): boolean {
    return humidity >= 0 && humidity <= 100;
  }

  validatePrecipitation(precipitation: number): boolean {
    return precipitation >= 0;
  }
}
