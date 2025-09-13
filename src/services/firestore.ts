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

// Image upload with Firebase SDK
export const uploadImage = async (file: File): Promise<string> => {
  try {
    // Validate file type
    if (!file.type.startsWith('image/')) {
      throw new Error('فایل انتخاب شده باید تصویر باشد');
    }

    // Validate file size (max 5MB)
    const maxSize = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSize) {
      throw new Error('حجم فایل نباید بیشتر از 5 مگابایت باشد');
    }

    // Create a unique filename
    const timestamp = Date.now();
    const randomString = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop() || 'jpg';
    const fileName = `${timestamp}-${randomString}.${fileExtension}`;
    
    // Create storage reference
    const storageRef = ref(storage, `food-images/${fileName}`);
    
    // Upload metadata
    const metadata = {
      contentType: file.type,
      customMetadata: {
        uploadedBy: 'admin',
        uploadedAt: new Date().toISOString(),
        originalName: file.name
      }
    };
    
    // Upload the file with metadata
    console.log('Starting upload...', { fileName, size: file.size, type: file.type });
    const snapshot = await uploadBytes(storageRef, file, metadata);
    console.log('Upload completed:', snapshot);
    
    // Get the download URL
    const downloadURL = await getDownloadURL(snapshot.ref);
    console.log('Download URL obtained:', downloadURL);
    
    return downloadURL;
  } catch (error) {
    console.error('Error uploading image:', error);
    
    // More specific error handling
    if (error instanceof Error) {
      if (error.message.includes('storage/unauthorized')) {
        throw new Error('شما مجوز آپلود تصویر ندارید. لطفاً دوباره وارد شوید.');
      } else if (error.message.includes('storage/canceled')) {
        throw new Error('آپلود تصویر لغو شد.');
      } else if (error.message.includes('storage/unknown')) {
        throw new Error('خطای نامشخص در آپلود تصویر. لطفاً دوباره تلاش کنید.');
      } else if (error.message.includes('storage/invalid-format')) {
        throw new Error('فرمت فایل پشتیبانی نمی‌شود.');
      } else if (error.message.includes('storage/invalid-checksum')) {
        throw new Error('فایل آسیب دیده است. لطفاً دوباره انتخاب کنید.');
      } else {
        throw new Error(`خطا در آپلود تصویر: ${error.message}`);
      }
    }
    
    throw new Error('خطای نامشخص در آپلود تصویر');
  }
};
