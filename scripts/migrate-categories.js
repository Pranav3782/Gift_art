import { initializeApp, cert } from 'firebase-admin/app';
import { getFirestore } from 'firebase-admin/firestore';
import * as dotenv from 'dotenv';
import path from 'path';

dotenv.config({ path: path.resolve(__dirname, '../.env.local') });

// Make sure to add your service account JSON file
// or use GOOGLE_APPLICATION_CREDENTIALS for admin operations
const serviceAccountPath = process.env.FIREBASE_SERVICE_ACCOUNT_PATH;
if (!serviceAccountPath) {
  console.warn("Please set FIREBASE_SERVICE_ACCOUNT_PATH in .env.local to run migration");
} else {
  const serviceAccount = require(path.resolve(serviceAccountPath));
  
  initializeApp({
    credential: cert(serviceAccount)
  });
}

const db = getFirestore();

const CATEGORIES_TO_MIGRATE = [
  { name: 'Kids', slug: 'kids', description: 'Gifts and accessories for kids.', status: 'Active' },
  { name: 'Adults', slug: 'adults', description: 'Mens, womens, and unisex items.', status: 'Active' },
  { name: 'Personalized Gifts', slug: 'personalized-gifts', description: 'Mugs, bottles, passport covers, etc.', status: 'Active' },
  { name: 'Accessories', slug: 'accessories', description: 'Bags, travel combos, gift boxes.', status: 'Active' },
  { name: 'New Collection', slug: 'new', description: 'New launches and best sellers.', status: 'Active' },
];

async function migrate() {
  console.log("Starting Category Migration...");
  const categoriesRef = db.collection('categories');
  
  for (const cat of CATEGORIES_TO_MIGRATE) {
    const existing = await categoriesRef.where('slug', '==', cat.slug).get();
    if (existing.empty) {
      console.log(`Creating category: ${cat.name}`);
      await categoriesRef.add({
        ...cat,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    } else {
      console.log(`Category already exists: ${cat.name}`);
    }
  }
  console.log("Migration complete.");
}

if (serviceAccountPath) {
  migrate().catch(console.error);
}
