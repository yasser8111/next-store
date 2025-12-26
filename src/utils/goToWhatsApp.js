import { STORE_INFO } from "./constants"

/**
 * Opens a direct WhatsApp chat with the store's number.
 * - phoneNumber: The target phone number in international format (without +).
 * - whatsappUrl: Generates the official WhatsApp API link.
 * - window.open: Opens the link in a new browser tab (_blank) to keep the user on the site.
 */
export const handleWhatsApp = () => {
  const phoneNumber = STORE_INFO.PHONE;
  const whatsappUrl = `https://wa.me/${phoneNumber}`;
  window.open(whatsappUrl, "_blank");
};