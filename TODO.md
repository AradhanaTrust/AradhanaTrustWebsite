# Project TODO List

## Urgent Fixes
- [ ] **Fix 'About Us' Subheading Color Mismatch**
  - Problem: The subheading "Promoting Dharma..." appears black/dark instead of the intended Gold (#B8860B).
  - Goal: Ensure it matches the "Objectives" subheading style exactly (Solid Gold, No Opacity).
  - Status: Modifications to remove `/80` opacity and use hex codes were attempted but reverted/not reflecting.

## Refinements
- [ ] **Polish Objective Tile Images**
  - Goal: Refining the generated tile images (Temple, Annadanam, Pooja, etc.) to be more distinct, high-quality, and visually consistent with the new cream/gold theme.
  - Current State: Using initial draft generations + placeholders.

## General
- [ ] Verify Global CSS Variables for `secondary-dark` to ensure it's not overriding to black in specific contexts.

## Data Migration
- [ ] **Migrate Static Gallery Images to Database**
  - Problem: Static images in `galleryData.ts` and `Gallery.tsx` are hardcoded and not manageable via Admin Dashboard.
  - Goal: Upload original static images to the database via Admin Dashboard and remove hardcoded references from `Gallery.tsx` and `galleryData.ts` so all images are dynamic.
