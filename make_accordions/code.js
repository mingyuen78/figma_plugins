figma.showUI(__html__, { width: 260, height: 380 });

function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return { r, g, b };
}

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'create-accordions') {
    const { count, fontFamily, fontSize, paddingX, paddingY, textColor, bgColor } = msg;
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

    const selection = figma.currentPage.selection;
    let targetWidth = 1024;
    let pLeft = 20, pRight = 20, pTop = 20, pBottom = 20, spacing = 16;

    if (selection.length > 0 && (selection[0].type === 'FRAME' || selection[0].type === 'COMPONENT' || selection[0].type === 'INSTANCE')) {
      const selected = selection[0];
      targetWidth = selected.width;
      // If the selected element has auto-layout, respect its padding and spacing
      if (selected.layoutMode !== "NONE") {
        pLeft = selected.paddingLeft;
        pRight = selected.paddingRight;
        pTop = selected.paddingTop;
        pBottom = selected.paddingBottom;
        spacing = selected.itemSpacing;
      }
    }

    const container = figma.createFrame();
    container.name = "Accordion Container";
    container.layoutMode = "VERTICAL";
    container.itemSpacing = spacing;
    container.paddingLeft = pLeft;
    container.paddingRight = pRight;
    container.paddingTop = pTop;
    container.paddingBottom = pBottom;
    container.primaryAxisSizingMode = "AUTO";
    container.counterAxisSizingMode = "FIXED";
    container.resize(targetWidth, 100);
    container.fills = []; // Transparent background

    for (let i = 1; i <= count; i++) {
      const accordion = figma.createFrame();
      accordion.name = `Accordion Item ${i}`;
      accordion.layoutMode = "HORIZONTAL";
      accordion.primaryAxisSizingMode = "FIXED";
      accordion.counterAxisSizingMode = "AUTO";
      accordion.layoutAlign = "STRETCH";
      accordion.resize(targetWidth - pLeft - pRight, 1); // Set to 1, Hug will expand it
      accordion.paddingLeft = paddingX || 24;
      accordion.paddingRight = paddingX || 24;
      accordion.paddingTop = paddingY || 24;
      accordion.paddingBottom = paddingY || 24;
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
      text.fontSize = fontSize || 24;
      text.fills = [{ type: 'SOLID', color: textRgb }];
      text.layoutAlign = "INHERIT";
      text.layoutGrow = 1;
      text.textAutoResize = "HEIGHT";

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

    if (selection.length > 0 && (selection[0].type === 'FRAME' || selection[0].type === 'COMPONENT' || selection[0].type === 'INSTANCE')) {
      selection[0].appendChild(container);
    } else {
      figma.currentPage.appendChild(container);
    }
    figma.currentPage.selection = [container];
    figma.viewport.scrollAndZoomIntoView([container]);
    
    figma.notify(`Created ${count} accordions!`);
  }
};
