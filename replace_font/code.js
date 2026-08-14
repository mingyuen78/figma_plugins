figma.showUI(__html__, { width: 280, height: 260 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'replace-font') {
    const { fontFamily, fontStyle } = msg;

    let textNodes = [];
    if (figma.currentPage.selection.length > 0) {
      figma.currentPage.selection.forEach(node => {
        if (node.type === "TEXT") textNodes.push(node);
        if ("findAll" in node) {
          textNodes.push(...node.findAll(n => n.type === "TEXT"));
        }
      });
    } else {
      textNodes = figma.currentPage.findAll(n => n.type === 'TEXT');
    }

    if (textNodes.length === 0) {
      figma.notify("No text layers found in selection.");
      return;
    }

    // Filter out duplicates in case of nested selections
    textNodes = [...new Set(textNodes)];

    let successCount = 0;
    let errorCount = 0;
    figma.notify(`Found ${textNodes.length} text layers. Replacing...`);

    for (const node of textNodes) {
      try {
        if (node.fontName === figma.mixed) {
          const segments = node.getStyledTextSegments(['fontName']);
          for (const segment of segments) {
            const currentFont = segment.fontName;
            const targetStyle = fontStyle === 'keep' ? currentFont.style : fontStyle;
            const targetFont = { family: fontFamily, style: targetStyle };
            
            try {
              // Try to load original font (might be missing)
              await figma.loadFontAsync(currentFont).catch(() => console.warn("Original font missing"));
              await figma.loadFontAsync(targetFont);
              node.setRangeFontName(segment.start, segment.end, targetFont);
            } catch (err) {
              // Fallback to "Regular" then to whatever is available
              try {
                const fallback = { family: fontFamily, style: "Regular" };
                await figma.loadFontAsync(fallback);
                node.setRangeFontName(segment.start, segment.end, fallback);
              } catch (fallbackErr) {
                errorCount++;
              }
            }
          }
        } else {
          const currentFont = node.fontName;
          const targetStyle = fontStyle === 'keep' ? currentFont.style : fontStyle;
          const targetFont = { family: fontFamily, style: targetStyle };

          try {
            await figma.loadFontAsync(currentFont).catch(() => console.warn("Original font missing"));
            await figma.loadFontAsync(targetFont);
            node.fontName = targetFont;
          } catch (err) {
            try {
              const fallback = { family: fontFamily, style: "Regular" };
              await figma.loadFontAsync(fallback);
              node.fontName = fallback;
            } catch (fallbackErr) {
              errorCount++;
            }
          }
        }
        successCount++;
      } catch (err) {
        console.error(`Error processing node ${node.name}:`, err);
        errorCount++;
      }
    }

    if (errorCount > 0) {
      figma.notify(`Updated ${successCount} layers. ${errorCount} styles failed to load (check style names).`, { timeout: 5000 });
    } else {
      figma.notify(`Successfully updated ${successCount} text layers!`);
    }
  }
};
