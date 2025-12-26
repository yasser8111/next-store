/**
 * Fix image URL if it doesn't have a full path
 */
export function fixImageUrl(url) {
  if (!url) return "https://res.cloudinary.com/dxbelrmq1/image/upload/default.jpg";
  if (url.startsWith("http://") || url.startsWith("https://")) return url;
  return `https://res.cloudinary.com/dxbelrmq1/image/upload/${url}`;
}