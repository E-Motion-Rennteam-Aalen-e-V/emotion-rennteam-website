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

/* ─── Lanyard ─── */
function Lanyard() {
  return (
    <svg width="52" height="88" viewBox="0 0 52 88" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="rope2" x1="0" y1="0" x2="0" y2="88" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#666" />
          <stop offset="60%" stopColor="#333" />
          <stop offset="100%" stopColor="#111" />
        </linearGradient>
        <linearGradient id="clip2" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#aaa" />
          <stop offset="40%" stopColor="#777" />
          <stop offset="100%" stopColor="#444" />
        </linearGradient>
      </defs>
      <path d="M26 0 C26 26, 26 52, 26 70" stroke="url(#rope2)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="15" y="68" width="22" height="14" rx="2" fill="url(#clip2)" />
      <rect x="17" y="70" width="18" height="3" rx="1" fill="rgba(255,255,255,0.18)" />
      <circle cx="26" cy="66" r="5" fill="#0a0a0a" stroke="#555" strokeWidth="1.5" />
      <circle cx="26" cy="66" r="2" fill="#050505" />
    </svg>
  );
}

/* ─── Stagger variants ─── */
const backContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.06, delayChildren: 0.06 } },
};
const backItem = {
  hidden: { opacity: 0, y: 8 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.32, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

/* Carbon fiber pattern via repeating gradients */
const carbonStyle = {
  backgroundImage: [
    'repeating-linear-gradient(45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 8px)',
    'repeating-linear-gradient(-45deg, rgba(255,255,255,0.012) 0px, rgba(255,255,255,0.012) 1px, transparent 1px, transparent 8px)',
  ].join(', '),
};

export default function MemberModal({ member, onClose }: MemberModalProps) {
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [backShowing, setBackShowing] = useState(false);
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
    if (!member) { setFlipped(false); setBackShowing(false); return; }
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

  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => setBackShowing(true), 400);
      return () => clearTimeout(t);
    } else {
      setBackShowing(false);
    }
  }, [flipped]);

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

  const CARD_W = 'min(300px, 84vw)';
  const CARD_H = 'min(450px, calc(84vw * 1.5))';

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
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            paddingTop: 'clamp(28px, 5vh, 56px)',
            paddingBottom: 48,
            background: 'rgba(0,0,0,0.92)',
            backdropFilter: 'blur(28px) saturate(1.2)',
          }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            aria-label="Schließen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              position: 'fixed', right: 20, top: 20, zIndex: 60,
              width: 38, height: 38, borderRadius: 2,
              border: '1px solid rgba(255,255,255,0.12)',
              background: 'rgba(18,18,18,0.85)',
              color: 'rgba(255,255,255,0.5)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(12px)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" style={{ width: 14, height: 14 }}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Card wrapper */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -80, opacity: 0, scale: 0.9 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -50, opacity: 0, scale: 0.92 }}
            transition={{ type: 'spring', damping: 22, stiffness: 180, mass: 0.9 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              filter: 'drop-shadow(0 48px 96px rgba(0,0,0,0.98)) drop-shadow(0 8px 32px rgba(0,0,0,0.6))',
            }}
          >
            {/* Lanyard */}
            <motion.div
              style={{ pointerEvents: 'none', marginBottom: -2 }}
              initial={{ opacity: 0, y: -16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15, duration: 0.4 }}
            >
              <Lanyard />
            </motion.div>

            {/* Swing wrapper */}
            <motion.div
              animate={hovering ? { rotate: 0 } : { rotate: [-0.8, 0.8, -0.4, 0.4, -0.8] }}
              transition={hovering
                ? { duration: 0.4, ease: 'easeOut' }
                : { repeat: Infinity, duration: 8, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }
              }
              style={{ transformOrigin: 'top center' }}
            >
              {/* Tilt wrapper */}
              <motion.div
                style={{
                  rotateX: flipped ? 0 : springX,
                  rotateY: flipped ? 0 : springY,
                  transformPerspective: 1000,
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
                    transition: 'transform 0.72s cubic-bezier(0.25, 0.1, 0.1, 1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >

                  {/* ════════ FRONT ════════ */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    borderRadius: 4, overflow: 'hidden',
                    background: '#0d0d0d',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', flexDirection: 'column',
                    ...carbonStyle,
                  }}>
                    {/* Racing accent stripe — diagonal cut */}
                    <div style={{
                      height: 3, flexShrink: 0,
                      background: '#D42B1E',
                    }} />

                    {/* Logo bar */}
                    <div style={{
                      flexShrink: 0,
                      padding: '11px 14px 9px',
                      display: 'flex', alignItems: 'center', gap: 9,
                      borderBottom: '1px solid rgba(255,255,255,0.06)',
                      background: 'rgba(12,12,12,0.95)',
                    }}>
                      {/* Logo mark — geometric "E" */}
                      <div style={{
                        width: 26, height: 26, borderRadius: 2, flexShrink: 0,
                        background: '#D42B1E',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                      }}>
                        <svg width="16" height="16" viewBox="0 0 40 40" fill="none">
                          <rect x="6" y="8" width="18" height="3.5" fill="white" />
                          <rect x="6" y="18" width="14" height="3.5" fill="white" />
                          <rect x="6" y="28" width="18" height="3.5" fill="white" />
                          <rect x="6" y="8" width="3.5" height="23.5" fill="white" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 10, fontWeight: 800, letterSpacing: '0.14em',
                          textTransform: 'uppercase', lineHeight: 1.1,
                          color: '#e8e8e8',
                        }}>
                          E-Motion Rennteam
                        </div>
                        <div style={{
                          color: 'rgba(255,255,255,0.28)', fontSize: 8,
                          fontWeight: 600, letterSpacing: '0.14em',
                          marginTop: 2.5, textTransform: 'uppercase',
                        }}>
                          Hochschule Aalen
                        </div>
                      </div>
                      {isExecutive && (
                        <div style={{
                          background: 'rgba(212,43,30,0.15)',
                          color: '#D42B1E', fontSize: 7.5, fontWeight: 800,
                          padding: '3px 7px', borderRadius: 2,
                          letterSpacing: '0.14em', textTransform: 'uppercase',
                          flexShrink: 0,
                          border: '1px solid rgba(212,43,30,0.35)',
                        }}>
                          Exec
                        </div>
                      )}
                    </div>

                    {/* Photo */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                      {member.photo ? (
                        <>
                          <Image
                            src={member.photo}
                            alt={member.name}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                          />
                          {/* Clean bottom gradient — no side vignettes */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to bottom, transparent 30%, rgba(13,13,13,0.6) 68%, rgba(13,13,13,0.97) 100%)',
                          }} />
                        </>
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 10,
                          background: '#111',
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth="1" style={{ width: 40, height: 40 }}>
                            <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                          </svg>
                          <span style={{
                            color: 'rgba(255,255,255,0.12)', fontSize: 8, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.22em',
                          }}>
                            Foto folgt
                          </span>
                        </div>
                      )}

                      {/* Name / role overlay */}
                      <motion.div
                        initial={{ opacity: 0, y: 16 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.4, duration: 0.45 }}
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          padding: '14px 16px 16px',
                        }}>
                        {member.role && (
                          <div style={{
                            color: '#D42B1E',
                            fontSize: 9, fontWeight: 800,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            marginBottom: 6,
                          }}>
                            {member.role}
                          </div>
                        )}
                        <h2
                          id={`modal-title-${member.slug}`}
                          style={{
                            color: '#f2f2f2', fontSize: 22, fontWeight: 900,
                            lineHeight: 1.05, margin: 0, letterSpacing: '-0.03em',
                            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                          }}
                        >
                          {member.name}
                        </h2>
                        {member.department && (
                          <p style={{
                            color: 'rgba(255,255,255,0.38)', fontSize: 9, marginTop: 5,
                            fontWeight: 600, letterSpacing: '0.12em', textTransform: 'uppercase',
                          }}>
                            {member.department}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    {/* Flip hint */}
                    <div style={{
                      flexShrink: 0,
                      borderTop: '1px solid rgba(255,255,255,0.05)',
                      padding: '6px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      background: 'rgba(10,10,10,0.8)',
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        style={{ width: 8, height: 8, color: 'rgba(255,255,255,0.2)' }}>
                        <path d="M1 4v6h6M23 20v-6h-6" />
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />
                      </svg>
                      <span style={{
                        color: 'rgba(255,255,255,0.2)', fontSize: 8, fontWeight: 700,
                        letterSpacing: '0.2em', textTransform: 'uppercase',
                      }}>
                        Umdrehen
                      </span>
                    </div>
                  </div>

                  {/* ════════ BACK ════════ */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: 4, overflow: 'hidden',
                    background: '#0d0d0d',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', flexDirection: 'column',
                    ...carbonStyle,
                  }}>
                    {/* Top stripe */}
                    <div style={{
                      height: 3, flexShrink: 0,
                      background: '#D42B1E',
                    }} />

                    {/* Animated back content */}
                    <motion.div
                      variants={backContainer}
                      initial="hidden"
                      animate={backShowing ? 'visible' : 'hidden'}
                      style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                    >
                      {/* Header */}
                      <motion.div variants={backItem} style={{
                        flexShrink: 0, padding: '12px 14px 10px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: 'rgba(10,10,10,0.8)',
                      }}>
                        <div style={{
                          width: 38, height: 38, borderRadius: 2, overflow: 'hidden',
                          flexShrink: 0, background: '#161616',
                          border: '1px solid rgba(255,255,255,0.1)',
                        }}>
                          {member.photo ? (
                            <Image src={member.photo} alt={member.name} width={38} height={38}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="1.5" style={{ width: 16, height: 16 }}>
                                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            color: '#f0f0f0', fontSize: 14, fontWeight: 800, margin: 0,
                            letterSpacing: '-0.02em', whiteSpace: 'nowrap',
                            overflow: 'hidden', textOverflow: 'ellipsis',
                            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                          }}>
                            {member.name}
                          </p>
                          {member.role && (
                            <p style={{
                              color: '#D42B1E', fontSize: 8.5, fontWeight: 800,
                              margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.14em',
                            }}>
                              {member.role}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Contact rows */}
                      <div style={{ flexShrink: 0, padding: '10px 14px', display: 'flex', flexDirection: 'column', gap: 5 }}>
                        {(member.phone || !showRealContact) && (
                          <motion.div variants={backItem}>
                            <ContactRow
                              icon={<PhoneIcon />}
                              label={showRealContact && member.phone ? maskPhone(member.phone) : '[Test Tel]'}
                              dim={!showRealContact || !member.phone}
                            />
                          </motion.div>
                        )}
                        {(member.email || !showRealContact) && (
                          <motion.div variants={backItem}>
                            <ContactRow
                              icon={<MailIcon />}
                              label={showRealContact && member.email ? maskEmail(member.email) : '[Test Mail]'}
                              dim={!showRealContact || !member.email}
                            />
                          </motion.div>
                        )}
                        {member.linkedin && (
                          <motion.div variants={backItem}>
                            <ContactRow icon={<LinkedInIcon />} label="linkedin.com/in/•••" dim />
                          </motion.div>
                        )}
                      </div>

                      {/* Divider */}
                      <motion.div variants={backItem} style={{
                        margin: '0 14px',
                        height: 1,
                        background: 'rgba(255,255,255,0.06)',
                        flexShrink: 0,
                      }} />

                      {/* QR */}
                      <motion.div variants={backItem} style={{
                        flexShrink: 0, display: 'flex', flexDirection: 'column',
                        alignItems: 'center', padding: '10px 14px 6px',
                      }}>
                        <div style={{
                          background: '#fff', borderRadius: 2, padding: 7,
                          boxShadow: '0 4px 24px rgba(0,0,0,0.5)',
                          display: 'inline-block',
                        }}>
                          {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="QR Code" style={{ width: 78, height: 78, display: 'block' }} />
                          ) : (
                            <div style={{
                              width: 78, height: 78, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              color: '#bbb', fontSize: 10, fontWeight: 600,
                            }}>
                              …
                            </div>
                          )}
                        </div>
                        <p style={{
                          color: 'rgba(255,255,255,0.22)', fontSize: 8, marginTop: 6,
                          textTransform: 'uppercase', letterSpacing: '0.18em', fontWeight: 700,
                        }}>
                          QR scannen · Kontakt speichern
                        </p>
                      </motion.div>

                      {/* Actions */}
                      <motion.div variants={backItem} style={{
                        flexGrow: 1, padding: '4px 14px 12px',
                        display: 'flex', flexDirection: 'column', gap: 5, justifyContent: 'flex-end',
                      }}>
                        <ActionButton onClick={(e) => { e.stopPropagation(); downloadVCard(member); }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 11, height: 11 }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          vCard herunterladen
                        </ActionButton>

                        <div style={{ display: 'flex', gap: 5 }}>
                          {showRealContact && member.email && (
                            <GhostButton href={getGoogleContactsLink()}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 10, height: 10 }}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              Google
                            </GhostButton>
                          )}
                          {showRealContact && member.phone && (
                            <GhostButton href={`tel:${member.phone}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 10, height: 10 }}>
                                <rect x="5" y="2" width="14" height="20" rx="2" />
                                <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              Wallet
                            </GhostButton>
                          )}
                        </div>
                      </motion.div>

                      {/* Footer */}
                      <motion.div variants={backItem} style={{
                        flexShrink: 0,
                        borderTop: '1px solid rgba(255,255,255,0.05)',
                        padding: '7px 14px',
                        display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                        background: 'rgba(10,10,10,0.7)',
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          <div style={{
                            width: 12, height: 12, borderRadius: 1,
                            background: '#D42B1E',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg width="8" height="8" viewBox="0 0 40 40" fill="none">
                              <rect x="6" y="8" width="18" height="3" fill="white" />
                              <rect x="6" y="17.5" width="14" height="3" fill="white" />
                              <rect x="6" y="27" width="18" height="3" fill="white" />
                              <rect x="6" y="8" width="3" height="22" fill="white" />
                            </svg>
                          </div>
                          <span style={{
                            color: 'rgba(255,255,255,0.25)', fontSize: 7.5,
                            fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em',
                          }}>
                            E-Motion Rennteam Aalen
                          </span>
                        </div>
                        <span style={{
                          color: 'rgba(255,255,255,0.15)', fontSize: 7.5,
                          fontWeight: 600, letterSpacing: '0.06em',
                        }}>
                          e.V.
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>

                </div>
              </motion.div>
            </motion.div>

            {/* Hint below */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.7, duration: 0.4 }}
              style={{
                color: 'rgba(255,255,255,0.12)', fontSize: 9,
                marginTop: 16, letterSpacing: '0.2em',
                textTransform: 'uppercase', fontWeight: 600,
              }}
            >
              Klicken · Umdrehen &nbsp;·&nbsp; ESC · Schließen
            </motion.p>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

/* ─── Helper components ─── */
function ContactRow({ icon, label, dim }: { icon: React.ReactNode; label: string; dim?: boolean }) {
  const [hovering, setHovering] = useState(false);
  return (
    <div
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5.5px 8px 5.5px 7px', borderRadius: 2,
        border: `1px solid ${hovering ? 'rgba(212,43,30,0.3)' : 'rgba(255,255,255,0.07)'}`,
        borderLeft: `2px solid ${hovering ? '#D42B1E' : 'rgba(255,255,255,0.12)'}`,
        cursor: 'default',
        background: hovering ? 'rgba(212,43,30,0.06)' : 'rgba(255,255,255,0.02)',
        transition: 'all 0.15s ease',
      }}>
      <div style={{
        width: 22, height: 22, borderRadius: 2, flexShrink: 0,
        background: 'rgba(255,255,255,0.04)',
        border: '1px solid rgba(255,255,255,0.08)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 500,
        color: dim ? 'rgba(255,255,255,0.2)' : (hovering ? '#e0e0e0' : 'rgba(255,255,255,0.6)'),
        letterSpacing: '0.01em',
        transition: 'color 0.15s ease',
      }}>
        {label}
      </span>
    </div>
  );
}

function ActionButton({ onClick, children }: { onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  const [hovering, setHovering] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        border: `1px solid ${hovering ? '#D42B1E' : 'rgba(255,255,255,0.1)'}`,
        borderRadius: 2, padding: '10px 16px',
        color: hovering ? '#fff' : 'rgba(255,255,255,0.65)',
        fontSize: 11.5, fontWeight: 700,
        cursor: 'pointer', letterSpacing: '0.06em', width: '100%',
        background: hovering ? '#D42B1E' : 'rgba(255,255,255,0.03)',
        transition: 'all 0.18s ease',
      }}
    >
      {children}
    </button>
  );
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hovering, setHovering] = useState(false);
  return (
    <a
      href={href}
      target={href.startsWith('tel:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setHovering(true)}
      onMouseLeave={() => setHovering(false)}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        border: `1px solid ${hovering ? 'rgba(255,255,255,0.18)' : 'rgba(255,255,255,0.07)'}`,
        borderRadius: 2, padding: '8px',
        color: hovering ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.35)',
        fontSize: 11, fontWeight: 700,
        textDecoration: 'none',
        background: hovering ? 'rgba(255,255,255,0.06)' : 'transparent',
        transition: 'all 0.15s ease',
      }}
    >
      {children}
    </a>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" style={{ width: 10, height: 10 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82A16 16 0 0 0 15.18 16.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="rgba(255,255,255,0.45)" strokeWidth="1.8" style={{ width: 10, height: 10 }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="rgba(255,255,255,0.45)" style={{ width: 9, height: 9 }}>
      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z" />
    </svg>
  );
}
