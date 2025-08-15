import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { usePet } from '../contexts/PetContext';
import { 
  ArrowLeft, 
  Edit, 
  Trash2, 
  Plus, 
  PawPrint, 
  Calendar, 
  FileText,
  AlertTriangle,
  CheckCircle,
  Download,
  X
} from 'lucide-react';

const PetDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { getPetById, deletePet, deleteDocument } = usePet();
  const [pet, setPet] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDocumentDeleteModal, setShowDocumentDeleteModal] = useState(false);
  const [documentToDelete, setDocumentToDelete] = useState(null);

  useEffect(() => {
    loadPet();
  }, [id]);

  const loadPet = async () => {
    try {
      const petData = await getPetById(id);
      if (petData) {
        setPet(petData);
      } else {
        navigate('/pets');
      }
    } catch (error) {
      console.error('Error loading pet:', error);
      navigate('/pets');
    } finally {
      setLoading(false);
    }
  };

  const handleDeletePet = async () => {
    try {
      await deletePet(id);
      navigate('/pets');
    } catch (error) {
      console.error('Error deleting pet:', error);
    }
  };

  const handleDeleteDocument = async () => {
    if (documentToDelete) {
      try {
        await deleteDocument(id, documentToDelete.id);
        setShowDocumentDeleteModal(false);
        setDocumentToDelete(null);
        await loadPet(); // Reload pet data
      } catch (error) {
        console.error('Error deleting document:', error);
      }
    }
  };

  const getUpcomingVaccines = () => {
    if (!pet?.vaccines) return [];
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    return pet.vaccines.filter(vaccine => 
      vaccine.nextDose && new Date(vaccine.nextDose) <= thirtyDaysFromNow
    ).sort((a, b) => new Date(a.nextDose) - new Date(b.nextDose));
  };

  const getActiveTreatments = () => {
    if (!pet?.treatments) return [];
    return pet.treatments.filter(treatment => !treatment.endDate);
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

  if (!pet) {
    return (
      <div className="page-container">
        <div className="text-center py-20">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">Mascota no encontrada</h2>
          <p className="text-gray-600 mb-6">La mascota que buscas no existe o ha sido eliminada.</p>
          <Link to="/pets" className="btn-primary">
            Volver a Mis Mascotas
          </Link>
        </div>
      </div>
    );
  }

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
        
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div className="flex items-center space-x-4 mb-4 sm:mb-0">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
              <PawPrint className="w-8 h-8 text-primary-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{pet.name}</h1>
              <p className="text-gray-600">{pet.breed} • {pet.species}</p>
            </div>
          </div>
          
          <div className="flex space-x-3">
            <Link
              to={`/pets/${id}/edit`}
              className="btn-secondary inline-flex items-center space-x-2"
            >
              <Edit className="w-4 h-4" />
              <span>Editar</span>
            </Link>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="btn-danger inline-flex items-center space-x-2"
            >
              <Trash2 className="w-4 h-4" />
              <span>Eliminar</span>
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-6">
          {/* Basic Information */}
          <div className="card">
            <h2 className="text-xl font-semibold text-gray-900 mb-4">Información Básica</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="text-sm font-medium text-gray-600">Nombre</label>
                <p className="text-gray-900">{pet.name}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Especie</label>
                <p className="text-gray-900">{pet.species}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Raza</label>
                <p className="text-gray-900">{pet.breed}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Edad</label>
                <p className="text-gray-900">{pet.age} años</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Sexo</label>
                <p className="text-gray-900">{pet.sex}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-600">Registrado</label>
                <p className="text-gray-900">
                  {pet.createdAt ? new Date(pet.createdAt).toLocaleDateString('es-CL') : 'No especificada'}
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Vaccines Alert */}
          {getUpcomingVaccines().length > 0 && (
            <div className="card border-warning-200 bg-warning-50">
              <div className="flex items-center space-x-3 mb-4">
                <AlertTriangle className="w-6 h-6 text-warning-600" />
                <h3 className="text-lg font-semibold text-warning-800">Próximas Vacunas</h3>
              </div>
              <div className="space-y-2">
                {getUpcomingVaccines().map((vaccine, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-white rounded-lg border border-warning-200">
                    <div>
                      <p className="font-medium text-gray-900">{vaccine.name}</p>
                      <p className="text-sm text-gray-600">
                        Próxima dosis: {new Date(vaccine.nextDose).toLocaleDateString('es-CL')}
                      </p>
                    </div>
                    <span className="text-sm text-warning-600 font-medium">
                      {Math.ceil((new Date(vaccine.nextDose) - new Date()) / (1000 * 60 * 60 * 24))} días
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Active Treatments */}
          {getActiveTreatments().length > 0 && (
            <div className="card border-info-200 bg-info-50">
              <div className="flex items-center space-x-3 mb-4">
                <Calendar className="w-6 h-6 text-info-600" />
                <h3 className="text-lg font-semibold text-info-800">Tratamientos Activos</h3>
              </div>
              <div className="space-y-3">
                {getActiveTreatments().map((treatment, index) => (
                  <div key={index} className="p-3 bg-white rounded-lg border border-info-200">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{treatment.name}</h4>
                      <span className="text-sm text-info-600">
                        Iniciado: {new Date(treatment.startDate).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{treatment.description}</p>
                    {treatment.instructions && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Instrucciones:</strong> {treatment.instructions}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Vaccines History */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Historial de Vacunas</h2>
              <Link
                to={`/pets/${id}/vaccines/add`}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Vacuna</span>
              </Link>
            </div>
            
            {pet.vaccines && pet.vaccines.length > 0 ? (
              <div className="space-y-3">
                {pet.vaccines.map((vaccine, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div>
                      <p className="font-medium text-gray-900">{vaccine.name}</p>
                      <p className="text-sm text-gray-600">
                        Aplicada: {new Date(vaccine.date).toLocaleDateString('es-CL')}
                      </p>
                      {vaccine.nextDose && (
                        <p className="text-sm text-gray-600">
                          Próxima: {new Date(vaccine.nextDose).toLocaleDateString('es-CL')}
                        </p>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-success-500" />
                      <span className="text-sm text-success-600">Aplicada</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No hay vacunas registradas</p>
            )}
          </div>

          {/* Medical History */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Historial Médico</h2>
              <Link
                to={`/pets/${id}/diseases/add`}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Agregar Enfermedad</span>
              </Link>
            </div>
            
            {pet.diseases && pet.diseases.length > 0 ? (
              <div className="space-y-3">
                {pet.diseases.map((disease, index) => (
                  <div key={index} className="p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="font-medium text-gray-900">{disease.name}</h4>
                      <span className="text-sm text-gray-600">
                        {new Date(disease.diagnosisDate).toLocaleDateString('es-CL')}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600">{disease.description}</p>
                    {disease.treatment && (
                      <p className="text-sm text-gray-600 mt-2">
                        <strong>Tratamiento:</strong> {disease.treatment}
                      </p>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No hay enfermedades registradas</p>
            )}
          </div>

          {/* Documents */}
          <div className="card">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">Documentos</h2>
              <Link
                to={`/pets/${id}/documents/add`}
                className="btn-primary inline-flex items-center space-x-2"
              >
                <Plus className="w-4 h-4" />
                <span>Subir Documento</span>
              </Link>
            </div>
            
            {pet.documents && pet.documents.length > 0 ? (
              <div className="space-y-3">
                {pet.documents.map((document, index) => (
                  <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <FileText className="w-5 h-5 text-gray-600" />
                      <div>
                        <p className="font-medium text-gray-900">{document.name}</p>
                        <p className="text-sm text-gray-600">
                          {document.type} • {new Date(document.uploadedAt).toLocaleDateString('es-CL')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <a
                        href={document.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 text-gray-400 hover:text-primary-600 transition-colors duration-200"
                        title="Ver documento"
                      >
                        <Download className="w-4 h-4" />
                      </a>
                      <button
                        onClick={() => {
                          setDocumentToDelete(document);
                          setShowDocumentDeleteModal(true);
                        }}
                        className="p-2 text-gray-400 hover:text-danger-600 transition-colors duration-200"
                        title="Eliminar documento"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center py-6">No hay documentos subidos</p>
            )}
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Pet Photo */}
          {pet.photo && (
            <div className="card">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Foto</h3>
              <img
                src={pet.photo}
                alt={pet.name}
                className="w-full h-48 object-cover rounded-lg"
              />
            </div>
          )}

          {/* Quick Stats */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Estadísticas</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Vacunas aplicadas</span>
                <span className="font-medium">{pet.vaccines?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Enfermedades</span>
                <span className="font-medium">{pet.diseases?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Tratamientos</span>
                <span className="font-medium">{pet.treatments?.length || 0}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Documentos</span>
                <span className="font-medium">{pet.documents?.length || 0}</span>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Acciones Rápidas</h3>
            <div className="space-y-3">
              <Link
                to={`/pets/${id}/vaccines/add`}
                className="w-full btn-secondary text-center text-sm"
              >
                Agregar Vacuna
              </Link>
              <Link
                to={`/pets/${id}/diseases/add`}
                className="w-full btn-secondary text-center text-sm"
              >
                Registrar Enfermedad
              </Link>
              <Link
                to={`/pets/${id}/treatments/add`}
                className="w-full btn-secondary text-center text-sm"
              >
                Agregar Tratamiento
              </Link>
              <Link
                to={`/pets/${id}/documents/add`}
                className="w-full btn-secondary text-center text-sm"
              >
                Subir Documento
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Delete Pet Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar a <strong>{pet.name}</strong>? 
              Esta acción no se puede deshacer y se eliminarán todos los datos asociados.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeletePet}
                className="btn-danger flex-1"
              >
                Eliminar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Delete Document Modal */}
      {showDocumentDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Confirmar Eliminación
            </h3>
            <p className="text-gray-600 mb-6">
              ¿Estás seguro de que quieres eliminar el documento <strong>{documentToDelete?.name}</strong>? 
              Esta acción no se puede deshacer.
            </p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowDocumentDeleteModal(false)}
                className="btn-secondary flex-1"
              >
                Cancelar
              </button>
              <button
                onClick={handleDeleteDocument}
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

export default PetDetail;
