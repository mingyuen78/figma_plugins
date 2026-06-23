---
name: footer-maker
description: Use this skill to generate responsive footers (Desktop 1920x100, Tablet 1280x100, Mobile 390x250) based on the "Parameter Here" section. Trigger this skill whenever the user asks to "generate footers", "create responsive footers", or mentions "/footer.maker".
---

# /footer.maker Skill

This skill generates a set of responsive footers by reading configuration from a "Parameter Here" section.

## Configuration Requirements

The skill expects a section named **"Parameter Here"** containing:
- `param_color` (Text): Hex code for background (e.g., `#006937`).
- `param_footer_links` (Text): Comma-separated list of links. Use `|` for line breaks in mobile.
- `param_footer_sep` (Frame): Separator icon/node.
- `param_feature_desktop` (Frame): Feature node for desktop version.
- `param_feature_mobile` (Frame): Feature node for mobile version.

## Output

Generates a **"Generated Footers"** section containing:
1. **Desktop Footer** (1920x100)
2. **Tablet Footer** (1280x100)
3. **Mobile Footer** (390x250) - Links are equally divided into columns and centered.
