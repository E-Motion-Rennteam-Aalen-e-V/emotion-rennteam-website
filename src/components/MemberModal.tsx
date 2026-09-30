'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring } from 'framer-motion';
import Image from 'next/image';
import type { TeamMember } from '@/lib/content';
import { downloadVCard } from '@/lib/vcard-generator';
import { generateQRCodeValue, generateQRCodeDataUrl } from '@/lib/qrcode-generator';

interface MemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

function maskPhone(phone: string): string {
  const prefix = phone.slice(0, Math.min(10, Math.ceil(phone.length * 0.45)));
  return prefix + ' •••–••••';
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  return `${local.slice(0, 2)}•••@${domain}`;
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [hovering, setHovering] = useState(false);

  const isExecutive = member ? ['ceo', 'cto', 'cfo'].includes(member.roleLevel || '') : false;
  const isLeadership = member
    ? isExecutive || ['Teamleiter', 'Leitung'].includes((member.role || '').trim())
    : false;
  const showRealContact = isLeadership;

  // Tilt on hover
  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 200, damping: 20 });
  const springY = useSpring(tiltY, { stiffness: 200, damping: 20 });

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

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    tiltX.set(y * -12);
    tiltY.set(x * 12);
  };

  const handleMouseLeave = () => {
    tiltX.set(0);
    tiltY.set(0);
    setHovering(false);
  };

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
          transition={{ duration: 0.3 }}
          onClick={onClose}
          className="fixed inset-0 z-50 flex flex-col items-center justify-start overflow-y-auto"
          style={{
            paddingTop: 'clamp(40px, 6vh, 72px)',
            paddingBottom: 48,
            background: 'radial-gradient(ellipse at 50% 0%, rgba(0,113,181,0.18) 0%, rgba(0,0,0,0.85) 60%)',
            backdropFilter: 'blur(20px)',
          }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            aria-label="Schließen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.1, backgroundColor: 'rgba(255,255,255,0.15)' }}
            whileTap={{ scale: 0.95 }}
            className="fixed right-5 top-5 z-[60] flex h-10 w-10 items-center justify-center rounded-full border border-white/20 bg-black/50 text-white/70 backdrop-blur-sm"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-4 w-4">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Card wrapper */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.95 }}
            transition={{ type: 'spring', damping: 18, stiffness: 160, mass: 1.2 }}
            className="flex flex-col items-center"
            style={{ filter: 'drop-shadow(0 40px 80px rgba(0,0,0,0.8))' }}
          >
            {/* Lanyard */}
            <div className="flex flex-col items-center" style={{ pointerEvents: 'none' }}>
              {/* Attachment hole */}
              <div style={{
                width: 16,
                height: 16,
                borderRadius: '50%',
                background: 'radial-gradient(circle, #2a2d40 30%, #1a1d2e 100%)',
                border: '2px solid #5a6070',
                boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.8), 0 0 0 1px rgba(255,255,255,0.04)',
                marginBottom: -2,
                zIndex: 3,
              }} />
              {/* Metal clip */}
              <div style={{
                width: 26,
                height: 14,
                background: 'linear-gradient(180deg, #c8d0e0 0%, #8892a4 40%, #6b7280 100%)',
                borderRadius: '4px 4px 3px 3px',
                border: '1px solid rgba(0,0,0,0.3)',
                boxShadow: '0 2px 4px rgba(0,0,0,0.4), inset 0 1px 0 rgba(255,255,255,0.4)',
                marginBottom: -1,
                zIndex: 2,
                position: 'relative',
              }}>
                {/* Clip highlight */}
                <div style={{
                  position: 'absolute',
                  top: 2,
                  left: 3,
                  right: 3,
                  height: 3,
                  borderRadius: 2,
                  background: 'rgba(255,255,255,0.35)',
                }} />
              </div>
              {/* Rope with subtle gradient */}
              <div style={{
                width: 4,
                height: 72,
                background: 'linear-gradient(180deg, #7c8494 0%, #4a5060 50%, #2e3340 100%)',
                borderRadius: 3,
                boxShadow: '1px 0 0 rgba(255,255,255,0.06)',
              }} />
            </div>

            {/* Card with swing + tilt */}
            <motion.div
              animate={!hovering ? { rotate: [-1, 1, -0.5, 0.5, -1] } : { rotate: 0 }}
              transition={!hovering
                ? { repeat: Infinity, duration: 5, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }
                : { duration: 0.4, ease: 'easeOut' }
              }
              style={{ transformOrigin: 'top center' }}
            >
              <motion.div
                style={{
                  rotateX: flipped ? 0 : springX,
                  rotateY: flipped ? 0 : springY,
                  transformPerspective: 1200,
                  cursor: 'pointer',
                }}
                onMouseMove={!flipped ? handleMouseMove : undefined}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={handleMouseLeave}
                onClick={() => setFlipped((f) => !f)}
              >
                {/* 3D flip container — responsive: clamp card to viewport */}
                <div
                  style={{
                    width: 'min(310px, 88vw)',
                    height: 'min(460px, calc(88vw * 1.484))',
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.75s cubic-bezier(0.35,0,0.15,1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >
                  {/* ══ FRONT ══ */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: 'linear-gradient(145deg, #0d0f1e 0%, #06070d 100%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,113,181,0.12), inset 0 1px 0 rgba(255,255,255,0.06)',
                  }}>
                    {/* Top racing stripe */}
                    <div style={{
                      position: 'absolute', top: 0, left: 0, right: 0, height: 4,
                      background: 'linear-gradient(90deg, #0071b5 0%, #2563eb 50%, #162e7b 100%)',
                      zIndex: 2,
                    }} />

                    {/* Subtle grid texture overlay */}
                    <div style={{
                      position: 'absolute', inset: 0, zIndex: 1,
                      backgroundImage: 'linear-gradient(rgba(255,255,255,0.015) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.015) 1px, transparent 1px)',
                      backgroundSize: '20px 20px',
                    }} />

                    {/* Logo bar */}
                    <div style={{
                      position: 'relative', zIndex: 3,
                      padding: '16px 20px 12px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{
                        width: 32, height: 32, borderRadius: 8, overflow: 'hidden',
                        background: '#0071b5',
                        boxShadow: '0 2px 8px rgba(0,113,181,0.5)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                      }}>
                        <svg width="22" height="22" viewBox="0 0 40 40" fill="none">
                          <path d="M8 28L14 12H20L16 22H22L18 32H8Z" fill="white" />
                          <path d="M20 12H32L28 22H24L28 12" fill="white" opacity="0.65" />
                        </svg>
                      </div>
                      <div>
                        <div style={{ color: '#e2e8f0', fontSize: 11, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>
                          E-Motion
                        </div>
                        <div style={{ color: '#6b7280', fontSize: 9, fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase', marginTop: 2 }}>
                          Rennteam Aalen
                        </div>
                      </div>
                      {isExecutive && (
                        <div style={{ marginLeft: 'auto' }}>
                          <span style={{
                            background: 'linear-gradient(135deg, #0071b5, #2563eb)',
                            color: 'white', fontSize: 9, fontWeight: 800,
                            padding: '3px 8px', borderRadius: 20,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                          }}>
                            Executive
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Photo — full width, tall */}
                    <div style={{ position: 'relative', zIndex: 3, padding: '16px 20px 0' }}>
                      <div style={{
                        width: '100%',
                        height: 220,
                        borderRadius: 12,
                        overflow: 'hidden',
                        background: 'linear-gradient(135deg, #0f1628 0%, #0d1020 100%)',
                        border: '1px solid rgba(0,113,181,0.15)',
                        position: 'relative',
                      }}>
                        {member.photo ? (
                          <>
                            <Image
                              src={member.photo}
                              alt={member.name}
                              width={270}
                              height={220}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }}
                            />
                            {/* Subtle vignette at bottom */}
                            <div style={{
                              position: 'absolute', bottom: 0, left: 0, right: 0, height: 60,
                              background: 'linear-gradient(transparent, rgba(6,7,13,0.6))',
                            }} />
                          </>
                        ) : (
                          <div style={{
                            width: '100%', height: '100%',
                            display: 'flex', flexDirection: 'column',
                            alignItems: 'center', justifyContent: 'center', gap: 8,
                          }}>
                            <div style={{
                              width: 56, height: 56, borderRadius: '50%',
                              background: 'rgba(0,113,181,0.15)',
                              display: 'flex', alignItems: 'center', justifyContent: 'center',
                            }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="#0071b5" strokeWidth="1.5" style={{ width: 28, height: 28, opacity: 0.6 }}>
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                              </svg>
                            </div>
                            <span style={{ color: '#374151', fontSize: 10, fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.15em' }}>Foto folgt</span>
                          </div>
                        )}
                      </div>
                    </div>

                    {/* Name / role / dept */}
                    <div style={{ position: 'relative', zIndex: 3, padding: '14px 20px 16px', textAlign: 'center' }}>
                      <h2
                        id={`modal-title-${member.slug}`}
                        style={{ color: '#f0f2f8', fontSize: 22, fontWeight: 900, lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em' }}
                      >
                        {member.name}
                      </h2>
                      {member.role && (
                        <p style={{
                          color: '#3b9fdb', fontSize: 12, fontWeight: 700,
                          marginTop: 5, letterSpacing: '0.06em', textTransform: 'uppercase',
                        }}>
                          {member.role}
                        </p>
                      )}
                      {member.department && (
                        <p style={{ color: '#4b5563', fontSize: 11, marginTop: 3, fontWeight: 500 }}>
                          {member.department}
                        </p>
                      )}
                    </div>

                    {/* Bottom hint */}
                    <div style={{
                      position: 'absolute', bottom: 0, left: 0, right: 0, zIndex: 3,
                      padding: '10px', textAlign: 'center',
                      borderTop: '1px solid rgba(255,255,255,0.04)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 11, height: 11, color: '#374151' }}>
                        <path d="M8 3H5a2 2 0 0 0-2 2v3M21 8V5a2 2 0 0 0-2-2h-3M8 21H5a2 2 0 0 0-2-2v-3M16 3h3a2 2 0 0 1 2 2v3M16 21h3a2 2 0 0 0 2-2v-3M3 16v-3M21 16v-3" />
                      </svg>
                      <span style={{ color: '#374151', fontSize: 9, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}>
                        Tippen · Umdrehen
                      </span>
                    </div>
                  </div>

                  {/* ══ BACK ══ */}
                  <div style={{
                    position: 'absolute',
                    inset: 0,
                    backfaceVisibility: 'hidden',
                    WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: 18,
                    overflow: 'hidden',
                    background: 'linear-gradient(155deg, #0e1828 0%, #06070d 60%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 30px 80px rgba(0,0,0,0.8), 0 0 0 1px rgba(0,113,181,0.1)',
                    display: 'flex',
                    flexDirection: 'column',
                  }}>
                    {/* Top accent bar */}
                    <div style={{ height: 4, background: 'linear-gradient(90deg, #162e7b 0%, #0071b5 60%, #2563eb 100%)', flexShrink: 0 }} />

                    {/* Diagonal accent */}
                    <div style={{
                      position: 'absolute', top: 4, right: -20, width: 120, height: 120,
                      background: 'radial-gradient(circle, rgba(0,113,181,0.12) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }} />

                    {/* Header with avatar hint */}
                    <div style={{
                      padding: '16px 20px', flexShrink: 0,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                      display: 'flex', alignItems: 'center', gap: 12,
                    }}>
                      {/* Mini photo */}
                      <div style={{
                        width: 40, height: 40, borderRadius: '50%',
                        overflow: 'hidden',
                        border: '2px solid rgba(0,113,181,0.4)',
                        flexShrink: 0,
                        background: '#0f1628',
                      }}>
                        {member.photo ? (
                          <Image src={member.photo} alt={member.name} width={40} height={40}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#4b5563" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
                              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div>
                        <p style={{ color: '#e8eaf0', fontSize: 15, fontWeight: 800, margin: 0, letterSpacing: '-0.01em' }}>{member.name}</p>
                        {member.role && (
                          <p style={{ color: '#3b9fdb', fontSize: 10, fontWeight: 700, margin: '2px 0 0', textTransform: 'uppercase', letterSpacing: '0.06em' }}>
                            {member.role}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact rows */}
                    <div style={{ padding: '14px 20px', display: 'flex', flexDirection: 'column', gap: 10, flexShrink: 0 }}>
                      {(member.phone || !showRealContact) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                            background: 'rgba(0,113,181,0.12)',
                            border: '1px solid rgba(0,113,181,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0071b5" strokeWidth="1.8" style={{ width: 13, height: 13 }}>
                              <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82A16 16 0 0 0 15.18 16.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
                            </svg>
                          </div>
                          <span style={{ color: showRealContact && member.phone ? '#a0aec0' : '#4b5563', fontSize: 13, fontWeight: 500 }}>
                            {showRealContact && member.phone ? maskPhone(member.phone) : '[Test Tel]'}
                          </span>
                        </div>
                      )}
                      {(member.email || !showRealContact) && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                            background: 'rgba(0,113,181,0.12)',
                            border: '1px solid rgba(0,113,181,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0071b5" strokeWidth="1.8" style={{ width: 13, height: 13 }}>
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <polyline points="22,6 12,13 2,6" />
                            </svg>
                          </div>
                          <span style={{ color: showRealContact && member.email ? '#a0aec0' : '#4b5563', fontSize: 13, fontWeight: 500 }}>
                            {showRealContact && member.email ? maskEmail(member.email) : '[Test Mail]'}
                          </span>
                        </div>
                      )}
                      {member.linkedin && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
                          <div style={{
                            width: 28, height: 28, borderRadius: 8, flexShrink: 0,
                            background: 'rgba(0,113,181,0.12)',
                            border: '1px solid rgba(0,113,181,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg viewBox="0 0 24 24" fill="#0071b5" style={{ width: 12, height: 12 }}>
                              <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z" />
                            </svg>
                          </div>
                          <span style={{ color: '#4b5563', fontSize: 13, fontWeight: 500 }}>linkedin.com/in/•••</span>
                        </div>
                      )}
                    </div>

                    {/* Divider */}
                    <div style={{ margin: '0 20px', height: 1, background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />

                    {/* QR Code */}
                    <div style={{
                      display: 'flex', flexDirection: 'column', alignItems: 'center',
                      padding: '14px 20px 10px', flexShrink: 0,
                    }}>
                      <div style={{
                        background: 'white', borderRadius: 12, padding: 10,
                        display: 'inline-block',
                        boxShadow: '0 4px 20px rgba(0,0,0,0.5)',
                      }}>
                        {qrCodeDataUrl ? (
                          <img src={qrCodeDataUrl} alt="QR Code" style={{ width: 100, height: 100, display: 'block' }} />
                        ) : (
                          <div style={{ width: 100, height: 100, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#9aa0b4', fontSize: 10 }}>
                            Lädt…
                          </div>
                        )}
                      </div>
                      <p style={{ color: '#374151', fontSize: 10, marginTop: 6, textTransform: 'uppercase', letterSpacing: '0.12em', fontWeight: 600 }}>
                        Scannen → Kontakt
                      </p>
                    </div>

                    {/* Action buttons */}
                    <div style={{ padding: '6px 20px 16px', display: 'flex', flexDirection: 'column', gap: 8, flexGrow: 1, justifyContent: 'flex-end' }}>
                      <button
                        onClick={(e) => { e.stopPropagation(); downloadVCard(member); }}
                        style={{
                          display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
                          background: 'linear-gradient(135deg, rgba(0,113,181,0.25) 0%, rgba(37,99,235,0.2) 100%)',
                          border: '1px solid rgba(0,113,181,0.4)',
                          borderRadius: 10, padding: '10px 14px',
                          color: '#60b8f0', fontSize: 12, fontWeight: 700,
                          cursor: 'pointer', letterSpacing: '0.04em',
                          boxShadow: '0 2px 12px rgba(0,113,181,0.15), inset 0 1px 0 rgba(255,255,255,0.05)',
                          transition: 'all 0.2s',
                        }}
                        onMouseEnter={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,113,181,0.4) 0%, rgba(37,99,235,0.35) 100%)';
                          e.currentTarget.style.borderColor = 'rgba(0,113,181,0.7)';
                        }}
                        onMouseLeave={(e) => {
                          e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,113,181,0.25) 0%, rgba(37,99,235,0.2) 100%)';
                          e.currentTarget.style.borderColor = 'rgba(0,113,181,0.4)';
                        }}
                      >
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 14, height: 14 }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        vCard herunterladen
                      </button>

                      <div style={{ display: 'flex', gap: 8 }}>
                        {showRealContact && member.email && (
                          <a
                            href={getGoogleContactsLink()}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: 10, padding: '9px 8px', color: '#6b7280', fontSize: 11,
                              fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                              (e.currentTarget as HTMLAnchorElement).style.color = '#9aa0b4';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                              (e.currentTarget as HTMLAnchorElement).style.color = '#6b7280';
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            Google
                          </a>
                        )}
                        {showRealContact && member.phone && (
                          <a
                            href={`tel:${member.phone}`}
                            onClick={(e) => e.stopPropagation()}
                            style={{
                              flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                              background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
                              borderRadius: 10, padding: '9px 8px', color: '#6b7280', fontSize: 11,
                              fontWeight: 600, textDecoration: 'none', transition: 'all 0.2s',
                            }}
                            onMouseEnter={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.08)';
                              (e.currentTarget as HTMLAnchorElement).style.color = '#9aa0b4';
                            }}
                            onMouseLeave={(e) => {
                              (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
                              (e.currentTarget as HTMLAnchorElement).style.color = '#6b7280';
                            }}
                          >
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                            </svg>
                            Wallet
                          </a>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                      borderTop: '1px solid rgba(255,255,255,0.04)',
                      padding: '8px 20px',
                      textAlign: 'center',
                      flexShrink: 0,
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: 4,
                        background: '#0071b5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 40 40" fill="none">
                          <path d="M8 28L14 12H20L16 22H22L18 32H8Z" fill="white" />
                          <path d="M20 12H32L28 22H24L28 12" fill="white" opacity="0.65" />
                        </svg>
                      </div>
                      <span style={{ color: '#2d3748', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.15em' }}>
                        E-Motion Rennteam Aalen e.V.
                      </span>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Hint below card */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              style={{ color: 'rgba(255,255,255,0.2)', fontSize: 10, marginTop: 16, letterSpacing: '0.14em', textTransform: 'uppercase', fontWeight: 600 }}
            >
              Klicken zum Umdrehen · ESC zum Schließen
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
