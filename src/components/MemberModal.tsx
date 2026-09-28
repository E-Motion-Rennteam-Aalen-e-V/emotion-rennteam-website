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

function maskPhone(phone: string): string {
  // Show first 7 chars then dots: "+49 (17" → "+49 (17X) •••–••••"
  const digits = phone.replace(/\D/g, '');
  if (digits.length < 4) return phone;
  const prefix = phone.slice(0, Math.min(10, Math.ceil(phone.length * 0.45)));
  return prefix + ' •••–••••';
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  const shown = local.slice(0, 2);
  return `${shown}•••@${domain}`;
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [flipped, setFlipped] = useState(false);

  useEffect(() => {
    if (!member) {
      setFlipped(false);
      return;
    }
    previousActiveElement.current = document.activeElement as HTMLElement;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [member, onClose]);

  useEffect(() => {
    if (!member) return;
    const qrValue = generateQRCodeValue(member);
    generateQRCodeDataUrl(qrValue).then(setQrCodeDataUrl).catch(() => setQrCodeDataUrl(''));
  }, [member]);

  const getGoogleContactsLink = () => {
    if (!member) return '#';
    const params = new URLSearchParams();
    if (member.name) params.append('name', member.name);
    if (member.phone) params.append('tel', member.phone);
    if (member.email) params.append('email', member.email);
    return `https://contacts.google.com/?add&contact=${params.toString()}`;
  };

  return (
    <AnimatePresence>
      {member && (
        <motion.div
          key="overlay"
          role="dialog"
          aria-modal="true"
          aria-labelledby={`modal-title-${member.slug}`}
          ref={dialogRef}
          tabIndex={-1}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.25 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto bg-black/70 backdrop-blur-md"
          style={{ paddingTop: 'clamp(32px, 8vh, 80px)', paddingBottom: 32 }}
        >
          {/* Close button */}
          <button
            onClick={onClose}
            aria-label="Schließen"
            className="fixed right-5 top-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/60 text-white/80 backdrop-blur-sm transition-colors hover:bg-white/10 hover:text-white"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" className="h-5 w-5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Hanging card wrapper — stops click propagation */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -60, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -40, opacity: 0 }}
            transition={{ type: 'spring', damping: 22, stiffness: 200 }}
            className="flex flex-col items-center"
          >
            {/* Rope + clip */}
            <div className="flex flex-col items-center" style={{ pointerEvents: 'none' }}>
              {/* Clip hole */}
              <div
                style={{
                  width: 14,
                  height: 14,
                  borderRadius: '50%',
                  border: '2.5px solid #9aa0b4',
                  background: '#1a1d2e',
                  marginBottom: -1,
                  zIndex: 2,
                }}
              />
              {/* Metal clip body */}
              <div
                style={{
                  width: 22,
                  height: 12,
                  background: 'linear-gradient(180deg, #b0b8cc 0%, #6b7280 100%)',
                  borderRadius: '3px 3px 2px 2px',
                  border: '1px solid #4b5563',
                  marginBottom: -1,
                  zIndex: 2,
                }}
              />
              {/* Rope */}
              <div
                style={{
                  width: 3,
                  height: 64,
                  background: 'linear-gradient(180deg, #6b7280 0%, #374151 100%)',
                  borderRadius: 2,
                }}
              />
            </div>

            {/* The card with swing */}
            <motion.div
              animate={{ rotate: [-1.5, 1.5, -1.5] }}
              transition={{ repeat: Infinity, duration: 3.8, ease: 'easeInOut' }}
              style={{ transformOrigin: 'top center', perspective: 1000 }}
              className="cursor-pointer"
              onClick={() => setFlipped((f) => !f)}
            >
              {/* 3D flip container */}
              <div
                style={{
                  width: 296,
                  height: 432,
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.7s cubic-bezier(0.4,0,0.2,1)',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}
              >
                {/* ── FRONT ── */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: '#06070d',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.7), 0 0 0 1px rgba(0,113,181,0.15)',
                  }}
                >
                  {/* Racing stripe */}
                  <div
                    style={{
                      position: 'absolute',
                      top: 0,
                      left: 0,
                      right: 0,
                      height: 5,
                      background: 'linear-gradient(90deg, #0071b5 0%, #162e7b 100%)',
                    }}
                  />

                  {/* Logo bar */}
                  <div
                    style={{
                      padding: '14px 18px 10px',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 8,
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 40 40" fill="none">
                      <rect width="40" height="40" rx="8" fill="#0071b5" />
                      <path d="M8 28L14 12H20L16 22H22L18 32H8Z" fill="white" />
                      <path d="M20 12H32L28 22H24L28 12" fill="white" opacity="0.7" />
                    </svg>
                    <span style={{ color: '#9aa0b4', fontSize: 11, fontWeight: 700, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      E-Motion Rennteam Aalen
                    </span>
                  </div>

                  {/* Photo */}
                  <div style={{ padding: '14px 18px 0' }}>
                    <div
                      style={{
                        width: '100%',
                        aspectRatio: '1 / 1',
                        borderRadius: 10,
                        overflow: 'hidden',
                        background: '#0f1120',
                        border: '1px solid rgba(0,113,181,0.2)',
                        maxHeight: 190,
                      }}
                    >
                      {member.photo ? (
                        <Image
                          src={member.photo}
                          alt={member.name}
                          width={260}
                          height={190}
                          style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                        />
                      ) : (
                        <div style={{ width: '100%', height: '100%', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', color: '#4b5563', gap: 6 }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 36, height: 36, opacity: 0.4 }}>
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                          </svg>
                          <span style={{ fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.1em' }}>Foto folgt</span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Name / role / dept */}
                  <div style={{ padding: '12px 18px 14px', textAlign: 'center' }}>
                    <h2
                      id={`modal-title-${member.slug}`}
                      style={{ color: '#f5f6f8', fontSize: 20, fontWeight: 800, lineHeight: 1.2, margin: 0 }}
                    >
                      {member.name}
                    </h2>
                    {member.role && (
                      <p style={{ color: '#0071b5', fontSize: 13, fontWeight: 700, marginTop: 4, letterSpacing: '0.04em' }}>
                        {member.role}
                      </p>
                    )}
                    {member.department && (
                      <p style={{ color: '#9aa0b4', fontSize: 11, marginTop: 2 }}>{member.department}</p>
                    )}
                  </div>

                  {/* Flip hint */}
                  <div style={{ position: 'absolute', bottom: 12, width: '100%', textAlign: 'center' }}>
                    <span style={{ color: '#4b5563', fontSize: 10, letterSpacing: '0.12em', textTransform: 'uppercase' }}>
                      Tippen zum Umdrehen
                    </span>
                  </div>
                </div>

                {/* ── BACK ── */}
                <div
                  style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: 16,
                    overflow: 'hidden',
                    background: 'linear-gradient(160deg, #0c1a35 0%, #06070d 55%)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: '0 25px 60px rgba(0,0,0,0.7)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  {/* Top accent */}
                  <div style={{ height: 5, background: 'linear-gradient(90deg, #162e7b 0%, #0071b5 100%)', flexShrink: 0 }} />

                  {/* Header */}
                  <div style={{ padding: '12px 18px', borderBottom: '1px solid rgba(255,255,255,0.06)', flexShrink: 0 }}>
                    <p style={{ color: '#f5f6f8', fontSize: 15, fontWeight: 800, margin: 0 }}>{member.name}</p>
                    {member.role && <p style={{ color: '#0071b5', fontSize: 11, fontWeight: 600, margin: 0, marginTop: 2 }}>{member.role}</p>}
                  </div>

                  {/* Contact rows */}
                  <div style={{ padding: '10px 18px', display: 'flex', flexDirection: 'column', gap: 6, flexShrink: 0 }}>
                    {member.phone && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#0071b5', fontSize: 14 }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82A16 16 0 0 0 15.18 16.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                          </svg>
                        </span>
                        <span style={{ color: '#9aa0b4', fontSize: 13 }}>{maskPhone(member.phone)}</span>
                      </div>
                    )}
                    {member.email && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#0071b5', fontSize: 14 }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
                            <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                            <polyline points="22,6 12,13 2,6" />
                          </svg>
                        </span>
                        <span style={{ color: '#9aa0b4', fontSize: 13 }}>{maskEmail(member.email)}</span>
                      </div>
                    )}
                    {member.linkedin && (
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <span style={{ color: '#0071b5', fontSize: 14 }}>
                          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 15, height: 15 }}>
                            <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z" />
                          </svg>
                        </span>
                        <span style={{ color: '#9aa0b4', fontSize: 13 }}>linkedin.com/in/•••</span>
                      </div>
                    )}
                  </div>

                  {/* QR Code */}
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '6px 18px', flexShrink: 0 }}>
                    <div style={{ background: 'white', borderRadius: 8, padding: 8, display: 'inline-block' }}>
                      {qrCodeDataUrl ? (
                        <img src={qrCodeDataUrl} alt="QR Code" style={{ width: 120, height: 120, display: 'block' }} />
                      ) : (
                        <div style={{ width: 120, height: 120, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa0b4', fontSize: 10 }}>
                          Wird geladen…
                        </div>
                      )}
                    </div>
                    <p style={{ color: '#4b5563', fontSize: 10, marginTop: 5, textTransform: 'uppercase', letterSpacing: '0.1em' }}>QR scannen → Kontakt</p>
                  </div>

                  {/* Action buttons */}
                  <div style={{ padding: '8px 18px 14px', display: 'flex', flexDirection: 'column', gap: 7, flexGrow: 1, justifyContent: 'flex-end' }}>
                    <button
                      onClick={(e) => { e.stopPropagation(); downloadVCard(member); }}
                      style={{
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                        background: 'rgba(0,113,181,0.2)', border: '1px solid rgba(0,113,181,0.4)',
                        borderRadius: 8, padding: '9px 12px', color: '#60b0e8', fontSize: 12,
                        fontWeight: 700, cursor: 'pointer', letterSpacing: '0.05em',
                      }}
                    >
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                        <polyline points="7 10 12 15 17 10" />
                        <line x1="12" y1="15" x2="12" y2="3" />
                      </svg>
                      vCard herunterladen
                    </button>

                    <div style={{ display: 'flex', gap: 7 }}>
                      {member.email && (
                        <a
                          href={getGoogleContactsLink()}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, padding: '8px 6px', color: '#9aa0b4', fontSize: 11,
                            fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
                            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                            <circle cx="12" cy="7" r="4" />
                          </svg>
                          Google
                        </a>
                      )}
                      {member.phone && (
                        <a
                          href={`tel:${member.phone}`}
                          onClick={(e) => e.stopPropagation()}
                          style={{
                            flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                            background: 'rgba(0,0,0,0.4)', border: '1px solid rgba(255,255,255,0.1)',
                            borderRadius: 8, padding: '8px 6px', color: '#9aa0b4', fontSize: 11,
                            fontWeight: 600, textDecoration: 'none', cursor: 'pointer',
                          }}
                        >
                          <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 13, height: 13 }}>
                            <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                          </svg>
                          Wallet
                        </a>
                      )}
                    </div>
                  </div>

                  {/* Footer */}
                  <div style={{ borderTop: '1px solid rgba(255,255,255,0.06)', padding: '8px 18px', textAlign: 'center', flexShrink: 0 }}>
                    <span style={{ color: '#374151', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                      E-Motion Rennteam Aalen e.V. · Hochschule Aalen
                    </span>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Hint below card */}
            <p style={{ color: 'rgba(255,255,255,0.3)', fontSize: 11, marginTop: 14, letterSpacing: '0.08em', textTransform: 'uppercase' }}>
              Karte anklicken zum Umdrehen
            </p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
