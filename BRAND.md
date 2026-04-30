# El Perro Negro — Brand Guidelines

## Identity
**Name:** El Perro Negro  
**Tagline:** Agave y Amigos  
**Type:** Tequila & Mezcal Bar (High-Level Craft Cocktails)  
**Aesthetic:** Mesoamerican folk art with modern sophistication

---

## Visual Language

### Logo Assets
All logos are located in `/public/branding/`:
- **`logo-square.png`** — Icon version (for favicon, app icon, compact sidebar)
- **`logo-horizontal.png`** — Lockup version (for login page, headers, wide displays)

**Color:** Mustard gold on black  
**Font:** Chunky slab serifs (Chango, Alfa Slab One)  
**Mascot:** Xolo/jaguar dog with folk-art dot detailing

---

## Color Palette

### Primary Colors
| Name | Hex | Usage |
|------|-----|-------|
| **Black** | `#000000` | Background, text, structure |
| **Agave Gold** | `#C29A2D` | Logo, highlights, accents, primary CTA |
| **Agave Dark** | `#A67C28` | Hover states, deeper accents |
| **Agave Light** | `#D4AF37` | Highlights, badges |

### Neutrals
| Name | Hex | Usage |
|------|-----|-------|
| **Off-Black** | `#1A1A1A` | Card backgrounds, panels |
| **Ink** | `#2D2D2D` | Text, borders |
| **Pale** | `#E8E8E8` | Light text on dark, dividers |
| **White** | `#FFFFFF` | High contrast text |

---

## Typography

### Display / Headlines
**Font:** Chango (Google Fonts)  
**Weights:** Regular (400)  
**Usage:** Logo, main headings, section titles  
**Character:** Bold, festive, folk-art energy

### Secondary Headlines
**Font:** Alfa Slab One (Google Fonts)  
**Weight:** Regular (400)  
**Usage:** Sub-headings, recipe titles, accent text  
**Character:** Strong slab serif, complements Chango

### Body Text
**Font:** Inter (system fallback: -apple-system, BlinkMacSystemFont)  
**Weights:** Regular (400), Medium (500), Semibold (600)  
**Usage:** Body copy, descriptions, labels, all UI text  
**Character:** Clean, modern, readable at small sizes

---

## Component Usage

### Sidebar Logo
- Use `logo-square.png` (96x96px recommended)
- Place in top-left of sidebar
- Maintain clear space (8px minimum)

### Login Page
- Use `logo-horizontal.png` (300px width recommended)
- Center on login card
- Pair with "El Perro Negro Cockpit" tagline below

### Spec Cards (Printable)
- Use `logo-horizontal.png` in header (2" width for 8.5x11" spec card)
- Ensure mustard gold prints cleanly on white

### Dashboard & Headers
- Use `logo-square.png` as app icon in browser tab
- Use `logo-horizontal.png` in page headers when space allows
- Scale responsively on mobile (full logo mobile, icon on small screens)

### Favicons & Metadata
- Use `logo-square.png` converted to `.ico` format (16x16, 32x32)
- Solid mustard gold + black is distinctive and readable at tiny sizes

---

## Color System (Tailwind Config)

The app uses a custom color scale built around agave gold:

```
agave-50: #F7F3EB
agave-100: #EFEBE0
agave-200: #DFD5C5
agave-300: #C29A2D  ← PRIMARY (matches logo)
agave-400: #B88A25
agave-500: #A67C28  ← HOVER STATE
agave-600: #8B6620
agave-700: #704F18
agave-800: #553810
agave-900: #3B2608
```

---

## Asset Locations

```
public/
├── branding/
│   ├── logo-square.png          # Icon version
│   └── logo-horizontal.png      # Lockup version
├── logo.png                     # Alias for logo-square
└── logo-horizontal.png          # Alias for lockup
```

---

## Dos & Don'ts

✅ **Do:**
- Use the logos at intended sizes (don't distort)
- Maintain clear space around logos (8px minimum)
- Pair with Chango/Alfa Slab One typography
- Use agave gold as the primary accent color
- Maintain black backgrounds for maximum contrast

❌ **Don't:**
- Rotate or skew the logo
- Use the logos on patterned backgrounds
- Reduce logo below 64px width (icon) or 200px width (lockup)
- Change the gold color (use `#C29A2D` exactly)
- Mix Chango with script fonts or thin serifs

---

## Future Updates

When you need to refresh the branding:
1. Export new logo files from Illustrator as PNG (300dpi recommended)
2. Drop them into `/public/branding/`
3. Update the color hex values in this file
4. Update `tailwind.config.ts` if the palette changes
5. No code changes needed — the app reads from `public/` paths

---

**Last Updated:** April 30, 2026  
**Maintained By:** El Perro Negro Ops Team
