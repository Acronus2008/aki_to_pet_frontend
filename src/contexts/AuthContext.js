import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  signOut, 
  onAuthStateChanged,
  GoogleAuthProvider,
  FacebookAuthProvider,
  signInWithPopup,
  updateProfile,
  sendPasswordResetEmail
} from 'firebase/auth';
import { doc, setDoc, getDoc } from 'firebase/firestore';
import { auth, db } from '../config/firebase';
import toast from 'react-hot-toast';

const AuthContext = createContext();

export function useAuth() {
  return useContext(AuthContext);
}

export function AuthProvider({ children }) {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [userProfile, setUserProfile] = useState(null);

  // Registro con email y contraseña
  async function signup(email, password, userData) {
    try {
      const result = await createUserWithEmailAndPassword(auth, email, password);
      
      // Actualizar perfil del usuario
      await updateProfile(result.user, {
        displayName: userData.name
      });

      // Guardar datos adicionales en Firestore
      await setDoc(doc(db, 'users', result.user.uid), {
        uid: result.user.uid,
        email: result.user.email,
        name: userData.name,
        phone: userData.phone || '',
        address: userData.address || '',
        createdAt: new Date(),
        isPremium: false,
        premiumExpiry: null
      });

      toast.success('Usuario registrado exitosamente');
      return result;
    } catch (error) {
      console.error('Error en registro:', error);
      toast.error(getErrorMessage(error.code));
      throw error;
    }
  }

  // Login con email y contraseña
  async function login(email, password) {
    try {
      const result = await signInWithEmailAndPassword(auth, email, password);
      toast.success('Inicio de sesión exitoso');
      return result;
    } catch (error) {
      console.error('Error en login:', error);
      toast.error(getErrorMessage(error.code));
      throw error;
    }
  }

  // Login con Google
  async function loginWithGoogle() {
    try {
      const provider = new GoogleAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Verificar si es un usuario nuevo
      if (result._tokenResponse.isNewUser) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          phone: '',
          address: '',
          createdAt: new Date(),
          isPremium: false,
          premiumExpiry: null
        });
      }
      
      toast.success('Inicio de sesión con Google exitoso');
      return result;
    } catch (error) {
      console.error('Error en login con Google:', error);
      toast.error(getErrorMessage(error.code));
      throw error;
    }
  }

  // Login con Facebook
  async function loginWithFacebook() {
    try {
      const provider = new FacebookAuthProvider();
      const result = await signInWithPopup(auth, provider);
      
      // Verificar si es un usuario nuevo
      if (result._tokenResponse.isNewUser) {
        await setDoc(doc(db, 'users', result.user.uid), {
          uid: result.user.uid,
          email: result.user.email,
          name: result.user.displayName,
          phone: '',
          address: '',
          createdAt: new Date(),
          isPremium: false,
          premiumExpiry: null
        });
      }
      
      toast.success('Inicio de sesión con Facebook exitoso');
      return result;
    } catch (error) {
      console.error('Error en login con Facebook:', error);
      toast.error(getErrorMessage(error.code));
      throw error;
    }
  }

  // Logout
  async function logout() {
    try {
      await signOut(auth);
      toast.success('Sesión cerrada exitosamente');
    } catch (error) {
      console.error('Error en logout:', error);
      toast.error('Error al cerrar sesión');
    }
  }

  // Recuperar contraseña
  async function resetPassword(email) {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success('Email de recuperación enviado');
    } catch (error) {
      console.error('Error en reset password:', error);
      toast.error(getErrorMessage(error.code));
      throw error;
    }
  }

  // Actualizar perfil
  async function updateUserProfile(uid, updates) {
    try {
      await setDoc(doc(db, 'users', uid), updates, { merge: true });
      setUserProfile(prev => ({ ...prev, ...updates }));
      toast.success('Perfil actualizado exitosamente');
    } catch (error) {
      console.error('Error al actualizar perfil:', error);
      toast.error('Error al actualizar perfil');
      throw error;
    }
  }

  // Cargar perfil del usuario
  async function loadUserProfile(uid) {
    try {
      const docRef = doc(db, 'users', uid);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        setUserProfile(docSnap.data());
      }
    } catch (error) {
      console.error('Error al cargar perfil:', error);
    }
  }

  // Obtener mensaje de error en español
  function getErrorMessage(errorCode) {
    const errorMessages = {
      'auth/user-not-found': 'Usuario no encontrado',
      'auth/wrong-password': 'Contraseña incorrecta',
      'auth/email-already-in-use': 'El email ya está en uso',
      'auth/weak-password': 'La contraseña es muy débil',
      'auth/invalid-email': 'Email inválido',
      'auth/too-many-requests': 'Demasiados intentos. Intenta más tarde',
      'auth/popup-closed-by-user': 'Ventana de autenticación cerrada',
      'auth/cancelled-popup-request': 'Solicitud de autenticación cancelada'
    };
    
    return errorMessages[errorCode] || 'Error de autenticación';
  }

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        await loadUserProfile(user.uid);
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signup,
    login,
    loginWithGoogle,
    loginWithFacebook,
    logout,
    resetPassword,
    updateUserProfile,
    loading
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
}
