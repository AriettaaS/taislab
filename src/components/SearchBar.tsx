import React, { useState } from 'react';

interface SearchBarProps {
  onSearch: (city: string) => void;
  disabled?: boolean;
  placeholder?: string;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  onSearch,
  disabled = false,
  placeholder = 'Ingresa el nombre de una ciudad...',
}) => {
  const [city, setCity] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const trimmedCity = city.trim();
    
    if (!trimmedCity) {
      setError('Por favor ingresa el nombre de una ciudad');
      return;
    }

    if (trimmedCity.length < 2) {
      setError('El nombre de la ciudad debe tener al menos 2 caracteres');
      return;
    }

    onSearch(trimmedCity);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCity(e.target.value);
    if (error) setError('');
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-md mx-auto">
      <div className="flex flex-col space-y-2">
        <div className="relative">
          <input
            type="text"
            value={city}
            onChange={handleChange}
            placeholder={placeholder}
            disabled={disabled}
            className={
              w-full px-4 py-3 border rounded-lg
              focus:ring-2 focus:ring-blue-500 focus:border-blue-500
              outline-none transition
              
              
            }
            aria-label="Nombre de la ciudad"
            aria-invalid={!!error}
            aria-describedby={error ? 'city-error' : undefined}
          />
        </div>

        {error && (
          <div
            id="city-error"
            className="text-red-600 text-sm flex items-center"
            role="alert"
          >
            <span className="mr-1">⚠️</span>
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={disabled}
          className={
            w-full py-3 px-4 rounded-lg font-semibold
            transition duration-200
            
          }
          aria-label="Buscar pronóstico del clima"
        >
          {disabled ? 'Buscando...' : 'Obtener Pronóstico'}
        </button>
      </div>
    </form>
  );
};
