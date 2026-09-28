import QRCode from 'qrcode';
import type { TeamMember } from './content';
import { generateMECard } from './vcard-generator';

/**
 * Generates QR code content from team member data
 * Uses MECARD format for optimal mobile scanning
 */
export function generateQRCodeValue(member: TeamMember): string {
  return generateMECard(member);
}

/**
 * Generates QR code as Data URL (PNG image)
 */
export async function generateQRCodeDataUrl(value: string): Promise<string> {
  try {
    return await QRCode.toDataURL(value, {
      errorCorrectionLevel: 'H',
      type: 'image/png',
      width: 200,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF',
      },
    });
  } catch (error) {
    console.error('Failed to generate QR code:', error);
    return '';
  }
}

/**
 * QR Code configuration for visiting cards
 */
export const QR_CONFIG = {
  size: 200,
  level: 'H' as const, // High error correction
  includeMargin: true,
  marginSize: 2,
} as const;
