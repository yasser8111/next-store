import { updateCartBadge } from "../core/header.js";

// Get cart from localStorage
export function getCart() {
  return JSON.parse(localStorage.getItem("cart")) || [];
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// Add to cart with full product info
export function addToCart(product, size) {
  const cart = getCart();

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency,
    mainImage: product.mainImage || null,
    hoverImage: product.hoverImage || null,
    galleryImages: product.galleryImages || [],
    selectedSize: size || null,
    quantity: 1
  };

  // Check if item already exists (same product + same size)
  const existingIndex = cart.findIndex(
    item => item.id === cartItem.id && item.selectedSize === cartItem.selectedSize
  );

  if (existingIndex !== -1) {
    cart[existingIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  saveCart(cart);
}

// Remove product from cart
export function removeFromCart(productId, size = null) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === productId && item.selectedSize === size));
  saveCart(cart);
}

// Update quantity
export function updateQuantity(productId, size, quantity) {
  const cart = getCart();
  const index = cart.findIndex(
    item => item.id === productId && item.selectedSize === size
  );

  if (index !== -1) {
    cart[index].quantity = quantity;
    saveCart(cart);
  }
}

// Clear cart
export function clearCart() {
  localStorage.removeItem("cart");
  updateCartBadge();
}
