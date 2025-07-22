
export default function getImageSrc(img) {
  if (!img) return '/placeholder.png';
  if (typeof img === 'string' && img.length > 0) return img;
  if (img instanceof File) return URL.createObjectURL(img);
  if (typeof img === 'object' && typeof img.url === 'string' && img.url.length > 0) return img.url;
  return '/placeholder.png';
} 