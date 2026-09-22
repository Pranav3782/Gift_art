'use client';

import React, { useMemo } from 'react';
import { initializeFirebase, FirebaseProvider } from './index';

export function FirebaseClientProvider({ children }: { children: React.ReactNode }) {
  const { firebaseApp, firestore, auth, storage } = useMemo(() => initializeFirebase(), []);

  return (
    <FirebaseProvider firebaseApp={firebaseApp} firestore={firestore} auth={auth} storage={storage}>
      {children}
    </FirebaseProvider>
  );
}
