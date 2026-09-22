
'use client';

import { EventEmitter } from 'events';
import { FirestorePermissionError } from './errors';

type FirebaseEvents = {
  'permission-error': (error: FirestorePermissionError) => void;
};

class FirebaseErrorEmitter extends EventEmitter {
  emit<K extends keyof FirebaseEvents>(event: K, ...args: Parameters<FirebaseEvents[K]>): boolean {
    return super.emit(event, ...args);
  }

  on<K extends keyof FirebaseEvents>(event: K, listener: FirebaseEvents[K]): this {
    return super.on(event, listener);
  }
}

export const errorEmitter = new FirebaseErrorEmitter();
