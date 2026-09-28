import type { TeamMember } from './content';

/**
 * Generates RFC 5545 compliant vCard (virtual contact) format
 * Compatible with all major contact apps (Outlook, Apple Contacts, Google Contacts, etc)
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
 * Escapes special characters in vCard field values
 * vCard spec requires escaping of: comma, semicolon, backslash, newline
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
 * Generates MECARD format (mobile-friendly QR code content)
 * Used for scanning with phone camera to add contact
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
 * Triggers download of vCard file
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
