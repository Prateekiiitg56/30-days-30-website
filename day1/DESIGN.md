# ORVAN — Design Specification

**Palette:** Oxblood & Blush (porcelain, deep oxblood, soft blush). Bold and romantic.
**Style:** Minimal, editorial, high-fashion. Big type, lots of space, one strong colour.
**Companion doc:** `PRD.md`

---

## 1. Design principles

1. **Editorial first.** Treat pages like magazine spreads: oversized type, large photos, calm space.
2. **One strong colour.** Oxblood is the brand colour. Blush is the soft highlight. Everything else stays neutral.
3. **The product is the hero.** Photos sit on quiet backgrounds so the clothes stand out.
4. **Try-on feels safe and simple.** Two steps, clear copy, privacy said up front.
5. **Accessible by default.** Every text colour pair passes WCAG AA.

---

## 2. Colour

### 2.1 Core palette

| Token | Name | Hex | Use |
| --- | --- | --- | --- |
| `--color-bg` | Porcelain | `#F2ECE6` | Main page background |
| `--color-bg-alt` | Linen | `#E8DDD5` | Alternate sections (New Vibes banner, trust row) |
| `--color-surface` | Chalk | `#FAF6F2` | Product grid section, cards, drawers, modals |
| `--color-photo` | Mauve Stone | `#DCCFC7` | Photo backgrounds and image placeholders |
| `--color-ink` | Ink Plum | `#1F1416` | Main text, primary buttons, icons |
| `--color-ink-soft` | Dusk | `#6E5A5C` | Secondary text, captions, prices |
| `--color-brand` | Oxblood | `#5C1A1F` | Top bar, category band, Try-On card, focus rings |
| `--color-brand-deep` | Garnet Night | `#3E1014` | Hover/pressed on oxblood |
| `--color-accent` | Blush | `#F0C4AF` | Links and highlights **on oxblood**, selected chips, badges |
| `--color-accent-soft` | Petal | `#F7E1D6` | Blush tint for backgrounds (try-on tags, info notes) |
| `--color-on-brand` | Porcelain Light | `#F6E9E2` | Text on oxblood |
| `--color-line` | Rosewood Line | `#D9C9C0` | Borders, dividers, inputs |

### 2.2 Status colours

| Token | Hex | Use |
| --- | --- | --- |
| `--color-success` | `#2F6B4F` | "Added to cart", "Look saved" |
| `--color-warning` | `#8A5A00` | "Needs a full-body photo" |
| `--color-error` | `#B3261E` | Form errors, upload failed |

The error red is brighter and more orange than Oxblood so the two don't get confused. Always pair status colour with an icon and words, never colour alone.

### 2.3 Approved text pairs (approximate contrast)

| Text | Background | Ratio | Use for |
| --- | --- | --- | --- |
| Ink `#1F1416` | Porcelain `#F2ECE6` | ~16:1 | All body text |
| Dusk `#6E5A5C` | Porcelain `#F2ECE6` | ~5.9:1 | Secondary text |
| Porcelain `#F2ECE6` | Ink `#1F1416` | ~16:1 | Primary button label |
| Porcelain Light `#F6E9E2` | Oxblood `#5C1A1F` | ~11:1 | Text on oxblood bands |
| Blush `#F0C4AF` | Oxblood `#5C1A1F` | ~7.5:1 | Links on oxblood |
| Oxblood `#5C1A1F` | Porcelain `#F2ECE6` | ~11:1 | Brand text/links on light |
| Ink `#1F1416` | Blush `#F0C4AF` | ~11:1 | Blush buttons and badges |

**Don't:** Blush text on Porcelain (too faint). Dusk text on Oxblood (too dark).

### 2.4 How much of each colour
Roughly **70%** neutrals (Porcelain, Linen, Chalk) · **20%** Ink · **8%** Oxblood · **2%** Blush.

---

## 3. Typography

**Font:** Jost (Google Fonts), a geometric sans in the Futura style.
Fallback stack: `Jost, "Futura", "Century Gothic", "Helvetica Neue", sans-serif`.
Weights: 400 (regular), 500 (medium), 600 (semibold).

| Token | Size / line height | Weight | Letter spacing | Use |
| --- | --- | --- | --- | --- |
| `display-xl` | 330 / 1.0 (desktop) · 120 / 1.0 (mobile) | 500 | 0.05em | Hero "ORVAN" wordmark |
| `display-l` | 104 / 0.95 · 56 mobile | 600 | 0.04em | "NEW VIBES" banner |
| `h1` | 48 / 1.1 | 500 | 0.04em | Page titles ("Your Cart") |
| `h2` | 36 / 1.2 | 500 | 0.05em | Section titles ("BEST OF ORVAN") |
| `h3` | 26 / 1.3 | 500 | 0.1em | Category names |
| `logo` | 44 / 1 | 600 | 0.14em | Header logo |
| `eyebrow` | 15–16 / 1.9 | 500 | 0.35em, UPPERCASE | "FASHION THAT MOVES WITH YOU." |
| `body-l` | 20 / 1.5 | 400 | 0 | Banner copy |
| `body` | 16 / 1.5 | 400 | 0 | Default text |
| `label` | 13–14 / 1 | 600 | 0.14em, UPPERCASE | Buttons, nav, links |
| `caption` | 12–13 / 1.4 | 400 | 0.02em | Helper text, tips |

Headings, nav, buttons and eyebrows are **UPPERCASE** with wide spacing. Body copy stays in sentence case.

---

## 4. Spacing, layout and shape

- **Spacing scale (px):** 4, 8, 12, 16, 24, 32, 40, 56, 72, 96, 120
- **Grid:** 12 columns, max width 1440, side margins 110 (desktop) / 40 (tablet) / 20 (mobile), gutter 24–28
- **Breakpoints:** mobile < 768 · tablet 768–1279 · desktop ≥ 1280
- **Corners:** 0 px on buttons, cards and images (sharp, editorial). Only round items are icon buttons (wishlist heart) and swatches.
- **Borders:** 1 px `--color-line`
- **Shadows:** none on the page. Only drawers and modals get `0 12px 40px rgba(31, 20, 22, 0.18)`.
- **Underline links:** 2 px underline in Oxblood, 4 px below the text.

---

## 5. Components

### Buttons
| Variant | Background | Text | Border | Height | Use |
| --- | --- | --- | --- | --- | --- |
| Primary | Ink | Porcelain | — | 54 | Shop now, Checkout, Add to cart |
| Brand | Oxblood | Porcelain Light | — | 54 | **Try on in Virtual Closet** |
| Blush | Blush | Ink | — | 54 | Primary action on oxblood backgrounds |
| Secondary | transparent | Ink | 1 px Ink | 54 | Back to cart, Save look |
| Text link | — | Ink or Oxblood | 2 px underline | — | Explore new in, View all |

All buttons use `label` text, 0 radius, and 32–44 px side padding. Hover: primary → Oxblood. Brand → Garnet Night. Focus: 2 px Oxblood ring with a 2 px offset (Blush ring on dark backgrounds). Disabled: 40% opacity plus a note explaining why.

### Inputs
Height 48, 1 px Rosewood Line border, Chalk fill, Ink text, Dusk placeholder. Focus: 2 px Oxblood border. Error: 2 px Error border plus a message below.

### Size pills
56 × 44, 1 px Line border. Selected: Ink fill with Porcelain text. Sold out: struck-through, Dusk text.

### Colour swatches
44 px circles. Selected: 2 px Oxblood ring with a 3 px gap. Each swatch has an accessible name.

### Product card
Image on Mauve Stone at a 3:4 ratio, wishlist heart button (44 px Chalk circle) in the top right, name (`body`, 500), price (`body`, Dusk). Optional "TRY-ON READY" tag: Petal background, Ink `caption` in uppercase.

### Cart line item
Image 120 × 160 · name · colour · size · quantity stepper (− / number / +) · price · remove (icon + label). Items that can be tried on show a small "Try on" text link.

### Virtual Try-On card (Cart page)
Oxblood background, Porcelain Light text.
- Eyebrow: "VIRTUAL CLOSET" in Blush
- Title: "See it on you" (`h3`)
- Line: "Upload a photo and try everything in your cart before you buy."
- Button: Blush variant, "TRY ON IN VIRTUAL CLOSET"
- Small print: "Your photo stays private." with a lock icon

### Mode toggle (Full / Half body)
A segmented control on Linen with a 4 px inset. Selected segment: Ink fill with Porcelain text. Each segment has a small figure icon (full or half).

### Upload zone
240 px tall, 1.5 px dashed Dusk border, Chalk fill, upload icon in Oxblood. Text: "Upload or take a photo" plus "JPG, PNG or HEIC · up to 10 MB". Drag-over state: Petal fill with a solid Oxblood border.

### Loading state
Shimmer from Mauve Stone to Chalk over the preview stage, with the message "Styling your look…" and a slim Oxblood progress bar.

### Notices
Petal background, Ink text, a 16 px icon, a short message and an optional link. Used for "Needs a full-body photo", "Quick preview — full render unavailable" and similar.

### Toasts
Ink background, Porcelain text, placed bottom-centre, 4 s. Example: "Size changed to M — cart updated."

### Icons
Line icons, 1.6 px stroke, 18–24 px, in currentColor. Needed: search, user, heart, bag, truck, box, badge-check, lock, upload, camera, figure-full, figure-half, eye (show/hide), swap, trash, arrow-right.

---

## 6. Screens

### 6.1 Home
1. **Announcement bar** (38 px, Oxblood): "FREE DELIVERY ON ORDERS ABOVE [AMOUNT]" on the left, DOWNLOAD APP · TRACK ORDER · HELP on the right.
2. **Header** (88 px, Porcelain): MEN · WOMEN · KIDS · BEAUTY on the left, **ORVAN** logo centred, SEARCH · LOGIN · WISHLIST · CART (n) on the right.
3. **Hero** (820 px): eyebrow "FASHION THAT MOVES WITH YOU." at the top left with a 44 px Oxblood rule. A giant "ORVAN" across the middle. The model cutout photo stands in front of the letters, overlapping them. "SHOP NOW" (primary) and "EXPLORE NEW IN" (text link) at the bottom left. "NEW COLLECTION [YEAR]" at the bottom right.
4. **Category band** (300 px, Oxblood): three columns for Men, Women and Kids, each with a 150 × 190 photo, the name (`h3`), one line of copy, and "SHOP … →" in Blush.
5. **New Vibes banner** (560 px, Linen): the left half has the eyebrow "NEW SEASON", "NEW VIBES" (`display-l`), "Discover everything new and now." and "EXPLORE COLLECTION". The right half is an editorial portrait.
6. **Closet promo strip** (P1, Petal): "Add to cart, then try it on." with the link "How the Virtual Closet works".
7. **Trust row** (200 px): Fast delivery · Easy returns · Quality assured · Secure payment, each with an icon, a label and a caption.
8. **Best of ORVAN** (Chalk): title plus "VIEW ALL", and a 4-column product grid.
9. **Footer** (Ink background, Porcelain text).

### 6.2 Listing page
Breadcrumb, page title, filter bar (a sticky row on desktop, a "Filter" sheet on mobile), and the product grid. Try-on-ready products show the tag.

### 6.3 Product page
Gallery on the left (main image plus thumbnails). Details on the right: name, price, colour swatches, size pills, "SIZE GUIDE" link, **ADD TO CART** (primary, full width), wishlist button, and an accordion (Details, Fabric & care, Delivery & returns). Under the button, a Petal note: "Add to cart to try it on in the Virtual Closet."

**Mini-cart drawer** (after adding): slides in from the right, 420 px wide. Shows "Added to cart" with a success icon, the item, "VIEW CART" (primary) and "CONTINUE SHOPPING" (text link), plus the hint "Try it on from your cart."

### 6.4 Cart page (desktop: 2 columns)
- **Left (8 cols):** "YOUR CART (n)", then the line items and a "Continue shopping" link.
- **Right (4 cols, sticky):**
  1. **Virtual Try-On card** (Oxblood), placed first so it is seen before the summary
  2. Order summary: subtotal, delivery, total
  3. **CHECKOUT** (primary, full width)
  4. Payment icons and "Secure checkout"
- **Mobile:** line items, then the Try-On card, then the summary, with a sticky bottom bar showing the total and CHECKOUT.
- **Empty cart:** centred message "Your cart is empty", "CONTINUE SHOPPING", and the caption "Add clothes to unlock virtual try-on."

### 6.5 Virtual Closet — Step 1: Photo
- Header: "← BACK TO CART", the title "VIRTUAL CLOSET", and a step indicator "1 Photo · 2 Try on".
- Centre column (max 560 px): eyebrow "STEP 1", title "Add your photo", mode toggle (Full body / Half body) with a caption saying what each mode can try, upload zone, photo tips as a list with small icons, consent checkbox, and **CONTINUE** (primary, disabled until a photo is added and consent is ticked).
- Side panel (desktop): "Good photo" and "Avoid" example illustrations.
- Privacy line at the bottom: lock icon plus "Used only for your preview. Deleted after your session unless you save a look."

### 6.6 Virtual Closet — Step 2: Try-on studio
**Desktop (3 columns):**
- **Left, 300 px:** photo thumbnail, mode label, "CHANGE PHOTO", and the Save look and Before/After buttons.
- **Centre, flexible:** the preview stage on Mauve Stone, with the shopper's photo showing the selected items. Chips at the top left show the mode and the item count. Zoom sits at the bottom right. Loading and fallback states appear here.
- **Right, 420 px:** "IN YOUR CART (n)", then one rail card per cart item: thumbnail, name, a show/hide checkbox, colour swatches, a size select and remove. Cards for items that can't be shown (half body + bottom) are dimmed and carry the notice. Below the list: total, **CHECKOUT** (primary) and **BACK TO CART** (secondary).

**Mobile:** the preview stage fills the top of the screen. A bottom sheet holds the cart items as horizontal cards; dragging it up shows full controls. A sticky bar at the bottom has Save and **CHECKOUT**.

**States to design**
| State | What shows |
| --- | --- |
| Generating | Shimmer, "Styling your look…", progress bar |
| Ready | Preview with the items |
| Item toggled off | Card checkbox cleared; preview re-renders from cached layers |
| Half body + bottom | Card dimmed with the notice "Needs a full-body photo" and a "Switch photo" link |
| Model failed | Overlay preview plus the notice "Quick preview — full render unavailable" |
| Size or colour changed | Preview updates and the toast "Cart updated" appears |
| Item removed | The card collapses and the toast "Removed from cart · Undo" appears |
| Cart emptied | Message "Your cart is empty" and "Continue shopping" |

### 6.7 Checkout (mock) and Confirmation
Single-column form: contact, address, delivery, payment (mock). The order summary on the right includes the saved look thumbnail if there is one. Confirmation: "Thank you" in `display-l`, order number [ORDER #], and "Continue shopping".

---

## 7. Motion

- Standard easing `cubic-bezier(0.2, 0, 0, 1)`: 200 ms for hovers, 320 ms for drawers and sheets.
- The hero wordmark fades up 12 px on load, and the model cutout follows 120 ms later.
- The preview crossfades (240 ms) between renders; there's no hard swap.
- Respect `prefers-reduced-motion`: turn off the shimmer and slide animations.

---

## 8. Imagery

- Model photos: studio shots on warm grey or porcelain backgrounds, with soft shadows. Colour or black-and-white both work against Oxblood.
- The hero needs a **cutout** (background removed) PNG of a full-body model.
- Try-on garment images: flat or ghost-mannequin shots on a transparent background, one per colour.
- Photo backgrounds in cards: Mauve Stone `#DCCFC7`.

---

## 9. Voice and copy

Short, warm and confident. No body-shape words.

| Place | Copy |
| --- | --- |
| Try-On card title | See it on you |
| Try-On button | Try on in Virtual Closet |
| Step 1 title | Add your photo |
| Loading | Styling your look… |
| Half-body notice | Needs a full-body photo |
| Fallback | Quick preview — full render unavailable |
| Save | Look saved to your cart |
| Privacy | Your photo stays private and is deleted after your session. |

---

## 10. CSS tokens

```css
:root {
  /* colour */
  --color-bg: #F2ECE6;
  --color-bg-alt: #E8DDD5;
  --color-surface: #FAF6F2;
  --color-photo: #DCCFC7;
  --color-ink: #1F1416;
  --color-ink-soft: #6E5A5C;
  --color-brand: #5C1A1F;
  --color-brand-deep: #3E1014;
  --color-accent: #F0C4AF;
  --color-accent-soft: #F7E1D6;
  --color-on-brand: #F6E9E2;
  --color-line: #D9C9C0;
  --color-success: #2F6B4F;
  --color-warning: #8A5A00;
  --color-error: #B3261E;

  /* type */
  --font-sans: "Jost", "Futura", "Century Gothic", "Helvetica Neue", sans-serif;

  /* spacing */
  --space-1: 4px;  --space-2: 8px;  --space-3: 12px; --space-4: 16px;
  --space-5: 24px; --space-6: 32px; --space-7: 40px; --space-8: 56px;
  --space-9: 72px; --space-10: 96px; --space-11: 120px;

  /* shape & motion */
  --radius: 0px;
  --shadow-overlay: 0 12px 40px rgba(31, 20, 22, 0.18);
  --ease: cubic-bezier(0.2, 0, 0, 1);
  --dur-fast: 200ms;
  --dur-med: 320ms;
}
```

### Tailwind config (extend)
```js
theme: {
  extend: {
    colors: {
      porcelain: '#F2ECE6', linen: '#E8DDD5', chalk: '#FAF6F2', stone: '#DCCFC7',
      ink: { DEFAULT: '#1F1416', soft: '#6E5A5C' },
      oxblood: { DEFAULT: '#5C1A1F', deep: '#3E1014' },
      blush: { DEFAULT: '#F0C4AF', soft: '#F7E1D6' },
      line: '#D9C9C0',
    },
    fontFamily: { sans: ['Jost', 'Futura', 'Century Gothic', 'sans-serif'] },
    borderRadius: { none: '0' },
  },
}
```
