# Feature: Interactive Visiting Cards for Executives

**Status:** Planning Phase  
**Branch:** `claude/magical-carson-oz9700`  
**Issue:** #463  
**Plan:** `/root/.claude/plans/groovy-gathering-umbrella.md`  

---

## Overview

Implement professional Business-Visiting Cards for Board Members (CEO/CTO/CFO) with direct export to Apple Wallet and Google Contacts. Cards display on the team page with elegant "Hanging Card" design inspired by event badges.

---

## User Experience

### Desktop Flow
1. User visits `/team` page
2. Board member cards show with "Executive" badge + enhanced glow
3. Click on Executive card → Modal opens with smooth animation
4. Modal displays:
   - Large photo with glow effect
   - Name, Role, Department
   - Contact details (Phone, Email, LinkedIn)
   - QR Code (scannable)
   - Action buttons: Download vCard, Add to Wallet
5. Escape key or Close button → Modal closes smoothly

### Mobile Flow
1. Same as desktop
2. Modal takes full screen (responsive)
3. QR code optimized for small screens
4. Wallet buttons use native OS intents

---

## Data Model

### TeamMember Type Extension
```typescript
export type TeamMember = {
  // ... existing fields
  phone?: string;           // "+49 (123) 456-7890"
  email?: string;           // "name@emotion-team.de"
  roleLevel?: 'ceo' | 'cto' | 'cfo' | 'member';  // Hierarchy flag
};
```

### Example Data (linda-mann.md)
```yaml
---
name: Linda Mann
photo: /uploads/single-bilder-upload/Linda.jpg
role: CEO
roleLevel: ceo
department: Board
season: "ERT-15/27"
order: 1
phone: "+49 (XXX) 123-4567"
email: linda.mann@emotion-rennteam.de
linkedin: https://www.linkedin.com/in/linda-mann-a3956a34a
---
```

---

## Technical Architecture

### Components & Utilities

#### 1. vCard Generator (`src/lib/vcard-generator.ts`)
Generates RFC 5545 compliant vCard format:
```
BEGIN:VCARD
VERSION:3.0
FN:Linda Mann
TITLE:CEO
ORG:E-Motion Rennteam Aalen
TEL;TYPE=WORK:+49 (XXX) 123-4567
EMAIL:linda.mann@emotion-rennteam.de
URL:https://www.linkedin.com/in/...
PHOTO:data:image/jpeg;base64,...
END:VCARD
```

**Exports:**
- `generateVCard(member: TeamMember): string` - RFC 5545 format
- `downloadVCard(member: TeamMember): void` - Trigger .vcf download

#### 2. QR Code Generator (`src/lib/qrcode-generator.ts`)
Generates scannable QR code from vCard data:
- Format: MECARD (mobile-friendly)
- Size: 200x200px
- Error correction: High (H)
- Library: `qrcode.react`

**Exports:**
- `generateQRCode(vcard: string): JSX.Element` - React component
- QR content: `MECARD:N:Mann,Linda;TEL:+49...;EMAIL:linda@...;URL:https://...`

#### 3. MemberModal Component (`src/components/MemberModal.tsx`)
Main modal UI with Hanging Card design:

**Props:**
```typescript
interface MemberModalProps {
  member: TeamMember;
  onClose: () => void;
}
```

**Features:**
- Framer Motion animations (backdrop fade + card slide-in)
- Lanyard/ribbon visual element
- Professional card layout with glow effects
- Staggered content reveal
- Accessibility: Focus trap, keyboard nav, ARIA labels

**Interior Layout:**
```
┌─ LANYARD ─┐
│           │
├───────────┤
│   PHOTO   │ (with glow)
├───────────┤
│ Name      │
│ CEO       │
│ Board     │
├───────────┤
│ 📞 +49... │
│ 📧 email  │
│ 🔗 LinkedIn
├───────────┤
│  QR-CODE  │
├───────────┤
│ Buttons   │
└───────────┘
```

**Action Buttons:**

1. **Download vCard**
   - Triggers `.vcf` file download
   - Compatible with all OS
   - Opens in default contacts app

2. **Apple Wallet** (iOS only)
   - Generates `.pkpass` file
   - One-tap add to Apple Wallet
   - Shows pass in Wallet app

3. **Google Contacts** (Android/Chrome)
   - Opens "Add to Contacts" intent
   - Auto-fills phone, email, LinkedIn
   - Saves to Google Contacts

#### 4. Team Page Integration (`src/app/(site)/team/page.tsx`)

**Changes:**
- Filter executives: `member.roleLevel === 'ceo'|'cto'|'cfo'`
- Add Executive badge ("Executive" label)
- Highlight with glow ring: `ring-2 ring-accent/40`
- Click handler: `onClick={() => setSelectedMember(member)}`
- Modal state: `useState<TeamMember | null>`
- Render: `<MemberModal member={selectedMember} onClose={() => setSelectedMember(null)} />`

**Visual Indicators:**
- Non-executives: Regular team member card
- Executives: Card + "Executive" badge + glow ring + cursor-pointer

---

## Styling & Animations

### Colors & Shadows
```css
/* Glow effect */
box-shadow: 0 0 50px rgba(0, 113, 181, 0.6);

/* Accent blue */
--accent: #0071b5;

/* Dark mode surfaces */
--bg-surface: #10121b;
--bg-dark: #06070d;
```

### Animations (Framer Motion)
1. **Modal Entry:**
   - Backdrop: `opacity 0→1` (200ms)
   - Panel: `x: 100%→0` (spring, damping: 32)

2. **Content Reveal:**
   - Photo fade-in
   - Text staggered (delayChildren: 0.08)
   - QR Code fade
   - Buttons appear last

3. **Hover States:**
   - Card lift: `y: 0→-4px`
   - Glow intensify
   - Photo zoom (slight)

### Responsive Breakpoints
- **Mobile** (<640px):
  - Full-screen modal
  - Lanyard simplified
  - QR code optimized

- **Desktop** (640px+):
  - Centered modal (max-width: 400px)
  - Full lanyard animation
  - Large QR code

---

## Dependencies

### Required
- `qrcode.react` - QR code generation

### Existing (Reuse)
- `framer-motion` - Animations
- `lucide-react` - Icons (phone, email, link)
- `next/image` - Image optimization
- `tailwindcss` - Styling

---

## CMS Admin Panel

**New Fields in Team Collection:**

| Field | Type | Required | Description |
|-------|------|----------|-------------|
| phone | string | No | Phone number with country code |
| email | string | No | Contact email address |
| roleLevel | select | No | Hierarchy: ceo, cto, cfo, member |

**Auto-Population:**
- Photo lookup: Searches `/uploads/single-bilder-upload/<Name>.jpg`
- Existing LinkedIn field: Already supports links

---

## Testing Checklist

### Functional
- [ ] Modal opens on Executive card click
- [ ] Modal closes on Escape key
- [ ] Modal closes on close button click
- [ ] vCard downloads with `.vcf` extension
- [ ] QR code scans to valid contact data
- [ ] Apple Wallet button works on iOS
- [ ] Google Contacts button works on Android

### UX & Performance
- [ ] Smooth animations (no jank)
- [ ] Mobile responsive layout
- [ ] Touch-friendly button sizes
- [ ] No layout shifts on modal open
- [ ] Fast load time

### Accessibility
- [ ] Modal has `role="dialog"` and `aria-modal="true"`
- [ ] Phone/Email links clickable: `tel:` and `mailto:`
- [ ] Tab navigation through modal buttons
- [ ] Escape key closes modal
- [ ] Screen reader announces modal title
- [ ] Focus returns to original card after close
- [ ] ARIA labels on all buttons

### Browser Compatibility
- [ ] Chrome/Edge (Desktop)
- [ ] Firefox (Desktop)
- [ ] Safari (Desktop & iOS)
- [ ] Chrome (Android)
- [ ] Samsung Internet

---

## Implementation Steps

See Plan: `/root/.claude/plans/groovy-gathering-umbrella.md`

1. Install `qrcode.react` dependency
2. Extend TeamMember schema
3. Create vCard generator
4. Create QR code generator
5. Build MemberModal component
6. Integrate into Team page
7. Update Executive data (phone, email, roleLevel)
8. Test end-to-end

**Estimated Time:** ~2 hours

---

## File Changes Summary

| File | Type | Change |
|------|------|--------|
| `package.json` | Config | Add qrcode.react |
| `src/lib/content.ts` | Type | Extend TeamMember |
| `src/lib/cms/collections.ts` | Config | Add CMS fields |
| `src/lib/vcard-generator.ts` | NEW | vCard utility |
| `src/lib/qrcode-generator.ts` | NEW | QR utility |
| `src/components/MemberModal.tsx` | NEW | Modal component |
| `src/app/(site)/team/page.tsx` | Component | Integration |
| `content/team/linda-mann.md` | Data | Add contact fields |
| `content/team/florian-nusseler.md` | Data | Add contact fields |
| `content/team/rafael-anranter.md` | Data | Add contact fields |

---

## Future Enhancements (Phase 2)

- 3D Tilt effect on photo (mouse tracking)
- Drag-to-dismiss gesture (mobile)
- Share button (LinkedIn preset message)
- Direct PKPass/Google Pay support
- vCard QR code customization (colors, logo)
- Wallet pass design customization

---

**Last Updated:** 2026-09-28  
**Plan Author:** Claude Haiku 4.5  
**Reviewed:** Pending
