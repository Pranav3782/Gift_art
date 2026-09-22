
'use client';

import { initializeApp, getApps, getApp, FirebaseApp } from 'firebase/app';
import { getFirestore, Firestore } from 'firebase/firestore';
import { getAuth, Auth } from 'firebase/auth';
import { getStorage, FirebaseStorage } from 'firebase/storage';
import { firebaseConfig } from './config';

interface FirebaseServices {
  firebaseApp: FirebaseApp | null;
  firestore: Firestore | null;
  auth: Auth | null;
  storage: FirebaseStorage | null;
}

let cachedServices: FirebaseServices | null = null;

export function initializeFirebase(): FirebaseServices {
  if (typeof window === 'undefined') {
    return {
      firebaseApp: null,
      firestore: null,
      auth: null,
      storage: null,
    };
  }

  if (cachedServices) {
    return cachedServices;
  }

  try {
    const firebaseApp = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();
    const firestore = getFirestore(firebaseApp);
    const auth = getAuth(firebaseApp);
    const storage = getStorage(firebaseApp);

    cachedServices = { firebaseApp, firestore, auth, storage };
    return cachedServices;
  } catch (error) {
    console.error('Firebase initialization failed:', error);
    return {
      firebaseApp: null,
      firestore: null,
      auth: null,
      storage: null,
    };
  }
}

export * from './provider';
export * from './client-provider';
export * from './firestore/use-collection';
export * from './firestore/use-doc';
export * from './auth/use-user';
export * from './error-emitter';
export * from './errors';
