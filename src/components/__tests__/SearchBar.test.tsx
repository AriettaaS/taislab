import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  const mockOnSearch = jest.fn();

  beforeEach(() => {
    mockOnSearch.mockClear();
  });

  it('debería renderizar correctamente', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    expect(screen.getByPlaceholderText(/ingresa el nombre de una ciudad/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /obtener pronóstico/i })).toBeInTheDocument();
  });

  it('debería mostrar placeholder personalizado', () => {
    const customPlaceholder = 'Busca tu ciudad favorita';
    render(
      <SearchBar 
        onSearch={mockOnSearch} 
        placeholder={customPlaceholder}
      />
    );
    
    expect(screen.getByPlaceholderText(customPlaceholder)).toBeInTheDocument();
  });

  it('debería deshabilitar el botón cuando disabled es true', () => {
    render(<SearchBar onSearch={mockOnSearch} disabled={true} />);
    
    const button = screen.getByRole('button', { name: /buscando/i });
    expect(button).toBeDisabled();
    expect(button).toHaveTextContent('Buscando...');
  });

  it('debería llamar a onSearch con el valor del input al enviar el formulario', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/ingresa el nombre de una ciudad/i);
    const button = screen.getByRole('button', { name: /obtener pronóstico/i });
    
    await user.type(input, 'Madrid');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('Madrid');
  });

  it('debería mostrar error cuando se envía ciudad vacía', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const button = screen.getByRole('button', { name: /obtener pronóstico/i });
    await user.click(button);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/por favor ingresa el nombre de una ciudad/i)).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('debería mostrar error cuando se envía ciudad con menos de 2 caracteres', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/ingresa el nombre de una ciudad/i);
    const button = screen.getByRole('button', { name: /obtener pronóstico/i });
    
    await user.type(input, 'A');
    await user.click(button);
    
    expect(screen.getByRole('alert')).toBeInTheDocument();
    expect(screen.getByText(/el nombre de la ciudad debe tener al menos 2 caracteres/i)).toBeInTheDocument();
    expect(mockOnSearch).not.toHaveBeenCalled();
  });

  it('debería limpiar el error al comenzar a escribir de nuevo', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/ingresa el nombre de una ciudad/i);
    const button = screen.getByRole('button', { name: /obtener pronóstico/i });
    
    // Generar error
    await user.click(button);
    expect(screen.getByRole('alert')).toBeInTheDocument();
    
    // Comenzar a escribir
    await user.type(input, 'M');
    expect(screen.queryByRole('alert')).not.toBeInTheDocument();
  });

  it('debería enviar el formulario al presionar Enter', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/ingresa el nombre de una ciudad/i);
    
    await user.type(input, 'Barcelona{enter}');
    
    expect(mockOnSearch).toHaveBeenCalledTimes(1);
    expect(mockOnSearch).toHaveBeenCalledWith('Barcelona');
  });

  it('debería trimar espacios en blanco al enviar', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/ingresa el nombre de una ciudad/i);
    const button = screen.getByRole('button', { name: /obtener pronóstico/i });
    
    await user.type(input, '   París   ');
    await user.click(button);
    
    expect(mockOnSearch).toHaveBeenCalledWith('París');
  });

  it('debería tener atributos ARIA para accesibilidad', () => {
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/ingresa el nombre de una ciudad/i);
    expect(input).toHaveAttribute('aria-label', 'Nombre de la ciudad');
    expect(input).toHaveAttribute('aria-invalid', 'false');
  });

  it('debería mostrar aria-invalid cuando hay error', async () => {
    const user = userEvent.setup();
    render(<SearchBar onSearch={mockOnSearch} />);
    
    const input = screen.getByPlaceholderText(/ingresa el nombre de una ciudad/i);
    const button = screen.getByRole('button', { name: /obtener pronóstico/i });
    
    await user.click(button);
    
    expect(input).toHaveAttribute('aria-invalid', 'true');
    expect(input).toHaveAttribute('aria-describedby', 'city-error');
  });
});
