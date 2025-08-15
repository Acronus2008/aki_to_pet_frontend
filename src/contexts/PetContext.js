import React, { createContext, useContext, useState, useEffect } from 'react';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  getDoc, 
  query, 
  where, 
  orderBy,
  serverTimestamp 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../config/firebase';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const PetContext = createContext();

export function usePet() {
  return useContext(PetContext);
}

export function PetProvider({ children }) {
  const [pets, setPets] = useState([]);
  const [loading, setLoading] = useState(false);
  const { currentUser } = useAuth();

  // Cargar mascotas del usuario
  useEffect(() => {
    if (currentUser) {
      loadUserPets();
    }
  }, [currentUser, loadUserPets]);

  // Cargar mascotas del usuario
  async function loadUserPets() {
    if (!currentUser) return;
    
    setLoading(true);
    try {
      const petsRef = collection(db, 'pets');
      const q = query(
        petsRef, 
        where('ownerId', '==', currentUser.uid),
        orderBy('createdAt', 'desc')
      );
      
      const querySnapshot = await getDocs(q);
      const petsData = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));
      
      setPets(petsData);
    } catch (error) {
      console.error('Error al cargar mascotas:', error);
      toast.error('Error al cargar mascotas');
    } finally {
      setLoading(false);
    }
  }

  // Agregar nueva mascota
  async function addPet(petData) {
    if (!currentUser) return;
    
    try {
      const petRef = collection(db, 'pets');
      const newPet = {
        ...petData,
        ownerId: currentUser.uid,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      const docRef = await addDoc(petRef, newPet);
      
      // Agregar la nueva mascota al estado local
      const petWithId = {
        id: docRef.id,
        ...newPet,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setPets(prev => [petWithId, ...prev]);
      toast.success('Mascota agregada exitosamente');
      
      return docRef.id;
    } catch (error) {
      console.error('Error al agregar mascota:', error);
      toast.error('Error al agregar mascota');
      throw error;
    }
  }

  // Actualizar mascota
  async function updatePet(petId, updates) {
    try {
      const petRef = doc(db, 'pets', petId);
      await updateDoc(petRef, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      
      // Actualizar en el estado local
      setPets(prev => prev.map(pet => 
        pet.id === petId 
          ? { ...pet, ...updates, updatedAt: new Date() }
          : pet
      ));
      
      toast.success('Mascota actualizada exitosamente');
    } catch (error) {
      console.error('Error al actualizar mascota:', error);
      toast.error('Error al actualizar mascota');
      throw error;
    }
  }

  // Eliminar mascota
  async function deletePet(petId) {
    try {
      // Obtener la mascota para eliminar archivos
      const pet = pets.find(p => p.id === petId);
      
      // Eliminar documentos asociados
      if (pet.documents && pet.documents.length > 0) {
        for (const doc of pet.documents) {
          try {
            const docRef = ref(storage, doc.url);
            await deleteObject(docRef);
          } catch (error) {
            console.error('Error al eliminar documento:', error);
          }
        }
      }
      
      // Eliminar de Firestore
      const petRef = doc(db, 'pets', petId);
      await deleteDoc(petRef);
      
      // Eliminar del estado local
      setPets(prev => prev.filter(pet => pet.id !== petId));
      toast.success('Mascota eliminada exitosamente');
    } catch (error) {
      console.error('Error al eliminar mascota:', error);
      toast.error('Error al eliminar mascota');
      throw error;
    }
  }

  // Obtener mascota por ID
  async function getPetById(petId) {
    try {
      const petRef = doc(db, 'pets', petId);
      const petSnap = await getDoc(petRef);
      
      if (petSnap.exists()) {
        return { id: petSnap.id, ...petSnap.data() };
      }
      return null;
    } catch (error) {
      console.error('Error al obtener mascota:', error);
      toast.error('Error al obtener mascota');
      return null;
    }
  }

  // Agregar vacuna
  async function addVaccine(petId, vaccineData) {
    try {
      const pet = pets.find(p => p.id === petId);
      if (!pet) return;
      
      const newVaccine = {
        id: Date.now().toString(),
        ...vaccineData,
        date: new Date(vaccineData.date),
        nextDose: vaccineData.nextDose ? new Date(vaccineData.nextDose) : null
      };
      
      const updatedVaccines = [...(pet.vaccines || []), newVaccine];
      
      await updatePet(petId, { vaccines: updatedVaccines });
      toast.success('Vacuna agregada exitosamente');
    } catch (error) {
      console.error('Error al agregar vacuna:', error);
      toast.error('Error al agregar vacuna');
      throw error;
    }
  }

  // Agregar enfermedad
  async function addDisease(petId, diseaseData) {
    try {
      const pet = pets.find(p => p.id === petId);
      if (!pet) return;
      
      const newDisease = {
        id: Date.now().toString(),
        ...diseaseData,
        diagnosisDate: new Date(diseaseData.diagnosisDate)
      };
      
      const updatedDiseases = [...(pet.diseases || []), newDisease];
      
      await updatePet(petId, { diseases: updatedDiseases });
      toast.success('Enfermedad agregada exitosamente');
    } catch (error) {
      console.error('Error al agregar enfermedad:', error);
      toast.error('Error al agregar enfermedad');
      throw error;
    }
  }

  // Agregar tratamiento
  async function addTreatment(petId, treatmentData) {
    try {
      const pet = pets.find(p => p.id === petId);
      if (!pet) return;
      
      const newTreatment = {
        id: Date.now().toString(),
        ...treatmentData,
        startDate: new Date(treatmentData.startDate),
        endDate: treatmentData.endDate ? new Date(treatmentData.endDate) : null
      };
      
      const updatedTreatments = [...(pet.treatments || []), newTreatment];
      
      await updatePet(petId, { treatments: updatedTreatments });
      toast.success('Tratamiento agregado exitosamente');
    } catch (error) {
      console.error('Error al agregar tratamiento:', error);
      toast.error('Error al agregar tratamiento');
      throw error;
    }
  }

  // Subir documento
  async function uploadDocument(petId, file, documentType) {
    try {
      const fileName = `${petId}_${Date.now()}_${file.name}`;
      const storageRef = ref(storage, `documents/${fileName}`);
      
      const snapshot = await uploadBytes(storageRef, file);
      const downloadURL = await getDownloadURL(snapshot.ref);
      
      const newDocument = {
        id: Date.now().toString(),
        name: file.name,
        type: documentType,
        url: downloadURL,
        uploadedAt: new Date(),
        size: file.size
      };
      
      const pet = pets.find(p => p.id === petId);
      if (!pet) return;
      
      const updatedDocuments = [...(pet.documents || []), newDocument];
      
      await updatePet(petId, { documents: updatedDocuments });
      toast.success('Documento subido exitosamente');
      
      return newDocument;
    } catch (error) {
      console.error('Error al subir documento:', error);
      toast.error('Error al subir documento');
      throw error;
    }
  }

  // Eliminar documento
  async function deleteDocument(petId, documentId) {
    try {
      const pet = pets.find(p => p.id === petId);
      if (!pet) return;
      
      const document = pet.documents.find(d => d.id === documentId);
      if (!document) return;
      
      // Eliminar de Storage
      const docRef = ref(storage, document.url);
      await deleteObject(docRef);
      
      // Eliminar de Firestore
      const updatedDocuments = pet.documents.filter(d => d.id !== documentId);
      await updatePet(petId, { documents: updatedDocuments });
      
      toast.success('Documento eliminado exitosamente');
    } catch (error) {
      console.error('Error al eliminar documento:', error);
      toast.error('Error al eliminar documento');
      throw error;
    }
  }

  // Obtener próximas vacunas
  function getUpcomingVaccines() {
    const today = new Date();
    const thirtyDaysFromNow = new Date(today.getTime() + (30 * 24 * 60 * 60 * 1000));
    
    const upcomingVaccines = [];
    
    pets.forEach(pet => {
      if (pet.vaccines) {
        pet.vaccines.forEach(vaccine => {
          if (vaccine.nextDose && new Date(vaccine.nextDose) <= thirtyDaysFromNow) {
            upcomingVaccines.push({
              petId: pet.id,
              petName: pet.name,
              vaccineName: vaccine.name,
              nextDose: vaccine.nextDose,
              daysUntil: Math.ceil((new Date(vaccine.nextDose) - today) / (1000 * 60 * 60 * 24))
            });
          }
        });
      }
    });
    
    return upcomingVaccines.sort((a, b) => new Date(a.nextDose) - new Date(b.nextDose));
  }

  const value = {
    pets,
    loading,
    addPet,
    updatePet,
    deletePet,
    getPetById,
    addVaccine,
    addDisease,
    addTreatment,
    uploadDocument,
    deleteDocument,
    getUpcomingVaccines,
    loadUserPets
  };

  return (
    <PetContext.Provider value={value}>
      {children}
    </PetContext.Provider>
  );
}
