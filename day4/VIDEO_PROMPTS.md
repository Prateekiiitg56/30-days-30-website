# Bong Fish hero video: floating Bengali seafood (Google Flow / Veo)

## Concept

A food-commercial style loop on the right side of the yellow hero: the Bong Fish menu floating in the air against the same taxi yellow as the site. Shorshe ilish, a golda chingri, a crab, fish fry and a bowl of rice drift and turn slowly, with mustard seeds, green chillies and curry droplets suspended around them. It shows fish, prawns and crab together, all as cooked food.

The video's edges fade softly into the page, so the background must be flat #F6C90E yellow.

## Specs

- Model: Veo 3 (Quality) in Google Flow. Audio off.
- Length: 8 seconds, seamless loop.
- Aspect: 16:9, 1080p. Food kept in the centre 60% of the frame.
- Flat seamless taxi-yellow backdrop (#F6C90E), no gradient, no props touching the edges.
- No text, logos, watermarks, people or hands.

## Workflow

1. Generate the still with Prompt 1.
2. Use it as the start frame AND end frame in Flow (image-to-video) with Prompt 2, for a clean loop.
3. Generate 4 takes, keep the one where the food stays solid (no melting or merging).

## Prompt 1: still frame (image)

> Premium food-commercial photograph of a levitating Bengali seafood feast against a flat seamless taxi-yellow backdrop (#F6C90E). Floating in mid-air in the centre: a piece of shorshe ilish (hilsa in bright yellow mustard gravy) on a small brass plate, one large golda chingri malai prawn glazed in creamy orange coconut gravy, a whole red cooked crab, two golden crumb-fried bhetki fish fry pieces, and a small brass bowl of steaming white rice. Around them, frozen in the air: black and yellow mustard seeds, slit green chillies, curry leaves, a few drops of golden mustard oil and splashes of curry. Soft studio lighting from top-left, crisp shadows, glossy textures, ultra-realistic, appetizing, centred composition with empty yellow space at the edges. No text, no logo, no hands, no people.

## Prompt 2: motion (image-to-video, 8 s loop)

> The floating Bengali seafood feast drifts and rotates slowly in zero gravity against the flat yellow backdrop. The ilish plate tilts gently, the prawn turns to show its glossy gravy, the crab rotates slowly, the fish fry pieces bob up and down, and thin steam rises from the rice bowl. Mustard seeds, green chillies and curry droplets float and spin softly around the dishes. Smooth, slow, premium food-commercial motion. Everything returns to its starting position at the end for a seamless loop. The yellow backdrop stays perfectly flat. Realistic food textures, no melting, no merging, no extra items, no text.

## Prompt 3 (alternative): the dishes come together on a banana leaf

> Overhead stop-motion style food animation on a flat taxi-yellow backdrop (#F6C90E). A fresh green banana leaf slides into the centre, then Bengali dishes land on it one by one with a soft bounce: a mound of white rice, a bowl of shorshe ilish in mustard gravy, a golda chingri malai curry, a crab curry, crispy bhetki fish fry, slit green chillies and a lemon wedge. Steam rises gently. In the last second the dishes slide off again, leaving the empty leaf, so the clip loops seamlessly. Bright, playful, appetizing, 8 seconds, no text, no hands.

## After you generate

Save to `D:\work\bong-fish\hero.mp4` and tell me. I will compress it (WebM + MP4, about 3 MB), make a poster image, match the hero yellow to the video's exact backdrop, and deploy. The slot is ready: once `video/hero.mp4` exists it replaces the 3D ilish automatically, and visitors who prefer reduced motion see the still poster.
