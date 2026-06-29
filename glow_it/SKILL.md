---
name: glow-it
description: Use this skill to apply a neon glow effect to selected Figma objects via a UI panel. Trigger this skill whenever the user mentions "neonize", "add glow", "glow effect", or specifically asks to use the "/glow.it" functionality.
---

# /glow.it Skill

This skill applies a neon glow (drop shadow) effect to selected Figma objects using a UI panel for parameter entry.

## Logic Overview

1. **UI Panel**:
   - Opens a 240x260 pixel window.
   - Provides input fields for:
     - **Color (Hex)**: 6-character hex code (default: `FFFFFF`).
     - **Offset X**: Horizontal displacement (default: `0`).
     - **Offset Y**: Vertical displacement (default: `0`).
     - **Blur**: Blur radius (default: `20`).

2. **Selection Validation**:
   - Requires at least one object to be selected.
   - Applies the effect to all selected nodes that support effects.

3. **Effect Application**:
   - Appends a new `DROP_SHADOW` effect to the node's existing effects.
   - Uses the color and dimensions provided in the UI panel.

## Implementation Details

- **Main Script**: `./glow_it/code.js`
- **UI Template**: `./glow_it/ui.html`
- **Manifest**: `./glow_it/manifest.json`
