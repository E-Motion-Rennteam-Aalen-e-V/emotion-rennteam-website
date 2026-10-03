'use client';

import { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, useMotionTemplate } from 'framer-motion';
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

/** Generate a deterministic pseudo member-ID from a name */
function generateMemberId(name: string): string {
  const letters = name.replace(/\s+/g, '').slice(0, 3).toUpperCase();
  const num = name.split('').reduce((a, c) => a + c.charCodeAt(0), 0) % 10000;
  return `ERT-${letters}${String(num).padStart(4, '0')}`;
}

/* ─── Site tokens (mirrored from globals.css :root) ─── */
const T = {
  bg:        '#06070d',
  surface:   '#10121b',
  surface2:  '#171a26',
  fg:        '#f5f6f8',
  muted:     '#9aa0b4',
  accent:    '#0071b5',
  accent2:   '#162e7b',
  accentTxt: '#5aa6d6',
  border:    '#232635',
};

/* ─── Lanyard — site-colored ─── */
function Lanyard() {
  return (
    <svg width="52" height="86" viewBox="0 0 52 86" fill="none" style={{ display: 'block', margin: '0 auto' }}>
      <defs>
        <linearGradient id="lrope" x1="0" y1="0" x2="0" y2="86" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={T.accentTxt} stopOpacity="0.7" />
          <stop offset="55%" stopColor={T.accent}   stopOpacity="0.5" />
          <stop offset="100%" stopColor={T.accent2}  stopOpacity="0.4" />
        </linearGradient>
        <linearGradient id="lclip" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#a0aec0" />
          <stop offset="55%" stopColor="#718096" />
          <stop offset="100%" stopColor="#4a5568" />
        </linearGradient>
      </defs>
      <path d="M26 0 C26 26, 26 52, 26 68" stroke="url(#lrope)" strokeWidth="2.5" strokeLinecap="round" />
      <rect x="15" y="66" width="22" height="14" rx="2.5" fill="url(#lclip)" />
      <rect x="17.5" y="68.5" width="17" height="3" rx="1" fill="rgba(255,255,255,0.2)" />
      <circle cx="26" cy="64" r="5" fill={T.bg} stroke={T.border} strokeWidth="1.5" />
      <circle cx="26" cy="64" r="2" fill={T.surface} />
    </svg>
  );
}

/* ─── Checkered stripe (from globals.css .checkered-divider) ─── */
function CheckeredStripe({ opacity = 0.18 }: { opacity?: number }) {
  return (
    <div style={{
      height: 8, flexShrink: 0,
      backgroundImage: [
        'linear-gradient(45deg, rgba(255,255,255,0.9) 25%, transparent 25%)',
        'linear-gradient(-45deg, rgba(255,255,255,0.9) 25%, transparent 25%)',
        'linear-gradient(45deg, transparent 75%, rgba(255,255,255,0.9) 75%)',
        'linear-gradient(-45deg, transparent 75%, rgba(255,255,255,0.9) 75%)',
      ].join(', '),
      backgroundSize: '8px 8px',
      backgroundPosition: '0 0, 0 4px, 4px -4px, -4px 0px',
      backgroundColor: T.bg,
      opacity,
    }} />
  );
}

/* ─── Decorative barcode strip (purely visual) ─── */
function DecorativeBarcode() {
  // alternating bar / gap widths — even indices are bars, odd are gaps
  const pattern = [2,1,3,1,1,1,4,1,2,1,1,1,3,1,2,1,1,1,3,1,1,1,4,1,2,1,1,1,2,1,3,1,1,1,2];
  const rects: Array<{ x: number; w: number }> = [];
  let x = 0;
  pattern.forEach((w, i) => {
    if (i % 2 === 0) rects.push({ x, w });
    x += w;
  });
  return (
    <svg
      width="100%"
      height="14"
      viewBox={`0 0 ${x} 14`}
      preserveAspectRatio="xMidYMid meet"
      style={{ display: 'block', opacity: 0.28 }}
    >
      {rects.map((r, i) => (
        <rect key={i} x={r.x} y={0} width={r.w} height={14} fill={T.muted} />
      ))}
    </svg>
  );
}

/* ─── Stagger variants ─── */
const backContainer = {
  hidden: {},
  visible: { transition: { staggerChildren: 0.055, delayChildren: 0.05 } },
};
const backItem = {
  hidden: { opacity: 0, y: 7 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number,number,number,number] } },
};

export default function MemberModal({ member, onClose }: MemberModalProps) {
  const dialogRef    = useRef<HTMLDivElement>(null);
  const prevFocus    = useRef<HTMLElement | null>(null);
  const [qrUrl, setQrUrl]             = useState('');
  const [flipped, setFlipped]         = useState(false);
  const [backShowing, setBackShowing] = useState(false);
  const [hovering, setHovering]       = useState(false);
  const [sweepKey, setSweepKey]       = useState(0);

  const isExecutive  = member ? ['ceo', 'cto', 'cfo'].includes(member.roleLevel || '') : false;
  const isLeadership = member
    ? isExecutive || ['Teamleiter', 'Leitung'].includes((member.role || '').trim())
    : false;
  const showReal = isLeadership;

  const tiltX = useMotionValue(0);
  const tiltY = useMotionValue(0);
  const springX = useSpring(tiltX, { stiffness: 180, damping: 22 });
  const springY = useSpring(tiltY, { stiffness: 180, damping: 22 });

  // Holographic reflex: map tilt springs → highlight position on card surface
  // tiltY positive = mouse right → highlight moves right; tiltX: inverted sign
  const hHighlightX = useTransform(springY, [-13, 13], [20, 80]);
  const hHighlightY = useTransform(springX, [13, -13], [20, 80]);
  const holoBg = useMotionTemplate`radial-gradient(ellipse 60% 40% at ${hHighlightX}% ${hHighlightY}%, rgba(180,220,255,0.15) 0%, rgba(100,170,255,0.07) 40%, transparent 68%)`;

  useEffect(() => {
    if (!member) { setFlipped(false); setBackShowing(false); return; }
    prevFocus.current = document.activeElement as HTMLElement;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') onClose(); };
    document.addEventListener('keydown', onKey);
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', onKey);
      prevFocus.current?.focus();
    };
  }, [member, onClose]);

  useEffect(() => {
    if (!member) return;
    generateQRCodeDataUrl(generateQRCodeValue(member)).then(setQrUrl).catch(() => setQrUrl(''));
  }, [member]);

  useEffect(() => {
    if (flipped) {
      const t = setTimeout(() => setBackShowing(true), 400);
      return () => clearTimeout(t);
    } else {
      setBackShowing(false);
    }
  }, [flipped]);

  const onMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (flipped) return;
    const r = e.currentTarget.getBoundingClientRect();
    tiltX.set(((e.clientY - r.top) / r.height - 0.5) * -13);
    tiltY.set(((e.clientX - r.left) / r.width - 0.5) * 13);
  };

  const resetTilt = () => { tiltX.set(0); tiltY.set(0); setHovering(false); };

  const handleMouseEnter = () => {
    setHovering(true);
    if (!flipped) setSweepKey((k) => k + 1);
  };

  const googleLink = () => {
    if (!member) return '#';
    const p = new URLSearchParams();
    if (member.name)  p.append('name',  member.name);
    if (member.phone) p.append('tel',   member.phone);
    if (member.email) p.append('email', member.email);
    return `https://contacts.google.com/?add&contact=${p.toString()}`;
  };

  const W = 'min(296px, 83vw)';
  const H = 'min(444px, calc(83vw * 1.5))';

  /* ── shared card shell style — inset top shine for plastic card feel ── */
  const cardShell: React.CSSProperties = {
    position: 'absolute', inset: 0,
    backfaceVisibility:       'hidden',
    WebkitBackfaceVisibility: 'hidden',
    borderRadius: 16,
    overflow: 'hidden',
    background: `linear-gradient(160deg, ${T.surface} 0%, ${T.bg} 100%)`,
    border: `1px solid ${T.border}`,
    display: 'flex', flexDirection: 'column',
    // Subtle top-edge gloss: like light catching a plastic card edge
    boxShadow: `inset 0 1px 0 rgba(255,255,255,0.09), inset 0 0 0 1px rgba(255,255,255,0.025)`,
  };

  const memberId = member ? generateMemberId(member.name) : '';

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
          transition={{ duration: 0.22 }}
          onClick={onClose}
          style={{
            position: 'fixed', inset: 0, zIndex: 50,
            display: 'flex', flexDirection: 'column',
            alignItems: 'center', justifyContent: 'flex-start',
            overflowY: 'auto',
            paddingTop: 'clamp(24px, 5vh, 52px)',
            paddingBottom: 48,
            // Radial brand glow + subtle security-paper diagonal lines
            background: [
              'repeating-linear-gradient(-45deg, transparent, transparent 20px, rgba(255,255,255,0.012) 20px, rgba(255,255,255,0.012) 21px)',
              `radial-gradient(ellipse 80% 50% at 50% 0%, rgba(0,113,181,0.14) 0%, rgba(6,7,13,0.97) 55%)`,
            ].join(', '),
            backdropFilter: 'blur(32px) saturate(1.3)',
          }}
        >
          {/* Close */}
          <motion.button
            onClick={onClose}
            aria-label="Schließen"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            whileHover={{ scale: 1.06 }}
            whileTap={{ scale: 0.93 }}
            style={{
              position: 'fixed', right: 18, top: 18, zIndex: 60,
              width: 38, height: 38, borderRadius: 10,
              border: `1px solid ${T.border}`,
              background: T.surface,
              color: T.muted,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8"
              style={{ width: 14, height: 14 }}>
              <line x1="18" y1="6" x2="6" y2="18" /><line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </motion.button>

          {/* Card wrapper — entry: drops with subtle Y-axis pendulum swing */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -70, opacity: 0, scale: 0.92, rotateY: -5 }}
            animate={{ y: 0, opacity: 1, scale: 1, rotateY: 0 }}
            exit={{ y: -45, opacity: 0, scale: 0.93 }}
            transition={{ type: 'spring', damping: 22, stiffness: 190, mass: 0.85 }}
            style={{
              display: 'flex', flexDirection: 'column', alignItems: 'center',
              filter: `drop-shadow(0 40px 80px rgba(0,0,0,0.96)) drop-shadow(0 0 48px rgba(0,113,181,0.12))`,
              transformPerspective: 1200,
            }}
          >
            {/* Lanyard */}
            <motion.div
              style={{ pointerEvents: 'none', marginBottom: -2 }}
              initial={{ opacity: 0, y: -14 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.14, duration: 0.36 }}
            >
              <Lanyard />
            </motion.div>

            {/* Swing */}
            <motion.div
              animate={hovering ? { rotate: 0 } : { rotate: [-0.7, 0.7, -0.35, 0.35, -0.7] }}
              transition={hovering
                ? { duration: 0.35, ease: 'easeOut' }
                : { repeat: Infinity, duration: 9, ease: 'easeInOut', times: [0, 0.25, 0.5, 0.75, 1] }
              }
              style={{ transformOrigin: 'top center' }}
            >
              {/* Tilt */}
              <motion.div
                style={{
                  rotateX: flipped ? 0 : springX,
                  rotateY: flipped ? 0 : springY,
                  transformPerspective: 1000,
                  cursor: 'pointer',
                }}
                onMouseMove={!flipped ? onMouseMove : undefined}
                onMouseEnter={handleMouseEnter}
                onMouseLeave={resetTilt}
                onClick={() => setFlipped((f) => !f)}
              >
                {/* Flip container — 0.55s springier cubic-bezier */}
                <div style={{
                  width: W, height: H,
                  position: 'relative',
                  transformStyle: 'preserve-3d',
                  transition: 'transform 0.55s cubic-bezier(0.34, 1.26, 0.64, 1)',
                  transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                }}>

                  {/* ═══════ FRONT ═══════ */}
                  <div style={cardShell}>

                    {/* Accent gradient stripe */}
                    <div style={{
                      height: 3, flexShrink: 0,
                      background: `linear-gradient(90deg, ${T.accent} 0%, ${T.accent2} 100%)`,
                    }} />

                    {/* Holographic tilt reflex — moves with mouse position */}
                    <motion.div
                      style={{
                        position: 'absolute', inset: 0,
                        borderRadius: 16,
                        pointerEvents: 'none',
                        background: holoBg,
                        opacity: hovering && !flipped ? 1 : 0,
                        transition: 'opacity 0.3s ease',
                        zIndex: 4,
                        mixBlendMode: 'screen',
                      }}
                    />

                    {/* Glanz-Sweep on mouseEnter (remounts on each hover entry) */}
                    <AnimatePresence>
                      {sweepKey > 0 && (
                        <motion.div
                          key={sweepKey}
                          initial={{ x: '-130%', skewX: -20 }}
                          animate={{ x: '240%', skewX: -20 }}
                          exit={{}}
                          transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
                          style={{
                            position: 'absolute',
                            top: 0, bottom: 0, left: 0,
                            width: '48%',
                            background: 'linear-gradient(100deg, transparent 0%, rgba(255,255,255,0.055) 50%, transparent 100%)',
                            pointerEvents: 'none',
                            zIndex: 5,
                          }}
                        />
                      )}
                    </AnimatePresence>

                    {/* Header bar */}
                    <div style={{
                      flexShrink: 0,
                      padding: '10px 14px 9px',
                      display: 'flex', alignItems: 'center', gap: 9,
                      borderBottom: `1px solid ${T.border}`,
                      background: T.surface,
                    }}>
                      {/* Logo — white badge so it renders cleanly on dark surfaces */}
                      <div style={{
                        width: 42, height: 42, borderRadius: 8, flexShrink: 0,
                        background: '#ffffff',
                        display: 'flex', alignItems: 'center', justifyContent: 'center',
                        overflow: 'hidden',
                        boxShadow: `0 0 0 1px rgba(255,255,255,0.15), 0 2px 8px rgba(0,0,0,0.4)`,
                      }}>
                        <Image
                          src="/uploads/logo.png"
                          alt="E-Motion Rennteam Logo"
                          width={34}
                          height={34}
                          style={{ objectFit: 'contain', width: 34, height: 34 }}
                        />
                      </div>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{
                          fontSize: 9.5, fontWeight: 800,
                          letterSpacing: '0.13em', textTransform: 'uppercase',
                          color: T.fg, lineHeight: 1.1,
                          fontFamily: 'var(--font-heading, var(--font-sans, system-ui))',
                        }}>
                          E-Motion Rennteam
                        </div>
                        <div style={{
                          color: T.muted, fontSize: 7.5, fontWeight: 600,
                          letterSpacing: '0.12em', marginTop: 2.5,
                          textTransform: 'uppercase',
                        }}>
                          Hochschule Aalen
                        </div>
                      </div>
                      {isExecutive && (
                        <motion.span
                          initial={{ scale: 0.8, opacity: 0 }}
                          animate={{ scale: 1, opacity: 1 }}
                          transition={{ delay: 0.25, type: 'spring' }}
                          style={{
                            background: T.accent,
                            color: '#fff', fontSize: 7.5, fontWeight: 700,
                            padding: '3px 7px', borderRadius: 20,
                            letterSpacing: '0.12em', textTransform: 'uppercase',
                            flexShrink: 0,
                          }}
                        >
                          Executive
                        </motion.span>
                      )}
                    </div>

                    {/* Photo — full bleed */}
                    <div style={{ flex: 1, position: 'relative', overflow: 'hidden' }}>
                      {/* Left accent bar — print design element, 3 px, full photo height */}
                      <div style={{
                        position: 'absolute',
                        left: 0, top: 0, bottom: 0,
                        width: 3,
                        background: `linear-gradient(to bottom, ${T.accent} 0%, ${T.accent2} 100%)`,
                        zIndex: 2,
                      }} />

                      {member.photo ? (
                        <>
                          <Image
                            src={member.photo} alt={member.name} fill
                            style={{ objectFit: 'cover', objectPosition: 'top' }}
                          />
                          <div style={{
                            position: 'absolute', inset: 0,
                            background: `linear-gradient(to bottom, transparent 28%, rgba(6,7,13,0.55) 62%, rgba(6,7,13,0.97) 100%)`,
                          }} />
                        </>
                      ) : (
                        <div style={{
                          width: '100%', height: '100%',
                          display: 'flex', flexDirection: 'column',
                          alignItems: 'center', justifyContent: 'center', gap: 8,
                          background: T.surface2,
                        }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke={T.border}
                            strokeWidth="1" style={{ width: 38, height: 38 }}>
                            <circle cx="12" cy="8" r="4" />
                            <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                          </svg>
                          <span style={{
                            color: T.muted, fontSize: 8, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.2em',
                          }}>
                            Foto folgt
                          </span>
                        </div>
                      )}

                      {/* Name / Role overlay */}
                      <motion.div
                        initial={{ opacity: 0, y: 14 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: 0.38, duration: 0.4 }}
                        style={{
                          position: 'absolute', bottom: 0, left: 0, right: 0,
                          padding: '12px 16px 14px',
                        }}
                      >
                        {member.role && (
                          <div style={{
                            color: T.accentTxt,
                            fontSize: 8.5, fontWeight: 800,
                            letterSpacing: '0.2em', textTransform: 'uppercase',
                            marginBottom: 5,
                          }}>
                            {member.role}
                          </div>
                        )}
                        <h2
                          id={`modal-title-${member.slug}`}
                          style={{
                            color: T.fg,
                            fontSize: 'clamp(20px, 6.5vw, 26px)',
                            fontWeight: 900, lineHeight: 1.0,
                            margin: 0, letterSpacing: '-0.01em',
                            fontFamily: 'var(--font-heading, var(--font-sans, system-ui))',
                            textTransform: 'uppercase',
                          }}
                        >
                          {member.name}
                        </h2>
                        {member.department && (
                          <p style={{
                            color: T.muted, fontSize: 9, marginTop: 5,
                            fontWeight: 600, letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                          }}>
                            {member.department}
                          </p>
                        )}
                      </motion.div>
                    </div>

                    {/* Checkered bottom stripe */}
                    <CheckeredStripe opacity={0.22} />

                    {/* Flip hint */}
                    <div style={{
                      flexShrink: 0,
                      padding: '5px',
                      display: 'flex', alignItems: 'center',
                      justifyContent: 'center', gap: 5,
                      background: T.surface,
                    }}>
                      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"
                        style={{ width: 8, height: 8, color: T.muted, opacity: 0.45 }}>
                        <path d="M1 4v6h6M23 20v-6h-6" />
                        <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10M23 14l-4.64 4.36A9 9 0 0 1 3.51 15" />
                      </svg>
                      <span style={{
                        color: T.muted, fontSize: 7.5, fontWeight: 700,
                        letterSpacing: '0.2em', textTransform: 'uppercase', opacity: 0.45,
                      }}>
                        Umdrehen
                      </span>
                    </div>
                  </div>

                  {/* ═══════ BACK ═══════ */}
                  <div style={{
                    ...cardShell,
                    transform: 'rotateY(180deg)',
                  }}>
                    {/* Accent stripe */}
                    <div style={{
                      height: 3, flexShrink: 0,
                      background: `linear-gradient(90deg, ${T.accent} 0%, ${T.accent2} 100%)`,
                    }} />

                    <motion.div
                      variants={backContainer}
                      initial="hidden"
                      animate={backShowing ? 'visible' : 'hidden'}
                      style={{ display: 'flex', flexDirection: 'column', flex: 1 }}
                    >
                      {/* Header */}
                      <motion.div variants={backItem} style={{
                        flexShrink: 0,
                        padding: '11px 14px 10px',
                        display: 'flex', alignItems: 'center', gap: 10,
                        borderBottom: `1px solid ${T.border}`,
                        background: T.surface,
                      }}>
                        <div style={{
                          width: 36, height: 36, borderRadius: 8, overflow: 'hidden',
                          flexShrink: 0, background: T.surface2,
                          border: `1px solid ${T.border}`,
                          boxShadow: `0 0 0 2px rgba(0,113,181,0.25)`,
                        }}>
                          {member.photo ? (
                            <Image src={member.photo} alt={member.name} width={36} height={36}
                              style={{ width: '100%', height: '100%', objectFit: 'cover', objectPosition: 'top' }} />
                          ) : (
                            <div style={{ width: '100%', height: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                              <svg viewBox="0 0 24 24" fill="none" stroke={T.muted}
                                strokeWidth="1.5" style={{ width: 15, height: 15, opacity: 0.4 }}>
                                <circle cx="12" cy="8" r="4" />
                                <path d="M4 20c0-4.4 3.6-8 8-8s8 3.6 8 8" />
                              </svg>
                            </div>
                          )}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <p style={{
                            color: T.fg, fontSize: 13.5, fontWeight: 800, margin: 0,
                            letterSpacing: '-0.01em',
                            whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis',
                            fontFamily: 'var(--font-heading, var(--font-sans, system-ui))',
                            textTransform: 'uppercase',
                          }}>
                            {member.name}
                          </p>
                          {member.role && (
                            <p style={{
                              color: T.accentTxt, fontSize: 8.5, fontWeight: 700,
                              margin: '3px 0 0', textTransform: 'uppercase',
                              letterSpacing: '0.12em',
                            }}>
                              {member.role}
                            </p>
                          )}
                        </div>
                      </motion.div>

                      {/* Contact rows */}
                      <div style={{ flexShrink: 0, padding: '8px 12px 6px', display: 'flex', flexDirection: 'column', gap: 3 }}>
                        {(member.phone || !showReal) && (
                          <motion.div variants={backItem}>
                            <ContactRow icon={<PhoneIcon />}
                              label={showReal && member.phone ? maskPhone(member.phone) : '[Test Tel]'}
                              dim={!showReal || !member.phone} />
                          </motion.div>
                        )}
                        {(member.email || !showReal) && (
                          <motion.div variants={backItem}>
                            <ContactRow icon={<MailIcon />}
                              label={showReal && member.email ? maskEmail(member.email) : '[Test Mail]'}
                              dim={!showReal || !member.email} />
                          </motion.div>
                        )}
                        {member.linkedin && (
                          <motion.div variants={backItem}>
                            <ContactRow icon={<LinkedInIcon />} label="linkedin.com/in/•••" dim />
                          </motion.div>
                        )}
                      </div>

                      {/* QR section — center of attention */}
                      <motion.div variants={backItem} style={{
                        flexShrink: 0, margin: '0 12px',
                        borderTop: `1px solid ${T.border}`,
                        borderBottom: `1px solid ${T.border}`,
                        padding: '10px 0 8px',
                        display: 'flex', flexDirection: 'column', alignItems: 'center',
                        background: `linear-gradient(180deg, transparent, rgba(0,113,181,0.04) 50%, transparent)`,
                      }}>
                        {/* Label above QR */}
                        <div style={{
                          display: 'flex', alignItems: 'center', gap: 5, marginBottom: 7,
                        }}>
                          <div style={{ height: 1, width: 16, background: `linear-gradient(90deg, transparent, ${T.border})` }} />
                          <span style={{
                            color: T.accentTxt, fontSize: 7, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.22em',
                            opacity: 0.7,
                          }}>
                            Kontakt scannen
                          </span>
                          <div style={{ height: 1, width: 16, background: `linear-gradient(90deg, ${T.border}, transparent)` }} />
                        </div>

                        <div style={{
                          background: '#fff', borderRadius: 10, padding: 6,
                          boxShadow: `0 6px 24px rgba(0,0,0,0.7), 0 0 0 1px ${T.border}, 0 0 20px rgba(0,113,181,0.08)`,
                        }}>
                          {qrUrl ? (
                            <img src={qrUrl} alt="QR Code"
                              style={{ width: 96, height: 96, display: 'block', borderRadius: 5 }} />
                          ) : (
                            <div style={{
                              width: 96, height: 96, display: 'flex',
                              alignItems: 'center', justifyContent: 'center',
                              color: T.muted, fontSize: 10,
                            }}>…</div>
                          )}
                        </div>

                        {/* Decorative barcode + member ID row */}
                        <div style={{ width: '100%', marginTop: 8, padding: '0 4px' }}>
                          <DecorativeBarcode />
                        </div>
                        <p style={{
                          color: T.muted, fontSize: 7, marginTop: 4,
                          fontFamily: 'var(--font-mono, monospace)',
                          letterSpacing: '0.16em', fontWeight: 600, opacity: 0.38,
                        }}>
                          {memberId}
                        </p>
                      </motion.div>

                      {/* Actions */}
                      <motion.div variants={backItem} style={{
                        flexGrow: 1, padding: '8px 12px 10px',
                        display: 'flex', flexDirection: 'column',
                        gap: 5, justifyContent: 'flex-end',
                      }}>
                        <ActionButton onClick={(e) => { e.stopPropagation(); downloadVCard(member); }}>
                          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
                            style={{ width: 11, height: 11 }}>
                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                            <polyline points="7 10 12 15 17 10" />
                            <line x1="12" y1="15" x2="12" y2="3" />
                          </svg>
                          vCard herunterladen
                        </ActionButton>

                        <div style={{ display: 'flex', gap: 5 }}>
                          {showReal && member.email && (
                            <GhostButton href={googleLink()}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.8" style={{ width: 10, height: 10 }}>
                                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                                <circle cx="12" cy="7" r="4" />
                              </svg>
                              Google
                            </GhostButton>
                          )}
                          {showReal && member.phone && (
                            <GhostButton href={`tel:${member.phone}`}>
                              <svg viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                strokeWidth="1.8" style={{ width: 10, height: 10 }}>
                                <rect x="5" y="2" width="14" height="20" rx="2" />
                                <line x1="12" y1="18" x2="12" y2="18" strokeWidth="2" strokeLinecap="round" />
                              </svg>
                              Wallet
                            </GhostButton>
                          )}
                        </div>
                      </motion.div>

                      {/* Footer */}
                      <CheckeredStripe opacity={0.14} />
                      <motion.div variants={backItem} style={{
                        flexShrink: 0,
                        padding: '5px 14px',
                        display: 'flex', alignItems: 'center',
                        justifyContent: 'space-between',
                        background: T.surface,
                        borderTop: `1px solid ${T.border}`,
                      }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: 5 }}>
                          {/* Logo in footer — white badge */}
                          <div style={{
                            width: 16, height: 16, borderRadius: 2,
                            background: '#ffffff',
                            display: 'flex', alignItems: 'center', justifyContent: 'center',
                            overflow: 'hidden',
                          }}>
                            <Image
                              src="/uploads/logo.png"
                              alt=""
                              width={12}
                              height={12}
                              style={{ objectFit: 'contain', width: 12, height: 12 }}
                            />
                          </div>
                          <span style={{
                            color: T.muted, fontSize: 7.5, fontWeight: 700,
                            textTransform: 'uppercase', letterSpacing: '0.12em',
                            opacity: 0.55,
                          }}>
                            E-Motion Rennteam Aalen
                          </span>
                        </div>
                        {/* Gültig bis — like a real ID card */}
                        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 1 }}>
                          <span style={{
                            color: T.muted, fontSize: 6.5, fontWeight: 600,
                            textTransform: 'uppercase', letterSpacing: '0.1em',
                            opacity: 0.38,
                          }}>
                            Gültig bis
                          </span>
                          <span style={{
                            color: T.muted, fontSize: 7.5, fontWeight: 700,
                            letterSpacing: '0.06em',
                            opacity: 0.52,
                          }}>
                            Saison 2025/26
                          </span>
                        </div>
                      </motion.div>
                    </motion.div>
                  </div>

                </div>
              </motion.div>
            </motion.div>

            {/* Hint */}
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.65, duration: 0.35 }}
              style={{
                color: T.muted, fontSize: 8.5, opacity: 0.35,
                marginTop: 14, letterSpacing: '0.2em',
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

/* ─── ContactRow ─── */
function ContactRow({ icon, label, dim }: { icon: React.ReactNode; label: string; dim?: boolean }) {
  const [hov, setHov] = useState(false);
  return (
    <div
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', gap: 8,
        padding: '5px 8px 5px 6px', borderRadius: 8,
        border: `1px solid ${hov ? 'rgba(0,113,181,0.4)' : T.border}`,
        borderLeft: `2px solid ${hov ? T.accent : T.border}`,
        background: hov ? 'rgba(0,113,181,0.08)' : 'transparent',
        cursor: 'default',
        transition: 'all 0.14s ease',
      }}>
      <div style={{
        width: 22, height: 22, borderRadius: 6, flexShrink: 0,
        background: T.surface2,
        border: `1px solid ${T.border}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
      }}>
        {icon}
      </div>
      <span style={{
        fontSize: 11, fontWeight: 500,
        color: dim ? T.border : (hov ? T.fg : T.muted),
        letterSpacing: '0.01em',
        transition: 'color 0.14s ease',
      }}>
        {label}
      </span>
    </div>
  );
}

/* ─── ActionButton ─── */
function ActionButton({ onClick, children }: { onClick: (e: React.MouseEvent) => void; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <button
      onClick={onClick}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 7,
        border: `1px solid ${hov ? T.accent : T.border}`,
        borderRadius: 10, padding: '10px 16px',
        color: hov ? '#fff' : T.accentTxt,
        fontSize: 11.5, fontWeight: 700,
        cursor: 'pointer', letterSpacing: '0.05em', width: '100%',
        background: hov ? T.accent : T.surface2,
        boxShadow: hov ? `0 0 20px rgba(0,113,181,0.35)` : 'none',
        transition: 'all 0.16s ease',
      }}
    >
      {children}
    </button>
  );
}

/* ─── GhostButton ─── */
function GhostButton({ href, children }: { href: string; children: React.ReactNode }) {
  const [hov, setHov] = useState(false);
  return (
    <a
      href={href}
      target={href.startsWith('tel:') ? undefined : '_blank'}
      rel="noopener noreferrer"
      onClick={(e) => e.stopPropagation()}
      onMouseEnter={() => setHov(true)}
      onMouseLeave={() => setHov(false)}
      style={{
        flex: 1, display: 'flex', alignItems: 'center',
        justifyContent: 'center', gap: 5,
        border: `1px solid ${hov ? T.border : 'rgba(35,38,53,0.6)'}`,
        borderRadius: 8, padding: '8px',
        color: hov ? T.fg : T.muted,
        fontSize: 11, fontWeight: 700,
        textDecoration: 'none',
        background: hov ? T.surface2 : 'transparent',
        transition: 'all 0.14s ease',
      }}
    >
      {children}
    </a>
  );
}

/* ─── Icons ─── */
function PhoneIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={T.accentTxt} strokeWidth="1.8"
      style={{ width: 10, height: 10, opacity: 0.75 }}>
      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.22h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.82A16 16 0 0 0 15.18 16.09l.96-.96a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 22 16.92z" />
    </svg>
  );
}

function MailIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke={T.accentTxt} strokeWidth="1.8"
      style={{ width: 10, height: 10, opacity: 0.75 }}>
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
      <polyline points="22,6 12,13 2,6" />
    </svg>
  );
}

function LinkedInIcon() {
  return (
    <svg viewBox="0 0 24 24" fill={T.accentTxt} style={{ width: 9, height: 9, opacity: 0.75 }}>
      <path d="M4.98 3.5C4.98 4.881 3.87 6 2.5 6S0 4.881 0 3.5 1.12 1 2.5 1s2.48 1.119 2.48 2.5zM.24 8.25h4.52V23H.24V8.25zM8.5 8.25h4.33v2.02h.06c.6-1.14 2.07-2.34 4.26-2.34 4.55 0 5.39 3 5.39 6.9V23h-4.52v-6.7c0-1.6-.03-3.66-2.23-3.66-2.24 0-2.58 1.75-2.58 3.55V23H8.5V8.25z" />
    </svg>
  );
}
