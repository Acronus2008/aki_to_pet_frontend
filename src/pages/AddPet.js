import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { usePet } from '../contexts/PetContext';
import { 
  ArrowLeft, 
  Upload, 
  X, 
  PawPrint,
  AlertCircle
} from 'lucide-react';

const AddPet = () => {
  const [isLoading, setIsLoading] = useState(false);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [photoPreview, setPhotoPreview] = useState(null);
  const { addPet } = usePet();
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors },
    setError,
    watch
  } = useForm();

  const species = watch('species');

  const speciesOptions = [
    { value: 'perro', label: 'Perro' },
    { value: 'gato', label: 'Gato' },
    { value: 'ave', label: 'Ave' },
    { value: 'reptil', label: 'Reptil' },
    { value: 'roedor', label: 'Roedor' },
    { value: 'pez', label: 'Pez' },
    { value: 'otro', label: 'Otro' }
  ];

  const sexOptions = [
    { value: 'macho', label: 'Macho' },
    { value: 'hembra', label: 'Hembra' }
  ];

  const handlePhotoChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        setError('photo', {
          type: 'manual',
          message: 'La imagen debe ser menor a 5MB'
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setError('photo', {
          type: 'manual',
          message: 'Por favor selecciona un archivo de imagen válido'
        });
        return;
      }

      setSelectedPhoto(file);
      setPhotoPreview(URL.createObjectURL(file));
      setError('photo', { type: 'manual', message: '' });
    }
  };

  const removePhoto = () => {
    setSelectedPhoto(null);
    setPhotoPreview(null);
    if (document.getElementById('photo')) {
      document.getElementById('photo').value = '';
    }
  };

  const onSubmit = async (data) => {
    setIsLoading(true);
    
    try {
      const petData = {
        ...data,
        age: parseInt(data.age),
        photo: selectedPhoto ? selectedPhoto : null
      };

      const petId = await addPet(petData);
      navigate(`/pets/${petId}`);
    } catch (error) {
      setError('root', {
        type: 'manual',
        message: 'Error al agregar la mascota. Por favor, intenta nuevamente.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate(-1)}
          className="inline-flex items-center space-x-2 text-gray-600 hover:text-gray-900 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Volver</span>
        </button>
        <h1 className="section-title">Agregar Nueva Mascota</h1>
        <p className="text-gray-600">
          Completa la información de tu mascota para comenzar a gestionar su salud
        </p>
      </div>

      <div className="max-w-2xl">
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Información Básica</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Name */}
              <div className="md:col-span-2">
                <label htmlFor="name" className="form-label">
                  Nombre de la Mascota *
                </label>
                <input
                  id="name"
                  type="text"
                  className={`input-field ${
                    errors.name ? 'border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  placeholder="Ej: Luna, Max, Rocky"
                  {...register('name', {
                    required: 'El nombre es requerido',
                    minLength: {
                      value: 2,
                      message: 'El nombre debe tener al menos 2 caracteres'
                    }
                  })}
                />
                {errors.name && (
                  <p className="mt-1 text-sm text-danger-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.name.message}
                  </p>
                )}
              </div>

              {/* Species */}
              <div>
                <label htmlFor="species" className="form-label">
                  Especie *
                </label>
                <select
                  id="species"
                  className={`input-field ${
                    errors.species ? 'border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  {...register('species', {
                    required: 'La especie es requerida'
                  })}
                >
                  <option value="">Seleccionar especie</option>
                  {speciesOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.species && (
                  <p className="mt-1 text-sm text-danger-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.species.message}
                  </p>
                )}
              </div>

              {/* Breed */}
              <div>
                <label htmlFor="breed" className="form-label">
                  Raza *
                </label>
                <input
                  id="breed"
                  type="text"
                  className={`input-field ${
                    errors.breed ? 'border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  placeholder="Ej: Golden Retriever, Persa"
                  {...register('breed', {
                    required: 'La raza es requerida'
                  })}
                />
                {errors.breed && (
                  <p className="mt-1 text-sm text-danger-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.breed.message}
                  </p>
                )}
              </div>

              {/* Age */}
              <div>
                <label htmlFor="age" className="form-label">
                  Edad (años) *
                </label>
                <input
                  id="age"
                  type="number"
                  min="0"
                  max="30"
                  className={`input-field ${
                    errors.age ? 'border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  placeholder="0"
                  {...register('age', {
                    required: 'La edad es requerida',
                    min: {
                      value: 0,
                      message: 'La edad no puede ser negativa'
                    },
                    max: {
                      value: 30,
                      message: 'La edad no puede ser mayor a 30 años'
                    }
                  })}
                />
                {errors.age && (
                  <p className="mt-1 text-sm text-danger-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.age.message}
                  </p>
                )}
              </div>

              {/* Sex */}
              <div>
                <label htmlFor="sex" className="form-label">
                  Sexo *
                </label>
                <select
                  id="sex"
                  className={`input-field ${
                    errors.sex ? 'border-danger-500 focus:ring-danger-500' : ''
                  }`}
                  {...register('sex', {
                    required: 'El sexo es requerido'
                  })}
                >
                  <option value="">Seleccionar sexo</option>
                  {sexOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
                {errors.sex && (
                  <p className="mt-1 text-sm text-danger-600 flex items-center">
                    <AlertCircle className="w-4 h-4 mr-1" />
                    {errors.sex.message}
                  </p>
                )}
              </div>
            </div>
          </div>

          {/* Photo Upload */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Foto de la Mascota</h3>
            <p className="text-sm text-gray-600 mb-4">
              Sube una foto de tu mascota (opcional). Formatos: JPG, PNG. Máximo 5MB.
            </p>

            {!photoPreview ? (
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <label htmlFor="photo" className="cursor-pointer">
                  <span className="text-primary-600 hover:text-primary-700 font-medium">
                    Haz clic para subir una foto
                  </span>
                  <span className="text-gray-500"> o arrastra y suelta</span>
                </label>
                <input
                  id="photo"
                  type="file"
                  accept="image/*"
                  onChange={handlePhotoChange}
                  className="hidden"
                />
              </div>
            ) : (
              <div className="relative">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-full h-64 object-cover rounded-lg"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center hover:bg-red-600 transition-colors duration-200"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {errors.photo && (
              <p className="mt-2 text-sm text-danger-600 flex items-center">
                <AlertCircle className="w-4 h-4 mr-1" />
                {errors.photo.message}
              </p>
            )}
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

          {/* Submit Buttons */}
          <div className="flex space-x-4">
            <button
              type="button"
              onClick={() => navigate(-1)}
              className="btn-secondary flex-1"
              disabled={isLoading}
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="btn-primary flex-1"
            >
              {isLoading ? (
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                  Agregando mascota...
                </div>
              ) : (
                <div className="flex items-center justify-center space-x-2">
                  <PawPrint className="w-4 h-4" />
                  <span>Agregar Mascota</span>
                </div>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddPet;
