import React from 'react';
import { render, screen } from '@testing-library/react';
import { WeatherDisplay } from '../WeatherDisplay';
import { City, DailyForecast } from '../../types';

describe('WeatherDisplay', () => {
  const mockCity: City = {
    name: 'Madrid',
    latitude: 40.4165,
    longitude: -3.7026,
    country: 'España',
    country_code: 'ES',
  };

  const mockForecast: DailyForecast[] = [
    {
      date: '2024-01-01',
      temperature: { min: 8, max: 15, unit: '°C' },
      humidity: 65,
      precipitation: 0,
    },
    {
      date: '2024-01-02',
      temperature: { min: 9, max: 16, unit: '°C' },
      humidity: 70,
      precipitation: 2,
    },
    {
      date: '2024-01-03',
      temperature: { min: 7, max: 14, unit: '°C' },
      humidity: 68,
      precipitation: 0,
    },
  ];

  it('debería mostrar indicador de carga cuando isLoading es true', () => {
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={mockForecast}
        isLoading={true}
      />
    );
    
    expect(screen.getByText(/cargando pronóstico/i)).toBeInTheDocument();
    expect(screen.getByRole('status')).toBeInTheDocument();
  });

  it('debería mostrar mensaje cuando no hay datos de pronóstico', () => {
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={[]}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(/no hay datos de pronóstico disponibles/i)).toBeInTheDocument();
  });

  it('debería mostrar información de la ciudad correctamente', () => {
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={mockForecast}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(/madrid, españa/i)).toBeInTheDocument();
    expect(screen.getByText(/coordenadas: 40\.4165, -3\.7026/i)).toBeInTheDocument();
  });

  it('debería mostrar todos los días del pronóstico', () => {
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={mockForecast}
        isLoading={false}
      />
    );
    
    // Verificar que se muestren todos los días
    expect(screen.getByText('15°C')).toBeInTheDocument();
    expect(screen.getByText('16°C')).toBeInTheDocument();
    expect(screen.getByText('14°C')).toBeInTheDocument();
    
    // Verificar temperaturas mínimas
    expect(screen.getByText('8°C')).toBeInTheDocument();
    expect(screen.getByText('9°C')).toBeInTheDocument();
    expect(screen.getByText('7°C')).toBeInTheDocument();
    
    // Verificar humedad
    expect(screen.getByText('65%')).toBeInTheDocument();
    expect(screen.getByText('70%')).toBeInTheDocument();
    expect(screen.getByText('68%')).toBeInTheDocument();
    
    // Verificar precipitación
    expect(screen.getByText('0mm')).toBeInTheDocument();
    expect(screen.getByText('2mm')).toBeInTheDocument();
  });

  it('debería resaltar el primer día como "Hoy"', () => {
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={mockForecast}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('Hoy')).toBeInTheDocument();
  });

  it('debería formatear las fechas correctamente en español', () => {
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={mockForecast}
        isLoading={false}
      />
    );
    
    // Las fechas deberían estar formateadas en español
    // Dependiendo del día de la semana, puede mostrar "lun", "mar", etc.
    expect(screen.getByText(/\d{1,2} [a-z]{3}/i)).toBeInTheDocument();
  });

  it('debería mostrar la hora de actualización', () => {
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={mockForecast}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(/actualizado:/i)).toBeInTheDocument();
  });

  it('debería mostrar mensaje de pronóstico para 7 días', () => {
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={mockForecast}
        isLoading={false}
      />
    );
    
    expect(screen.getByText(/pronóstico para los próximos 7 días/i)).toBeInTheDocument();
  });

  it('debería manejar diferentes tamaños de pronóstico', () => {
    const singleDayForecast: DailyForecast[] = [
      {
        date: '2024-01-01',
        temperature: { min: 10, max: 20, unit: '°C' },
        humidity: 50,
        precipitation: 5,
      },
    ];
    
    render(
      <WeatherDisplay
        city={mockCity}
        forecast={singleDayForecast}
        isLoading={false}
      />
    );
    
    expect(screen.getByText('20°C')).toBeInTheDocument();
    expect(screen.getByText('10°C')).toBeInTheDocument();
    expect(screen.getByText('50%')).toBeInTheDocument();
    expect(screen.getByText('5mm')).toBeInTheDocument();
  });

  it('debería tener diseño responsivo con diferentes clases de grid', () => {
    const { container } = render(
      <WeatherDisplay
        city={mockCity}
        forecast={mockForecast}
        isLoading={false}
      />
    );
    
    const gridElement = container.querySelector('.grid');
    expect(gridElement).toBeInTheDocument();
    expect(gridElement).toHaveClass('grid-cols-1');
    expect(gridElement).toHaveClass('sm:grid-cols-2');
    expect(gridElement).toHaveClass('md:grid-cols-3');
    expect(gridElement).toHaveClass('lg:grid-cols-7');
  });
});
