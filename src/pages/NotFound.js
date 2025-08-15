import React from 'react';
import { Link } from 'react-router-dom';
import { Home, ArrowLeft, PawPrint } from 'lucide-react';

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md text-center">
        <div className="mb-8">
          <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <PawPrint className="w-12 h-12 text-primary-600" />
          </div>
          <h1 className="text-6xl font-bold text-primary-600 mb-4">404</h1>
          <h2 className="text-2xl font-semibold text-gray-900 mb-2">
            Página no encontrada
          </h2>
          <p className="text-gray-600 mb-8">
            Lo sentimos, la página que buscas no existe o ha sido movida.
          </p>
        </div>

        <div className="space-y-4">
          <Link
            to="/"
            className="btn-primary w-full inline-flex items-center justify-center space-x-2"
          >
            <Home className="w-4 h-4" />
            <span>Ir al Inicio</span>
          </Link>
          
          <button
            onClick={() => window.history.back()}
            className="btn-secondary w-full inline-flex items-center justify-center space-x-2"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Volver Atrás</span>
          </button>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>¿Necesitas ayuda? Contacta con nuestro soporte</p>
          <a 
            href="mailto:soporte@akitopet.cl" 
            className="text-primary-600 hover:text-primary-500 font-medium"
          >
            soporte@akitopet.cl
          </a>
        </div>
      </div>
    </div>
  );
};

export default NotFound;
