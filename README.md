# AkiToPet Frontend

Plataforma web para la gestión integral de mascotas con beneficios premium en Chile.

## 🚀 Características

### Módulo de Usuarios
- ✅ Registro y autenticación con email/contraseña
- ✅ Login social con Google y Facebook
- ✅ Perfil de usuario con datos personales
- ✅ Gestión de contraseña y recuperación
- ✅ Autenticación OAuth 2.0

### Módulo de Mascotas
- ✅ Registro completo de mascotas (nombre, especie, raza, edad, sexo)
- ✅ Subida de fotos opcional
- ✅ Historial médico básico
- ✅ Gestión de vacunas y próximas dosis
- ✅ Registro de enfermedades diagnosticadas
- ✅ Seguimiento de tratamientos activos
- ✅ Subida de documentos (PDF/imágenes)

### Módulo Premium
- ✅ Suscripción premium con beneficios exclusivos
- ✅ Acceso a descuentos en farmacias de mascotas
- ✅ Beneficios en consultas veterinarias
- ✅ Seguros para mascotas con precios preferenciales
- ✅ Gestión de descuentos por categoría y ubicación

### Módulo de Aliados Comerciales (B2B)
- ✅ Panel para veterinarias, farmacias y seguros
- ✅ Administración de descuentos y promociones
- ✅ Métricas de usuarios y alcance

### Módulo de Notificaciones
- ✅ Recordatorios automáticos de vacunas
- ✅ Alertas de renovación de seguro
- ✅ Notificaciones de promociones activas

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 18, React Router DOM
- **Estilos**: Tailwind CSS
- **Formularios**: React Hook Form
- **Autenticación**: Firebase Auth
- **Base de Datos**: Firestore
- **Almacenamiento**: Firebase Storage
- **Notificaciones**: React Hot Toast
- **Iconos**: Lucide React
- **Manejo de Fechas**: date-fns

## 📋 Requisitos Previos

- Node.js 16+ 
- npm o yarn
- Cuenta de Firebase (para autenticación y base de datos)

## 🚀 Instalación

1. **Clonar el repositorio**
   ```bash
   git clone <repository-url>
   cd aki_to_pet_frontend
   ```

2. **Instalar dependencias**
   ```bash
   npm install
   ```

3. **Configurar Firebase**
   - Crear un proyecto en [Firebase Console](https://console.firebase.google.com/)
   - Habilitar Authentication, Firestore y Storage
   - Crear un archivo `.env.local` en la raíz del proyecto:

   ```env
   REACT_APP_FIREBASE_API_KEY=tu-api-key
   REACT_APP_FIREBASE_AUTH_DOMAIN=tu-proyecto.firebaseapp.com
   REACT_APP_FIREBASE_PROJECT_ID=tu-proyecto-id
   REACT_APP_FIREBASE_STORAGE_BUCKET=tu-proyecto.appspot.com
   REACT_APP_FIREBASE_MESSAGING_SENDER_ID=123456789
   REACT_APP_FIREBASE_APP_ID=tu-app-id
   ```

4. **Ejecutar la aplicación**
   ```bash
   npm start
   ```

   La aplicación estará disponible en `http://localhost:3000`

## 🏗️ Arquitectura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── auth/           # Componentes de autenticación
│   ├── layout/         # Componentes de layout (Navbar, Footer)
│   └── ui/             # Componentes de interfaz de usuario
├── contexts/            # Contextos de React (Auth, Pet, Premium)
├── pages/               # Páginas de la aplicación
│   ├── auth/           # Páginas de autenticación
│   └── ...             # Otras páginas
├── config/              # Configuración (Firebase)
├── hooks/               # Hooks personalizados
├── utils/               # Utilidades y helpers
└── index.css            # Estilos globales con Tailwind
```

## 🔐 Configuración de Firebase

### 1. Authentication
- Habilitar proveedores: Email/Password, Google, Facebook
- Configurar reglas de seguridad

### 2. Firestore Database
- Crear colecciones: `users`, `pets`, `partners`, `userDiscounts`
- Configurar reglas de seguridad

### 3. Storage
- Configurar reglas para subida de imágenes y documentos
- Establecer límites de tamaño de archivo

## 📱 Funcionalidades Implementadas

### Autenticación
- [x] Registro con email/contraseña
- [x] Login con Google
- [x] Login con Facebook
- [x] Recuperación de contraseña
- [x] Protección de rutas

### Gestión de Mascotas
- [x] CRUD completo de mascotas
- [x] Historial médico
- [x] Gestión de vacunas
- [x] Registro de enfermedades
- [x] Seguimiento de tratamientos
- [x] Subida de documentos

### Sistema Premium
- [x] Activación de suscripción
- [x] Gestión de descuentos
- [x] Canje de beneficios
- [x] Estadísticas de usuario

### Interfaz de Usuario
- [x] Diseño responsivo
- [x] Navegación intuitiva
- [x] Formularios validados
- [x] Notificaciones toast
- [x] Iconos y animaciones

## 🎨 Diseño y UX

- **Paleta de colores**: Azul primario (#0ea5e9) y púrpura secundario (#d946ef)
- **Tipografía**: Inter (Google Fonts)
- **Componentes**: Diseño consistente con Tailwind CSS
- **Responsive**: Mobile-first approach
- **Accesibilidad**: Navegación por teclado y contraste adecuado

## 🚀 Scripts Disponibles

```bash
npm start          # Ejecutar en modo desarrollo
npm run build      # Construir para producción
npm test           # Ejecutar tests
npm run eject      # Eyectar configuración (irreversible)
```

## 📦 Estructura de Base de Datos

### Colección: users
```javascript
{
  uid: string,
  email: string,
  name: string,
  phone: string,
  address: string,
  createdAt: timestamp,
  isPremium: boolean,
  premiumExpiry: timestamp,
  premiumActivatedAt: timestamp
}
```

### Colección: pets
```javascript
{
  id: string,
  ownerId: string,
  name: string,
  species: string,
  breed: string,
  age: number,
  sex: string,
  photo: string,
  vaccines: array,
  diseases: array,
  treatments: array,
  documents: array,
  createdAt: timestamp,
  updatedAt: timestamp
}
```

### Colección: partners
```javascript
{
  id: string,
  name: string,
  type: string, // 'veterinaria', 'farmacia', 'seguro'
  logo: string,
  description: string,
  location: string,
  isActive: boolean,
  discounts: array
}
```

## 🔒 Seguridad

- Autenticación OAuth 2.0
- Reglas de Firestore por usuario
- Validación de formularios
- Sanitización de datos
- Protección de rutas

## 📈 Escalabilidad

- Arquitectura modular
- Contextos separados por funcionalidad
- Componentes reutilizables
- Lazy loading preparado
- Optimización de imágenes

## 🌐 Despliegue

### Firebase Hosting
```bash
npm run build
firebase deploy
```

### Netlify
- Conectar repositorio
- Build command: `npm run build`
- Publish directory: `build`

### Vercel
- Importar proyecto
- Framework preset: Create React App
- Build command: `npm run build`

## 🤝 Contribución

1. Fork el proyecto
2. Crear una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abrir un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver el archivo `LICENSE` para más detalles.

## 📞 Contacto

- **Email**: info@akitopet.cl
- **Teléfono**: +56 2 2345 6789
- **Ubicación**: Santiago, Chile

## 🙏 Agradecimientos

- Firebase por la infraestructura gratuita
- Tailwind CSS por el framework de estilos
- React por la biblioteca de interfaz
- La comunidad de desarrolladores open source

---

**AkiToPet** - Cuida a tu mejor amigo como se merece 🐾
