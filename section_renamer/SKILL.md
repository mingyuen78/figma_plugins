---
name: section-renamer
description: Use this skill to rename and organize items within a Figma section based on their dimensions. Trigger this skill whenever the user mentions "renaming banners", "organizing sections", "banner naming", or specifically asks to use the "/section.renamer" functionality. This skill is essential for maintaining consistent naming and layout conventions for marketing banners in Figma.
---

# /section.renamer Skill

This skill allows you to rename and organize child items within a Figma section according to specific dimensions and layout rules.

## Logic Overview

1. **Section Selection**:
   - Identify the selected section or the parent section of the selected node.
   - If no section is found, notify the user.

2. **Naming Convention**:
   - Format: `[Prefix]_[DIMENSION]_[Suffix]`
   - **Prefix**: The part of the section name before the last underscore.
   - **Suffix**: The last part of the section name (after the last underscore).
   - **DIMENSION**: The matched target dimension (e.g., `1920x1080`).
   - Example: `home_deco_en` -> `home_deco_1920x1080_en`.

3. **Target Dimensions (Tolerance: ±5px)**:
   - 1280x550, 1280x585, 1280x665, 1280x695
   - 1536x695, 1536x730, 1536x826
   - 1707x825
   - 1920x1080
   - 2880x1418

4. **Rearrangement & Layout**:
   - **Sort**: Smallest width/height to largest.
   - **Stack**: Vertically with a **60px gap**.
   - **Align**: Right-aligned.
   - **Padding**: **60px** around all items.
   - **Resizing**: Resize the section to fit the new layout.

## Implementation Details

The implementation is located in `./section_renamer/code.js`. Use this file as the source of truth for the logic.
