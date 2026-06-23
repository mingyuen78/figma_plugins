---
name: navbar-maker
description: Use this skill to generate responsive navbars (Desktop 1920px, Tablet 1280px, Mobile 390px) and a mobile menu based on the "Parameter Here" section. Trigger this skill whenever the user asks to "generate navbars", "create responsive navbars", or mentions "/navbar.maker".
---

# /navbar.maker Skill

This skill generates a set of responsive navbars and a dedicated mobile menu frame.

## Configuration Requirements

The skill expects a section named **"Parameter Here"** containing:
- `param_color` (Text): Background hex code.
- `param_links` (Text): Comma-separated links. Prefix with `*` for submenu items.
- `param_logo` (Frame/Text): Brand logo.
- `param_feature` (Frame): Additional feature (e.g., language switcher).
- `param_align` (Text): Mobile menu text alignment (`left`, `center`, `right`).

## Output

Generates a **"Generated Navbars"** section containing:
1. **Desktop Navbar** (1920px width) - Right-aligned links.
2. **Tablet Navbar** (1280px width) - Right-aligned links.
3. **Mobile Navbar** (390px width) - Hamburger (left), Logo (center), Feature (right).
4. **Mobile Menu** (370x620) - Vertically stacked links with close button.

## Features
- **Smart Alignment**: Respects the `param_align` value for mobile menu links.
- **Submenus**: Automatically adds a chevron icon to links prefixed with `*`.
- **Automatic Stacking**: Places the new section below existing page content.
