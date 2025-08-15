import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { 
  PawPrint, 
  Shield, 
  Gift, 
  Users, 
  Calendar, 
  FileText,
  CheckCircle,
  ArrowRight
} from 'lucide-react';

const Home = () => {
  const { currentUser } = useAuth();

  const features = [
    {
      icon: PawPrint,
      title: 'Gestión de Mascotas',
      description: 'Registra y mantén toda la información de tus mascotas en un solo lugar.'
    },
    {
      icon: Calendar,
      title: 'Recordatorios',
      description: 'Recibe notificaciones de vacunas, tratamientos y citas veterinarias.'
    },
    {
      icon: FileText,
      title: 'Historial Médico',
      description: 'Mantén un registro completo de la salud y tratamientos de tu mascota.'
    },
    {
      icon: Gift,
      title: 'Beneficios Premium',
      description: 'Accede a descuentos exclusivos en veterinarias, farmacias y seguros.'
    }
  ];

  const premiumBenefits = [
    'Descuentos en consultas veterinarias',
    'Ofertas especiales en farmacias',
    'Seguros para mascotas con precios preferenciales',
    'Acceso a veterinarios de emergencia 24/7',
    'Programa de recompensas por puntos',
    'Soporte prioritario'
  ];

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-primary-50 to-secondary-50 py-20">
        <div className="page-container">
          <div className="text-center max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold text-gray-900 mb-6">
              Cuida a tu{' '}
              <span className="text-gradient">mejor amigo</span>
              <br />
              como se merece
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
              AkiToPet es la plataforma líder en Chile para la gestión integral de mascotas. 
              Registra, cuida y obtén beneficios exclusivos para tu compañero peludo.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              {currentUser ? (
                <Link
                  to="/dashboard"
                  className="btn-primary text-lg px-8 py-3 flex items-center justify-center space-x-2"
                >
                  <span>Ir al Dashboard</span>
                  <ArrowRight className="w-5 h-5" />
                </Link>
              ) : (
                <>
                  <Link
                    to="/register"
                    className="btn-primary text-lg px-8 py-3"
                  >
                    Comenzar Gratis
                  </Link>
                  <Link
                    to="/login"
                    className="btn-secondary text-lg px-8 py-3"
                  >
                    Ya tengo cuenta
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Todo lo que necesitas para tu mascota</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Una plataforma completa que te ayuda a cuidar la salud y bienestar de tu mascota, 
              con herramientas intuitivas y beneficios exclusivos.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="text-center group">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-200">
                  <feature.icon className="w-8 h-8 text-primary-600" />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  {feature.title}
                </h3>
                <p className="text-gray-600">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Premium Section */}
      <section className="py-20 bg-gradient-to-br from-yellow-50 to-orange-50">
        <div className="page-container">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center space-x-2 bg-yellow-100 text-yellow-800 px-4 py-2 rounded-full text-sm font-medium mb-6">
              <Shield className="w-4 h-4" />
              <span>Plan Premium</span>
            </div>
            <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-6">
              Desbloquea beneficios exclusivos
            </h2>
            <p className="text-xl text-gray-600 mb-8">
              Con nuestra suscripción premium, accede a descuentos especiales, 
              seguros preferenciales y servicios veterinarios de calidad.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
              {premiumBenefits.map((benefit, index) => (
                <div key={index} className="flex items-start space-x-3 text-left">
                  <CheckCircle className="w-5 h-5 text-success-500 mt-0.5 flex-shrink-0" />
                  <span className="text-gray-700">{benefit}</span>
                </div>
              ))}
            </div>

            {currentUser ? (
              <Link
                to="/premium"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <span>Ver Plan Premium</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            ) : (
              <Link
                to="/register"
                className="btn-primary text-lg px-8 py-3 inline-flex items-center space-x-2"
              >
                <span>Registrarse para Premium</span>
                <ArrowRight className="w-5 h-5" />
              </Link>
            )}
          </div>
        </div>
      </section>

      {/* Partners Section */}
      <section className="py-20 bg-white">
        <div className="page-container">
          <div className="text-center mb-16">
            <h2 className="section-title">Nuestros Aliados Comerciales</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Trabajamos con las mejores veterinarias, farmacias y aseguradoras 
              de Chile para ofrecerte los mejores servicios y precios.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Shield className="w-8 h-8 text-primary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Veterinarias</h3>
              <p className="text-gray-600">
                Consultas, emergencias y tratamientos especializados con los mejores profesionales.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-secondary-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Gift className="w-8 h-8 text-secondary-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Farmacias</h3>
              <p className="text-gray-600">
                Medicamentos, alimentos especiales y productos de cuidado con descuentos exclusivos.
              </p>
            </div>

            <div className="text-center p-6 bg-gray-50 rounded-xl">
              <div className="w-16 h-16 bg-success-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="w-8 h-8 text-success-600" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">Seguros</h3>
              <p className="text-gray-600">
                Cobertura completa para tu mascota con precios preferenciales y beneficios especiales.
              </p>
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              to="/partners"
              className="btn-secondary text-lg px-8 py-3 inline-flex items-center space-x-2"
            >
              <span>Ver todos los aliados</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary-600">
        <div className="page-container text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-6">
            ¿Listo para empezar?
          </h2>
          <p className="text-xl text-primary-100 mb-8 max-w-2xl mx-auto">
            Únete a miles de dueños de mascotas que ya confían en AkiToPet 
            para el cuidado de sus mejores amigos.
          </p>
          {!currentUser && (
            <Link
              to="/register"
              className="bg-white text-primary-600 hover:bg-gray-100 text-lg px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <span>Crear cuenta gratuita</span>
              <ArrowRight className="w-5 h-5" />
            </Link>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;
