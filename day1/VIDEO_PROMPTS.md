# ORVAN — Hero video prompts (v2, tuned for a clean cut-out)

These are the same three shots as before. Each prompt is rewritten to fix what softened the edges last time:

| Problem in v1 | What v2 asks for |
| --- | --- |
| Green light bouncing onto the trousers and skin | Model stands far from the backdrop; the backdrop is lit separately; no green reflections |
| Soft or blurry edges while walking | Fast shutter, no motion blur, crisp outline |
| Frizzy hair edge | Sleek, tightly pulled-back bun with no flyaway strands |
| Low resolution (1280×720) | 1080p or 4K |
| Dark or uneven green, floor shadows | Bright, flat, evenly lit green; no cast shadows |
| Tripod and watermark in the corners | Empty corners; nothing in the frame except the model |

## Settings for every shot

- **Resolution: 1080p (or 4K if available). Aspect ratio 16:9. 24 fps.**
- **Reference image:** attach `public/images/editorial/hero-model.png` to every shot. For shots B and C, also attach the last frame of the previous shot if the generator allows two references.
- Save to `public/images/main-model-video/` with the same names as before, replacing the old files:
  - `shot-a-cross.mp4`
  - `shot-b-approach.mp4`
  - `shot-c-pose.mp4`
- **Regenerate the shot** if you see any of these: a camera move or zoom, a cut, a shadow on the green, green tint on her clothes or skin, loose hair strands, her feet cut off at the bottom, or anything in the corners.

---

## Shot A — `shot-a-cross.mp4`

```
Professional chroma-key fashion film, 16:9, 1080p, 24 fps, shot on a locked-off cinema camera on a tripod at hip height: no pan, no tilt, no zoom, no camera shake, no cuts.

BACKGROUND: a seamless infinity-cove green screen in one flat, bright, saturated chroma green (#00B140), evenly lit edge to edge by separate soft background lights, so the green has no gradient, no hot spots, no dark corners, no visible floor line and no cast shadows. Nothing else is in the frame: no stands, no equipment, no props, no marks on the floor, and all four corners are clean green.

SUBJECT: the same female model as in the reference image: same face, same dark hair pulled back tightly into a sleek, smooth low bun with no loose or flyaway strands. Same outfit: a long tailored oxblood-red (#5C1A1F) double-faced wool coat worn open, a cream ribbed knit, ecru wide-leg pleated trousers, dark brown leather loafers. Nothing green or reflective on her.

LIGHTING: she stands and walks at least 3 metres in front of the green backdrop. She is lit by a large soft warm key light from the front-left and soft fill from the right. There is no green light spilling onto her hair, skin or clothes, and her edges read clean and neutral against the green.

ACTION: the frame starts as empty green for half a second. She enters from the left edge and walks in profile, a confident, steady runway walk, straight across to the right edge, exiting by 7 seconds. The final second is empty green. She always stays at exactly the same distance from the camera, shown full length from head to toe, feet on the same floor level, with generous empty green above her head and below her feet.

CAMERA: fast shutter for crisp edges, no motion blur, sharp focus on her the whole time, deep enough depth of field that her whole body is sharp, natural fabric movement.

STYLE: photorealistic, high-end fashion campaign, clean and minimal. No text, no logo, no watermark, no subtitles.
```

## Shot B — `shot-b-approach.mp4`

```
Professional chroma-key fashion film, 16:9, 1080p, 24 fps, shot on a locked-off cinema camera on a tripod at hip height: no pan, no tilt, no zoom, no camera shake, no cuts.

BACKGROUND: a seamless infinity-cove green screen in one flat, bright, saturated chroma green (#00B140), evenly lit edge to edge by separate soft background lights, so the green has no gradient, no hot spots, no dark corners, no visible floor line and no cast shadows. Nothing else is in the frame: no stands, no equipment, no props, no marks on the floor, and all four corners are clean green.

SUBJECT: the same female model as in the reference image: same face, same dark hair pulled back tightly into a sleek, smooth low bun with no loose or flyaway strands. Same outfit: a long tailored oxblood-red (#5C1A1F) double-faced wool coat worn open, a cream ribbed knit, ecru wide-leg pleated trousers, dark brown leather loafers. Nothing green or reflective on her.

LIGHTING: she is always at least 3 metres in front of the green backdrop. She is lit by a large soft warm key light from the front-left and soft fill from the right. There is no green light spilling onto her hair, skin or clothes, and her edges read clean and neutral against the green.

ACTION: at the start she stands far away in the exact centre of the frame, small in the distance. She walks straight towards the camera in a slow, confident runway walk, growing larger, and stops at 6.5 seconds in the centre of the frame. At that point she is shown full length, head to toe: her head is about 5% below the top of the frame and her feet about 5% above the bottom. She stands still, facing the camera with a calm expression, for the final 1.5 seconds.

CAMERA: fast shutter for crisp edges, no motion blur, sharp focus on her the whole time, deep enough depth of field that her whole body is sharp, natural coat movement.

STYLE: photorealistic, high-end fashion campaign, clean and minimal. No text, no logo, no watermark, no subtitles.
```

## Shot C — `shot-c-pose.mp4`

```
Professional chroma-key fashion film, 16:9, 1080p, 24 fps, shot on a locked-off cinema camera on a tripod at hip height: no pan, no tilt, no zoom, no camera shake, no cuts.

BACKGROUND: a seamless infinity-cove green screen in one flat, bright, saturated chroma green (#00B140), evenly lit edge to edge by separate soft background lights, so the green has no gradient, no hot spots, no dark corners, no visible floor line and no cast shadows. Nothing else is in the frame: no stands, no equipment, no props, no marks on the floor, and all four corners are clean green.

SUBJECT: the same female model as in the reference image: same face, same dark hair pulled back tightly into a sleek, smooth low bun with no loose or flyaway strands. Same outfit: a long tailored oxblood-red (#5C1A1F) double-faced wool coat worn open, a cream ribbed knit, ecru wide-leg pleated trousers, dark brown leather loafers. Nothing green or reflective on her.

LIGHTING: she stands at least 3 metres in front of the green backdrop. She is lit by a large soft warm key light from the front-left and soft fill from the right. There is no green light spilling onto her hair, skin or clothes, and her edges read clean and neutral against the green.

FRAMING: she stands in the exact centre of the frame, shown full length, head to toe: her head is about 5% below the top of the frame and her feet about 5% above the bottom. This matches the end of the previous shot. Her feet stay on the same spot the whole time.

ACTION: she moves slowly and elegantly through three editorial poses, keeping her arms close to her body so there are few gaps between her arms and her body:
1. Facing the camera, one hand in the coat pocket, weight on one leg.
2. A quarter turn to her left, lifting the coat collar with one hand and looking back over her shoulder at the camera.
3. Turning back to face the camera, both hands in the coat pockets, with a confident, calm expression.
She holds pose 3 completely still for the final 2 seconds.

CAMERA: fast shutter for crisp edges, no motion blur, sharp focus, deep enough depth of field that her whole body is sharp, natural fabric movement.

STYLE: photorealistic, high-end fashion campaign, clean and minimal. No text, no logo, no watermark, no subtitles.
```

---

## If the generator still struggles

- **Green tint on her:** add *"Her clothes, skin and hair show no green colour cast at all."*
- **Shadows on the floor:** add *"She casts no shadow; the green floor stays one uniform brightness under her feet."*
- **Size drifting in shot A:** add *"She stays at exactly the same distance from the camera the whole time."*
- **Outfit or face changing between shots:** use the last frame of the previous shot as the reference image.
- **Shot C ending off-centre:** add *"Her body is centred horizontally in the frame, exactly where she stopped in the previous shot."*

When the new files are in place, tell me and I'll re-key them with the same pipeline (edge colour bleed, 1 px choke, a shadow that follows her feet, dissolves between shots).
