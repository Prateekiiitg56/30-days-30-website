# ORVAN — Product Requirements Document

**Product:** ORVAN, an online clothing store with a Virtual Try-On Closet inside the cart
**Version:** 1.0 (Day 1 build)
**Palette:** Oxblood & Blush (see `DESIGN.md`)
**Status:** Draft

---

## 1. Summary

ORVAN is a minimal, editorial fashion store for Men, Women, Kids and Beauty. Its signature feature is the **Virtual Closet**. The Closet lives in the **Cart page**: once a shopper has added products to the cart, they tap **"Try on in Virtual Closet"**, upload a full-body or half-body photo, and see the items in their cart on themselves before checking out.

Putting the try-on in the cart is deliberate. At that point the shopper has already chosen the pieces and is deciding whether to buy, which is exactly when "will this look good on me?" matters most.

---

## 2. Problem

- Shoppers can't tell how clothes will look on their own body, so they hesitate at checkout.
- To be safe, they order several sizes or colours and then return most of them.
- Product photos show a model, not the shopper, so the doubt stays until the parcel arrives.

---

## 3. Goals and non-goals

### Goals (Day 1)
1. A complete shopping flow: Home → Category → Product → Add to cart → Cart.
2. A **Virtual Try-On** button on the Cart page that opens the Closet with the cart's items already loaded.
3. Photo upload with **Full body** and **Half body** modes.
4. A preview of one or more cart items on the shopper's photo.
5. From the Closet the shopper can change size or colour, remove items, save a look, and go to checkout.
6. The Oxblood & Blush design system applied across every screen.

### Non-goals (Day 1)
- Real payments. Checkout is a mock confirmation screen.
- User accounts, order history, loyalty.
- Size recommendation based on body measurements.
- Try-on from the product page or home page. This is planned for later (section 12).

---

## 4. Success metrics

| Metric | Definition | Target |
| --- | --- | --- |
| Try-on adoption | Carts with ≥1 item where "Try on" is tapped ÷ carts with ≥1 item | [TARGET %] |
| Preview success | Uploads that produce a preview ÷ total uploads | [TARGET %] |
| Checkout after try-on | Checkouts started from the Closet or the cart after a try-on ÷ try-on sessions | [TARGET %] |
| Checkout lift | Checkout rate with try-on vs without | [TARGET] |
| Return rate | Returns on items that were tried on vs not tried on | [TARGET] |
| Time to preview | Seconds from "Generate" to the first preview shown | < [X] s |

---

## 5. Users

**Primary: the style-conscious online shopper (18–40).** Mostly shops on mobile, cares about fit and look, and returns things that don't suit them.

**Secondary: the gift or family shopper.** Buys for Kids or for someone else, and may skip the try-on. The cart must work just as well without it.

---

## 6. User stories

| # | As a… | I want to… | So that… |
| --- | --- | --- | --- |
| US-1 | shopper | add products to my cart with a size and colour | I can collect what I'm thinking of buying |
| US-2 | shopper | see a clear "Try on in Virtual Closet" option on my cart page | I know I can check the look before paying |
| US-3 | shopper | upload a full-body photo | I can try dresses, coats and trousers |
| US-4 | shopper with only a half-body photo | use half-body mode | I can still try tops and jackets |
| US-5 | shopper | try all my cart items together as one outfit | I can see the full look |
| US-6 | shopper | switch items on and off in the preview | I can compare pieces |
| US-7 | shopper | change size or colour in the Closet | the cart updates without going back |
| US-8 | shopper | remove an item that doesn't suit me | my cart only holds what I'll buy |
| US-9 | shopper | save a look | I can come back to it or share it |
| US-10 | shopper | go straight to checkout from the Closet | I don't lose momentum |
| US-11 | shopper | know my photo is private and deleted by default | I feel safe uploading it |

---

## 7. User flow

```
Home ─► Category / Search ─► Product page
                                   │
                         select size + colour
                                   │
                              Add to cart ──► mini-cart drawer ("View cart")
                                   │
                              CART PAGE
                 ┌─────────────────┴──────────────────┐
                 │                                    │
      "Try on in Virtual Closet"              "Checkout" (skip try-on)
                 │
     Closet · Step 1: Photo
     ├─ choose Full body / Half body
     ├─ upload or take photo
     ├─ consent + photo quality check
     │      └─ fails → tips + retake
                 │
     Closet · Step 2: Try-on studio
     ├─ cart items shown on the rail (all selected by default)
     ├─ preview generates (loading state)
     ├─ toggle items on/off · change size/colour · remove
     ├─ half body + bottoms selected → notice "Needs full-body photo"
     ├─ Save look · Before/After
                 │
      "Back to cart"  or  "Checkout"  ──► Checkout (mock) ──► Confirmation
```

**Rules**
- The Try-on button is visible only when the cart has at least one item.
- If the cart only has items that can't be tried on (Beauty, accessories), the button is disabled with the note: "Try-on is available for clothing."
- Changes made in the Closet (size, colour, remove) update the cart **immediately**, so the two never disagree.
- The photo is kept for the session. Coming back to the Closet in the same session skips Step 1 (with a "Change photo" option).

---

## 8. Functional requirements

Priority: **P0** = must ship Day 1 · **P1** = soon after · **P2** = later.

### 8.1 Global
| ID | Requirement | Priority |
| --- | --- | --- |
| G-1 | Top announcement bar (free delivery threshold, Download app, Track order, Help) | P0 |
| G-2 | Header: category nav (Men, Women, Kids, Beauty), centred ORVAN logo, Search, Login, Wishlist, Cart (count) | P0 |
| G-3 | Cart count updates as soon as an item is added or removed | P0 |
| G-4 | Footer: links, newsletter sign-up, social links | P1 |
| G-5 | Responsive: desktop (≥1280), tablet (768–1279), mobile (<768) | P0 |

### 8.2 Home page
| ID | Requirement | Priority |
| --- | --- | --- |
| H-1 | Hero: giant "ORVAN" wordmark with a model cutout in front, tagline "Fashion that moves with you.", "Shop now" + "Explore new in", "New collection [YEAR]" | P0 |
| H-2 | Category band on oxblood: Men / Women / Kids cards, each with photo, one line and a "Shop" link | P0 |
| H-3 | "New season / New vibes" editorial banner with "Explore collection" | P0 |
| H-4 | Trust row: Fast delivery, Easy returns, Quality assured, Secure payment | P0 |
| H-5 | "Best of ORVAN" product grid (4 items) with wishlist heart and "View all" | P0 |
| H-6 | A small banner promoting the Virtual Closet: "Add to cart, then try it on" | P1 |

### 8.3 Category / listing page
| ID | Requirement | Priority |
| --- | --- | --- |
| L-1 | Product grid, 4 columns on desktop and 2 on mobile | P0 |
| L-2 | Filters: category, size, colour, price; sort by newest / price | P1 |
| L-3 | "Try-on ready" tag on products that support virtual try-on | P1 |

### 8.4 Product page
| ID | Requirement | Priority |
| --- | --- | --- |
| P-1 | Image gallery, name, price, colour swatches, size pills (XS–XL) | P0 |
| P-2 | "Add to cart" (disabled until a size is picked; the error names the missing choice) | P0 |
| P-3 | After adding, a mini-cart drawer opens with the item, "View cart", and the hint "Try it on from your cart" | P0 |
| P-4 | Size guide modal | P1 |
| P-5 | Wishlist toggle | P1 |

### 8.5 Cart page (where try-on starts)
| ID | Requirement | Priority |
| --- | --- | --- |
| C-1 | List of cart items: image, name, colour, size, quantity stepper, price, remove | P0 |
| C-2 | Order summary: subtotal, delivery, total, "Checkout" button | P0 |
| C-3 | **Virtual Try-On card** above the summary: title "See it on you", one line of copy, and the primary button "Try on in Virtual Closet" | P0 |
| C-4 | Each clothing item shows a small "Try on" link that opens the Closet with only that item selected | P1 |
| C-5 | Items that can't be tried on show "Try-on not available" in muted text | P0 |
| C-6 | Empty cart state: message, "Continue shopping", and a note that try-on unlocks once items are added | P0 |
| C-7 | After a try-on, the cart shows a "Your saved look" thumbnail that reopens the Closet | P1 |

### 8.6 Virtual Closet — Step 1: Photo
| ID | Requirement | Priority |
| --- | --- | --- |
| V-1 | Opens as a full-screen page (desktop) or full-screen sheet (mobile) with "Back to cart" | P0 |
| V-2 | Mode toggle: **Full body** (all clothing) / **Half body** (tops, jackets, outerwear only) | P0 |
| V-3 | Upload from device or take a photo with the camera; JPG/PNG/HEIC; max 10 MB | P0 |
| V-4 | Photo tips: face the camera, arms slightly away from the body, fitted clothes, plain background, even light | P0 |
| V-5 | Consent checkbox: "I'm 18 or older and agree my photo is used only to create this preview." Required to continue | P0 |
| V-6 | Quality check: detects no person, several people, a cut-off body for the chosen mode, or a very dark or blurry photo, and shows a specific fix | P1 |
| V-7 | Example "good photo" and "avoid" illustrations | P1 |

### 8.7 Virtual Closet — Step 2: Try-on studio
| ID | Requirement | Priority |
| --- | --- | --- |
| V-8 | Layout: preview stage (centre), cart item rail (right on desktop, bottom on mobile), photo panel (left on desktop) | P0 |
| V-9 | All try-on-able cart items are loaded and selected by default; the preview layers them as one outfit | P0 |
| V-10 | Layering order: bottoms → tops → outerwear. Only one item per slot (for example, one top) is shown at a time; picking a second top swaps it in | P0 |
| V-11 | Each rail item has a checkbox (show/hide), colour swatches, a size selector and remove | P0 |
| V-12 | Size, colour and remove changes sync to the cart right away | P0 |
| V-13 | Loading state during generation: skeleton shimmer on the stage with "Styling your look…" | P0 |
| V-14 | Half-body mode + a bottom selected: that item is greyed out with "Needs a full-body photo" and a "Switch photo" link | P0 |
| V-15 | Generation fails or times out → fall back to the flat overlay preview, with the note "Quick preview — full render unavailable" | P0 |
| V-16 | Actions: **Checkout** (primary), **Back to cart**, **Save look**, **Change photo** | P0 |
| V-17 | Before/After compare slider | P1 |
| V-18 | Zoom in on the preview | P1 |
| V-19 | Share the saved look as an image | P2 |

### 8.8 Checkout (mock)
| ID | Requirement | Priority |
| --- | --- | --- |
| K-1 | Address, delivery option and payment method form (no real payment) | P0 |
| K-2 | Order confirmation screen with an order number placeholder | P0 |

---

## 9. Try-on rules by product type

| Product type | Full body | Half body | Slot |
| --- | --- | --- | --- |
| T-shirts, shirts, sweaters | Yes | Yes | Top |
| Jackets, coats, blazers | Yes | Yes (cropped at the frame) | Outerwear |
| Dresses, jumpsuits | Yes | No | Full-length (replaces top + bottom) |
| Trousers, jeans, skirts, shorts | Yes | No | Bottom |
| Shoes | P2 | No | Shoes |
| Accessories, Beauty | No | No | — |

Each product in the catalogue carries a `tryOn` field: `{ enabled, slot, garmentImage per colour }`.

---

## 10. Non-functional requirements

**Performance**
- Home page loads its main content in under [X] s on a mid-range phone on 4G.
- Try-on preview in under ~10 s, always with a visible progress state.

**Accessibility**
- WCAG 2.1 AA: text contrast ≥ 4.5:1 (see `DESIGN.md`), and every control usable by keyboard with a visible focus ring.
- Touch targets ≥ 44 × 44 px.
- The preview has alt text listing what is shown, for example "Your photo wearing Oxblood Wool Coat, size M".

**Privacy and safety**
- Photos are processed only to make the preview. They are never public and never used to train models.
- Photos are deleted at the end of the session unless the shopper saves a look. Saved looks can be deleted any time.
- 18+ confirmation before upload.
- No body-shape labels, scores or comments in the UI.

**Reliability**
- The overlay fallback means the Closet always shows something, even if the AI model is down.

---

## 11. Technical approach

| Layer | Choice | Notes |
| --- | --- | --- |
| Front end | Next.js (App Router) + Tailwind | Design tokens from `DESIGN.md` as CSS variables |
| State | Cart in a global store (Zustand or React Context), kept in localStorage | The Closet reads and writes the same store |
| Catalogue | Static JSON for Day 1 | `id, name, category, price, colours[], sizes[], images[], tryOn{}` |
| Try-on API | Server route `/api/tryon` that calls a hosted virtual try-on model | Inputs: person photo, garment image, slot. Output: image URL |
| Multi-item outfits | Generate in layers: bottom → top → outerwear, each pass using the previous result | Cache each layer so toggling an item doesn't regenerate everything |
| Fallback | Client-side 2D overlay of garment PNGs | Used on timeout or error |
| Photo storage | Temporary storage with automatic expiry | Deleted after the session unless a look is saved |

**Key data shapes**
```json
// Cart item
{ "productId": "coat-01", "colour": "oxblood", "size": "M", "qty": 1 }

// Try-on session
{
  "photoId": "tmp_abc",
  "mode": "full",
  "selected": ["coat-01", "trouser-02"],
  "layers": { "bottom": "img_url", "top": null, "outer": "img_url" },
  "status": "ready"
}
```

---

## 12. Future (after Day 1)

- Try-on directly from the product page ("Try before adding to cart").
- Accounts with a saved "My photo" so shoppers upload once.
- Size recommendation from height and usual size.
- Shoes and accessories try-on.
- Share looks with friends for a vote.

---

## 13. Day 1 build checklist

- [ ] Project setup, Jost font, Oxblood & Blush tokens
- [ ] Header, announcement bar, footer
- [ ] Home page (hero, category band, New Vibes banner, trust row, Best of ORVAN)
- [ ] Listing page and product page with add to cart
- [ ] Cart store, mini-cart drawer, Cart page
- [ ] Virtual Try-On card on the Cart page
- [ ] Closet Step 1: mode toggle, upload, tips, consent
- [ ] Closet Step 2: stage, cart rail, toggles, size/colour sync, remove
- [ ] Try-on API route + overlay fallback + loading state
- [ ] Mock checkout and confirmation
- [ ] Mobile pass, contrast and keyboard check

---

## 14. Risks and open questions

| Risk | Mitigation |
| --- | --- |
| Poor preview quality on messy photos | Quality check, clear tips, retake option |
| Slow or failing model | Loading state, cached layers, overlay fallback |
| Layering several items looks wrong | Fixed layer order; show one item per slot |
| Privacy worries stop uploads | Clear consent copy, session-only storage, delete button |
| Body-image sensitivity | Neutral, kind copy; no body-shape labels |

**Open questions**
1. Which try-on model/provider will we use, and what does each preview cost?
2. Do we have flat (ghost-mannequin) garment photos for every product and colour?
3. Should Kids items support try-on, given the extra care needed around photos of children?
4. What are the free-delivery threshold and the returns window?
