import type { TeamMember } from './content';

/**
 * Erzeugt eine vCard nach RFC 6350 (Version 3.0) — das universelle Format
 * für digitale Visitenkarten, das von Outlook, Apple Contacts, Google
 * Contacts und praktisch jeder anderen Kontakt-App verstanden wird.
 * Generates an RFC 6350-compliant vCard (version 3.0) — the universal
 * digital business-card format understood by Outlook, Apple Contacts,
 * Google Contacts, and virtually every other contacts app.
 *
 * Trennzeichen ist \r\n (CRLF), nicht nur \n — das schreibt die Spec vor.
 * Einige Apps (v. a. ältere Outlook-Versionen) lehnen vCards mit reinem LF
 * ab oder importieren sie fehlerhaft.
 * The line separator is \r\n (CRLF), not just \n — the spec requires it.
 * Some apps (especially older Outlook versions) reject or mangle vCards
 * with bare LF line endings.
 */
export function generateVCard(member: TeamMember): string {
  const lines: string[] = [
    'BEGIN:VCARD',
    'VERSION:3.0',
    `FN:${escapeVCardValue(member.name)}`,
  ];

  if (member.role) {
    lines.push(`TITLE:${escapeVCardValue(member.role)}`);
  }

  lines.push('ORG:E-Motion Rennteam Aalen');

  if (member.phone) {
    lines.push(`TEL;TYPE=WORK:${escapeVCardValue(member.phone)}`);
  }

  if (member.email) {
    lines.push(`EMAIL;TYPE=WORK:${escapeVCardValue(member.email)}`);
  }

  if (member.linkedin) {
    lines.push(`URL:${escapeVCardValue(member.linkedin)}`);
  }

  if (member.department) {
    lines.push(`NOTE:${escapeVCardValue(member.department)}`);
  }

  if (member.body) {
    const cleanBody = member.body.replace(/\[.*?\]\(.*?\)/g, '').trim();
    lines.push(`DESCRIPTION:${escapeVCardValue(cleanBody)}`);
  }

  lines.push('END:VCARD');
  return lines.join('\r\n');
}

/**
 * Maskiert Sonderzeichen in vCard-Feldwerten.
 * Escapes special characters in vCard field values.
 *
 * Die vCard-Spec (RFC 6350 §3.4) verlangt Escaping für: Komma, Semikolon,
 * Backslash und Zeilenumbruch. Ohne das würde ein Name wie "Müller, Hans"
 * als zwei getrennte Namensteile interpretiert.
 * The vCard spec (RFC 6350 §3.4) requires escaping of: comma, semicolon,
 * backslash, and newline. Without it, a name like "Müller, Hans" would be
 * parsed as two separate name components.
 */
function escapeVCardValue(value: string): string {
  if (!value) return '';
  return value
    .replace(/\\/g, '\\\\')
    .replace(/,/g, '\\,')
    .replace(/;/g, '\\;')
    .replace(/\n/g, '\\n');
}

/**
 * Erzeugt das MECARD-Format — kompakter als vCard und ideal für QR-Codes.
 * Generates MECARD format — more compact than vCard and ideal for QR codes.
 *
 * MECARD wurde von NTT DoCoMo entwickelt und ist auf praktisch jedem
 * modernen Smartphone nativ lesbar (iOS Kamera-App, Android-Kamera etc.).
 * Wichtig: Der Name wird umgekehrt gespeichert (Nachname, Vorname), weil
 * das der MECARD-Standard so vorschreibt — beim Import dreht die App es
 * wieder um.
 *
 * MECARD was developed by NTT DoCoMo and is natively readable by virtually
 * every modern smartphone (iOS Camera app, Android camera, etc.). Note: the
 * name is stored in reverse order (last name, first name) as the MECARD
 * standard requires — contact apps flip it back on import.
 */
export function generateMECard(member: TeamMember): string {
  const parts: string[] = [];

  parts.push(`N:${member.name.split(' ').reverse().join(',')}`);

  if (member.phone) {
    parts.push(`TEL:${member.phone}`);
  }

  if (member.email) {
    parts.push(`EMAIL:${member.email}`);
  }

  if (member.linkedin) {
    parts.push(`URL:${member.linkedin}`);
  }

  if (member.role) {
    parts.push(`TITLE:${member.role}`);
  }

  return `MECARD:${parts.join(';')}`;
}

/**
 * Löst den Download der vCard-Datei im Browser aus.
 * Triggers a vCard file download in the browser.
 *
 * Wir erstellen einen temporären <a>-Link mit einer Blob-URL, klicken ihn
 * programmatisch und räumen danach auf. revokeObjectURL ist wichtig: Ohne
 * es hält der Browser den Speicher des Blobs so lange, bis der Tab
 * geschlossen wird.
 *
 * We create a temporary <a> link with a Blob URL, click it programmatically,
 * then clean up. revokeObjectURL matters: without it the browser keeps the
 * blob's memory allocated until the tab is closed.
 */
export function downloadVCard(member: TeamMember): void {
  const vcard = generateVCard(member);
  const blob = new Blob([vcard], { type: 'text/vcard;charset=utf-8' });
  const url = URL.createObjectURL(blob);

  const link = document.createElement('a');
  link.href = url;
  link.download = `${member.slug || member.name.toLowerCase().replace(/\s+/g, '-')}.vcf`;
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
