// modules/orders.js
import { db } from "../firebase/firebase-config.js";
import { collection, addDoc } from "https://www.gstatic.com/firebasejs/10.13.0/firebase-firestore.js";

export async function createOrder(orderData) {
  try {
    const ordersRef = collection(db, "orders");

    await addDoc(ordersRef, orderData);

    console.log("Order saved:", orderData);

    return true; 
  } catch (error) {
    console.error("Error creating order:", error);
    return false;
  }
}
