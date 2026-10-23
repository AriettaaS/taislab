import React from 'react';
import { City, DailyForecast } from '../types';

interface WeatherDisplayProps {
  city: City;
  forecast: DailyForecast[];
  isLoading?: boolean;
}

export const WeatherDisplay: React.FC<WeatherDisplayProps> = ({
  city,
  forecast,
  isLoading = false,
}) => {
  if (isLoading) {
    return (
      <div className="text-center py-8">
        <div className="inline-block animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <p className="mt-2 text-gray-600">Cargando pronóstico...</p>
      </div>
    );
  }

  if (!forecast || forecast.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-gray-600">No hay datos de pronóstico disponibles</p>
      </div>
    );
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('es-ES', {
      weekday: 'short',
      day: 'numeric',
      month: 'short',
    });
  };

  return (
    <div className="space-y-6">
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-800">
          {city.name}, {city.country}
        </h2>
        <p className="text-gray-600 text-sm mt-1">
          Coordenadas: {city.latitude.toFixed(4)}, {city.longitude.toFixed(4)}
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-7 gap-4">
        {forecast.map((day, index) => (
          <div
            key={day.date}
            className={
              bg-white rounded-lg shadow p-4
              border border-gray-200
              
            }
          >
            <div className="text-center">
              <div className="font-semibold text-gray-800">
                {formatDate(day.date)}
              </div>
              {index === 0 && (
                <div className="text-xs text-blue-600 font-medium mt-1">
                  Hoy
                </div>
              )}
            </div>

            <div className="mt-4 space-y-3">
              <div className="text-center">
                <div className="flex items-center justify-center space-x-2">
                  <span className="text-2xl font-bold text-gray-800">
                    {day.temperature.max}°C
                  </span>
                  <span className="text-gray-500">/</span>
                  <span className="text-lg text-gray-600">
                    {day.temperature.min}°C
                  </span>
                </div>
                <div className="text-sm text-gray-500 mt-1">Temperatura</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">💧</span>
                  <span className="text-gray-700">{day.humidity}%</span>
                </div>
                <div className="text-sm text-gray-500">Humedad</div>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">🌧️</span>
                  <span className="text-gray-700">{day.precipitation}mm</span>
                </div>
                <div className="text-sm text-gray-500">Precipitación</div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="text-center text-sm text-gray-500 pt-4 border-t border-gray-200">
        <p>Pronóstico para los próximos 7 días</p>
        <p className="mt-1">Actualizado: {new Date().toLocaleString('es-ES')}</p>
      </div>
    </div>
  );
};
