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
import { db } from './firebase';
import { uploadImageToCloudinary, uploadImageToImgBB, convertToBase64 } from './cloudinary';
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

// Image upload with multiple providers (free options)
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('فایل انتخاب شده باید تصویر باشد');
    }

    // Try different upload methods in order of preference
    const uploadMethods = [
      { name: 'Cloudinary', method: () => uploadImageToCloudinary(file) },
      { name: 'ImgBB', method: () => uploadImageToImgBB(file) },
      { name: 'Base64', method: () => convertToBase64(file) },
    ];

    for (const { name, method } of uploadMethods) {
      try {
        console.log(`Trying ${name} upload...`);
        const result = await method();
        console.log(`${name} upload successful:`, result);
        return result;
      } catch (error) {
        console.warn(`${name} upload failed:`, error);
        // Continue to next method
      }
    }

    // If all methods fail, return placeholder
    console.warn('All upload methods failed. Using placeholder image.');
    return 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop&crop=center';
    
  } catch (error) {
    console.error('Error uploading image:', error);
    
    if (error instanceof Error) {
      throw new Error(`خطا در آپلود تصویر: ${error.message}`);
    }
    
    throw new Error('خطای نامشخص در آپلود تصویر');
  }
};
