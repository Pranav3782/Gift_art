const { initializeApp } = require('firebase/app');
const { getFirestore, collection, getDocs } = require('firebase/firestore');

const firebaseConfig = {
  apiKey: "AIzaSyB4oXre_27lq9cU0SEWcapnCxHoZqA3HOw",
  authDomain: "studio-157276530-549e7.firebaseapp.com",
  projectId: "studio-157276530-549e7",
  storageBucket: "studio-157276530-549e7.firebasestorage.app",
  messagingSenderId: "701221566766",
  appId: "1:701221566766:web:bf6a0467c43d384667a2bf"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

async function run() {
  console.log("Fetching products...");
  const querySnapshot = await getDocs(collection(db, "products"));
  console.log(`Found ${querySnapshot.size} products:`);
  querySnapshot.forEach((doc) => {
    const data = doc.data();
    console.log(`ID: ${doc.id}`);
    console.log(`Name: ${data.name}`);
    console.log(`Image: ${data.image}`);
    console.log(`isNew: ${data.isNew}`);
    console.log("------------------------");
  });
  process.exit(0);
}

run().catch(err => {
  console.error(err);
  process.exit(1);
});
