---
name: slice-9
description: Use this skill to generate 9-patch CSS and Tailwind utilities for selected Figma objects. Trigger this skill whenever the user mentions "9-patch", "slicing", "slice.9", or generating CSS for scalable borders.
---

# /slice.9 Skill

This skill helps you generate `border-image` CSS and Tailwind CSS utilities for objects that require 9-patch scaling (scalable borders with fixed corners).

## Logic Overview

1. **Selection & Preview**:
   - The plugin automatically detects the selected object in Figma.
   - It displays a preview of the selected object in the UI.

2. **Slicing Parameters**:
   - The user provides 4 offset values: **Top**, **Right**, **Bottom**, and **Left**.
   - These offsets define the areas that should remain fixed (corners) and the areas that should stretch (sides and center).

3. **CSS Generation**:
   - **`border-image-source`**: Assumes the asset will be saved in `/assets/images/`.
   - **`border-image-slice`**: Uses the provided offsets with the `fill` keyword to preserve the center.
   - **`border-width`**: Sets the border width to match the slice offsets for pixel-perfect scaling.
   - **Tailwind Utility**: Generates an inline Tailwind class string using arbitrary value syntax.

## Implementation Details

- **Main Script**: `./slice_9/code.js`
- **UI Template**: `./slice_9/ui.html`
- **Manifest**: `./slice_9/manifest.json`
