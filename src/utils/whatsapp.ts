export const createWhatsAppLink = (phoneNumber: string, message: string): string => {
  const cleanNumber = phoneNumber.replace(/[^0-9]/g, '');
  const encodedMsg = encodeURIComponent(message);
  return `https://wa.me/${cleanNumber}?text=${encodedMsg}`;
};

export const createPhoneLink = (phoneNumber: string): string => {
  const cleanNumber = phoneNumber.replace(/[^0-9+]/g, '');
  return `tel:${cleanNumber}`;
};
