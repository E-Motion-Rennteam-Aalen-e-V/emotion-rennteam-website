import QRCode from 'qrcode';
import type { TeamMember } from './content';
import { generateMECard } from './vcard-generator';

/**
 * Erstellt den QR-Code-Inhalt aus den Teammitglied-Daten.
 * Generates QR code content from team member data.
 *
 * Wir nutzen MECARD statt vCard, weil MECARD deutlich kürzer ist und
 * damit weniger QR-Datenmodule benötigt — das macht den Code robuster beim
 * Scannen, besonders auf kleinen Bildschirmen oder bei ungünstiger Beleuchtung.
 * Uses MECARD format instead of vCard because MECARD is significantly
 * shorter, needs fewer QR data modules, and therefore scans more reliably
 * on small screens or in low light.
 */
export function generateQRCodeValue(member: TeamMember): string {
  return generateMECard(member);
}

/**
 * Erzeugt den QR-Code als Data-URL (PNG-Bild), direkt einbettbar in <img src=…>.
 * Generates QR code as a Data URL (PNG image), directly embeddable as <img src=…>.
 *
 * errorCorrectionLevel 'H' = 30 % Wiederherstellungskapazität. Klingt nach
 * Overhead, ist aber wichtig: Viele Handy-Kameras lesen QR-Codes, die
 * leicht verdeckt oder gedruckt mit Tintenproblemen sind. 'H' kostet etwas
 * mehr Fläche, verhindert aber Scan-Fehler in der Praxis.
 *
 * errorCorrectionLevel 'H' = 30 % recovery capacity. Sounds like overhead,
 * but it matters: many phone cameras read QR codes that are slightly obscured
 * or printed with ink imperfections. 'H' costs a bit more area but prevents
 * scan failures in practice.
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
