import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../contexts/AuthContext';
import { 
  User, 
  Mail, 
  Phone, 
  MapPin, 
  Save, 
  Edit, 
  X,
  AlertCircle,
  CheckCircle
} from 'lucide-react';

const Profile = () => {
  const { userProfile, updateUserProfile } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    reset
  } = useForm({
    defaultValues: {
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || ''
    }
  });

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      await updateUserProfile(userProfile.uid, data);
      setIsEditing(false);
      reset(data);
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Error al actualizar el perfil. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({
      name: userProfile?.name || '',
      phone: userProfile?.phone || '',
      address: userProfile?.address || ''
    });
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <h1 className="section-title">Mi Perfil</h1>
        <p className="text-gray-600">
          Gestiona tu información personal y configuración de cuenta
        </p>
      </div>

      <div className="max-w-2xl">
        {/* Profile Information */}
        <div className="card mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-semibold text-gray-900">Información Personal</h2>
            {!isEditing && (
              <button
                onClick={handleEdit}
                className="btn-secondary inline-flex items-center space-x-2"
              >
                <Edit className="w-4 h-4" />
                <span>Editar</span>
              </button>
            )}
          </div>

          {isEditing ? (
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              {/* Name */}
              <div>
                <label htmlFor="name" className="form-label">
                  Nombre Completo *
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="name"
                    type="text"
                    className={`input-field pl-10 ${
                      errors.name ? 'border-danger-500 focus:ring-danger-500' : ''
                    }`}
                    placeholder="Tu nombre completo"
                    {...register('name', {
                      required: 'El nombre es requerido',
                      minLength: {
                        value: 2,
                        message: 'El nombre debe tener al menos 2 caracteres'
                      }
                    })}
                  />
                </div>
                {errors.name && (
                  <p className="mt-1 text-sm text-danger-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Email (Read-only) */}
              <div>
                <label htmlFor="email" className="form-label">
                  Email
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    type="email"
                    value={userProfile?.email || ''}
                    disabled
                    className="input-field pl-10 bg-gray-50 cursor-not-allowed"
                  />
                </div>
                <p className="mt-1 text-sm text-gray-500">
                  El email no se puede modificar desde esta vista
                </p>
              </div>

              {/* Phone */}
              <div>
                <label htmlFor="phone" className="form-label">
                  Teléfono
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Phone className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="phone"
                    type="tel"
                    className="input-field pl-10"
                    placeholder="+56 9 1234 5678"
                    {...register('phone')}
                  />
                </div>
              </div>

              {/* Address */}
              <div>
                <label htmlFor="address" className="form-label">
                  Dirección
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <MapPin className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="address"
                    type="text"
                    className="input-field pl-10"
                    placeholder="Tu dirección"
                    {...register('address')}
                  />
                </div>
              </div>

              {/* Error Message */}
              {errors.root && (
                <div className="bg-danger-50 border border-danger-200 rounded-md p-4">
                  <div className="flex">
                    <AlertCircle className="h-5 w-5 text-danger-400" />
                    <div className="ml-3">
                      <p className="text-sm text-danger-800">
                        {errors.root.message}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  type="button"
                  onClick={handleCancel}
                  className="btn-secondary flex-1"
                  disabled={isLoading}
                >
                  <X className="w-4 h-4 mr-2" />
                  Cancelar
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className="btn-primary flex-1"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                      Guardando...
                    </div>
                  ) : (
                    <>
                      <Save className="w-4 h-4 mr-2" />
                      Guardar Cambios
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            /* Display Mode */
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <User className="w-6 h-6 text-primary-600" />
                </div>
                <div>
                  <h3 className="font-medium text-gray-900">{userProfile?.name || 'Sin nombre'}</h3>
                  <p className="text-sm text-gray-500">Usuario</p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-gray-600">Email</label>
                  <p className="text-gray-900">{userProfile?.email || 'No especificado'}</p>
                </div>
                
                <div>
                  <label className="text-sm font-medium text-gray-600">Teléfono</label>
                  <p className="text-gray-900">{userProfile?.phone || 'No especificado'}</p>
                </div>
                
                <div className="md:col-span-2">
                  <label className="text-sm font-medium text-gray-600">Dirección</label>
                  <p className="text-gray-900">{userProfile?.address || 'No especificada'}</p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Account Information */}
        <div className="card mb-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Información de la Cuenta</h2>
          
          <div className="space-y-4">
            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Estado de la Cuenta</p>
                <p className="text-sm text-gray-600">Cuenta verificada y activa</p>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-success-500" />
                <span className="text-sm text-success-600 font-medium">Activa</span>
              </div>
            </div>

            <div className="flex items-center justify-between py-3 border-b border-gray-200">
              <div>
                <p className="font-medium text-gray-900">Plan de Suscripción</p>
                <p className="text-sm text-gray-600">
                  {userProfile?.isPremium ? 'Premium' : 'Gratuito'}
                </p>
              </div>
              <div className="flex items-center space-x-2">
                {userProfile?.isPremium ? (
                  <>
                    <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                    <span className="text-sm text-yellow-600 font-medium">Premium</span>
                  </>
                ) : (
                  <span className="text-sm text-gray-500">Gratuito</span>
                )}
              </div>
            </div>

            <div className="flex items-center justify-between py-3">
              <div>
                <p className="font-medium text-gray-900">Fecha de Registro</p>
                <p className="text-sm text-gray-600">
                  {userProfile?.createdAt ? 
                    new Date(userProfile.createdAt).toLocaleDateString('es-CL') : 
                    'No especificada'
                  }
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Account Actions */}
        <div className="card">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Acciones de Cuenta</h2>
          
          <div className="space-y-3">
            <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              Cambiar Contraseña
            </button>
            
            <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              Configuración de Notificaciones
            </button>
            
            <button className="w-full text-left p-3 text-gray-700 hover:bg-gray-50 rounded-lg transition-colors duration-200">
              Exportar Mis Datos
            </button>
            
            <button className="w-full text-left p-3 text-red-600 hover:bg-red-50 rounded-lg transition-colors duration-200">
              Eliminar Cuenta
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
