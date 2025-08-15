import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  getDocs, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const PremiumContext = createContext();

export function usePremium() {
  return useContext(PremiumContext);
}

export function PremiumProvider({ children }) {
  const [partners, setPartners] = useState([]);
  const [discounts, setDiscounts] = useState([]);
  const [userDiscounts, setUserDiscounts] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser, userProfile } = useAuth();

  // Cargar aliados comerciales
  useEffect(() => {
    loadPartners();
  }, []);

  // Cargar descuentos del usuario si es premium
  useEffect(() => {
    if (currentUser && userProfile?.isPremium) {
      loadUserDiscounts();
    }
  }, [currentUser, userProfile, loadUserDiscounts]);

  // Cargar aliados comerciales
  async function loadPartners() {
    setLoading(true);
    try {
      const partnersRef = collection(db, 'partners');
      const q = query(partnersRef, where('isActive', '==', true), orderBy('name'));
      
      const querySnapshot = await getDocs(q);
      const partnersData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPartners(partnersData);
      
      // Cargar descuentos de todos los aliados
      const discountsData = [];
      for (const partner of partnersData) {
        if (partner.discounts) {
          discountsData.push(...partner.discounts.map(discount => ({
            ...discount,
            partnerId: partner.id,
            partnerName: partner.name,
            partnerType: partner.type,
            partnerLogo: partner.logo
          })));
        }
      }
      setDiscounts(discountsData);
      
    } catch (error) {
      console.error('Error al cargar aliados:', error);
      toast.error('Error al cargar aliados comerciales');
    } finally {
      setLoading(false);
    }
  }

  // Cargar descuentos del usuario
  const loadUserDiscounts = useCallback(async () => {
    if (!currentUser || !userProfile?.isPremium) return;
    
    try {
      const userDiscountsRef = collection(db, 'userDiscounts');
      const q = query(
        userDiscountsRef, 
        where('userId', '==', currentUser.uid),
        orderBy('claimedAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const userDiscountsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setUserDiscounts(userDiscountsData);
    } catch (error) {
      console.error('Error al cargar descuentos del usuario:', error);
    }
  }, [currentUser, userProfile?.isPremium]);

  // Activar suscripción premium
  async function activatePremium() {
    if (!currentUser) return;
    
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      const expiryDate = new Date();
      expiryDate.setFullYear(expiryDate.getFullYear() + 1); // 1 año de suscripción
      
      await updateDoc(userRef, {
        isPremium: true,
        premiumExpiry: expiryDate,
        premiumActivatedAt: serverTimestamp()
      });
      
      toast.success('¡Suscripción Premium activada!');
      
      // Recargar descuentos del usuario
      await loadUserDiscounts();
      
      return true;
    } catch (error) {
      console.error('Error al activar premium:', error);
      toast.error('Error al activar suscripción premium');
      return false;
    }
  }

  // Canjear descuento
  async function claimDiscount(discountId, partnerId) {
    if (!currentUser || !userProfile?.isPremium) {
      toast.error('Necesitas una suscripción premium para canjear descuentos');
      return false;
    }
    
    try {
      // Verificar si ya fue canjeado
      const alreadyClaimed = userDiscounts.find(
        ud => ud.discountId === discountId && ud.partnerId === partnerId
      );
      
      if (alreadyClaimed) {
        toast.error('Ya has canjeado este descuento');
        return false;
      }
      
      // Agregar descuento canjeado
      const userDiscountsRef = collection(db, 'userDiscounts');
      await addDoc(userDiscountsRef, {
        userId: currentUser.uid,
        discountId,
        partnerId,
        claimedAt: serverTimestamp(),
        isUsed: false,
        usedAt: null
      });
      
      // Actualizar estado local
      const newUserDiscount = {
        id: Date.now().toString(),
        userId: currentUser.uid,
        discountId,
        partnerId,
        claimedAt: new Date(),
        isUsed: false,
        usedAt: null
      };
      
      setUserDiscounts(prev => [newUserDiscount, ...prev]);
      
      toast.success('Descuento canjeado exitosamente');
      return true;
    } catch (error) {
      console.error('Error al canjear descuento:', error);
      toast.error('Error al canjear descuento');
      return false;
    }
  }

  // Marcar descuento como usado
  async function useDiscount(userDiscountId) {
    try {
      const userDiscountRef = doc(db, 'userDiscounts', userDiscountId);
      await updateDoc(userDiscountRef, {
        isUsed: true,
        usedAt: serverTimestamp()
      });
      
      // Actualizar estado local
      setUserDiscounts(prev => prev.map(ud => 
        ud.id === userDiscountId 
          ? { ...ud, isUsed: true, usedAt: new Date() }
          : ud
      ));
      
      toast.success('Descuento marcado como usado');
      return true;
    } catch (error) {
      console.error('Error al marcar descuento como usado:', error);
      toast.error('Error al marcar descuento como usado');
      return false;
    }
  }

  // Filtrar descuentos por categoría
  function filterDiscountsByCategory(category) {
    if (!category || category === 'all') return discounts;
    return discounts.filter(discount => discount.category === category);
  }

  // Filtrar descuentos por ubicación
  function filterDiscountsByLocation(userLocation) {
    if (!userLocation) return discounts;
    
    return discounts.filter(discount => {
      if (!discount.location) return true;
      
      // Lógica simple de filtrado por ubicación
      // En producción, usar geolocalización más precisa
      return discount.location.toLowerCase().includes(userLocation.toLowerCase());
    });
  }

  // Obtener estadísticas del usuario premium
  function getUserPremiumStats() {
    if (!userProfile?.isPremium) return null;
    
    const totalClaimed = userDiscounts.length;
    const totalUsed = userDiscounts.filter(ud => ud.isUsed).length;
    const totalAvailable = totalClaimed - totalUsed;
    
    // Calcular ahorro estimado
    const estimatedSavings = userDiscounts
      .filter(ud => ud.isUsed)
      .reduce((total, ud) => {
        const discount = discounts.find(d => d.id === ud.discountId);
        return total + (discount?.estimatedSavings || 0);
      }, 0);
    
    return {
      totalClaimed,
      totalUsed,
      totalAvailable,
      estimatedSavings
    };
  }

  // Verificar si la suscripción premium está activa
  function isPremiumActive() {
    if (!userProfile?.isPremium) return false;
    
    if (!userProfile.premiumExpiry) return true;
    
    const expiryDate = new Date(userProfile.premiumExpiry);
    const now = new Date();
    
    return expiryDate > now;
  }

  // Obtener días restantes de suscripción
  function getDaysUntilExpiry() {
    if (!userProfile?.isPremium || !userProfile.premiumExpiry) return null;
    
    const expiryDate = new Date(userProfile.premiumExpiry);
    const now = new Date();
    const diffTime = expiryDate - now;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    return diffDays > 0 ? diffDays : 0;
  }

  const value = {
    partners,
    discounts,
    userDiscounts,
    loading,
    activatePremium,
    claimDiscount,
    useDiscount,
    filterDiscountsByCategory,
    filterDiscountsByLocation,
    getUserPremiumStats,
    isPremiumActive,
    getDaysUntilExpiry,
    loadPartners,
    loadUserDiscounts
  };

  return (
    <PremiumContext.Provider value={value}>
      {children}
    </PremiumContext.Provider>
  );
}
