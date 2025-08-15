import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { usePet } from '../contexts/PetContext';
import { usePremium } from '../contexts/PremiumContext';
import { 
  Plus, 
  PawPrint, 
  Calendar, 
  Crown, 
  AlertTriangle,
  ArrowRight,
  Users,
  Gift,
  CheckCircle
} from 'lucide-react';

const Dashboard = () => {
  const { userProfile } = useAuth();
  const { pets, getUpcomingVaccines } = usePet();
  const { isPremiumActive, getUserPremiumStats } = usePremium();

  const upcomingVaccines = getUpcomingVaccines();
  const premiumStats = getUserPremiumStats();

  return (
    <div className="page-container">
      {/* Welcome Header */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">
          ¡Hola, {userProfile?.name || 'Usuario'}! 👋
        </h1>
        <p className="text-gray-600 mt-2">
          Bienvenido a tu dashboard de AkiToPet
        </p>
      </div>

      {/* Premium Status Banner */}
      {!isPremiumActive() && (
        <div className="bg-gradient-to-r from-yellow-400 to-orange-400 rounded-xl p-6 mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8 text-white" />
              <div>
                <h3 className="text-lg font-semibold text-white">
                  ¡Desbloquea beneficios Premium!
                </h3>
                <p className="text-yellow-100">
                  Accede a descuentos exclusivos en veterinarias, farmacias y seguros
                </p>
              </div>
            </div>
            <Link
              to="/premium"
              className="bg-white text-orange-600 px-6 py-2 rounded-lg font-medium hover:bg-gray-100 transition-colors duration-200"
            >
              Ver Plan
            </Link>
          </div>
        </div>
      )}

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Mascotas</p>
              <p className="text-2xl font-bold text-gray-900">{pets.length}</p>
            </div>
            <div className="w-12 h-12 bg-primary-100 rounded-lg flex items-center justify-center">
              <PawPrint className="w-6 h-6 text-primary-600" />
            </div>
          </div>
        </div>

        <div className="card">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600">Próximas Vacunas</p>
              <p className="text-2xl font-bold text-gray-900">{upcomingVaccines.length}</p>
            </div>
            <div className="w-12 h-12 bg-warning-100 rounded-lg flex items-center justify-center">
              <Calendar className="w-6 h-6 text-warning-600" />
            </div>
          </div>
        </div>

        {isPremiumActive() && (
          <>
            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Descuentos Canjeados</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {premiumStats?.totalClaimed || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-success-100 rounded-lg flex items-center justify-center">
                  <Gift className="w-6 h-6 text-success-600" />
                </div>
              </div>
            </div>

            <div className="card">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Ahorro Estimado</p>
                  <p className="text-2xl font-bold text-gray-900">
                    ${premiumStats?.estimatedSavings?.toLocaleString() || 0}
                  </p>
                </div>
                <div className="w-12 h-12 bg-secondary-100 rounded-lg flex items-center justify-center">
                  <Crown className="w-6 h-6 text-secondary-600" />
                </div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
          <div className="space-y-3">
            <Link
              to="/pets/add"
              className="flex items-center justify-between p-3 bg-primary-50 rounded-lg hover:bg-primary-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <Plus className="w-5 h-5 text-primary-600" />
                <span className="font-medium text-primary-700">Agregar Mascota</span>
              </div>
              <ArrowRight className="w-4 h-4 text-primary-600" />
            </Link>

            <Link
              to="/pets"
              className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <PawPrint className="w-5 h-5 text-gray-600" />
                <span className="font-medium text-gray-700">Ver Mis Mascotas</span>
              </div>
              <ArrowRight className="w-4 h-4 text-gray-600" />
            </Link>

            {isPremiumActive() && (
              <Link
                to="/premium"
                className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg hover:bg-yellow-100 transition-colors duration-200"
              >
                <div className="flex items-center space-x-3">
                  <Crown className="w-5 h-5 text-yellow-600" />
                  <span className="font-medium text-yellow-700">Ver Beneficios Premium</span>
                </div>
                <ArrowRight className="w-4 h-4 text-yellow-600" />
              </Link>
            )}
          </div>
        </div>

        <div className="card">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Estado de Suscripción</h3>
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Plan Actual:</span>
              <span className={`font-medium ${isPremiumActive() ? 'text-success-600' : 'text-gray-900'}`}>
                {isPremiumActive() ? 'Premium' : 'Gratuito'}
              </span>
            </div>
            
            {isPremiumActive() && (
              <>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Estado:</span>
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-success-100 text-success-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Activo
                  </span>
                </div>
                
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Próxima Renovación:</span>
                  <span className="font-medium text-gray-900">
                    {userProfile?.premiumExpiry ? 
                      new Date(userProfile.premiumExpiry).toLocaleDateString('es-CL') : 
                      'No especificada'
                    }
                  </span>
                </div>
              </>
            )}

            {!isPremiumActive() && (
              <Link
                to="/premium"
                className="btn-primary w-full text-center"
              >
                Actualizar a Premium
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Upcoming Vaccines */}
      {upcomingVaccines.length > 0 && (
        <div className="card mb-8">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Próximas Vacunas</h3>
            <Link
              to="/pets"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver todas
            </Link>
          </div>
          
          <div className="space-y-3">
            {upcomingVaccines.slice(0, 5).map((vaccine) => (
              <div
                key={`${vaccine.petId}-${vaccine.vaccineName}`}
                className="flex items-center justify-between p-3 bg-warning-50 rounded-lg border border-warning-200"
              >
                <div className="flex items-center space-x-3">
                  <AlertTriangle className="w-5 h-5 text-warning-600" />
                  <div>
                    <p className="font-medium text-gray-900">
                      {vaccine.petName} - {vaccine.vaccineName}
                    </p>
                    <p className="text-sm text-gray-600">
                      {vaccine.daysUntil === 0 ? 'Hoy' : 
                       vaccine.daysUntil === 1 ? 'Mañana' : 
                       `En ${vaccine.daysUntil} días`}
                    </p>
                  </div>
                </div>
                <Link
                  to={`/pets/${vaccine.petId}`}
                  className="text-primary-600 hover:text-primary-700 text-sm font-medium"
                >
                  Ver detalles
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Recent Pets */}
      {pets.length > 0 && (
        <div className="card">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold text-gray-900">Mis Mascotas</h3>
            <Link
              to="/pets"
              className="text-primary-600 hover:text-primary-700 text-sm font-medium"
            >
              Ver todas
            </Link>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {pets.slice(0, 6).map((pet) => (
              <Link
                key={pet.id}
                to={`/pets/${pet.id}`}
                className="block p-4 border border-gray-200 rounded-lg hover:border-primary-300 hover:shadow-md transition-all duration-200"
              >
                <div className="flex items-center space-x-3">
                  <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                    <PawPrint className="w-6 h-6 text-primary-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">{pet.name}</h4>
                    <p className="text-sm text-gray-600">
                      {pet.species} • {pet.breed}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {pets.length === 0 && (
        <div className="card text-center py-12">
          <PawPrint className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            No tienes mascotas registradas
          </h3>
          <p className="text-gray-600 mb-6">
            Comienza agregando tu primera mascota para aprovechar todas las funcionalidades
          </p>
          <Link
            to="/pets/add"
            className="btn-primary inline-flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Agregar Primera Mascota</span>
          </Link>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
