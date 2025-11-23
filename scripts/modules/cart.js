import { updateCartBadge } from "../core/header.js";

// Get cart from localStorage
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
}

// Add to cart (fixed for new DB structure)
export function addToCart(product, size) {
  const cart = getCart();

  const cartItem = {
    productId: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency,
    selectedSize: size || null,
    image: product.mainImage, // FIXED
    quantity: 1
  };

  // Check if item already in cart (same product + same size)
  const existingIndex = cart.findIndex(
    item => item.productId === cartItem.productId && item.selectedSize === cartItem.selectedSize
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  saveCart(cart);
  updateCartBadge();
}

// Remove product from cart
export function removeFromCart(productId, size = null) {
  let cart = getCart();
  cart = cart.filter(item => !(item.productId === productId && item.selectedSize === size));
  saveCart(cart);
}

// Update quantity
export function updateQuantity(productId, size, quantity) {
  const cart = getCart();
  const index = cart.findIndex(
    item => item.productId === productId && item.selectedSize === size
  );

  if (index !== -1) {
    cart[index].quantity = quantity;
    saveCart(cart);
  }
}
