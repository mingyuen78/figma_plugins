async function run() {
  let section = figma.currentPage.selection.find(n => n.type === "SECTION" && n.name === "Parameter Here");
  if (!section) {
    section = figma.currentPage.findOne(n => n.type === "SECTION" && n.name === "Parameter Here");
  }

  if (!section) {
    figma.notify("Please create or select a 'Parameter Here' section first.");
    figma.closePlugin();
    return;
  }

  const colorNode = section.findOne(n => n.name === "param_color" && n.type === "TEXT");
  const footerLinksNode = section.findOne(n => n.name === "param_footer_links" && n.type === "TEXT");
  const sepNode = section.findOne(n => n.name === "param_footer_sep");
  const featureDesktopNode = section.findOne(n => n.name === "param_feature_desktop" && n.type === "FRAME");
  const featureMobileNode = section.findOne(n => n.name === "param_feature_mobile" && n.type === "FRAME");

  const base_color = colorNode ? colorNode.characters : "#006937";
  const footer_links = footerLinksNode ? footerLinksNode.characters : "Terms & Conditions, FAQ, Privacy Policy, Contact Us";
  
  let fontName = { family: "Inter", style: "Regular" };
  let fontSize = 14;
  let textDecoration = "NONE";
  let textCase = "ORIGINAL";
  if (footerLinksNode && footerLinksNode.fontName !== figma.mixed) {
    fontName = { family: footerLinksNode.fontName.family, style: footerLinksNode.fontName.style };
    if (footerLinksNode.fontSize !== figma.mixed) {
      fontSize = footerLinksNode.fontSize;
    }
    if (footerLinksNode.textDecoration !== figma.mixed) {
      textDecoration = footerLinksNode.textDecoration;
    }
    if (footerLinksNode.textCase !== figma.mixed) {
      textCase = footerLinksNode.textCase;
    }
  }

  try {
    await figma.loadFontAsync(fontName);
  } catch (e) {
    await figma.loadFontAsync({ family: "Inter", style: "Regular" });
    fontName = { family: "Inter", style: "Regular" };
  }

  const linksArray = footer_links.split(",").map(s => {
    const trimmed = s.trim();
    return trimmed.startsWith("*") ? trimmed.substring(1).trim() : trimmed;
  });

  function hexToRgb(hex) {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result ? {
      r: parseInt(result[1], 16) / 255,
      g: parseInt(result[2], 16) / 255,
      b: parseInt(result[3], 16) / 255
    } : { r: 0, g: 0, b: 0 };
  }

  const bgColor = hexToRgb(base_color);
  const padding = 20;

  function createFooter(width, height, isMobile) {
    const frame = figma.createFrame();
    frame.resize(width, height);
    frame.fills = [{ type: 'SOLID', color: bgColor }];
    frame.name = `Footer - ${width}x${height}${isMobile ? ' (Mobile)' : ''}`;

    if (isMobile) {
      // Mobile: Fixed column width of 85px
      const colWidth = 85;
      const totalLinksWidth = colWidth * linksArray.length;
      const mobileWidth = totalLinksWidth + (padding * 2);
      
      // Update frame width to fit the links
      frame.resize(mobileWidth, height);

      // Calculate max height for mobile links to align them properly
      const textNodes = [];
      linksArray.forEach((link, index) => {
        const text = figma.createText();
        text.fontName = fontName;
        text.characters = link.replace(/\|/g, "\n");
        text.fontSize = fontSize;
        text.textDecoration = textDecoration;
        text.textCase = textCase;
        text.resize(colWidth, text.height);
        text.textAutoResize = "HEIGHT";
        textNodes.push(text);
      });

      const maxTextHeight = Math.max(...textNodes.map(t => t.height));
      const rowCenterY = padding * 1.5 + (maxTextHeight / 2);
      
      textNodes.forEach((text, index) => {
        frame.appendChild(text);
        text.textAlignHorizontal = "CENTER";
        text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        
        text.x = padding + (index * colWidth);
        text.y = rowCenterY - (text.height / 2);

        if (index < linksArray.length - 1 && sepNode) {
          const sepClone = sepNode.clone();
          frame.appendChild(sepClone);
          
          // Respect dimensions of the source sepNode
          sepClone.resize(sepNode.width, sepNode.height);
          
          sepClone.x = padding + (index + 1) * colWidth - (sepClone.width / 2);
          sepClone.y = rowCenterY - (sepClone.height / 2);
          
          sepClone.children.forEach(child => {
            child.x = (sepClone.width - child.width) / 2;
            child.y = (sepClone.height - child.height) / 2;
          });
        }
      });

      const maxLinkY = padding * 1.5 + maxTextHeight;

      // Add Mobile Feature right below links, centered
      if (featureMobileNode) {
        const featureClone = featureMobileNode.clone();
        frame.appendChild(featureClone);
        featureClone.x = (frame.width - featureClone.width) / 2;
        featureClone.y = maxLinkY + 20;
      }
    } else {
      // Desktop: Left-aligned group
      const items = [];
      let totalWidth = 0;
      const gap = 10; // Tighter gap for desktop

      linksArray.forEach((link, index) => {
        const text = figma.createText();
        text.fontName = fontName;
        text.characters = link.replace(/\|/g, " ");
        text.fontSize = fontSize + 2;
        text.textDecoration = textDecoration;
        text.textCase = textCase;
        text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        text.textAutoResize = "WIDTH_AND_HEIGHT";
        
        items.push({ type: 'TEXT', node: text });
        totalWidth += text.width;

        if (index < linksArray.length - 1 && sepNode) {
          const sepClone = sepNode.clone();
          // Respect dimensions of the source sepNode
          sepClone.resize(sepNode.width, sepNode.height);
          
          items.push({ type: 'SEP', node: sepClone });
          totalWidth += sepClone.width + (gap * 2);
        }
      });

      let currentX = padding;
      const linksY = 30; // Position links near the top
      items.forEach(item => {
        frame.appendChild(item.node);
        if (item.type === 'TEXT') {
          item.node.x = currentX;
          item.node.y = linksY - (item.node.height / 2);
          currentX += item.node.width;
        } else {
          currentX += gap;
          item.node.x = currentX;
          item.node.y = linksY - (item.node.height / 2);
          item.node.children.forEach(child => {
            child.x = (item.node.width - child.width) / 2;
            child.y = (item.node.height - child.height) / 2;
          });
          currentX += item.node.width + gap;
        }
      });

      // Add Desktop Feature below links with tight padding
      if (featureDesktopNode) {
        const featureClone = featureDesktopNode.clone();
        frame.appendChild(featureClone);
        featureClone.x = padding;
        featureClone.y = linksY + 20; // Tight vertical gap
      }
    }

    return frame;
  }

  let maxY = 0;
  figma.currentPage.children.forEach(node => {
    if (node.y + node.height > maxY) {
      maxY = node.y + node.height;
    }
  });

  const resultSection = figma.createSection();
  resultSection.name = "Generated Footers";
  resultSection.y = maxY + 100;
  
  const gap = 30;
  const footer1920 = createFooter(1920, 100, false);
  const footer1280 = createFooter(1280, 100, false);
  const footer390 = createFooter(390, 250, true);

  resultSection.appendChild(footer1920);
  resultSection.appendChild(footer1280);
  resultSection.appendChild(footer390);

  footer1920.x = 20; footer1920.y = 40;
  footer1280.x = 20; footer1280.y = footer1920.y + footer1920.height + gap;
  footer390.x = 20; footer390.y = footer1280.y + footer1280.height + gap;

  resultSection.resize(2000, footer390.y + footer390.height + 40);
  figma.viewport.scrollAndZoomIntoView([resultSection]);
  figma.closePlugin();
}

run();
