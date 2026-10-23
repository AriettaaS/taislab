export interface City {
  name: string;
  latitude: number;
  longitude: number;
  country: string;
  country_code: string;
}

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

export interface WeatherResponse {
  city: City;
  forecast: DailyForecast[];
  cached: boolean;
  timestamp: string;
}

export type LoadingState = 'idle' | 'loading' | 'success' | 'error';

export interface WeatherState {
  city: string;
  coordinates: { lat: number; lon: number } | null;
  forecast: DailyForecast[] | null;
  loadingState: LoadingState;
  error: string | null;
  lastUpdated: string | null;
}

export interface SearchParams {
  city: string;
  useCache: boolean;
}
