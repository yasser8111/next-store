// GetProducts.js
import { doc, getDoc, collection, getDocs } from "firebase/firestore"; // تأكد من إضافة doc و getDoc
import { db } from "./firebaseConfig";

export const getAllProducts = async () => {
  const productsRef = collection(db, "products");
  const snapshot = await getDocs(productsRef);

  return snapshot.docs.map((doc) => ({
    id: doc.id,
    ...doc.data(),
  }));
};

export const getProductById = async (id) => {
  const docRef = doc(db, "products", id); 
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    return { id: docSnap.id, ...docSnap.data() };
  } else {
    return null;
  }
};
