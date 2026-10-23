import React from 'react';

interface ErrorDisplayProps {
  error: string;
  onRetry?: () => void;
  showRetry?: boolean;
}

export const ErrorDisplay: React.FC<ErrorDisplayProps> = ({
  error,
  onRetry,
  showRetry = true,
}) => {
  const getErrorMessage = (errorMsg: string) => {
    const lowerCaseError = errorMsg.toLowerCase();
    
    if (lowerCaseError.includes('ciudad no encontrada')) {
      return 'La ciudad ingresada no fue encontrada. Por favor verifica el nombre e intenta de nuevo.';
    }
    
    if (lowerCaseError.includes('red') || lowerCaseError.includes('network')) {
      return 'Error de conexión. Por favor verifica tu conexión a internet e intenta de nuevo.';
    }
    
    if (lowerCaseError.includes('servicio') || lowerCaseError.includes('api')) {
      return 'El servicio meteorológico está temporalmente no disponible. Por favor intenta más tarde.';
    }
    
    return errorMsg;
  };

  return (
    <div 
      className="bg-red-50 border border-red-200 rounded-lg p-6 text-center"
      role="alert"
      aria-live="assertive"
    >
      <div className="flex flex-col items-center space-y-4">
        <div className="text-red-600 text-4xl">⚠️</div>
        
        <div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Ocurrió un error
          </h3>
          <p className="text-red-700">
            {getErrorMessage(error)}
          </p>
        </div>

        {showRetry && onRetry && (
          <button
            onClick={onRetry}
            className="
              mt-4 px-6 py-2 bg-red-600 text-white
              rounded-lg font-medium hover:bg-red-700
              transition duration-200
              focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2
            "
            aria-label="Reintentar"
          >
            Reintentar
          </button>
        )}
        
        {showRetry && !onRetry && (
          <p className="text-sm text-red-600 mt-2">
            Recarga la página para intentar de nuevo
          </p>
        )}
      </div>
    </div>
  );
};
