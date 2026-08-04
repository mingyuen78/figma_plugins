figma.showUI(__html__, { width: 260, height: 280 });

function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return { r, g, b };
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-accordions') {
    const { count, fontFamily, textColor, bgColor } = msg;
    const textRgb = hexToRgb(textColor);
    const bgRgb = hexToRgb(bgColor);

    try {
      await figma.loadFontAsync({ family: fontFamily, style: "Bold" });
      await figma.loadFontAsync({ family: fontFamily, style: "Regular" });
    } catch (e) {
      figma.notify(`Font "${fontFamily}" not found. Falling back to Inter.`);
      await figma.loadFontAsync({ family: "Inter", style: "Bold" });
      await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    }

    const container = figma.createFrame();
    container.name = "Accordion Container";
    container.layoutMode = "VERTICAL";
    container.itemSpacing = 16;
    container.paddingLeft = 20;
    container.paddingRight = 20;
    container.paddingTop = 20;
    container.paddingBottom = 20;
    container.primaryAxisSizingMode = "AUTO";
    container.counterAxisSizingMode = "FIXED";
    container.resize(1024, 100);
    container.fills = []; // Transparent background

    for (let i = 1; i <= count; i++) {
      const accordion = figma.createFrame();
      accordion.name = `Accordion Item ${i}`;
      accordion.layoutMode = "HORIZONTAL";
      accordion.primaryAxisSizingMode = "FIXED";
      accordion.counterAxisSizingMode = "AUTO";
      accordion.layoutAlign = "STRETCH";
      accordion.resize(1024 - 40, 80);
      accordion.paddingLeft = 24;
      accordion.paddingRight = 24;
      accordion.paddingTop = 24;
      accordion.paddingBottom = 24;
      accordion.cornerRadius = 12;
      accordion.fills = [{ type: 'SOLID', color: bgRgb }];
      accordion.primaryAxisAlignItems = "SPACE_BETWEEN";
      accordion.counterAxisAlignItems = "CENTER";

      const text = figma.createText();
      try {
        text.fontName = { family: fontFamily, style: "Bold" };
      } catch (e) {
        text.fontName = { family: "Inter", style: "Bold" };
      }
      text.characters = `${i}. This is a sample accordion question?`;
      text.fontSize = 24;
      text.fills = [{ type: 'SOLID', color: textRgb }];
      text.layoutAlign = "INHERIT";

      // Chevron Icon (Vector)
      const chevron = figma.createVector();
      chevron.name = "Chevron";
      chevron.vectorPaths = [{
        windingRule: "EVENODD",
        data: "M 0 0 L 8 8 L 16 0"
      }];
      chevron.strokes = [{ type: 'SOLID', color: textRgb }];
      chevron.strokeWeight = 3;
      chevron.strokeCap = "ROUND";
      chevron.strokeJoin = "ROUND";
      
      accordion.appendChild(text);
      accordion.appendChild(chevron);
      container.appendChild(accordion);
    }

    figma.currentPage.appendChild(container);
    figma.currentPage.selection = [container];
    figma.viewport.scrollAndZoomIntoView([container]);
    
    figma.notify(`Created ${count} accordions!`);
  }
};
