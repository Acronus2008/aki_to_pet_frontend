import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { usePet } from '../contexts/PetContext';
import { 
  Plus, 
  Search, 
  Filter, 
  PawPrint, 
  Edit, 
  Trash2, 
  Eye,
  Calendar,
  AlertTriangle
} from 'lucide-react';

const Pets = () => {
  const { pets, loading, deletePet } = usePet();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterSpecies, setFilterSpecies] = useState('all');
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [petToDelete, setPetToDelete] = useState(null);

  const filteredPets = pets.filter(pet => {
    const matchesSearch = pet.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pet.breed.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesSpecies = filterSpecies === 'all' || pet.species === filterSpecies;
    return matchesSearch && matchesSpecies;
  });

  const speciesOptions = ['all', ...Array.from(new Set(pets.map(pet => pet.species)))];

  const handleDeleteClick = (pet) => {
    setPetToDelete(pet);
    setShowDeleteModal(true);
  };

  const confirmDelete = async () => {
    if (petToDelete) {
      try {
        await deletePet(petToDelete.id);
        setShowDeleteModal(false);
        setPetToDelete(null);
      } catch (error) {
        console.error('Error deleting pet:', error);
      }
    }
  };

  const getUpcomingVaccines = (pet) => {
    if (!pet.vaccines) return 0;
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return pet.vaccines.filter(vaccine => 
      vaccine.nextDose && new Date(vaccine.nextDose) <= thirtyDaysFromNow
    ).length;
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
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
        <div>
          <h1 className="section-title">Mis Mascotas</h1>
          <p className="text-gray-600">
            Gestiona toda la información de tus mascotas en un solo lugar
          </p>
        </div>
        <Link
          to="/pets/add"
          className="btn-primary inline-flex items-center space-x-2 mt-4 sm:mt-0"
        >
          <Plus className="w-4 h-4" />
          <span>Agregar Mascota</span>
        </Link>
      </div>

      {/* Search and Filters */}
      <div className="card mb-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar por nombre o raza..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input-field pl-10"
            />
          </div>
          <div className="relative">
            <Filter className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
            <select
              value={filterSpecies}
              onChange={(e) => setFilterSpecies(e.target.value)}
              className="input-field pl-10"
            >
              {speciesOptions.map(species => (
                <option key={species} value={species}>
                  {species === 'all' ? 'Todas las especies' : species}
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      {/* Pets Grid */}
      {filteredPets.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPets.map((pet) => (
            <div key={pet.id} className="card hover:shadow-lg transition-shadow duration-200">
              {/* Pet Header */}
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <PawPrint className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h3 className="font-semibold text-gray-900">{pet.name}</h3>
                    <p className="text-sm text-gray-600">{pet.breed}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <Link
                    to={`/pets/${pet.id}`}
                    className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                    title="Ver detalles"
                  >
                    <Eye className="w-4 h-4" />
                  </Link>
                  <Link
                    to={`/pets/${pet.id}/edit`}
                    className="p-2 text-gray-400 hover:text-warning-600 transition-colors duration-200"
                    title="Editar"
                  >
                    <Edit className="w-4 h-4" />
                  </Link>
                  <button
                    onClick={() => handleDeleteClick(pet)}
                    className="p-2 text-gray-400 hover:text-danger-600 transition-colors duration-200"
                    title="Eliminar"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              {/* Pet Info */}
              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Especie:</span>
                  <span className="font-medium text-gray-900">{pet.species}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Edad:</span>
                  <span className="font-medium text-gray-900">{pet.age} años</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-600">Sexo:</span>
                  <span className="font-medium text-gray-900">{pet.sex}</span>
                </div>
              </div>

              {/* Alerts */}
              <div className="space-y-2">
                {getUpcomingVaccines(pet) > 0 && (
                  <div className="flex items-center space-x-2 p-2 bg-warning-50 rounded-lg border border-warning-200">
                    <AlertTriangle className="w-4 h-4 text-warning-600" />
                    <span className="text-sm text-warning-800">
                      {getUpcomingVaccines(pet)} vacuna(s) próxima(s)
                    </span>
                  </div>
                )}
                
                {pet.treatments && pet.treatments.filter(t => !t.endDate).length > 0 && (
                  <div className="flex items-center space-x-2 p-2 bg-info-50 rounded-lg border border-info-200">
                    <Calendar className="w-4 h-4 text-info-600" />
                    <span className="text-sm text-info-800">
                      Tratamiento activo
                    </span>
                  </div>
                )}
              </div>

              {/* View Details Button */}
              <div className="mt-4 pt-4 border-t border-gray-200">
                <Link
                  to={`/pets/${pet.id}`}
                  className="btn-secondary w-full text-center text-sm"
                >
                  Ver Detalles Completos
                </Link>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* Empty State */
        <div className="card text-center py-12">
          <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {searchTerm || filterSpecies !== 'all' ? 'No se encontraron mascotas' : 'No tienes mascotas registradas'}
          </h3>
          <p className="text-gray-600 mb-6">
            {searchTerm || filterSpecies !== 'all' 
              ? 'Intenta ajustar los filtros de búsqueda'
              : 'Comienza agregando tu primera mascota para aprovechar todas las funcionalidades'
            }
          </p>
          <Link
            to="/pets/add"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Mascota</span>
          </Link>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar a <strong>{petToDelete?.name}</strong>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={confirmDelete}
                className="btn-danger flex-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pets;
