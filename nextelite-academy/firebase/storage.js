// Firebase Storage utilities for image management
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  deleteObject,
  listAll,
  getMetadata
} from "firebase/storage";
import { storage } from "./config.js";
import { 
  collection, 
  doc, 
  getDocs, 
  setDoc, 
  deleteDoc,
  getDoc,
  query,
  orderBy
} from "firebase/firestore";
import { db } from "./config.js";

const IMAGES_COLLECTION = 'images';

// Upload an image file to Firebase Storage and save metadata to Firestore
export const uploadImage = async (file, folder = 'images') => {
  try {
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileExtension = file.name.split('.').pop();
    const fileName = `${timestamp}_${randomStr}.${fileExtension}`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    // Save metadata to Firestore
    const imageData = {
      fileName,
      url: downloadURL,
      path: `${folder}/${fileName}`,
      name: file.name,
      size: file.size,
      type: file.type,
      uploadedAt: new Date().toISOString(),
      order: Date.now() // For sorting/ordering
    };

    const imageRef = doc(collection(db, IMAGES_COLLECTION));
    await setDoc(imageRef, imageData);

    return {
      id: imageRef.id,
      ...imageData
    };
  } catch (error) {
    console.error('Error uploading image:', error);
    throw error;
  }
};

// Get all images from Firestore
export const getImages = async () => {
  try {
    const imagesRef = collection(db, IMAGES_COLLECTION);
    const q = query(imagesRef, orderBy('order', 'desc'));
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
  } catch (error) {
    console.error('Error fetching images:', error);
    return [];
  }
};

// Delete an image from both Storage and Firestore
export const deleteImage = async (imageId, imagePath) => {
  try {
    // Delete from Storage
    if (imagePath) {
      const storageRef = ref(storage, imagePath);
      await deleteObject(storageRef);
    }

    // Delete from Firestore
    await deleteDoc(doc(db, IMAGES_COLLECTION, imageId));

    return true;
  } catch (error) {
    console.error('Error deleting image:', error);
    throw error;
  }
};

// Update image order in Firestore
export const updateImageOrder = async (imageId, order) => {
  try {
    const imageRef = doc(db, IMAGES_COLLECTION, imageId);
    await setDoc(imageRef, { order }, { merge: true });
    return true;
  } catch (error) {
    console.error('Error updating image order:', error);
    throw error;
  }
};

// Update multiple image orders at once
export const updateImagesOrder = async (imageOrders) => {
  try {
    const promises = imageOrders.map(({ id, order }) => 
      setDoc(doc(db, IMAGES_COLLECTION, id), { order }, { merge: true })
    );
    await Promise.all(promises);
    return true;
  } catch (error) {
    console.error('Error updating images order:', error);
    throw error;
  }
};

// Upload multiple images
export const uploadMultipleImages = async (files, folder = 'images') => {
  try {
    const uploadPromises = Array.from(files).map(file => uploadImage(file, folder));
    const results = await Promise.all(uploadPromises);
    return results;
  } catch (error) {
    console.error('Error uploading multiple images:', error);
    throw error;
  }
};

// Upload a PDF file to Firebase Storage
export const uploadPDF = async (file, folder = 'attachments') => {
  try {
    if (!file.type.includes('pdf')) {
      throw new Error('File must be a PDF');
    }
    // Generate unique filename
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 15);
    const fileName = `${timestamp}_${randomStr}.pdf`;
    const storageRef = ref(storage, `${folder}/${fileName}`);

    // Upload file
    const snapshot = await uploadBytes(storageRef, file);
    const downloadURL = await getDownloadURL(snapshot.ref);

    return {
      name: file.name,
      size: formatFileSize(file.size),
      url: downloadURL,
    };
  } catch (error) {
    console.error('Error uploading PDF:', error);
    throw error;
  }
};

// Helper function to format file size
const formatFileSize = (bytes) => {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
};

