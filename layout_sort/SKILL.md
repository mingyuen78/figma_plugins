---
name: layout-sort
description: Use this skill to sort children within a Figma frame that has Auto Layout enabled alphabetically by name. Trigger this skill whenever the user mentions "sorting children", "alphabetical sort", "layout sort", or specifically asks to use the "/layout.sort" functionality.
---

# /layout.sort Skill

This skill allows you to alphabetically sort all child elements within a selected Figma frame, component, or instance that has Auto Layout enabled.

## Logic Overview

1. **Selection Validation**:
   - The user must select exactly one node.
   - The node must be a **Frame**, **Component**, or **Instance**.
   - The node must have **Auto Layout** enabled (`layoutMode` is not `NONE`).

2. **Sorting Logic**:
   - All children are collected into an array.
   - Children are sorted alphabetically by their `name` property in ascending order.
   - The sort uses `numeric: true` to correctly handle numbered layers (e.g., "Item 2" comes before "Item 10").

3. **Reordering**:
   - Children are re-inserted into the parent node using `insertChild(index, child)`.
   - The alphabetically first child is placed at **index 0**, which corresponds to the **top** (in vertical auto layout) or **left** (in horizontal auto layout) visual position.

## Implementation Details

The implementation is located in `./layout_sort/code.js`. Use this file as the source of truth for the logic.
