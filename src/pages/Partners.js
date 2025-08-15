import React, { useState } from 'react';
import { usePremium } from '../contexts/PremiumContext';
import { 
  Search, 
  Filter, 
  MapPin, 
  Phone, 
  Mail, 
  Globe, 
  Star,
  Shield,
  Gift,
  Users
} from 'lucide-react';

const Partners = () => {
  const { partners, loading } = usePremium();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');

  const filteredPartners = partners.filter(partner => {
    const matchesSearch = partner.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         partner.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = filterType === 'all' || partner.type === filterType;
    return matchesSearch && matchesType;
  });

  const partnerTypes = [
    { value: 'all', label: 'Todos los tipos', icon: Users },
    { value: 'veterinaria', label: 'Veterinarias', icon: Shield },
    { value: 'farmacia', label: 'Farmacias', icon: Gift },
    { value: 'seguro', label: 'Seguros', icon: Shield }
  ];

  const getTypeIcon = (type) => {
    switch (type) {
      case 'veterinaria':
        return Shield;
      case 'farmacia':
        return Gift;
      case 'seguro':
        return Shield;
      default:
        return Users;
    }
  };

  const getTypeColor = (type) => {
    switch (type) {
      case 'veterinaria':
        return 'bg-blue-100 text-blue-600';
      case 'farmacia':
        return 'bg-green-100 text-green-600';
      case 'seguro':
        return 'bg-purple-100 text-purple-600';
      default:
        return 'bg-gray-100 text-gray-600';
    }
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex items-center justify-center py-20">
          <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="section-title">Nuestros Aliados Comerciales</h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Trabajamos con las mejores veterinarias, farmacias y aseguradoras 
          de Chile para ofrecerte los mejores servicios y precios.
        </p>
      </div>

      {/* Search and Filters */}
      <div className="card mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar aliados comerciales..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              className="input-field pl-10"
            >
              {partnerTypes.map(type => (
                <option key={type.value} value={type.value}>
                  {type.label}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Partners Grid */}
      {filteredPartners.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPartners.map((partner) => {
            const TypeIcon = getTypeIcon(partner.type);
            const typeColor = getTypeColor(partner.type);
            
            return (
              <div key={partner.id} className="card hover:shadow-lg transition-shadow duration-200">
                {/* Partner Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                      {partner.logo ? (
                        <img 
                          src={partner.logo} 
                          alt={partner.name}
                          className="w-8 h-8 object-contain"
                        />
                      ) : (
                        <TypeIcon className="w-6 h-6 text-gray-600" />
                      )}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{partner.name}</h3>
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${typeColor}`}>
                        <TypeIcon className="w-3 h-3 mr-1" />
                        {partner.type}
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < (partner.rating || 4) ? 'text-yellow-400 fill-current' : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                </div>

                {/* Partner Description */}
                <p className="text-gray-600 text-sm mb-4 line-clamp-3">
                  {partner.description}
                </p>

                {/* Partner Info */}
                <div className="space-y-2 mb-4">
                  {partner.location && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <MapPin className="w-4 h-4" />
                      <span>{partner.location}</span>
                    </div>
                  )}
                  
                  {partner.phone && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Phone className="w-4 h-4" />
                      <span>{partner.phone}</span>
                    </div>
                  )}
                  
                  {partner.email && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Mail className="w-4 h-4" />
                      <span>{partner.email}</span>
                    </div>
                  )}
                  
                  {partner.website && (
                    <div className="flex items-center space-x-2 text-sm text-gray-600">
                      <Globe className="w-4 h-4" />
                      <a 
                        href={partner.website} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="text-primary-600 hover:text-primary-700"
                      >
                        Visitar sitio web
                      </a>
                    </div>
                  )}
                </div>

                {/* Discounts Preview */}
                {partner.discounts && partner.discounts.length > 0 && (
                  <div className="border-t border-gray-200 pt-4">
                    <h4 className="text-sm font-medium text-gray-900 mb-2">
                      Ofertas Disponibles
                    </h4>
                    <div className="space-y-2">
                      {partner.discounts.slice(0, 3).map((discount, index) => (
                        <div key={index} className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">{discount.name}</span>
                          <span className="font-medium text-success-600">
                            {discount.discount}% desc.
                          </span>
                        </div>
                      ))}
                      {partner.discounts.length > 3 && (
                        <p className="text-xs text-gray-500 text-center">
                          +{partner.discounts.length - 3} ofertas más
                        </p>
                      )}
                    </div>
                  </div>
                )}

                {/* Contact Button */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <button className="btn-secondary w-full text-center text-sm">
                    Contactar
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        /* Empty State */
        <div className="card text-center py-12">
          <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterType !== 'all' ? 'No se encontraron aliados' : 'No hay aliados disponibles'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterType !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Estamos trabajando para agregar más aliados comerciales'
            }
          </p>
          {(searchTerm || filterType !== 'all') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setFilterType('all');
              }}
              className="btn-primary inline-flex items-center space-x-2"
            >
              <span>Limpiar Filtros</span>
            </button>
          )}
        </div>
      )}

      {/* Become a Partner Section */}
      <div className="mt-16">
        <div className="card bg-gradient-to-r from-primary-50 to-secondary-50 border-primary-200">
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              ¿Quieres ser nuestro aliado?
            </h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Únete a nuestra red de aliados comerciales y accede a miles de usuarios 
              que buscan los mejores servicios para sus mascotas.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <button className="btn-primary">
                Solicitar Información
              </button>
              <button className="btn-secondary">
                Descargar Brochure
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Partner Types Info */}
      <div className="mt-16">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Tipos de Alianzas
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="card text-center">
            <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-blue-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Veterinarias</h3>
            <p className="text-gray-600 text-sm">
              Clínicas veterinarias, especialistas y servicios de emergencia 
              con descuentos exclusivos para nuestros usuarios premium.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Gift className="w-8 h-8 text-green-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Farmacias</h3>
            <p className="text-gray-600 text-sm">
              Farmacias veterinarias, medicamentos, alimentos especiales 
              y productos de cuidado con ofertas preferenciales.
            </p>
          </div>

          <div className="card text-center">
            <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Shield className="w-8 h-8 text-purple-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Seguros</h3>
            <p className="text-gray-600 text-sm">
              Aseguradoras especializadas en mascotas con cobertura completa 
              y precios preferenciales para usuarios premium.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Partners;
