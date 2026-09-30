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
    <svg width="56" height="92" viewBox="0 0 56 92" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="rope" x1="0" y1="0" x2="0" y2="92" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor="#9ba8bb" />
          <stop offset="60%" stopColor="#4d5868" />
          <stop offset="100%" stopColor="#2a303d" />
        </linearGradient>
        <linearGradient id="clip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#d4dce8" />
          <stop offset="40%" stopColor="#8e9cb2" />
          <stop offset="100%" stopColor="#576070" />
        </linearGradient>
        <linearGradient id="clipShine" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%" stopColor="rgba(255,255,255,0)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.28)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0)" />
        </linearGradient>
      </defs>
      {/* Rope with subtle taper */}
      <path d="M28 0 C28 28, 28 56, 28 74" stroke="url(#rope)" strokeWidth="3" strokeLinecap="round" />
      {/* Clip body */}
      <rect x="17" y="72" width="22" height="14" rx="3.5" fill="url(#clip)" />
      {/* Clip shine */}
      <rect x="17" y="72" width="22" height="14" rx="3.5" fill="url(#clipShine)" />
      {/* Clip rivet highlight */}
      <rect x="19" y="74" width="18" height="3.5" rx="1.5" fill="rgba(255,255,255,0.25)" />
      {/* Hole with inner shadow */}
      <circle cx="28" cy="70" r="5.5" fill="#0e111e" stroke="#4a5468" strokeWidth="1.8" />
      <circle cx="28" cy="70" r="2.5" fill="#080a14" />
      <circle cx="26.5" cy="68.5" r="1" fill="rgba(255,255,255,0.1)" />
    </svg>
  );
}

/* ─── Stagger variants ─── */
const backContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.07, delayChildren: 0.08 } },
};
const backItem = {
  hidden: { opacity: 0, y: 10 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.38, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
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
  const springX = useSpring(tiltX, { stiffness: 200, damping: 24 });
  const springY = useSpring(tiltY, { stiffness: 200, damping: 24 });

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

  /* Trigger back stagger after flip starts */
  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => setBackShowing(true), 420);
      return () => clearTimeout(t);
    } else {
      setBackShowing(false);
    }
  }, [flipped]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltX.set(((e.clientY - r.top) / r.height - 0.5) * -16);
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 16);
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

  const CARD_W = 'min(308px, 86vw)';
  const CARD_H = 'min(462px, calc(86vw * 1.497))';

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
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', flexDirection: 'column', alignItems: 'center',
            justifyContent: 'flex-start',
            overflowY: 'auto',
            paddingTop: 'clamp(32px, 5vh, 64px)',
            paddingBottom: 48,
            background: 'radial-gradient(ellipse 90% 65% at 50% 0%, rgba(0,80,180,0.28) 0%, rgba(0,0,0,0.9) 62%)',
            backdropFilter: 'blur(20px) saturate(1.5)',
          }}
        >
          {/* Close button */}
          <motion.button
            onClick={onClose}
            aria-label="Schließen"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ delay: 0.4, type: 'spring', stiffness: 300 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            style={{
              position: 'fixed', right: 18, top: 18, zIndex: 60,
              width: 40, height: 40, borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.15)',
              background: 'rgba(10,12,20,0.7)',
              color: 'rgba(255,255,255,0.6)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', backdropFilter: 'blur(10px)',
              boxShadow: '0 2px 16px rgba(0,0,0,0.4)',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 15, height: 15 }}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Card wrapper */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -100, opacity: 0, scale: 0.85 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            exit={{ y: -60, opacity: 0, scale: 0.9 }}
            transition={{ type: 'spring', damping: 18, stiffness: 160, mass: 1.0 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              filter: 'drop-shadow(0 56px 120px rgba(0,0,0,0.95)) drop-shadow(0 0 60px rgba(0,80,180,0.15))',
            }}
          >
            {/* Lanyard */}
            <motion.div
              style={{ pointerEvents: 'none', marginBottom: -2 }}
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2, duration: 0.5 }}
            >
              <Lanyard />
            </motion.div>

            {/* Swing wrapper */}
            <motion.div
              animate={hovering ? { rotate: 0 } : { rotate: [-1, 1, -0.5, 0.5, -1] }}
              transition={hovering
                ? { duration: 0.5, ease: 'easeOut' }
                : { repeat: Infinity, duration: 7, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }
              }
              style={{ transformOrigin: 'top center' }}
            >
              {/* Tilt wrapper */}
              <motion.div
                style={{
                  rotateX: flipped ? 0 : springX,
                  rotateY: flipped ? 0 : springY,
                  transformPerspective: 1200,
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
                    transition: 'transform 0.75s cubic-bezier(0.28, 0, 0.1, 1)',
                    transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                  }}
                >

                  {/* ════════ FRONT ════════ */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    borderRadius: 22, overflow: 'hidden',
                    background: '#07080f',
                    border: '1px solid rgba(255,255,255,0.08)',
                    boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.06)',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {/* Racing stripe — animated shimmer */}
                    <div style={{
                      height: 3, flexShrink: 0, position: 'relative', overflow: 'hidden',
                      background: 'linear-gradient(90deg, #003eb5 0%, #0081e0 45%, #003eb5 100%)',
                    }}>
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: 'linear', repeatDelay: 2 }}
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                          width: '40%',
                        }}
                      />
                    </div>

                    {/* Logo bar — frosted glass */}
                    <div style={{
                      flexShrink: 0,
                      padding: '11px 16px 9px',
                      display: 'flex', alignItems: 'center', gap: 9,
                      background: 'rgba(7,8,15,0.55)',
                      backdropFilter: 'blur(12px)',
                      borderBottom: '1px solid rgba(255,255,255,0.04)',
                    }}>
                      <div style={{
                        width: 28, height: 28, borderRadius: 7,
                        background: 'linear-gradient(135deg, #0071b5 0%, #0048cc 100%)',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        flexShrink: 0,
                        boxShadow: '0 2px 12px rgba(0,113,181,0.5), inset 0 1px 0 rgba(255,255,255,0.2)',
                      }}>
                        <svg width="18" height="18" viewBox="0 0 40 40" fill="none">
                          <path d="M8 28L14 12H20L16 22H22L18 32H8Z" fill="white" />
                          <path d="M20 12H32L28 22H24L28 12" fill="white" opacity="0.55" />
                        </svg>
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ color: '#c8d2e4', fontSize: 10.5, fontWeight: 800, letterSpacing: '0.08em', textTransform: 'uppercase', lineHeight: 1 }}>
                          E-Motion Rennteam
                        </div>
                        <div style={{ color: '#3a4560', fontSize: 8.5, fontWeight: 600, letterSpacing: '0.12em', marginTop: 2, textTransform: 'uppercase' }}>
                          Hochschule Aalen
                        </div>
                      </div>
                      {isExecutive && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.3, type: 'spring' }}
                          style={{
                            background: 'linear-gradient(135deg, #0058cc, #0090e0)',
                            color: '#e8f4ff', fontSize: 8.5, fontWeight: 800,
                            padding: '3px 8px', borderRadius: 20,
                            letterSpacing: '0.1em', textTransform: 'uppercase',
                            flexShrink: 0,
                            boxShadow: '0 2px 10px rgba(0,113,181,0.55), inset 0 1px 0 rgba(255,255,255,0.2)',
                          }}
                        >
                          Executive
                        </motion.span>
                      )}
                    </div>

                    {/* Photo — full bleed */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                      {member.photo ? (
                        <>
                          <Image
                            src={member.photo}
                            alt={member.name}
                            fill
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                          />
                          {/* Vignette + bottom gradient */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: [
                              'radial-gradient(ellipse at 50% 0%, transparent 60%, rgba(5,7,18,0.4) 100%)',
                              'linear-gradient(to bottom, transparent 38%, rgba(5,7,18,0.5) 65%, rgba(5,7,18,0.97) 100%)',
                            ].join(', '),
                          }} />
                          {/* Subtle side vignette */}
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: 'linear-gradient(to right, rgba(5,7,18,0.3) 0%, transparent 20%, transparent 80%, rgba(5,7,18,0.3) 100%)',
                          }} />
                        </>
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 10,
                          background: 'linear-gradient(135deg, #0a1628 0%, #060810 100%)',
                        }}>
                          <div style={{
                            width: 68, height: 68, borderRadius: '50%',
                            background: 'radial-gradient(circle, rgba(0,113,181,0.14) 0%, rgba(0,0,0,0) 100%)',
                            border: '1px solid rgba(0,113,181,0.22)',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                          }}>
                            <svg viewBox="0 0 24 24" fill="none" stroke="#0071b5" strokeWidth="1.3" style={{ width: 34, height: 34, opacity: 0.45 }}>
                              <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                            </svg>
                          </div>
                          <span style={{ color: '#1e2840', fontSize: 9, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.2em' }}>
                            Foto folgt
                          </span>
                        </div>
                      )}

                      {/* Name / role overlay */}
                      <div style={{
                        position: 'absolute', bottom: 0, left: 0, right: 0,
                        padding: '12px 18px 14px',
                        textAlign: 'center',
                      }}>
                        <h2
                          id={`modal-title-${member.slug}`}
                          style={{
                            color: '#ffffff', fontSize: 22, fontWeight: 900,
                            lineHeight: 1.15, margin: 0, letterSpacing: '-0.02em',
                            fontStyle: 'normal', fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                            textShadow: '0 0 32px rgba(60,150,255,0.35), 0 2px 18px rgba(0,0,0,0.95)',
                          }}
                        >
                          {member.name}
                        </h2>
                        {member.role && (
                          <div style={{ marginTop: 6, display: 'flex', justifyContent: 'center' }}>
                            <span style={{
                              color: '#60c4ff', fontSize: 10, fontWeight: 700,
                              letterSpacing: '0.1em', textTransform: 'uppercase',
                              background: 'rgba(0,100,200,0.2)',
                              border: '1px solid rgba(0,140,255,0.25)',
                              borderRadius: 20, padding: '3px 10px',
                              backdropFilter: 'blur(4px)',
                            }}>
                              {member.role}
                            </span>
                          </div>
                        )}
                        {member.department && (
                          <p style={{
                            color: 'rgba(180,200,225,0.45)', fontSize: 9.5, marginTop: 4,
                            fontWeight: 500, letterSpacing: '0.05em',
                          }}>
                            {member.department}
                          </p>
                        )}
                      </div>
                    </div>

                    {/* Flip hint */}
                    <div style={{
                      flexShrink: 0,
                      borderTop: '1px solid rgba(255,255,255,0.035)',
                      padding: '7px',
                      display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
                      background: 'rgba(7,8,15,0.6)',
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        style={{ width: 9, height: 9, color: 'rgba(100,120,145,0.4)' }}>
                        <path d="M1 4v6h6M23 20v-6h-6" />
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />
                      </svg>
                      <span style={{ color: 'rgba(100,120,145,0.4)', fontSize: 8.5, fontWeight: 600, letterSpacing: '0.16em', textTransform: 'uppercase' }}>
                        Umdrehen
                      </span>
                    </div>
                  </div>

                  {/* ════════ BACK ════════ */}
                  <div style={{
                    position: 'absolute', inset: 0,
                    backfaceVisibility: 'hidden', WebkitBackfaceVisibility: 'hidden',
                    transform: 'rotateY(180deg)',
                    borderRadius: 22, overflow: 'hidden',
                    background: 'linear-gradient(158deg, #0d1d35 0%, #07080f 55%)',
                    border: '1px solid rgba(255,255,255,0.07)',
                    display: 'flex', flexDirection: 'column',
                  }}>
                    {/* Top stripe */}
                    <div style={{
                      height: 3, flexShrink: 0, position: 'relative', overflow: 'hidden',
                      background: 'linear-gradient(90deg, #003eb5 0%, #0090e0 50%, #003eb5 100%)',
                    }}>
                      <motion.div
                        animate={{ x: ['-100%', '200%'] }}
                        transition={{ repeat: Infinity, duration: 2.8, ease: 'linear', repeatDelay: 3, delay: 1 }}
                        style={{
                          position: 'absolute', inset: 0,
                          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.5), transparent)',
                          width: '40%',
                        }}
                      />
                    </div>

                    {/* Decorative bg glow */}
                    <div style={{
                      position: 'absolute', top: 3, right: -20, width: 200, height: 200,
                      background: 'radial-gradient(circle, rgba(0,100,200,0.12) 0%, transparent 70%)',
                      pointerEvents: 'none',
                    }} />
                    <div style={{
                      position: 'absolute', bottom: 40, left: -30, width: 150, height: 150,
                      background: 'radial-gradient(circle, rgba(0,60,140,0.08) 0%, transparent 70%)',
                      pointerEvents: 'none',
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
                        flexShrink: 0, padding: '13px 16px 11px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        borderBottom: '1px solid rgba(255,255,255,0.05)',
                        background: 'linear-gradient(to right, rgba(0,60,140,0.12) 0%, transparent 100%)',
                      }}>
                        <div style={{
                          width: 40, height: 40, borderRadius: '50%', overflow: 'hidden',
                          flexShrink: 0, background: '#0a1020',
                          boxShadow: '0 0 0 2px rgba(0,130,220,0.4), 0 0 12px rgba(0,130,220,0.2)',
                        }}>
                          {member.photo ? (
                            <Image src={member.photo} alt={member.name} width={40} height={40}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="#2a3d55" strokeWidth="1.5" style={{ width: 18, height: 18 }}>
                                <circle cx="12" cy="8" r="4" /><path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            color: '#e8eef8', fontSize: 15, fontWeight: 800, margin: 0,
                            letterSpacing: '-0.01em', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            fontFamily: 'var(--font-sans, system-ui, sans-serif)',
                          }}>
                            {member.name}
                          </p>
                          {member.role && (
                            <p style={{ color: '#3eaaee', fontSize: 9.5, fontWeight: 700, margin: '3px 0 0', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
                              {member.role}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Contact rows */}
                      <div style={{ flexShrink: 0, padding: '10px 16px', display: 'flex', flexDirection: 'column', gap: 6 }}>
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
                      <motion.div variants={backItem} style={{ margin: '0 16px', height: 1, background: 'linear-gradient(to right, rgba(0,100,220,0.2), rgba(255,255,255,0.04), transparent)', flexShrink: 0 }} />

                      {/* QR */}
                      <motion.div variants={backItem} style={{ flexShrink: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px 16px 6px' }}>
                        <div style={{
                          background: 'white', borderRadius: 10, padding: 7,
                          boxShadow: '0 0 0 1px rgba(0,120,220,0.25), 0 6px 28px rgba(0,0,0,0.7), 0 0 20px rgba(0,100,200,0.12)',
                          display: 'inline-block',
                        }}>
                          {qrCodeDataUrl ? (
                            <img src={qrCodeDataUrl} alt="QR Code" style={{ width: 82, height: 82, display: 'block' }} />
                          ) : (
                            <div style={{ width: 82, height: 82, display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#bbb', fontSize: 10 }}>
                              Lädt…
                            </div>
                          )}
                        </div>
                        <p style={{ color: 'rgba(100,125,155,0.5)', fontSize: 8.5, marginTop: 4, textTransform: 'uppercase', letterSpacing: '0.15em', fontWeight: 700 }}>
                          QR scannen · Kontakt speichern
                        </p>
                      </motion.div>

                      {/* Actions */}
                      <motion.div variants={backItem} style={{ flexGrow: 1, padding: '4px 16px 12px', display: 'flex', flexDirection: 'column', gap: 6, justifyContent: 'flex-end' }}>
                        <ActionButton onClick={(e) => { e.stopPropagation(); downloadVCard(member); }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ width: 12, height: 12 }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          vCard herunterladen
                        </ActionButton>

                        <div style={{ display: 'flex', gap: 6 }}>
                          {showRealContact && member.email && (
                            <GhostButton href={getGoogleContactsLink()}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 11, height: 11 }}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              Google
                            </GhostButton>
                          )}
                          {showRealContact && member.phone && (
                            <GhostButton href={`tel:${member.phone}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" style={{ width: 11, height: 11 }}>
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
                        padding: '6px 16px',
                        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 6,
                        background: 'rgba(0,0,0,0.2)',
                      }}>
                        <div style={{
                          width: 13, height: 13, borderRadius: 3,
                          background: 'linear-gradient(135deg, #0071b5, #0048cc)',
                          display: 'flex', alignItems: 'center', justifyContent: 'center',
                          boxShadow: '0 0 6px rgba(0,113,181,0.4)',
                        }}>
                          <svg width="9" height="9" viewBox="0 0 40 40" fill="none">
                            <path d="M8 28L14 12H20L16 22H22L18 32H8Z" fill="white" />
                            <path d="M20 12H32L28 22H24L28 12" fill="white" opacity="0.55" />
                          </svg>
                        </div>
                        <span style={{ color: 'rgba(100,125,155,0.45)', fontSize: 8.5, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.14em' }}>
                          E-Motion Rennteam Aalen e.V.
                        </span>
                      </motion.div>
                    </motion.div>
                  </div>

                </div>
              </motion.div>
            </motion.div>

            {/* Hint below */}
            <motion.p
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8, duration: 0.5 }}
              style={{ color: 'rgba(255,255,255,0.15)', fontSize: 9.5, marginTop: 16, letterSpacing: '0.16em', textTransform: 'uppercase', fontWeight: 600 }}
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
  return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: 9,
      padding: '6px 8px 6px 6px', borderRadius: 8,
      background: 'rgba(255,255,255,0.02)',
      border: '1px solid rgba(255,255,255,0.04)',
      borderLeft: '2px solid rgba(0,100,200,0.25)',
    }}>
      <div style={{
        width: 24, height: 24, borderRadius: 6, flexShrink: 0,
        background: 'rgba(0,100,200,0.14)',
        border: '1px solid rgba(0,120,220,0.2)',
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{ color: dim ? 'rgba(100,120,148,0.5)' : '#8fb8d4', fontSize: 11.5, fontWeight: 500, letterSpacing: '0.01em' }}>
        {label}
      </span>
    </div>
  );
}

function ActionButton({ onClick, children }: { onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  return (
    <motion.button
      onClick={onClick}
      whileHover={{ scale: 1.015, borderColor: 'rgba(0,140,255,0.6)' }}
      whileTap={{ scale: 0.97 }}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        background: 'linear-gradient(135deg, rgba(0,90,180,0.28) 0%, rgba(0,60,140,0.22) 100%)',
        border: '1px solid rgba(0,120,220,0.4)',
        borderRadius: 10, padding: '10px 14px',
        color: '#4dc4ff', fontSize: 11.5, fontWeight: 700,
        cursor: 'pointer', letterSpacing: '0.04em', width: '100%',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.05), 0 2px 12px rgba(0,80,180,0.15)',
        transition: 'border-color 0.2s',
      }}
    >
      {children}
    </motion.button>
  );
}

function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  return (
    <motion.a
      href={href}
      target={href.startsWith('tel:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      whileHover={{ scale: 1.02, borderColor: 'rgba(255,255,255,0.14)' }}
      whileTap={{ scale: 0.97 }}
      style={{
        flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 5,
        background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.07)',
        borderRadius: 9, padding: '8px 8px',
        color: '#4a5a70', fontSize: 11, fontWeight: 600,
        textDecoration: 'none',
        transition: 'border-color 0.2s, color 0.2s',
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.03)',
      }}
    >
      {children}
    </motion.a>
  );
}

function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2a8cc8" strokeWidth="1.8" style={{ width: 11, height: 11 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82A16 16 0 0 0 15.18 16.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="#2a8cc8" strokeWidth="1.8" style={{ width: 11, height: 11 }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="#2a8cc8" style={{ width: 10, height: 10 }}>
      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z" />
    </svg>
  );
}
