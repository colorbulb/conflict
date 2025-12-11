// List management for categories, instructors, levels
import { 
  collection, 
  doc, 
  getDoc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  addDoc
} from "firebase/firestore";
import { db } from "./config.js";

const COLLECTIONS = {
  CATEGORIES: 'categories',
  INSTRUCTORS: 'instructors',
  LEVELS: 'levels'
};

// ===== CATEGORIES =====
export const getCategories = async () => {
  try {
    const categoriesRef = collection(db, COLLECTIONS.CATEGORIES);
    const snapshot = await getDocs(categoriesRef);
    return snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const saveCategory = async (category) => {
  try {
    if (category.id) {
      await setDoc(doc(db, COLLECTIONS.CATEGORIES, category.id), { name: category.name });
      return category.id;
    } else {
      const docRef = await addDoc(collection(db, COLLECTIONS.CATEGORIES), { name: category.name });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving category:', error);
    throw error;
  }
};

export const deleteCategory = async (categoryId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.CATEGORIES, categoryId));
  } catch (error) {
    console.error('Error deleting category:', error);
    throw error;
  }
};

// ===== INSTRUCTORS =====
export const getInstructors = async () => {
  try {
    const instructorsRef = collection(db, COLLECTIONS.INSTRUCTORS);
    const snapshot = await getDocs(instructorsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
  } catch (error) {
    console.error('Error fetching instructors:', error);
    return [];
  }
};

export const saveInstructor = async (instructor) => {
  try {
    if (instructor.id) {
      await setDoc(doc(db, COLLECTIONS.INSTRUCTORS, instructor.id), { name: instructor.name });
      return instructor.id;
    } else {
      const docRef = await addDoc(collection(db, COLLECTIONS.INSTRUCTORS), { name: instructor.name });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving instructor:', error);
    throw error;
  }
};

export const deleteInstructor = async (instructorId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.INSTRUCTORS, instructorId));
  } catch (error) {
    console.error('Error deleting instructor:', error);
    throw error;
  }
};

// ===== LEVELS =====
export const getLevels = async () => {
  try {
    const levelsRef = collection(db, COLLECTIONS.LEVELS);
    const snapshot = await getDocs(levelsRef);
    return snapshot.docs.map(doc => ({ id: doc.id, name: doc.data().name }));
  } catch (error) {
    console.error('Error fetching levels:', error);
    return [];
  }
};

export const saveLevel = async (level) => {
  try {
    if (level.id) {
      await setDoc(doc(db, COLLECTIONS.LEVELS, level.id), { name: level.name });
      return level.id;
    } else {
      const docRef = await addDoc(collection(db, COLLECTIONS.LEVELS), { name: level.name });
      return docRef.id;
    }
  } catch (error) {
    console.error('Error saving level:', error);
    throw error;
  }
};

export const deleteLevel = async (levelId) => {
  try {
    await deleteDoc(doc(db, COLLECTIONS.LEVELS, levelId));
  } catch (error) {
    console.error('Error deleting level:', error);
    throw error;
  }
};

