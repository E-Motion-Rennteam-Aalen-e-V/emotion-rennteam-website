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

/* ─── Lanyard SVG ─── */
function Lanyard() {
  return (
    <svg width="60" height="96" viewBox="0 0 60 96" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      {/* Rope */}
      <path
        d="M30 0 C30 32, 30 64, 30 80"
        stroke="url(#ropeGrad)"
        strokeWidth="3.5"
        strokeLinecap="round"
      />
      {/* Clip body */}
      <rect x="18" y="78" width="24" height="14" rx="3" fill="url(#clipGrad)" />
      {/* Clip highlight */}
      <rect x="20" y="80" width="20" height="4" rx="2" fill="rgba(255,255,255,0.32)" />
      {/* Clip hole */}
      <circle cx="30" cy="75" r="6" fill="#1a1d2e" stroke="#5a6378" strokeWidth="2" />
      <circle cx="30" cy="75" r="3" fill="#0e1020" />
      <defs>
        <linearGradient id="ropeGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse" gradientTransform="scale(1,96)">
          <stop offset="0%" stopColor="#8892a4" />
          <stop offset="100%" stopColor="#2e3340" />
        </linearGradient>
        <linearGradient id="clipGrad" x1="0" y1="0" x2="0" y2="1" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#c8d0e0" />
          <stop offset="45%" stopColor="#8892a4" />
          <stop offset="100%" stopColor="#5a6378" />
        </linearGradient>
      </defs>
    </svg>
  );
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

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 180, damping: 22 });
  const springY = useSpring(tiltY, { stiffness: 180, damping: 22 });

  useEffect(() => {
    if (!member) { setFlipped(false); return; }
    previousActiveElement.current = document.activeElement as HTMLElement;
    const handleKeyDown = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      previousActiveElement.current?.focus();
    };
  }, [member, onClose]);

  useEffect(() => {
    if (!member) return;
    generateQRCodeDataUrl(generateQRCodeValue(member))
      .then(setQrCodeDataUrl)
      .catch(() => setQrCodeDataUrl(''));
  }, [member]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltX.set(((e.clientY - r.top) / r.height - 0.5) * -14);
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 14);
  };

  const resetTilt = () => { tiltX.set(0); tiltY.set(0); setHovering(false); };

  const getGoogleContactsLink = () => {
    if (!member) return '#';
    const p = new URLSearchParams();
    if (member.name) p.append('name', member.name);
    if (member.phone) p.append('tel', member.phone);
    if (member.email) p.append('email', member.email);
    return `https://contacts.google.com/?add&contact=${p.toString()}`;
  };

  /* card size: responsive clamp */
  const CARD_W = 'min(308px, 86vw)';
  const CARD_H = 'min(460px, calc(86vw * 1.494))';

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
          transition={{ duration: 0.28 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            paddingTop: 'clamp(36px, 6vh, 68px)',
            paddingBottom: 48,
            background: 'radial-gradient(ellipse 80% 60% at 50% 0%, rgba(0,93,179,0.22) 0%, rgba(0,0,0,0.88) 65%)',
            backdropFilter: 'blur(18px) saturate(1.4)',
          }}
        >
          {/* Close */}
          <motion.button
            onClick={onClose}
            aria-label="Schließen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.35 }}
            whileHover={{ scale: 1.08, background: 'rgba(255,255,255,0.13)' }}
            whileTap={{ scale: 0.94 }}
            style={{
              position: 'fixed', right: 18, top: 18, zIndex: 60,
              width: 40, height: 40, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.16)',
              background: 'rgba(0,0,0,0.55)',
              color: 'rgba(255,255,255,0.65)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(8px)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" style={{ width: 16, height: 16 }}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Card wrapper */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -90, opacity: 0, scale: 0.88 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 17, stiffness: 150, mass: 1.1 }}
            style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', filter: 'drop-shadow(0 48px 96px rgba(0,0,0,0.9))' }}
          >
            {/* Lanyard */}
            <div style={{ pointerEvents: 'none', marginBottom: -4 }}>
              <Lanyard />
            </div>

            {/* Swing wrapper */}
            <motion.div
              animate={hovering ? { rotate: 0 } : { rotate: [-0.8, 0.8, -0.4, 0.4, -0.8] }}
              transition={hovering
                ? { duration: 0.4, ease: 'easeOut' }
                : { repeat: Infinity, duration: 6, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }
              }
              style={{ transformOrigin: 'top center' }}
            >
              {/* Tilt wrapper */}
              <motion.div
                style={{
                  rotateX: flipped ? 0 : springX,
                  rotateY: flipped ? 0 : springY,
                  transformPerspective: 1100,
                  cursor: 'pointer',
                }}
                onMouseMove={!flipped ? handleMouseMove : undefined}
                onMouseEnter={() => setHovering(true)}
                onMouseLeave={resetTilt}
                onClick={() => setFlipped((f) => !f)}
              >
                {/* 3-D flip container */}
                <div
                  style={{
                    width: CARD_W,
                    height: CARD_H,
                    position: 'relative',
                    transformStyle: 'preserve-3d',
                    transition: 'transform 0.72s cubic-bezier(0.3,0,0.12,1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >

                  {/* ════════ FRONT ════════ */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    borderRadius: 20, overflow: 'hidden',
                    background: '#07080f',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.85), inset 0 1px 0 rgba(255,255,255,0.07)',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {/* Racing accent stripe */}
                    <div style={{
                      height: 3, flexShrink: 0,
                      background: 'linear-gradient(90deg, #0058cc 0%, #0080d4 40%, #0058cc 100%)',
                    }} />

                    {/* Logo bar */}
                    <div style={{
                      flexShrink: 0,
                      padding: '12px 18px 10px',
                      display: 'flex', alignItems: 'center', gap: 10,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{
                        width: 30, height: 30, borderRadius: 7,
                        background: 'linear-gradient(135deg, #0071b5 0%, #0058cc 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0, boxShadow: '0 2px 10px rgba(0,113,181,0.45)',
                      }}>
                        <svg width="20" height="20" viewBox="0 0 40 40" fill="none">
                          <path d="M8 28L14 12H20L16 22H22L18 32H8Z" fill="white" />
                          <path d="M20 12H32L28 22H24L28 12" fill="white" opacity="0.6" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#d4dae8', fontSize: 11, fontWeight: 800, letterSpacing: '0.07em', textTransform: 'uppercase', lineHeight: 1 }}>
                          E-Motion Rennteam
                        </div>
                        <div style={{ color: '#4b5563', fontSize: 9, fontWeight: 600, letterSpacing: '0.1em', marginTop: 2, textTransform: 'uppercase' }}>
                          Hochschule Aalen
                        </div>
                      </div>
                      {isExecutive && (
                        <span style={{
                          background: 'linear-gradient(135deg, #0071b5, #1a4fd4)',
                          color: '#e8f4ff', fontSize: 9, fontWeight: 800,
                          padding: '3px 9px', borderRadius: 20,
                          letterSpacing: '0.1em', textTransform: 'uppercase',
                          flexShrink: 0, boxShadow: '0 2px 8px rgba(0,113,181,0.4)',
                        }}>
                          Executive
                        </span>
                      )}
                    </div>

                    {/* Photo — full-bleed, fills the card */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                      {member.photo ? (
                        <>
                          <Image
                            src={member.photo}
                            alt={member.name}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                          />
                          {/* Gradient overlay bottom → name area */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, transparent 45%, rgba(7,8,15,0.55) 70%, rgba(7,8,15,0.92) 100%)',
                          }} />
                        </>
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 10,
                          background: 'linear-gradient(135deg, #0d1628 0%, #0a0c18 100%)',
                        }}>
                          <div style={{
                            width: 64, height: 64, borderRadius: '50%',
                            background: 'rgba(0,113,181,0.12)',
                            border: '1px solid rgba(0,113,181,0.2)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0071b5" strokeWidth="1.4" style={{ width: 32, height: 32, opacity: 0.5 }}>
                              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                            </svg>
                          </div>
                          <span style={{ color: '#2d3748', fontSize: 10, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.18em' }}>
                            Foto folgt
                          </span>
                        </div>
                      )}

                      {/* Name / role overlay at bottom of photo */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '14px 18px 16px',
                        textAlign: 'center',
                      }}>
                        <h2
                          id={`modal-title-${member.slug}`}
                          style={{
                            color: '#f2f4f8', fontSize: 21, fontWeight: 900,
                            lineHeight: 1.15, margin: 0, letterSpacing: '-0.025em',
                            textShadow: '0 2px 12px rgba(0,0,0,0.8)',
                            fontStyle: 'normal', fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                          }}
                        >
                          {member.name}
                        </h2>
                        {member.role && (
                          <p style={{
                            color: '#5bb8f5', fontSize: 11, fontWeight: 700,
                            marginTop: 4, letterSpacing: '0.08em', textTransform: 'uppercase',
                            textShadow: '0 1px 8px rgba(0,0,0,0.7)',
                          }}>
                            {member.role}
                          </p>
                        )}
                        {member.department && (
                          <p style={{
                            color: 'rgba(200,210,230,0.55)', fontSize: 10, marginTop: 2,
                            fontWeight: 500, textShadow: '0 1px 6px rgba(0,0,0,0.7)',
                          }}>
                            {member.department}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Flip hint */}
                    <div style={{
                      flexShrink: 0,
                      borderTop: '1px solid rgba(255,255,255,0.04)',
                      padding: '8px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        style={{ width: 10, height: 10, color: 'rgba(100,120,145,0.4)' }}>
                        <path d="M1 4v6h6M23 20v-6h-6" />
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />
                      </svg>
                      <span style={{ color: 'rgba(100,120,145,0.45)', fontSize: 9, fontWeight: 600, letterSpacing: '0.14em', textTransform: 'uppercase' }}>
                        Umdrehen
                      </span>
                    </div>
                  </div>

                  {/* ════════ BACK ════════ */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: 20, overflow: 'hidden',
                    background: 'linear-gradient(155deg, #0b1626 0%, #07080f 55%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    boxShadow: '0 32px 80px rgba(0,0,0,0.85)',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {/* Top stripe */}
                    <div style={{ height: 3, flexShrink: 0, background: 'linear-gradient(90deg, #0058cc 0%, #0080d4 60%, #0058cc 100%)' }} />

                    {/* Ambient glow */}
                    <div style={{
                      position: 'absolute', top: 3, right: -40, width: 160, height: 160,
                      background: 'radial-gradient(circle, rgba(0,113,181,0.1) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }} />

                    {/* Header row */}
                    <div style={{
                      flexShrink: 0, padding: '14px 18px 12px',
                      display: 'flex', alignItems: 'center', gap: 11,
                      borderBottom: '1px solid rgba(255,255,255,0.05)',
                    }}>
                      <div style={{
                        width: 42, height: 42, borderRadius: '50%', overflow: 'hidden',
                        border: '2px solid rgba(0,113,181,0.4)', flexShrink: 0,
                        background: '#0d1020',
                      }}>
                        {member.photo ? (
                          <Image src={member.photo} alt={member.name} width={42} height={42}
                            style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                        ) : (
                          <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#3a4a60" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
                              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                            </svg>
                          </div>
                        )}
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <p style={{ color: '#e8edf5', fontSize: 15, fontWeight: 900, margin: 0, letterSpacing: '-0.015em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                          {member.name}
                        </p>
                        {member.role && (
                          <p style={{ color: '#4ea8d8', fontSize: 10, fontWeight: 700, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.07em' }}>
                            {member.role}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Contact rows */}
                    <div style={{ flexShrink: 0, padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 7 }}>
                      {(member.phone || !showRealContact) && (
                        <ContactRow icon={<PhoneIcon />} label={showRealContact && member.phone ? maskPhone(member.phone) : '[Test Tel]'} dim={!showRealContact || !member.phone} />
                      )}
                      {(member.email || !showRealContact) && (
                        <ContactRow icon={<MailIcon />} label={showRealContact && member.email ? maskEmail(member.email) : '[Test Mail]'} dim={!showRealContact || !member.email} />
                      )}
                      {member.linkedin && (
                        <ContactRow icon={<LinkedInIcon />} label="linkedin.com/in/•••" dim />
                      )}
                    </div>

                    {/* Divider */}
                    <div style={{ margin: '0 16px', height: 1, background: 'rgba(255,255,255,0.05)', flexShrink: 0 }} />

                    {/* QR */}
                    <div style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px 6px' }}>
                      <div style={{
                        background: 'white', borderRadius: 10, padding: 7,
                        boxShadow: '0 4px 24px rgba(0,0,0,0.6)',
                        display: 'inline-block',
                      }}>
                        {qrCodeDataUrl ? (
                          <img src={qrCodeDataUrl} alt="QR Code" style={{ width: 82, height: 82, display: 'block' }} />
                        ) : (
                          <div style={{ width: 82, height: 82, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#aaa', fontSize: 10 }}>
                            Lädt…
                          </div>
                        )}
                      </div>
                      <p style={{ color: 'rgba(100,120,145,0.5)', fontSize: 9, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.14em', fontWeight: 700 }}>
                        QR scannen · Kontakt speichern
                      </p>
                    </div>

                    {/* Actions */}
                    <div style={{ flexGrow: 1, padding: '4px 16px 12px', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'flex-end' }}>
                      <ActionButton onClick={(e) => { e.stopPropagation(); downloadVCard(member); }}>
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 13, height: 13 }}>
                          <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                          <polyline points="7 10 12 15 17 10" />
                          <line x1="12" y1="15" x2="12" y2="3" />
                        </svg>
                        vCard herunterladen
                      </ActionButton>

                      <div style={{ display: 'flex', gap: 7 }}>
                        {showRealContact && member.email && (
                          <GhostButton href={getGoogleContactsLink()}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
                              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                              <circle cx="12" cy="7" r="4" />
                            </svg>
                            Google
                          </GhostButton>
                        )}
                        {showRealContact && member.phone && (
                          <GhostButton href={`tel:${member.phone}`}>
                            <svg viewBox="0 0 24 24" fill="currentColor" style={{ width: 12, height: 12 }}>
                              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm0 16H5V5h14v14z" />
                            </svg>
                            Wallet
                          </GhostButton>
                        )}
                      </div>
                    </div>

                    {/* Footer */}
                    <div style={{
                      flexShrink: 0,
                      borderTop: '1px solid rgba(255,255,255,0.06)',
                      padding: '6px 16px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                    }}>
                      <div style={{
                        width: 14, height: 14, borderRadius: 3,
                        background: '#0071b5',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="10" height="10" viewBox="0 0 40 40" fill="none">
                          <path d="M8 28L14 12H20L16 22H22L18 32H8Z" fill="white" />
                          <path d="M20 12H32L28 22H24L28 12" fill="white" opacity="0.6" />
                        </svg>
                      </div>
                      <span style={{ color: 'rgba(100,120,145,0.45)', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
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
              transition={{ delay: 0.7 }}
              style={{ color: 'rgba(255,255,255,0.18)', fontSize: 10, marginTop: 14, letterSpacing: '0.15em', textTransform: 'uppercase', fontWeight: 600 }}
            >
              Klicken · Umdrehen &nbsp;·&nbsp; ESC · Schließen
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Small helper components ─── */
function ContactRow({ icon, label, dim }: { icon: React.ReactNode; label: string; dim?: boolean }) {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
      <div style={{
        width: 26, height: 26, borderRadius: 6, flexShrink: 0,
        background: 'rgba(0,113,181,0.12)',
        border: '1px solid rgba(0,113,181,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{ color: dim ? 'rgba(110,125,145,0.55)' : '#9aadbe', fontSize: 12, fontWeight: 500, letterSpacing: '0.01em' }}>
        {label}
      </span>
    </div>
  );
}

function ActionButton({ onClick, children }: { onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 8,
        background: 'linear-gradient(135deg, rgba(0,113,181,0.22) 0%, rgba(26,79,212,0.18) 100%)',
        border: '1px solid rgba(0,113,181,0.38)',
        borderRadius: 10, padding: '10px 14px',
        color: '#5ab8f4', fontSize: 12, fontWeight: 700,
        cursor: 'pointer', letterSpacing: '0.04em', width: '100%',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.04)',
        transition: 'border-color 0.18s, background 0.18s',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,113,181,0.65)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,113,181,0.36) 0%, rgba(26,79,212,0.3) 100%)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(0,113,181,0.38)';
        e.currentTarget.style.background = 'linear-gradient(135deg, rgba(0,113,181,0.22) 0%, rgba(26,79,212,0.18) 100%)';
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <a
      href={href}
      target={href.startsWith('tel:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
        background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)',
        borderRadius: 10, padding: '9px 8px',
        color: '#4b5a70', fontSize: 11, fontWeight: 600,
        textDecoration: 'none', transition: 'all 0.18s',
      }}
      onMouseEnter={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.09)';
        (e.currentTarget as HTMLAnchorElement).style.color = '#8a9ab0';
      }}
      onMouseLeave={(e) => {
        (e.currentTarget as HTMLAnchorElement).style.background = 'rgba(255,255,255,0.04)';
        (e.currentTarget as HTMLAnchorElement).style.color = '#4b5a70';
      }}
    >
      {children}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#0071b5" strokeWidth="1.8" style={{ width: 12, height: 12 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82A16 16 0 0 0 15.18 16.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#0071b5" strokeWidth="1.8" style={{ width: 12, height: 12 }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#0071b5" style={{ width: 11, height: 11 }}>
      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z" />
    </svg>
  );
}
