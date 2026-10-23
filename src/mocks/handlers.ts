import { http, HttpResponse } from 'msw';

export const handlers = [
  // Mock para geocodificación API
  http.get('https://geocoding-api.open-meteo.com/v1/search', ({ request }) => {
    const url = new URL(request.url);
    const city = url.searchParams.get('name');
    
    if (city?.toLowerCase() === 'madrid') {
      return HttpResponse.json({
        results: [
          {
            name: 'Madrid',
            latitude: 40.4165,
            longitude: -3.7026,
            country: 'Spain',
            country_code: 'ES',
          },
        ],
      });
    }
    
    if (city?.toLowerCase() === 'ciudad no encontrada') {
      return HttpResponse.json({
        results: [],
      });
    }
    
    return HttpResponse.json({
      results: [
        {
          name: city || 'Default City',
          latitude: 40.4165,
          longitude: -3.7026,
          country: 'Default Country',
          country_code: 'DC',
        },
      ],
    });
  }),

  // Mock para weather API
  http.get('https://api.open-meteo.com/v1/forecast', () => {
    return HttpResponse.json({
      latitude: 40.4165,
      longitude: -3.7026,
      generationtime_ms: 0.123,
      utc_offset_seconds: 3600,
      timezone: 'Europe/Madrid',
      timezone_abbreviation: 'CET',
      elevation: 667,
      daily_units: {
        time: 'iso8601',
        temperature_2m_max: '°C',
        temperature_2m_min: '°C',
        relative_humidity_2m_mean: '%',
        precipitation_sum: 'mm',
      },
      daily: {
        time: [
          '2024-01-01',
          '2024-01-02',
          '2024-01-03',
          '2024-01-04',
          '2024-01-05',
          '2024-01-06',
          '2024-01-07',
        ],
        temperature_2m_max: [15, 16, 14, 17, 18, 16, 15],
        temperature_2m_min: [8, 9, 7, 10, 11, 9, 8],
        relative_humidity_2m_mean: [65, 70, 68, 72, 75, 70, 68],
        precipitation_sum: [0, 2, 0, 5, 1, 0, 0],
      },
    });
  }),
];
