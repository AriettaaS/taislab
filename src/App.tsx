import React, { useState } from 'react';
import { SearchBar } from './components/SearchBar';
import { WeatherDisplay } from './components/WeatherDisplay';
import { LoadingIndicator } from './components/LoadingIndicator';
import { ErrorDisplay } from './components/ErrorDisplay';
import { City, DailyForecast } from './types';

const App: React.FC = () => {
  const [city, setCity] = useState<City | null>(null);
  const [forecast, setForecast] = useState<DailyForecast[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (searchCity: string) => {
    setLoading(true);
    setError(null);
    
    // Simulación de búsqueda (en una implementación real, aquí se llamarían las APIs)
    setTimeout(() => {
      try {
        if (searchCity.toLowerCase() === 'error') {
          throw new Error('Ciudad no encontrada');
        }

        const mockCity: City = {
          name: searchCity,
          latitude: 40.4165,
          longitude: -3.7026,
          country: 'España',
          country_code: 'ES',
        };

        const mockForecast: DailyForecast[] = [
          {
            date: new Date().toISOString().split('T')[0],
            temperature: { min: 15, max: 22, unit: '°C' },
            humidity: 65,
            precipitation: 0,
          },
          {
            date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
            temperature: { min: 16, max: 23, unit: '°C' },
            humidity: 70,
            precipitation: 2,
          },
          {
            date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
            temperature: { min: 14, max: 21, unit: '°C' },
            humidity: 68,
            precipitation: 0,
          },
        ];

        setCity(mockCity);
        setForecast(mockForecast);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error desconocido');
      } finally {
        setLoading(false);
      }
    }, 1500);
  };

  const handleRetry = () => {
    setError(null);
    if (city) {
      handleSearch(city.name);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <header className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-800 mb-4">
            🌤️ Pronóstico del Clima
          </h1>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Obtén el pronóstico meteorológico de cualquier ciudad del mundo. 
            Ingresa el nombre de una ciudad y consulta temperatura, humedad y precipitaciones.
          </p>
        </header>

        {/* Search Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Buscar Ciudad
            </h2>
            <SearchBar
              onSearch={handleSearch}
              disabled={loading}
              placeholder="Ej: Madrid, Barcelona, París, Tokio..."
            />
            
            <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center p-4 bg-blue-50 rounded-lg">
                <div className="text-blue-600 text-2xl mb-2">📍</div>
                <h3 className="font-semibold text-blue-700 mb-1">Geocodificación</h3>
                <p className="text-sm text-gray-600">Convierte nombres de ciudades en coordenadas precisas</p>
              </div>
              <div className="text-center p-4 bg-green-50 rounded-lg">
                <div className="text-green-600 text-2xl mb-2">🌡️</div>
                <h3 className="font-semibold text-green-700 mb-1">Temperatura</h3>
                <p className="text-sm text-gray-600">Pronósticos de temperatura mínima y máxima</p>
              </div>
              <div className="text-center p-4 bg-purple-50 rounded-lg">
                <div className="text-purple-600 text-2xl mb-2">💧</div>
                <h3 className="font-semibold text-purple-700 mb-1">Humedad & Lluvia</h3>
                <p className="text-sm text-gray-600">Datos de humedad y probabilidad de precipitación</p>
              </div>
            </div>
          </div>
        </section>

        {/* Results Section */}
        <section className="mb-12">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <h2 className="text-2xl font-semibold text-gray-800 mb-6 text-center">
              Resultados del Pronóstico
            </h2>
            
            {loading && (
              <div className="py-12">
                <LoadingIndicator 
                  message="Obteniendo pronóstico meteorológico..." 
                  size="large"
                />
              </div>
            )}

            {error && (
              <div className="py-8">
                <ErrorDisplay 
                  error={error} 
                  onRetry={handleRetry}
                  showRetry={true}
                />
              </div>
            )}

            {!loading && !error && city && forecast.length > 0 && (
              <WeatherDisplay
                city={city}
                forecast={forecast}
                isLoading={false}
              />
            )}

            {!loading && !error && !city && (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">🌍</div>
                <h3 className="text-xl font-medium text-gray-700 mb-2">
                  Busca una ciudad para comenzar
                </h3>
                <p className="text-gray-500">
                  Ingresa el nombre de una ciudad en el campo de búsqueda para obtener el pronóstico del clima
                </p>
              </div>
            )}
          </div>
        </section>

        {/* Footer */}
        <footer className="text-center text-gray-500 text-sm pt-8 border-t border-gray-200">
          <p className="mb-2">
            Utiliza las APIs de Open-Meteo para datos de geocodificación y pronóstico meteorológico
          </p>
          <p>
            Esta aplicación es una demostración técnica - Datos simulados para propósitos de prueba
          </p>
        </footer>
      </div>
    </div>
  );
};

export default App;
