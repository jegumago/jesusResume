# Jesús Martínez // DevOps & Admin Portfolio

Interactive terminal-style portfolio deployed via GitHub Pages. Features a cyber/neon aesthetic with a dual-mode interface — hacker terminal and professional CV.

**Live:** https://jegumago.github.io/jesusResume/

---

## Features

### Identity Gate (Entry Screen)
- Two entry paths: **CORPORATE_HR_PROTOCOL** (direct to CV) or **BLACK_HAT_TERMINAL** (boot sequence)
- Animated frame pulse with neon glow transitions

### Hacker Terminal Path
- Boot sequence with simulated system initialization log lines
- Login prompt with agent identification + password cracking animation
- **Matrix Rain** digital katakana fall during the boot sequence
- Loading bar with decryption progress

### Main Interface — Cyber Mode
- **Neon particle system** — 110 particles with glow, pulse, and interconnecting web (cyan / magenta / yellow)
- **Animated grid lines** + CRT scanlines overlay
- **5 floating geometric shapes** with glow and drift animation
- **Corner brackets** with alternating neon colors
- **Mouse trail** that expands on interactive elements
- **Live clock** + version display
- **System Metrics** — simulated operational KPIs
- **Hardware Inventory** — 11 skill slots with click-to-inspect metadata pane
- **Contract Log** — 4 encrypted experience entries with decrypt animation (14-iteration scramble + glitch border flash)
- **Overclock mode** — inverts neon/critical colors
- **Toggle font** — terminal ↔ readable

### HR Mode (Standard CV)
- White glass card (`rgba(255,255,255,0.35)`) floats over the cyber background with backdrop blur
- Professional layout: Segoe UI font, slate/black text, blue accent (`#1d4ed8`)
- All cyber decorations visible through the semi-transparent card
- LinkedIn button with blue border + hover fill
- Clean section cards with rounded corners

### Screen Transitions
- Smooth fade + scale transitions between gatekeeper → boot → main UI
- Skill description scramble effect on slot change
- Staggered reveal animation for sections

### Responsive Design
- 3 breakpoints: 768px, 600px, 480px
- Adaptive grid, compact spacing, mobile-friendly controls

---

## Tech Stack
- Vanilla HTML / CSS / JavaScript (no frameworks)
- Canvas API for particle system and matrix rain
- Google Fonts: Orbitron (headings)
- GitHub Pages for hosting (master branch)

---

## Deployment

```bash
git add .
git commit -m "description of changes"
git push origin master
```

> A `shipit` alias is configured in `.bash_aliases` to streamline this workflow. 
