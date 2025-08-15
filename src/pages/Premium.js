import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import { usePremium } from '../contexts/PremiumContext';
import { 
  Crown, 
  CheckCircle, 
  Star, 
  Shield, 
  Gift, 
  Users,
  Calendar,
  Zap
} from 'lucide-react';

const Premium = () => {
  const { userProfile } = useAuth();
  const { isPremiumActive, activatePremium, getDaysUntilExpiry } = usePremium();

  const features = [
    {
      icon: Gift,
      title: 'Descuentos Exclusivos',
      description: 'Accede a ofertas especiales en veterinarias, farmacias y seguros'
    },
    {
      icon: Shield,
      title: 'Seguros Preferenciales',
      description: 'Cobertura completa para tu mascota con precios especiales'
    },
    {
      icon: Users,
      title: 'Veterinarios de Emergencia',
      description: 'Acceso 24/7 a veterinarios especializados'
    },
    {
      icon: Calendar,
      title: 'Recordatorios Avanzados',
      description: 'Sistema inteligente de alertas para vacunas y tratamientos'
    },
    {
      icon: Zap,
      title: 'Soporte Prioritario',
      description: 'Atención preferencial en consultas y emergencias'
    },
    {
      icon: Star,
      title: 'Programa de Recompensas',
      description: 'Gana puntos por cada visita y canjéalos por beneficios'
    }
  ];

  const handleActivatePremium = async () => {
    try {
      await activatePremium();
    } catch (error) {
      console.error('Error activating premium:', error);
    }
  };

  return (
    <div className="page-container">
      {/* Header */}
      <div className="text-center mb-12">
        <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-yellow-400 to-orange-400 text-white px-6 py-3 rounded-full text-sm font-medium mb-6">
          <Crown className="w-5 h-5" />
          <span>Plan Premium</span>
        </div>
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Desbloquea Beneficios Exclusivos
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto">
          Con nuestra suscripción premium, accede a descuentos especiales, 
          seguros preferenciales y servicios veterinarios de calidad para tu mascota.
        </p>
      </div>

      {/* Current Status */}
      {isPremiumActive() && (
        <div className="bg-gradient-to-r from-success-400 to-green-500 rounded-xl p-6 mb-8 text-white">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Crown className="w-8 h-8" />
              <div>
                <h3 className="text-lg font-semibold">
                  ¡Ya tienes Premium activo!
                </h3>
                <p className="text-success-100">
                  Disfruta de todos los beneficios exclusivos
                </p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-success-100">Días restantes</p>
              <p className="text-2xl font-bold">
                {getDaysUntilExpiry() || '∞'}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
        {features.map((feature, index) => (
          <div key={index} className="card text-center group hover:shadow-lg transition-shadow duration-200">
            <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary-200 transition-colors duration-200">
              <feature.icon className="w-8 h-8 text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {feature.title}
            </h3>
            <p className="text-gray-600">
              {feature.description}
            </p>
          </div>
        ))}
      </div>

      {/* Pricing Section */}
      <div className="card max-w-4xl mx-auto">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Plan Premium Anual
          </h2>
          <p className="text-gray-600">
            Acceso completo a todos los beneficios por un año completo
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Free Plan */}
          <div className="border border-gray-200 rounded-lg p-6">
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Plan Gratuito</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $0
              <span className="text-lg font-normal text-gray-600">/mes</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-gray-600">Registro de mascotas</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-gray-600">Historial médico básico</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-gray-600">Recordatorios básicos</span>
              </li>
            </ul>
            <div className="text-center">
              <span className="text-sm text-gray-500">Plan actual</span>
            </div>
          </div>

          {/* Premium Plan */}
          <div className="border-2 border-primary-500 rounded-lg p-6 bg-primary-50 relative">
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <span className="bg-primary-600 text-white px-4 py-1 rounded-full text-sm font-medium">
                Recomendado
              </span>
            </div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Plan Premium</h3>
            <div className="text-3xl font-bold text-gray-900 mb-4">
              $29.990
              <span className="text-lg font-normal text-gray-600">/año</span>
            </div>
            <div className="text-sm text-gray-600 mb-4">
              <span className="line-through">$59.990</span>
              <span className="text-success-600 font-medium ml-2">50% de descuento</span>
            </div>
            <ul className="space-y-3 mb-6">
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-gray-600">Todo del plan gratuito</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-gray-600">Descuentos exclusivos</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-gray-600">Seguros preferenciales</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-gray-600">Veterinarios 24/7</span>
              </li>
              <li className="flex items-center space-x-2">
                <CheckCircle className="w-4 h-4 text-success-500" />
                <span className="text-sm text-gray-600">Soporte prioritario</span>
              </li>
            </ul>
            
            {!isPremiumActive() ? (
              <button
                onClick={handleActivatePremium}
                className="btn-primary w-full"
              >
                Activar Premium
              </button>
            ) : (
              <div className="text-center">
                <span className="text-sm text-success-600 font-medium">
                  ✓ Plan activo
                </span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Benefits Details */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Beneficios Detallados
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Gift className="w-5 h-5 text-primary-600" />
              <span>Descuentos y Ofertas</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• 15-30% de descuento en consultas veterinarias</li>
              <li>• 20-40% de descuento en medicamentos</li>
              <li>• 25% de descuento en alimentos premium</li>
              <li>• Acceso a promociones exclusivas</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Shield className="w-5 h-5 text-primary-600" />
              <span>Seguros y Protección</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Seguros veterinarios con 20% de descuento</li>
              <li>• Cobertura de emergencias 24/7</li>
              <li>• Protección contra accidentes</li>
              <li>• Reembolso de gastos médicos</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Users className="w-5 h-5 text-primary-600" />
              <span>Servicios Veterinarios</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Red de veterinarios certificados</li>
              <li>• Consultas de emergencia prioritarias</li>
              <li>• Segunda opinión médica gratuita</li>
              <li>• Telemedicina veterinaria</li>
            </ul>
          </div>

          <div className="card">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Star className="w-5 h-5 text-primary-600" />
              <span>Programa de Recompensas</span>
            </h3>
            <ul className="space-y-2 text-sm text-gray-600">
              <li>• Gana puntos por cada visita</li>
              <li>• Canjea puntos por servicios</li>
              <li>• Niveles de membresía</li>
              <li>• Beneficios por fidelidad</li>
            </ul>
          </div>
        </div>
      </div>

      {/* FAQ Section */}
      <div className="mt-12">
        <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
          Preguntas Frecuentes
        </h2>
        
        <div className="max-w-3xl mx-auto space-y-4">
          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              ¿Puedo cancelar mi suscripción premium en cualquier momento?
            </h3>
            <p className="text-gray-600 text-sm">
              Sí, puedes cancelar tu suscripción premium en cualquier momento. 
              Los beneficios estarán disponibles hasta el final del período pagado.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              ¿Los descuentos están disponibles en todo Chile?
            </h3>
            <p className="text-gray-600 text-sm">
              Actualmente cubrimos las principales ciudades de Chile. 
              Estamos expandiendo nuestra red de aliados comerciales constantemente.
            </p>
          </div>

          <div className="card">
            <h3 className="font-semibold text-gray-900 mb-2">
              ¿Cómo funcionan los recordatorios avanzados?
            </h3>
            <p className="text-gray-600 text-sm">
              Nuestro sistema inteligente te notifica sobre vacunas próximas a vencer, 
              tratamientos que requieren seguimiento y citas veterinarias programadas.
            </p>
          </div>
        </div>
      </div>

      {/* CTA Section */}
      {!isPremiumActive() && (
        <div className="mt-12 text-center">
          <div className="bg-gradient-to-r from-primary-600 to-secondary-600 rounded-xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              ¿Listo para darle lo mejor a tu mascota?
            </h2>
            <p className="text-primary-100 mb-6">
              Únete a miles de dueños que ya confían en AkiToPet Premium
            </p>
            <button
              onClick={handleActivatePremium}
              className="bg-white text-primary-600 hover:bg-gray-100 px-8 py-3 rounded-lg font-medium transition-colors duration-200 inline-flex items-center space-x-2"
            >
              <Crown className="w-5 h-5" />
              <span>Activar Premium Ahora</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default Premium;
