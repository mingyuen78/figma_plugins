# Figma Navbar Generator

A suite of Figma plugins to generate responsive navbars based on design-driven parameters directly from your canvas.

## Plugins

### 1. `/input.section`
Run this plugin to generate a "Parameter Here" configuration section on your canvas. This section acts as the UI for your navbar settings.

![Input Section Parameters](/tmp/zencoder/pasted/files/image-20260619042930-6s8gvb..png)

#### Available Parameters:
- **Base Color**: Enter a Hex code (e.g., `#006937`) to set the navbar background.
- **Menu Links**: A comma-separated list of links. 
    - Prefix a link with `*` (e.g., `* Promotions`) to add a **submenu chevron-down icon**.
    - The font family and style of this text node will be used for the generated navbar links.
- **Logo**: A frame named `param_logo`. Replace the placeholder content with your actual logo.
- **Feature**: A frame named `param_feature` (e.g., for language switchers like `EN | CH`).
- **Mobile Menu Alignment**: Set to `left`, `center`, or `right` to control text alignment in the mobile menu.

### 2. `/navbar.maker`
Once you have configured your parameters in the "Parameter Here" section, run this plugin to generate the navbars.

#### What it generates:
- **Desktop Navbar** (1920px width)
- **Tablet Navbar** (1280px width)
- **Mobile Navbar** (390px width)
    - Features a hamburger menu on the left and the Feature frame on the right.
- **Mobile Menu Frame** (370x620px)
    - Contains vertically stacked links with submenu chevrons aligned to the far right.
    - Includes a Heroicon close button at the top right.

## How to Use
1. Run `/input.section` to create the parameter block.
2. Edit the values (Color, Links, Logo, etc.) directly on the Figma canvas.
3. Select the "Parameter Here" section (or just run the plugin if it's the only one on the page).
4. Run `/navbar.maker`.
5. The generated navbars will appear in a new "Generated Navbars" section, placed `100px` below the lowest element on your page to avoid overlap.
