# ORVAN — Image prompts (one prompt = one image)

Copy each prompt as-is into Gemini. Save the result at the path shown in its heading.
Every prompt is complete on its own — no need to add anything.

**General rules**
- Save as JPG, except image 1 (PNG with a transparent background).
- Set the aspect ratio shown in each heading. Minimum 1200 px on the long side (image 1: 2000 px).
- If Gemini adds text, a logo or a watermark, regenerate.
- Any image that is missing shows a plain Mauve Stone placeholder on the site, so you can add them in any order.

Total: 5 editorial + 26 product = **31 images** (the 13 `-2` detail shots are optional).

---

# PART A — Editorial images → `public/images/editorial/`

## 1. `public/images/editorial/hero-model.png` · 2:3 · transparent PNG

```
Full-length editorial fashion photograph of a tall female model standing straight and facing the camera, entire body visible from the top of the head to the shoes, with empty space above the head and below the feet. Relaxed confident pose: weight on one leg, left hand in the coat pocket, right arm hanging naturally slightly away from the body, calm neutral expression, dark hair pulled back into a low bun. She wears a long tailored double-faced wool coat in deep oxblood red (#5C1A1F) that falls below the knee, open at the front over a fine cream ribbed knit top and ecru wide-leg pleated trousers, with minimal dark brown leather loafers. The background is a completely plain, flat, evenly lit light grey studio wall with no texture, no props and no floor line, so the model can be cut out cleanly. Soft diffused key light from the front-left, subtle natural shadow, sharp focus on the whole figure, crisp clean edges around the hair and clothing. High-end fashion campaign look, shot on medium format, natural skin texture, warm muted colour grading. No text, no logo, no watermark.
```

After generating: remove the background (Gemini "remove background", remove.bg or Photoshop) and export a transparent PNG. Keep the edges clean — the model stands in front of the giant "ORVAN" letters.

## 2. `public/images/editorial/category-men.jpg` · 4:5

```
Half-body editorial fashion portrait of a male model in his late twenties, framed from the top of the head to just below the waist, body turned slightly to the left and face looking just off camera with a calm, confident expression, short neat dark hair and light stubble. He wears a charcoal grey fine merino crew-neck sweater under an unstructured stone-beige linen blazer with soft natural creases. The background is a plain seamless warm grey studio backdrop in mauve stone (#DCCFC7) with no props. Soft diffused key light from the left with a gentle shadow on the right side of the face, warm muted colour grading, shallow depth of field, sharp focus on the eyes and fabric texture. Minimal high-fashion catalogue style, shot on medium format, natural skin texture. No text, no logo, no watermark.
```

## 3. `public/images/editorial/category-women.jpg` · 4:5

```
Half-body editorial fashion portrait of a female model in her mid twenties, framed from the top of the head to the waist, facing the camera at a slight three-quarter angle with a calm, serene expression, dark hair pulled back. She wears a long tailored double-faced wool coat in deep oxblood red (#5C1A1F) with the wide collar turned up around her neck and her hands resting in the pockets. The background is a plain seamless warm grey studio backdrop in mauve stone (#DCCFC7) with no props. Soft diffused key light from the front-left, gentle falloff into shadow, warm muted colour grading, sharp focus on the face and the wool texture. Minimal, romantic, high-fashion campaign style, shot on medium format, natural skin texture. No text, no logo, no watermark.
```

## 4. `public/images/editorial/category-kids.jpg` · 4:5

```
Fashion catalogue portrait of a child about eight years old, fully clothed, framed from the head to the knees, standing in a relaxed playful pose with a small natural smile and looking at the camera. The child wears a quilted puffer jacket in deep oxblood red (#5C1A1F), zipped halfway, over a cream cotton t-shirt and rust-orange corduroy dungarees. The background is a plain seamless warm grey studio backdrop in mauve stone (#DCCFC7) with no props. Soft, even, diffused studio light, gentle shadow, warm muted colour grading, sharp focus. Clean, wholesome, minimal kidswear catalogue style, shot on medium format. No text, no logo, no watermark.
```

## 5. `public/images/editorial/new-vibes.jpg` · 4:5

```
Editorial three-quarter-length fashion portrait of a female model framed from the head to mid-thigh, standing slightly turned to the right and looking directly into the lens with a soft, confident expression, loose natural wavy hair. She wears a bias-cut satin slip dress in soft blush pink (#F0C4AF) with thin straps, and a crisp cream oversized cotton shirt draped loosely over her shoulders. The background is a plain seamless porcelain off-white studio backdrop (#F2ECE6). Strong soft window light from the left creating a gentle gradient of shadow across the right side of the frame and a subtle sheen on the satin. Warm muted colour grading, romantic and modern high-fashion magazine look, shot on medium format, natural skin texture. No text, no logo, no watermark.
```

---

# PART B — Product images → `public/images/products/`

All product images are **3:4**. The `-1` image is the main shot; `-2` is an optional detail shot for the product-page gallery.

## 6. `public/images/products/w-coat-1.jpg` · 3:4

```
Full-body fashion catalogue photograph of a female model wearing a long tailored double-faced wool coat in deep oxblood red (#5C1A1F), knee-length, single-breasted and buttoned, with notch lapels and a straight clean silhouette, worn over black straight trousers and black leather ankle boots. The model stands straight facing the camera in a neutral relaxed pose with arms slightly away from the body so the coat shape is clearly visible, calm expression, hair pulled back. The entire figure from head to feet is in frame, centred. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused front light, gentle floor shadow, warm muted colour grading, sharp focus on the wool texture. Minimal high-end e-commerce style, shot on medium format. No text, no logo, no watermark.
```

## 7. `public/images/products/w-coat-2.jpg` · 3:4

```
Close-up detail photograph of a deep oxblood red (#5C1A1F) double-faced wool coat, showing the notch lapel, a large tonal horn button and the fine brushed wool texture with neat hand-finished edge stitching. The coat is shown on a model's torso, cropped from the shoulder to the waist, no face visible. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft raking side light that reveals the fabric texture, warm muted colour grading, very sharp focus, shallow depth of field. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 8. `public/images/products/w-dress-1.jpg` · 3:4

```
Full-body fashion catalogue photograph of a female model wearing a bias-cut satin slip dress in soft blush pink (#F0C4AF), midi length falling to mid-calf, with thin adjustable straps, a cowl neckline and a fluid draping skirt, paired with simple nude strappy sandals. The model stands straight facing the camera in a relaxed neutral pose with arms slightly away from the body, calm expression, hair loose. The entire figure from head to feet is in frame, centred. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused front light that shows a gentle sheen on the satin, soft floor shadow, warm muted colour grading. Minimal high-end e-commerce style, shot on medium format. No text, no logo, no watermark.
```

## 9. `public/images/products/w-dress-2.jpg` · 3:4

```
Close-up detail photograph of a soft blush pink (#F0C4AF) satin slip dress, showing the draped cowl neckline, the thin strap and the liquid sheen of the bias-cut satin, cropped from the collarbone to the waist on a model, no face visible. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft side light highlighting the fabric sheen and folds, warm muted colour grading, very sharp focus, shallow depth of field. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 10. `public/images/products/w-trouser-1.jpg` · 3:4

```
Full-body fashion catalogue photograph of a female model wearing high-waisted wide-leg pleated wool trousers in ecru off-white, with front pleats, a pressed centre crease and a floor-grazing hem, styled with a simple fitted cream knit top tucked in and minimal black leather loafers. The model stands straight facing the camera in a relaxed neutral pose, hands relaxed at her sides slightly away from the body, calm expression. The entire figure from head to feet is in frame, centred, and the trousers are the clear focus. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused front light, gentle floor shadow, warm muted colour grading, sharp focus. Minimal high-end e-commerce style, shot on medium format. No text, no logo, no watermark.
```

## 11. `public/images/products/w-trouser-2.jpg` · 3:4

```
Close-up detail photograph of ecru off-white wide-leg wool trousers, showing the high waistband, the front pleats, a side pocket and the fine woven wool texture, cropped from the waist to the upper thigh on a model standing still. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft raking side light revealing texture, warm muted colour grading, very sharp focus. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 12. `public/images/products/w-shirt-1.jpg` · 3:4

```
Waist-up fashion catalogue photograph of a female model wearing a crisp white oversized cotton poplin shirt with a relaxed boxy fit, dropped shoulders, a classic point collar open at the neck and sleeves rolled once at the wrist, tucked loosely into ecru trousers. The model faces the camera in a relaxed neutral pose, calm expression, hair pulled back, framed from the top of the head to the hips, centred. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused front light, warm muted colour grading, sharp focus on the crisp poplin fabric. Minimal high-end e-commerce style, shot on medium format. No text, no logo, no watermark.
```

## 13. `public/images/products/w-shirt-2.jpg` · 3:4

```
Close-up detail photograph of a crisp white cotton poplin shirt, showing the point collar, the button placket with small white mother-of-pearl buttons and the fine smooth weave of the fabric, cropped from the neck to the chest on a model, no face visible. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft side light, warm muted colour grading, very sharp focus. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 14. `public/images/products/w-bag-1.jpg` · 3:4

```
Product photograph of a small structured leather shoulder bag in deep oxblood red (#5C1A1F), rectangular shape with a front flap, a slim adjustable leather shoulder strap and minimal dark metal hardware, no branding. The bag stands upright, centred in the frame with its strap arranged in a neat curve above it, no model. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused light from above-left with a gentle contact shadow under the bag, warm muted colour grading, sharp focus on the smooth leather grain. Minimal luxury e-commerce still life, shot on medium format. No text, no logo, no watermark.
```

## 15. `public/images/products/w-bag-2.jpg` · 3:4

```
Close-up detail photograph of a small deep oxblood red (#5C1A1F) leather shoulder bag, showing the front flap edge, the neat tonal edge stitching, the smooth leather grain and a minimal dark metal strap ring, no branding, no model. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft raking light revealing the leather texture, warm muted colour grading, very sharp focus, shallow depth of field. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 16. `public/images/products/m-blazer-1.jpg` · 3:4

```
Waist-up fashion catalogue photograph of a male model wearing an unstructured single-breasted linen blazer in stone beige, with soft natural shoulders, notch lapels, two buttons left open and gentle natural linen creases, worn over a plain white crew-neck t-shirt. The model faces the camera in a relaxed neutral pose with arms slightly away from the body, calm expression, short neat dark hair, framed from the top of the head to the hips, centred. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused front light, warm muted colour grading, sharp focus on the linen texture. Minimal high-end e-commerce style, shot on medium format. No text, no logo, no watermark.
```

## 17. `public/images/products/m-blazer-2.jpg` · 3:4

```
Close-up detail photograph of a stone beige linen blazer, showing the notch lapel, a patch pocket, a tonal button and the visible slubby weave of the linen fabric, cropped on a male model's chest, no face visible. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft raking side light revealing texture, warm muted colour grading, very sharp focus. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 18. `public/images/products/m-knit-1.jpg` · 3:4

```
Waist-up fashion catalogue photograph of a male model wearing a fine-gauge merino wool crew-neck sweater in deep oxblood red (#5C1A1F), with a regular fit, ribbed crew neck, ribbed cuffs and ribbed hem, worn over dark charcoal trousers. The model faces the camera in a relaxed neutral pose with arms slightly away from the body, calm expression, short neat dark hair and light stubble, framed from the top of the head to the hips, centred. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused front light, warm muted colour grading, sharp focus on the knit texture. Minimal high-end e-commerce style, shot on medium format. No text, no logo, no watermark.
```

## 19. `public/images/products/m-knit-2.jpg` · 3:4

```
Close-up detail photograph of a deep oxblood red (#5C1A1F) fine-gauge merino wool sweater, showing the ribbed crew neck and the smooth even knit stitches, cropped from the neck to the chest on a male model, no face visible. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft raking side light revealing the knit texture, warm muted colour grading, very sharp focus, shallow depth of field. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 20. `public/images/products/m-trouser-1.jpg` · 3:4

```
Full-body fashion catalogue photograph of a male model wearing charcoal grey tapered wool trousers with a mid-rise, a single front pleat, a pressed centre crease and a slightly cropped hem at the ankle, styled with a plain white crew-neck t-shirt tucked in and minimal black leather loafers. The model stands straight facing the camera in a relaxed neutral pose, arms relaxed slightly away from the body, calm expression. The entire figure from head to feet is in frame, centred, with the trousers as the clear focus. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused front light, gentle floor shadow, warm muted colour grading, sharp focus. Minimal high-end e-commerce style, shot on medium format. No text, no logo, no watermark.
```

## 21. `public/images/products/m-trouser-2.jpg` · 3:4

```
Close-up detail photograph of charcoal grey wool trousers, showing the waistband, the single front pleat, a slanted side pocket and the fine woven wool texture, cropped from the waist to the upper thigh on a male model standing still. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft raking side light revealing texture, warm muted colour grading, very sharp focus. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 22. `public/images/products/m-tee-1.jpg` · 3:4

```
Waist-up fashion catalogue photograph of a male model wearing a heavyweight plain white cotton t-shirt with a relaxed fit, slightly dropped shoulders, a thick ribbed crew neck and sleeves ending at mid-bicep, tucked into charcoal trousers. The model faces the camera in a relaxed neutral pose with arms slightly away from the body, calm expression, short neat dark hair, framed from the top of the head to the hips, centred. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused front light, warm muted colour grading, sharp focus on the dense cotton jersey. Minimal high-end e-commerce style, shot on medium format. No text, no logo, no watermark.
```

## 23. `public/images/products/m-tee-2.jpg` · 3:4

```
Close-up detail photograph of a heavyweight plain white cotton t-shirt, showing the thick ribbed crew neck and the dense textured cotton jersey, cropped from the neck to the chest on a male model, no face visible, no print or graphic on the shirt. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft raking side light revealing the fabric texture, warm muted colour grading, very sharp focus. Luxury e-commerce detail shot. No text, no logo, no watermark.
```

## 24. `public/images/products/k-jacket-1.jpg` · 3:4

```
Full-body kidswear catalogue photograph of a child about eight years old, fully clothed, wearing a quilted puffer jacket in deep oxblood red (#5C1A1F) with horizontal stitched channels, a stand-up collar, a front zip done up to the chest and two side pockets, over a cream t-shirt, blue jeans and white sneakers. The child stands facing the camera in a relaxed natural pose with a small smile, arms slightly away from the body. The entire figure from head to feet is in frame, centred. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft even diffused light, gentle floor shadow, warm muted colour grading, sharp focus. Clean wholesome minimal kidswear e-commerce style. No text, no logo, no watermark.
```

## 25. `public/images/products/k-jacket-2.jpg` · 3:4

```
Product-only close-up detail photograph of a deep oxblood red (#5C1A1F) quilted kids puffer jacket laid flat, showing the stitched horizontal quilting channels, the stand-up collar and the zip pull, no person. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft side light revealing the padded texture, warm muted colour grading, very sharp focus. Clean e-commerce detail shot. No text, no logo, no watermark.
```

## 26. `public/images/products/k-dungaree-1.jpg` · 3:4

```
Full-body kidswear catalogue photograph of a child about eight years old, fully clothed, wearing rust-orange corduroy dungarees with a bib front pocket, adjustable shoulder straps with metal buckles and straight legs rolled once at the ankle, over a cream long-sleeve cotton t-shirt, with white sneakers. The child stands facing the camera in a relaxed natural pose with a small smile, hands relaxed at the sides. The entire figure from head to feet is in frame, centred. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft even diffused light, gentle floor shadow, warm muted colour grading, sharp focus. Clean wholesome minimal kidswear e-commerce style. No text, no logo, no watermark.
```

## 27. `public/images/products/k-dungaree-2.jpg` · 3:4

```
Product-only close-up detail photograph of rust-orange corduroy kids dungarees laid flat, showing the bib pocket, a metal strap buckle and the soft wide-wale corduroy ribs, no person. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft raking side light revealing the corduroy texture, warm muted colour grading, very sharp focus. Clean e-commerce detail shot. No text, no logo, no watermark.
```

## 28. `public/images/products/b-lipstick-1.jpg` · 3:4

```
Luxury beauty product photograph of a single satin lipstick in deep oxblood red (#5C1A1F), uncapped and standing upright with the bullet angled and fully visible, in a minimal matte black cylindrical tube, with the matching matte black cap lying on its side next to it, no branding, no model. Centred composition with generous empty space around the product. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused light from above-left with a gentle contact shadow, a subtle soft highlight on the lipstick bullet, warm muted colour grading, very sharp focus. Minimal high-end beauty still life, shot on medium format. No text, no logo, no watermark.
```

## 29. `public/images/products/b-lipstick-2.jpg` · 3:4

```
Macro close-up beauty photograph of a deep oxblood red (#5C1A1F) satin lipstick bullet emerging from a matte black tube, beside a single clean swatch of the same colour smeared on a smooth porcelain-coloured surface, no branding, no model. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft side light highlighting the creamy satin finish, warm muted colour grading, very sharp focus, shallow depth of field. Luxury beauty detail shot. No text, no logo, no watermark.
```

## 30. `public/images/products/b-perfume-1.jpg` · 3:4

```
Luxury beauty product photograph of a single minimal rectangular glass perfume bottle with thick clear glass walls, filled with a pale blush pink (#F0C4AF) liquid and topped with a smooth matte black cylindrical cap, no label, no branding, no model. The bottle stands upright, centred, with generous empty space around it. Plain seamless warm grey studio backdrop in mauve stone (#DCCFC7), soft diffused light from the left creating gentle refractions and a soft pink glow in the shadow, warm muted colour grading, very sharp focus. Minimal high-end fragrance still life, shot on medium format. No text, no logo, no watermark.
```

## 31. `public/images/products/b-perfume-2.jpg` · 3:4

```
Close-up detail photograph of a minimal glass perfume bottle with pale blush pink (#F0C4AF) liquid, showing the thick clear glass shoulder, the matte black cap and light refracting through the liquid, no label, no branding, no model. Plain warm grey studio backdrop in mauve stone (#DCCFC7), soft side light producing clean refractions, warm muted colour grading, very sharp focus, shallow depth of field. Luxury fragrance detail shot. No text, no logo, no watermark.
```

---

## Not needed from you

Try-on garment overlays, icons and the "Good photo / Avoid" guide illustrations are drawn in code (SVG), so they match every colour swatch.

## Final checklist

```
public/images/editorial/hero-model.png
public/images/editorial/category-men.jpg
public/images/editorial/category-women.jpg
public/images/editorial/category-kids.jpg
public/images/editorial/new-vibes.jpg
public/images/products/w-coat-1.jpg       w-coat-2.jpg
public/images/products/w-dress-1.jpg      w-dress-2.jpg
public/images/products/w-trouser-1.jpg    w-trouser-2.jpg
public/images/products/w-shirt-1.jpg      w-shirt-2.jpg
public/images/products/w-bag-1.jpg        w-bag-2.jpg
public/images/products/m-blazer-1.jpg     m-blazer-2.jpg
public/images/products/m-knit-1.jpg       m-knit-2.jpg
public/images/products/m-trouser-1.jpg    m-trouser-2.jpg
public/images/products/m-tee-1.jpg        m-tee-2.jpg
public/images/products/k-jacket-1.jpg     k-jacket-2.jpg
public/images/products/k-dungaree-1.jpg   k-dungaree-2.jpg
public/images/products/b-lipstick-1.jpg   b-lipstick-2.jpg
public/images/products/b-perfume-1.jpg    b-perfume-2.jpg
```
