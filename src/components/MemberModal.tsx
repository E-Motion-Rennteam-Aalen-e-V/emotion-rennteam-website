'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import type { TeamMember } from '@/lib/content';
import { downloadVCard } from '@/lib/vcard-generator';
import { generateQRCodeValue, generateQRCodeDataUrl } from '@/lib/qrcode-generator';

interface MemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');

  // Keyboard & focus management
  useEffect(() => {
    if (!member) return;

    previousActiveElement.current = document.activeElement as HTMLElement;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [member, onClose]);

  // Generate QR code
  useEffect(() => {
    if (!member) return;

    const qrValue = generateQRCodeValue(member);
    generateQRCodeDataUrl(qrValue).then(setQrCodeDataUrl).catch((error) => {
      console.error('Failed to generate QR code:', error);
      setQrCodeDataUrl('');
    });
  }, [member]);

  if (!member) return null;

  // Wallet links
  const getAppleWalletLink = () => {
    // Simplified Apple Wallet intent (users can manually add)
    return `tel:${member.phone}`;
  };

  const getGoogleContactsLink = () => {
    const params = new URLSearchParams();
    if (member.name) params.append('name', member.name);
    if (member.phone) params.append('tel', member.phone);
    if (member.email) params.append('email', member.email);
    return `https://contacts.google.com/?add&contact=${params.toString()}`;
  };

  return (
    <AnimatePresence>
      <motion.div
        role="dialog"
        aria-modal="true"
        aria-labelledby={`modal-title-${member.slug}`}
        ref={dialogRef}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={onClose}
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 backdrop-blur-sm sm:items-center"
      >
        {/* Modal Panel */}
        <motion.div
          initial={{ y: '100%', opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: '100%', opacity: 0 }}
          transition={{ type: 'spring', damping: 35, stiffness: 350 }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm overflow-y-auto rounded-t-2xl border border-border bg-surface shadow-2xl sm:max-w-md sm:rounded-2xl"
          style={{ maxHeight: '90svh' }}
        >
          {/* Close Button */}
          <button
            onClick={onClose}
            aria-label="Close modal"
            className="absolute right-4 top-4 z-10 rounded-full bg-surface-2/80 p-2 transition-colors hover:bg-surface-2 hover:text-accent"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Lanyard (hanging card effect) */}
          <div className="flex justify-center px-6 pt-6">
            <div className="relative h-16 w-8 bg-gradient-to-b from-gray-800 to-gray-900">
              <div className="absolute -top-1 left-1/2 h-3 w-6 -translate-x-1/2 transform rounded-full border border-gray-700 bg-gray-900" />
              <div className="absolute bottom-0 left-1/2 h-2 w-4 -translate-x-1/2 transform rounded-full border border-gray-700 bg-gray-900" />
              <div className="flex h-full items-center justify-center">
                <span className="text-center text-[8px] font-bold text-gray-500 mix-blend-multiply">
                  E-Motion<br />
                  Rennteam
                </span>
              </div>
            </div>
          </div>

          {/* Card Content */}
          <div className="space-y-4 p-6">
            {/* Photo */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.1 }}
              className="relative overflow-hidden rounded-lg bg-surface-2"
            >
              {member.photo ? (
                <Image
                  src={member.photo}
                  alt={member.name}
                  width={300}
                  height={300}
                  className="aspect-square w-full object-cover object-top shadow-[0_0_30px_rgba(0,113,181,0.4)]"
                />
              ) : (
                <div className="aspect-square flex flex-col items-center justify-center gap-2 text-muted">
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    className="h-12 w-12 opacity-30"
                  >
                    <circle cx="12" cy="8" r="4" />
                    <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                  </svg>
                  <span className="text-xs font-medium uppercase tracking-wide">Foto folgt</span>
                </div>
              )}
            </motion.div>

            {/* Name & Role */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.15 }}
              className="space-y-1 text-center"
            >
              <h2 id={`modal-title-${member.slug}`} className="text-2xl font-bold">
                {member.name}
              </h2>
              {member.role && <p className="text-lg font-semibold text-accent">{member.role}</p>}
              {member.department && <p className="text-sm text-muted">{member.department}</p>}
            </motion.div>

            <div className="border-t border-b border-border py-4">
              {/* Contact Details */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.2 }}
                className="space-y-2"
              >
                {member.phone && (
                  <a
                    href={`tel:${member.phone}`}
                    className="flex items-center gap-3 rounded px-2 py-1 text-sm hover:bg-surface-2"
                  >
                    <span className="text-accent">📞</span>
                    <span className="break-all">{member.phone}</span>
                  </a>
                )}
                {member.email && (
                  <a
                    href={`mailto:${member.email}`}
                    className="flex items-center gap-3 rounded px-2 py-1 text-sm hover:bg-surface-2"
                  >
                    <span className="text-accent">📧</span>
                    <span className="break-all text-accent-text underline">{member.email}</span>
                  </a>
                )}
                {member.linkedin && (
                  <a
                    href={member.linkedin}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 rounded px-2 py-1 text-sm hover:bg-surface-2"
                  >
                    <span className="text-accent">🔗</span>
                    <span className="text-accent-text underline">LinkedIn</span>
                  </a>
                )}
              </motion.div>
            </div>

            {/* QR Code */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.3 }}
              className="flex flex-col items-center space-y-2"
            >
              <p className="text-xs text-muted">QR Code scannen</p>
              <div className="rounded bg-white p-2">
                {qrCodeDataUrl ? (
                  <Image
                    src={qrCodeDataUrl}
                    alt="QR Code für Kontaktdaten"
                    width={200}
                    height={200}
                    className="h-[160px] w-[160px] sm:h-[200px] sm:w-[200px]"
                  />
                ) : (
                  <div className="flex h-[160px] w-[160px] items-center justify-center text-xs text-muted sm:h-[200px] sm:w-[200px]">
                    QR wird generiert...
                  </div>
                )}
              </div>
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.4 }}
              className="grid gap-2 pt-2"
            >
              <button
                onClick={() => downloadVCard(member)}
                className="flex items-center justify-center gap-2 rounded-lg bg-accent/20 px-4 py-2.5 font-semibold text-accent transition-all hover:bg-accent/30 active:scale-95"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  className="h-4 w-4"
                >
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                  <polyline points="7 10 12 15 17 10" />
                  <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
                vCard herunterladen
              </button>

              {/* Apple Wallet */}
              <button
                onClick={() => {
                  if (member.phone) {
                    window.location.href = getAppleWalletLink();
                  }
                }}
                className="flex items-center justify-center gap-2 rounded-lg bg-gray-900 px-4 py-2.5 font-semibold text-white transition-all hover:bg-gray-800 active:scale-95"
              >
                <svg viewBox="0 0 24 24" fill="currentColor" className="h-4 w-4">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                </svg>
                Wallet hinzufügen
              </button>

              {/* Google Contacts */}
              {member.email && (
                <a
                  href={getGoogleContactsLink()}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-blue-500/20 px-4 py-2.5 font-semibold text-blue-400 transition-all hover:bg-blue-500/30 active:scale-95"
                >
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    className="h-4 w-4"
                  >
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  Zu Kontakte hinzufügen
                </a>
              )}
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
}
