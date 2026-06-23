# /section.renamer

A Figma plugin dedicated to renaming and organizing items within a section based on their dimensions.

## Features

- **Smart Renaming**: Automatically renames child items within a selected section if their dimensions match standard banner sizes (with a ±5px tolerance).
- **Naming Convention**: 
  - The dimension is inserted before the last underscore of the section name.
  - Example: If the section is named `home_deco_en` and contains a 1920x1080 frame, it will be renamed to `home_deco_1920x1080_en`.
- **Auto-Rearrange**: Sorts all matching items from the smallest range to the largest.
- **Right Alignment**: Stacks items vertically and aligns their right edges.
- **Automatic Layout**: 
  - 60px gap between items.
  - 60px padding around the entire content.
  - Automatically resizes the section to fit the organized items.

## Supported Dimensions

- 1280x550
- 1280x585
- 1280x665
- 1280x695
- 1536x695
- 1536x730
- 1536x826
- 1707x825
- 1920x1080
- 2880x1418
- 2880x1367 (Automatically created if no matching item exists in the section)

## How to Use

1. Select a **Section** (or an item within a section).
2. Run the `/section.renamer` plugin.
3. If no section is found in the selection or hierarchy, an alert will prompt you to select one.
