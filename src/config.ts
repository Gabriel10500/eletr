export const WHATSAPP_RAW_NUMBER = '5511946951050';
export const WHATSAPP_FORMATTED_NUMBER = '(11) 94695-1050';

export function getWhatsAppUrl(message: string): string {
  return `https://wa.me/${WHATSAPP_RAW_NUMBER}?text=${encodeURIComponent(message)}`;
}
