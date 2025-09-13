import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  getDocs, 
  query, 
  where,
  orderBy 
} from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from './firebase';
import type { Category, Food } from '../types';

// Categories
export const getCategories = async (): Promise<Category[]> => {
  const categoriesRef = collection(db, 'categories');
  const q = query(categoriesRef, orderBy('name'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Category));
};

export const addCategory = async (name: string): Promise<string> => {
  const categoriesRef = collection(db, 'categories');
  const docRef = await addDoc(categoriesRef, { name });
  return docRef.id;
};

export const updateCategory = async (id: string, name: string): Promise<void> => {
  const categoryRef = doc(db, 'categories', id);
  await updateDoc(categoryRef, { name });
};

export const deleteCategory = async (id: string): Promise<void> => {
  const categoryRef = doc(db, 'categories', id);
  await deleteDoc(categoryRef);
};

// Foods
export const getFoods = async (): Promise<Food[]> => {
  const foodsRef = collection(db, 'foods');
  const q = query(foodsRef, orderBy('name'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Food));
};

export const getFoodsByCategory = async (categoryId: string): Promise<Food[]> => {
  const foodsRef = collection(db, 'foods');
  const q = query(foodsRef, where('categoryId', '==', categoryId), orderBy('name'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  } as Food));
};

export const addFood = async (food: Omit<Food, 'id'>): Promise<string> => {
  const foodsRef = collection(db, 'foods');
  const docRef = await addDoc(foodsRef, food);
  return docRef.id;
};

export const updateFood = async (id: string, food: Partial<Omit<Food, 'id'>>): Promise<void> => {
  const foodRef = doc(db, 'foods', id);
  await updateDoc(foodRef, food);
};

export const deleteFood = async (id: string): Promise<void> => {
  const foodRef = doc(db, 'foods', id);
  await deleteDoc(foodRef);
};

// Image upload
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Create a unique filename
    const timestamp = Date.now();
    const fileName = `${timestamp}-${Math.random().toString(36).substring(2)}.${file.name.split('.').pop()}`;
    const storageRef = ref(storage, `food-images/${fileName}`);
    
    // Upload the file
    const snapshot = await uploadBytes(storageRef, file);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    throw new Error('خطا در آپلود تصویر. لطفاً دوباره تلاش کنید.');
  }
};
