# Icon Generation Instructions

You need to create two PNG icons and place them in the `public` folder:

## Required Files:

- `public/pwa-192x192.png` (192x192 pixels)
- `public/pwa-512x512.png` (512x512 pixels)

## Quick Methods:

### Option 1: Online Generator (Easiest)

1. Visit: https://realfavicongenerator.net/
2. Upload your logo (the 🧶 yarn ball or your own design)
3. Download the generated pack
4. Extract `pwa-192x192.png` and `pwa-512x512.png`
5. Place them in your `public` folder

### Option 2: Canva (Free)

1. Go to Canva.com
2. Create custom size: 512x512px
3. Design your icon:
   - Purple gradient background (#7C3AED to #A78BFA)
   - White 🧶 emoji or text "MCK"
   - Keep it simple - will be small on phones
4. Export as PNG
5. Resize to 192x192 for the smaller version
6. Save both to `public` folder

### Option 3: Simple Emoji Icon

For a quick start, I can generate a simple purple square with the 🧶 emoji using an image generation tool.

## Design Tips:

- ✅ Use high contrast (white on purple works great)
- ✅ Keep it simple - complex designs don't scale well
- ✅ Square aspect ratio (don't use wide logos)
- ✅ Leave some padding around edges (safe zone)
- ❌ Don't use text smaller than 40px
- ❌ Don't use gradients that are too subtle

## After Creating Icons:

Place them in:

```
public/
  pwa-192x192.png
  pwa-512x512.png
```

Then test by building: `npm run build`
The manifest will be auto-generated at `dist/manifest.webmanifest`
