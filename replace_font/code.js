figma.showUI(__html__, { width: 280, height: 260 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'replace-font') {
    const { fontFamily } = msg;

    let textNodes = [];
    if (figma.currentPage.selection.length > 0) {
      function findTextNodes(node) {
        if (node.type === 'TEXT') {
          textNodes.push(node);
        } else if ("children" in node) {
          for (const child of node.children) {
            findTextNodes(child);
          }
        }
      }
      figma.currentPage.selection.forEach(findTextNodes);
    } else {
      textNodes = figma.currentPage.findAll(n => n.type === 'TEXT');
    }

    if (textNodes.length === 0) {
      figma.notify("No text layers found to replace.");
      return;
    }

    let successCount = 0;
    figma.notify(`Replacing fonts with "${fontFamily}"...`);

    for (const node of textNodes) {
      try {
        if (node.fontName === figma.mixed) {
          const segments = node.getStyledTextSegments(['fontName']);
          for (const segment of segments) {
            const currentFont = segment.fontName;
            const targetFont = { family: fontFamily, style: currentFont.style };
            
            // Try to load target font with original style
            try {
              await figma.loadFontAsync(currentFont); // Load original to avoid errors
              await figma.loadFontAsync(targetFont);
              node.setRangeFontName(segment.start, segment.end, targetFont);
            } catch (err) {
              // Fallback to Regular
              const fallback = { family: fontFamily, style: "Regular" };
              await figma.loadFontAsync(fallback);
              node.setRangeFontName(segment.start, segment.end, fallback);
            }
          }
        } else {
          const currentFont = node.fontName;
          const targetFont = { family: fontFamily, style: currentFont.style };

          try {
            await figma.loadFontAsync(currentFont);
            await figma.loadFontAsync(targetFont);
            node.fontName = targetFont;
          } catch (err) {
            const fallback = { family: fontFamily, style: "Regular" };
            await figma.loadFontAsync(fallback);
            node.fontName = fallback;
          }
        }
        successCount++;
      } catch (err) {
        console.error(`Error processing node ${node.name}:`, err);
      }
    }

    figma.notify(`Successfully updated ${successCount} text layers!`);
  }
};
