---
name: input-section
description: Use this skill to create the "Parameter Here" configuration section required by other plugins like /navbar.maker and /footer.maker. Trigger this skill whenever the user asks to "setup parameters", "create input section", "initialize plugin settings", or mentions "/input.section".
---

# /input.section Skill

This skill initializes the configuration UI on the Figma canvas.

## What it creates

Creates a section named **"Parameter Here"** with the following editable parameters:
1. **Base Color**: `param_color` (Default: `#006937`)
2. **Menu Links**: `param_links`
3. **Logo**: `param_logo` (Frame placeholder)
4. **Footer Feature (desktop)**: `param_feature_desktop`
5. **Footer Feature (mobile)**: `param_feature_mobile`
6. **Mobile Menu Alignment**: `param_align` (left, center, right)
7. **Footer Links**: `param_footer_links`
8. **Footer Separator**: `param_footer_sep`

## Purpose

This section acts as the source of truth for the **Navbar Maker** and **Footer Maker** plugins. Users should edit the values in this section before running the generation plugins.
