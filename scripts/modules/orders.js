import { db } from "../firebase/firebase-config";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

export async function createOrder(orderData) {
  try {
    await addDoc(collection(db, "orders"), {
      ...orderData,
      createdAt: serverTimestamp()
    });
    return true;
  } catch (error) {
    console.error("Error creating order:", error);
    return false;
  }
}
