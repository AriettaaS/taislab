import '@testing-library/jest-dom';
import { server } from './src/mocks/server';

// Establecer el tiempo de espera global para pruebas
jest.setTimeout(10000);

// Configurar MSW para interceptar solicitudes HTTP
beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));
afterEach(() => server.resetHandlers());
afterAll(() => server.close());
