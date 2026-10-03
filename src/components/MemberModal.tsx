'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence, useReducedMotion } from 'framer-motion';
import Image from 'next/image';
import type { TeamMember } from '@/lib/content';
import { downloadVCard } from '@/lib/vcard-generator';
import { generateQRCodeValue, generateQRCodeDataUrl } from '@/lib/qrcode-generator';

interface MemberModalProps {
  member: TeamMember | null;
  onClose: () => void;
}

const CARD_W = 340;
const CARD_H = 540;
const CARD_TOP = 190;
const STAGE_W = 340;
const STAGE_H = CARD_TOP + CARD_H;
const RAIL_Y = 44;
const MAX_ANGLE = 0.9;
const SITE_HOST = 'emotion-rennteam.de';
const ADDRESS = 'Beethovenstraße 1 · 73430 Aalen';

const HEADING_FONT = "var(--font-heading), var(--font-body), Arial, sans-serif";
const BODY_FONT = "var(--font-body), Arial, Helvetica, sans-serif";

function maskPhone(phone: string): string {
  const prefix = phone.slice(0, Math.min(10, Math.ceil(phone.length * 0.45)));
  return prefix + ' •••–••••';
}

function maskEmail(email: string): string {
  const [local, domain] = email.split('@');
  if (!domain) return email;
  return `${local.slice(0, 2)}•••@${domain}`;
}

function nameFontSize(name: string, base: number): number {
  const len = name.length;
  if (len <= 14) return base;
  if (len <= 20) return Math.round(base * 0.83);
  if (len <= 26) return Math.round(base * 0.7);
  return Math.round(base * 0.6);
}

/* ─── Icons ─── */
const iconProps = {
  width: 18,
  height: 18,
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: '#5aa6d6',
  strokeWidth: 2,
  strokeLinecap: 'round' as const,
  strokeLinejoin: 'round' as const,
  'aria-hidden': true,
};

function PhoneIcon() {
  return (
    <svg {...iconProps}>
      <path d="M5 4h4l2 5-2.5 1.5a11 11 0 005 5L15 13l5 2v4a2 2 0 01-2 2A16 16 0 013 6a2 2 0 012-2z" />
    </svg>
  );
}
function MailIcon() {
  return (
    <svg {...iconProps}>
      <rect x="3" y="5" width="18" height="14" rx="2" />
      <path d="M3 7l9 6 9-6" />
    </svg>
  );
}
function GlobeIcon() {
  return (
    <svg {...iconProps}>
      <circle cx="12" cy="12" r="9" />
      <path d="M3 12h18M12 3a14 14 0 010 18M12 3a14 14 0 000 18" />
    </svg>
  );
}
function PinIcon() {
  return (
    <svg {...iconProps}>
      <path d="M12 21s7-6.2 7-11a7 7 0 10-14 0c0 4.8 7 11 7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </svg>
  );
}
function PersonIcon({ size, stroke }: { size: number; stroke: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={stroke} strokeWidth="1.3" aria-hidden="true">
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4.4 3.6-8 8-8s8 3.6 8 8" />
    </svg>
  );
}

function ContactRow({ icon, text }: { icon: React.ReactNode; text: string }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'center',
        gap: 12,
        minHeight: 40,
        boxSizing: 'border-box',
        padding: '0 14px',
        borderRadius: 14,
        background: 'rgba(255,255,255,0.05)',
        border: '1px solid rgba(255,255,255,0.1)',
        fontSize: 13,
        color: '#f5f6f8',
      }}
    >
      <span style={{ flex: 'none', display: 'flex' }}>{icon}</span>
      <span style={{ minWidth: 0, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={text}>
        {text}
      </span>
    </div>
  );
}

const pillButton: React.CSSProperties = {
  minHeight: 44,
  padding: '0 18px',
  borderRadius: 999,
  border: '1px solid #232635',
  background: 'rgba(16,18,27,0.9)',
  color: '#f5f6f8',
  fontSize: 14,
  cursor: 'pointer',
  fontFamily: BODY_FONT,
};

function MemberDialog({ member, onClose }: { member: TeamMember; onClose: () => void }) {
  const reduceMotion = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const previousActiveElement = useRef<HTMLElement | null>(null);
  const anchorRef = useRef<HTMLDivElement>(null);
  const swingRef = useRef<HTMLDivElement>(null);
  const sheenRef = useRef<HTMLDivElement>(null);
  const parallaxRef = useRef<HTMLDivElement>(null);
  const physics = useRef({ th: 0, om: 0, drag: false, t: 0, sway: !reduceMotion });

  const [qrCodeDataUrl, setQrCodeDataUrl] = useState('');
  const [flipped, setFlipped] = useState(false);
  const [swayOn, setSwayOn] = useState(!reduceMotion);
  const [scale, setScale] = useState(1);

  const isExecutive = ['ceo', 'cto', 'cfo'].includes(member.roleLevel || '');
  const isLeadership = isExecutive || ['Teamleiter', 'Leitung'].includes((member.role || '').trim());

  /* Dialog: Escape, focus trap, focus return, scroll lock */
  useEffect(() => {
    previousActiveElement.current = document.activeElement as HTMLElement;
    const previousOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose();
        return;
      }
      if (e.key !== 'Tab' || !dialogRef.current) return;
      const focusable = Array.from(
        dialogRef.current.querySelectorAll<HTMLElement>('button, a[href], [tabindex]:not([tabindex="-1"])'),
      ).filter((el) => !el.hasAttribute('disabled'));
      if (focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener('keydown', handleKeyDown);
    dialogRef.current?.focus();
    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.body.style.overflow = previousOverflow;
      previousActiveElement.current?.focus();
    };
  }, [member, onClose]);

  /* QR code */
  useEffect(() => {
    generateQRCodeDataUrl(generateQRCodeValue(member))
      .then(setQrCodeDataUrl)
      .catch(() => setQrCodeDataUrl(''));
  }, [member]);

  /* Fit the fixed-size stage into the viewport */
  useEffect(() => {
    const fit = () => {
      const byWidth = (window.innerWidth - 24) / STAGE_W;
      const byHeight = (window.innerHeight - RAIL_Y - 12 - 132) / STAGE_H;
      setScale(Math.max(0.4, Math.min(1, byWidth, byHeight)));
    };
    fit();
    window.addEventListener('resize', fit);
    return () => window.removeEventListener('resize', fit);
  }, [member]);

  /* Pendulum */
  useEffect(() => {
    const p = physics.current;
    p.th = reduceMotion ? 0 : 0.32;
    p.om = 0;
    p.drag = false;
    let last = performance.now();
    let raf = 0;
    const tick = (now: number) => {
      const dt = Math.min(0.032, (now - last) / 1000);
      last = now;
      p.t += dt;
      if (!p.drag) {
        const drive = p.sway ? 1.2 * Math.sin(1.5 * p.t) : 0;
        const acc = -14 * Math.sin(p.th) - 0.9 * p.om + drive;
        p.om += acc * dt;
        p.th += p.om * dt;
        if (p.th > MAX_ANGLE) {
          p.th = MAX_ANGLE;
          p.om = -Math.abs(p.om) * 0.4;
        }
        if (p.th < -MAX_ANGLE) {
          p.th = -MAX_ANGLE;
          p.om = Math.abs(p.om) * 0.4;
        }
      }
      const deg = (p.th * 180) / Math.PI;
      if (swingRef.current) swingRef.current.style.transform = `rotate(${deg.toFixed(2)}deg)`;
      if (sheenRef.current) sheenRef.current.style.backgroundPosition = `${(50 + deg * 2.2).toFixed(1)}% 0`;
      if (parallaxRef.current) parallaxRef.current.style.transform = `translateX(${(-deg * 0.35).toFixed(1)}px)`;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [reduceMotion]);

  const toggleSway = () => {
    physics.current.sway = !physics.current.sway;
    setSwayOn(physics.current.sway);
  };

  const onCardPointerDown = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    const p = physics.current;
    const startX = e.clientX;
    const startY = e.clientY;
    let moved = false;
    p.om = 0;
    let lastMove = performance.now();

    const onMove = (ev: PointerEvent) => {
      if (!moved && Math.hypot(ev.clientX - startX, ev.clientY - startY) > 6) {
        moved = true;
        p.drag = true;
      }
      if (!p.drag || !anchorRef.current) return;
      const r = anchorRef.current.getBoundingClientRect();
      const dx = ev.clientX - (r.left + r.width / 2);
      const dy = ev.clientY - r.top;
      let th = Math.atan2(dx, Math.max(dy, 40));
      th = Math.max(-MAX_ANGLE, Math.min(MAX_ANGLE, th));
      const now = performance.now();
      const dt = Math.max(0.008, Math.min(0.05, (now - lastMove) / 1000));
      lastMove = now;
      const v = (th - p.th) / dt;
      p.om = Math.max(-8, Math.min(8, 0.5 * p.om + 0.5 * v));
      p.th = th;
    };
    const onUp = () => {
      window.removeEventListener('pointermove', onMove);
      window.removeEventListener('pointerup', onUp);
      window.removeEventListener('pointercancel', onUp);
      p.drag = false;
      if (!moved) setFlipped((f) => !f);
    };
    window.addEventListener('pointermove', onMove);
    window.addEventListener('pointerup', onUp);
    window.addEventListener('pointercancel', onUp);
  }, []);

  const getGoogleContactsLink = () => {
    const p = new URLSearchParams();
    if (member.name) p.append('name', member.name);
    if (member.phone) p.append('tel', member.phone);
    if (member.email) p.append('email', member.email);
    return `https://contacts.google.com/?add&contact=${p.toString()}`;
  };

  const showPhone = isLeadership && !!member.phone;
  const showEmail = isLeadership && !!member.email;

  return (
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
            position: 'fixed',
            inset: 0,
            zIndex: 100,
            overflow: 'hidden',
            outline: 'none',
            background:
              'radial-gradient(ellipse 70% 50% at 50% 48%, #12203f 0%, #0a0d18 45%, #06070d 78%)',
            fontFamily: BODY_FONT,
            color: '#f5f6f8',
          }}
        >
          {/* Rail */}
          <div
            aria-hidden="true"
            style={{
              position: 'absolute',
              left: 0,
              right: 0,
              top: RAIL_Y - 14,
              height: 14,
              background: 'linear-gradient(180deg, #5a6075 0%, #232635 55%, #10121b 100%)',
            }}
          />

          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onClose();
            }}
            aria-label="Schließen"
            style={{
              position: 'absolute',
              right: 16,
              top: 16,
              zIndex: 60,
              width: 44,
              height: 44,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.18)',
              background: 'rgba(16,18,27,0.85)',
              color: '#f5f6f8',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              cursor: 'pointer',
            }}
          >
            <svg viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>

          {/* Stage */}
          <motion.div
            onClick={(e) => e.stopPropagation()}
            initial={{ y: -140, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: -80, opacity: 0 }}
            transition={{ type: 'spring', damping: 20, stiffness: 140 }}
            style={{
              position: 'absolute',
              top: RAIL_Y,
              left: '50%',
              width: STAGE_W,
              height: STAGE_H,
              marginLeft: -STAGE_W / 2,
              transformOrigin: 'top center',
            }}
          >
            <div style={{ width: STAGE_W, height: STAGE_H, transform: `scale(${scale})`, transformOrigin: 'top center' }}>
              <div ref={anchorRef} style={{ position: 'absolute', left: STAGE_W / 2, top: 0, width: 0, height: 0 }} />

              <div
                ref={swingRef}
                style={{
                  position: 'absolute',
                  left: 0,
                  top: 0,
                  width: STAGE_W,
                  height: STAGE_H,
                  transformOrigin: `${STAGE_W / 2}px 0px`,
                }}
              >
                {/* Lanyard */}
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 148,
                    top: 0,
                    width: 44,
                    height: 150,
                    background: '#0071b5',
                    display: 'flex',
                    alignItems: 'flex-start',
                    justifyContent: 'center',
                    paddingTop: 12,
                    boxSizing: 'border-box',
                    overflow: 'hidden',
                  }}
                >
                  <div
                    style={{
                      writingMode: 'vertical-rl',
                      fontFamily: HEADING_FONT,
                      fontSize: 11,
                      letterSpacing: '0.08em',
                      color: '#ffffff',
                      whiteSpace: 'nowrap',
                    }}
                  >
                    E-MOTION RENNTEAM
                  </div>
                </div>
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 150,
                    top: 146,
                    width: 40,
                    height: 46,
                    borderRadius: 6,
                    background: 'linear-gradient(180deg, #b9bfd1 0%, #4a4f63 100%)',
                  }}
                />
                <div
                  aria-hidden="true"
                  style={{
                    position: 'absolute',
                    left: 158,
                    top: 170,
                    width: 24,
                    height: 24,
                    boxSizing: 'border-box',
                    borderRadius: '50%',
                    border: '3px solid #b9bfd1',
                  }}
                />

                {/* Card */}
                <div
                  onPointerDown={onCardPointerDown}
                  style={{
                    position: 'absolute',
                    left: 0,
                    top: CARD_TOP,
                    width: CARD_W,
                    height: CARD_H,
                    perspective: 1600,
                    cursor: 'grab',
                    touchAction: 'none',
                    userSelect: 'none',
                    filter: 'drop-shadow(0 30px 36px rgba(0,0,0,0.65))',
                  }}
                >
                  <div
                    style={{
                      position: 'relative',
                      width: CARD_W,
                      height: CARD_H,
                      transformStyle: 'preserve-3d',
                      transition: 'transform 0.8s cubic-bezier(.25,.8,.2,1)',
                      transform: flipped ? 'rotateY(180deg)' : 'rotateY(0deg)',
                    }}
                  >
                    {/* ════════ FRONT ════════ */}
                    <div
                      aria-hidden={flipped}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        borderRadius: 26,
                        border: '1px solid rgba(255,255,255,0.16)',
                        background: '#06070d',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                      }}
                    >
                      {member.photo ? (
                        <div ref={parallaxRef} style={{ position: 'absolute', inset: '-10px -24px', willChange: 'transform' }}>
                          <Image
                            src={member.photo}
                            alt=""
                            fill
                            sizes="400px"
                            priority
                            draggable={false}
                            style={{ objectFit: 'cover', objectPosition: 'top', pointerEvents: 'none' }}
                          />
                        </div>
                      ) : (
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            gap: 10,
                            paddingBottom: 150,
                            background: 'linear-gradient(180deg, #171a26, #06070d)',
                          }}
                        >
                          <PersonIcon size={130} stroke="#2a3040" />
                          <span style={{ color: '#9aa0b4', fontSize: 12, letterSpacing: '0.2em' }}>FOTO FOLGT</span>
                        </div>
                      )}
                      <div
                        style={{
                          position: 'absolute',
                          inset: 0,
                          background:
                            'linear-gradient(180deg, rgba(6,7,13,0.6) 0%, rgba(6,7,13,0) 22%, rgba(6,7,13,0) 40%, rgba(6,7,13,0.9) 68%, #06070d 100%)',
                        }}
                      />

                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img
                        src="/uploads/logo.png"
                        alt=""
                        draggable={false}
                        style={{ position: 'absolute', left: 12, top: 0, width: 190, height: 'auto', pointerEvents: 'none' }}
                      />
                      {member.season && (
                        <div
                          style={{
                            position: 'absolute',
                            right: 20,
                            top: 22,
                            padding: '6px 12px',
                            borderRadius: 999,
                            background: 'rgba(16,18,27,0.55)',
                            border: '1px solid rgba(255,255,255,0.18)',
                            fontSize: 11,
                            letterSpacing: '0.16em',
                            color: '#f5f6f8',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {member.season}
                        </div>
                      )}

                      {/* Glass panel */}
                      <div
                        style={{
                          position: 'absolute',
                          left: 16,
                          right: 16,
                          bottom: 16,
                          boxSizing: 'border-box',
                          padding: '16px 18px 14px',
                          borderRadius: 20,
                          background: 'rgba(16,18,27,0.5)',
                          border: '1px solid rgba(255,255,255,0.16)',
                          backdropFilter: 'blur(18px)',
                          WebkitBackdropFilter: 'blur(18px)',
                        }}
                      >
                        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
                          {member.role && (
                            <span
                              style={{
                                padding: '4px 10px',
                                borderRadius: 999,
                                background: '#0071b5',
                                color: '#ffffff',
                                fontSize: 11,
                                letterSpacing: '0.14em',
                                textTransform: 'uppercase',
                                lineHeight: 1.3,
                              }}
                            >
                              {member.role}
                            </span>
                          )}
                        </div>
                        <h2
                          id={`modal-title-${member.slug}`}
                          style={{
                            margin: '10px 0 0',
                            fontFamily: HEADING_FONT,
                            fontSize: nameFontSize(member.name, 36),
                            lineHeight: 1.05,
                            letterSpacing: '0.02em',
                            fontWeight: 400,
                            color: '#f5f6f8',
                            overflowWrap: 'anywhere',
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                          }}
                        >
                          {member.name}
                        </h2>
                        {member.department && (
                          <div style={{ marginTop: 8, fontSize: 13, letterSpacing: '0.08em', color: '#5aa6d6', lineHeight: 1.35 }}>
                            {member.department}
                          </div>
                        )}
                        <div
                          style={{
                            marginTop: 12,
                            paddingTop: 10,
                            borderTop: '1px solid rgba(255,255,255,0.14)',
                            display: 'flex',
                            justifyContent: 'space-between',
                            alignItems: 'center',
                            fontSize: 11,
                            letterSpacing: '0.16em',
                            color: '#9aa0b4',
                          }}
                        >
                          <span>{SITE_HOST.toUpperCase()}</span>
                          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#5aa6d6" strokeWidth="2" strokeLinecap="round" aria-hidden="true">
                            <path d="M6 8a6 6 0 010 8M10 5a10 10 0 010 14M14 2a14 14 0 010 20" />
                          </svg>
                        </div>
                      </div>

                      <div
                        ref={sheenRef}
                        aria-hidden="true"
                        style={{
                          position: 'absolute',
                          inset: 0,
                          pointerEvents: 'none',
                          mixBlendMode: 'screen',
                          backgroundImage:
                            'linear-gradient(112deg, rgba(0,0,0,0) 34%, rgba(0,113,181,0.35) 42%, rgba(255,255,255,0.3) 50%, rgba(90,166,214,0.35) 58%, rgba(0,0,0,0) 66%)',
                          backgroundSize: '260% 100%',
                          backgroundPosition: '50% 0',
                        }}
                      />
                    </div>

                    {/* ════════ BACK ════════ */}
                    <div
                      aria-hidden={!flipped}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        borderRadius: 26,
                        border: '1px solid rgba(255,255,255,0.16)',
                        background: '#06070d',
                        backfaceVisibility: 'hidden',
                        WebkitBackfaceVisibility: 'hidden',
                        transform: 'rotateY(180deg)',
                        display: 'flex',
                        flexDirection: 'column',
                      }}
                    >
                      <div style={{ position: 'relative', height: 170, flex: 'none' }}>
                        <Image
                          src="/uploads/ert-14-26-studio.jpg"
                          alt=""
                          fill
                          sizes="340px"
                          draggable={false}
                          style={{ objectFit: 'cover', objectPosition: '60% 55%', pointerEvents: 'none' }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            inset: 0,
                            background: 'linear-gradient(180deg, rgba(6,7,13,0.35) 0%, rgba(6,7,13,0.1) 45%, #06070d 100%)',
                          }}
                        />
                        <div
                          style={{
                            position: 'absolute',
                            left: 20,
                            top: 20,
                            display: 'flex',
                            alignItems: 'center',
                            gap: 10,
                            fontSize: 11,
                            letterSpacing: '0.2em',
                            color: '#f5f6f8',
                          }}
                        >
                          <span style={{ display: 'block', width: 24, height: 3, background: '#0071b5' }} />
                          <span>E-MOTION RENNTEAM AALEN</span>
                        </div>
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 12, margin: '-34px 20px 0', position: 'relative' }}>
                        <div
                          style={{
                            width: 64,
                            height: 64,
                            boxSizing: 'border-box',
                            borderRadius: '50%',
                            border: '2px solid #0071b5',
                            overflow: 'hidden',
                            flex: 'none',
                            background: '#171a26',
                            position: 'relative',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {member.photo ? (
                            <Image
                              src={member.photo}
                              alt=""
                              fill
                              sizes="64px"
                              draggable={false}
                              style={{ objectFit: 'cover', objectPosition: 'top' }}
                            />
                          ) : (
                            <PersonIcon size={34} stroke="#9aa0b4" />
                          )}
                        </div>
                        <div style={{ minWidth: 0, paddingTop: 30 }}>
                          <div
                            style={{
                              fontFamily: HEADING_FONT,
                              fontSize: nameFontSize(member.name, 25),
                              lineHeight: 1.05,
                              letterSpacing: '0.02em',
                              overflowWrap: 'anywhere',
                              display: '-webkit-box',
                              WebkitLineClamp: 2,
                              WebkitBoxOrient: 'vertical',
                              overflow: 'hidden',
                            }}
                          >
                            {member.name}
                          </div>
                          {member.role && (
                            <div style={{ marginTop: 4, fontSize: 12, letterSpacing: '0.12em', color: '#5aa6d6', textTransform: 'uppercase' }}>
                              {member.role}
                              {member.department ? ` · ${member.department}` : ''}
                            </div>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', gap: 6, margin: '18px 20px 0' }}>
                        {showPhone && <ContactRow icon={<PhoneIcon />} text={maskPhone(member.phone!)} />}
                        {showEmail && <ContactRow icon={<MailIcon />} text={maskEmail(member.email!)} />}
                        <ContactRow icon={<GlobeIcon />} text={SITE_HOST} />
                        <ContactRow icon={<PinIcon />} text={ADDRESS} />
                      </div>

                      <div style={{ display: 'flex', alignItems: 'center', gap: 14, margin: 'auto 20px 22px' }}>
                        <div
                          style={{
                            width: 96,
                            height: 96,
                            flex: 'none',
                            boxSizing: 'border-box',
                            borderRadius: 14,
                            background: '#ffffff',
                            padding: 6,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          {qrCodeDataUrl ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={qrCodeDataUrl} alt="QR-Code zum Speichern des Kontakts" draggable={false} style={{ width: '100%', height: '100%', display: 'block' }} />
                          ) : (
                            <span style={{ color: '#555a6b', fontSize: 11 }}>Lädt…</span>
                          )}
                        </div>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, minWidth: 0, flex: 1 }}>
                          <div style={{ fontSize: 11, letterSpacing: '0.14em', color: '#9aa0b4', lineHeight: 1.5 }}>
                            SCANNEN &amp; KONTAKT SPEICHERN
                          </div>
                          <button
                            type="button"
                            onPointerDown={(e) => e.stopPropagation()}
                            onClick={(e) => {
                              e.stopPropagation();
                              downloadVCard(member);
                            }}
                            tabIndex={flipped ? 0 : -1}
                            style={{
                              minHeight: 40,
                              borderRadius: 999,
                              border: '1px solid #0071b5',
                              background: '#0071b5',
                              color: '#ffffff',
                              fontSize: 13,
                              cursor: 'pointer',
                              fontFamily: BODY_FONT,
                            }}
                          >
                            vCard laden
                          </button>
                          {showEmail && (
                            <a
                              href={getGoogleContactsLink()}
                              target="_blank"
                              rel="noopener noreferrer"
                              onPointerDown={(e) => e.stopPropagation()}
                              onClick={(e) => e.stopPropagation()}
                              tabIndex={flipped ? 0 : -1}
                              style={{
                                minHeight: 36,
                                display: 'flex',
                                alignItems: 'center',
                                justifyContent: 'center',
                                borderRadius: 999,
                                border: '1px solid rgba(255,255,255,0.18)',
                                color: '#f5f6f8',
                                fontSize: 13,
                                textDecoration: 'none',
                              }}
                            >
                              Google Kontakte
                            </a>
                          )}
                        </div>
                      </div>

                      <div style={{ display: 'flex', height: 8, flex: 'none' }}>
                        <div style={{ flex: 3, background: '#0071b5' }} />
                        <div style={{ flex: 1, background: '#162e7b' }} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Controls */}
          <div
            onClick={(e) => e.stopPropagation()}
            style={{
              position: 'absolute',
              left: 16,
              right: 16,
              bottom: 20,
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: 8,
            }}
          >
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap', justifyContent: 'center' }}>
              <button type="button" style={pillButton} onClick={() => setFlipped((f) => !f)}>
                {flipped ? 'Vorderseite' : 'Umdrehen'}
              </button>
              <button
                type="button"
                aria-pressed={swayOn}
                onClick={toggleSway}
                style={{
                  ...pillButton,
                  background: swayOn ? '#0071b5' : pillButton.background,
                  borderColor: swayOn ? '#0071b5' : '#232635',
                  color: '#ffffff',
                }}
              >
                Pendeln
              </button>
            </div>
            <p style={{ margin: 0, fontSize: 12, letterSpacing: '0.12em', color: '#9aa0b4' }}>
              Karte ziehen &amp; loslassen · Tippen zum Umdrehen · ESC schließt
            </p>
          </div>
        </motion.div>
  );
}

export default function MemberModal({ member, onClose }: MemberModalProps) {
  return (
    <AnimatePresence>
      {member && <MemberDialog key={member.slug} member={member} onClose={onClose} />}
    </AnimatePresence>
  );
}
