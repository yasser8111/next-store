import { updateCartBadge } from "../core/header.js";

// Get cart from localStorage
export function getCart() {
  return JSON.parse(localStorage.getItem('cart')) || [];
}

// Save cart to localStorage
export function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

// Add to cart 
export function addToCart(product, size) {
  const cart = JSON.parse(localStorage.getItem("cart")) || [];

  const cartItem = {
    id: product.id,
    name: product.name,
    price: product.price,
    currency: product.currency,
    size: size,
    image: product.images[0],
    quantity: 1
  };

  const existingItemIndex = cart.findIndex(
    item => item.id === cartItem.id && item.size === cartItem.size
  );

  if (existingItemIndex > -1) {
    cart[existingItemIndex].quantity += 1;
  } else {
    cart.push(cartItem);
  }

  localStorage.setItem("cart", JSON.stringify(cart));
  updateCartBadge();
}

// Remove product from cart
export function removeFromCart(productId, size = null) {
  let cart = getCart();
  cart = cart.filter(item => !(item.id === productId && item.size === size));
  saveCart(cart);
}

// Update quantity
export function updateQuantity(productId, size, quantity) {
  const cart = getCart();
  const index = cart.findIndex(item => item.id === productId && item.size === size);
  if (index !== -1) {
    cart[index].quantity = quantity;
    saveCart(cart);
  }
}