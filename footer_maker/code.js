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
  const socialLinksNode = section.findOne(n => n.name === "param_social_links" && n.type === "FRAME");
  const socialAlignDesktopNode = section.findOne(n => n.name === "param_social_align_desktop" && n.type === "TEXT");
  const socialAlignMobileNode = section.findOne(n => n.name === "param_social_align_mobile" && n.type === "TEXT");

  const base_color = colorNode ? colorNode.characters : "#006937";
  const footer_links = footerLinksNode ? footerLinksNode.characters : "Terms & Conditions, FAQ, Privacy Policy, Contact Us";
  const social_align_desktop = socialAlignDesktopNode ? socialAlignDesktopNode.characters.toLowerCase().trim() : "right";
  const social_align_mobile = socialAlignMobileNode ? socialAlignMobileNode.characters.toLowerCase().trim() : "top";
  
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
  const vPadding = 12;

  function alignFrameContent(frame, alignment) {
    if (!frame || !("children" in frame) || frame.children.length === 0) return;
    
    // 1. Recursive padding reset
    function resetPaddings(node) {
      if ("paddingLeft" in node) {
        node.paddingLeft = 0; node.paddingRight = 0;
        node.paddingTop = 0; node.paddingBottom = 0;
      }
      if ("children" in node) node.children.forEach(resetPaddings);
    }
    resetPaddings(frame);

    // 2. Filter children to ignore invisible ones and placeholders
    const validChildren = frame.children.filter(c => {
      if (!c.visible) return false;
      if (c.type === "TEXT" && (c.characters.includes("SOCIAL LINKS") || c.characters.includes("FOOTER FEATURE"))) return false;
      return true;
    });
    
    const targetChildren = validChildren.length > 0 ? validChildren : frame.children;

    // 3. Alignment logic
    if ("layoutMode" in frame && frame.layoutMode !== "NONE") {
      const isHorizontal = frame.layoutMode === "HORIZONTAL";
      
      // Force FIXED so alignment has space to work within the frame width
      if (isHorizontal) frame.primaryAxisSizingMode = "FIXED";
      else frame.counterAxisSizingMode = "FIXED";

      if (alignment === "right") {
        if (isHorizontal) frame.primaryAxisAlignItems = "MAX";
        else frame.counterAxisAlignItems = "MAX";
      } else if (alignment === "center") {
        frame.primaryAxisAlignItems = "CENTER";
        frame.counterAxisAlignItems = "CENTER";
      } else {
        if (isHorizontal) frame.primaryAxisAlignItems = "MIN";
        else frame.counterAxisAlignItems = "MIN";
      }
    } else {
      // Manual shift for regular frames
      const minX = Math.min(...targetChildren.map(c => c.x));
      const maxX = Math.max(...targetChildren.map(c => c.x + c.width));
      
      let offset = 0;
      if (alignment === "right") {
        offset = frame.width - maxX;
      } else if (alignment === "center") {
        const contentWidth = maxX - minX;
        offset = (frame.width - contentWidth) / 2 - minX;
      } else {
        offset = -minX;
      }

      frame.children.forEach(child => {
        child.x += offset;
      });
    }
  }

  function createFooter(width, height, isMobile) {
    const frame = figma.createFrame();
    frame.resize(width, height);
    frame.fills = [{ type: 'SOLID', color: bgColor }];
    frame.name = `Footer - ${width}x${height}${isMobile ? ' (Mobile)' : ''}`;

    if (isMobile) {
      // Mobile: Fixed width of 390px
      const mobileWidth = 390;
      frame.resize(mobileWidth, height);

      // Mobile: Fixed column width of 72px for links
      const colWidth = 72;
      
      // Calculate max height for mobile links
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
      
      let currentY = padding * 0.5;

      // Handle Top Alignment: Social Links ABOVE Menu Links
      if (social_align_mobile === "top" && socialLinksNode) {
        const socialClone = socialLinksNode.clone();
        frame.appendChild(socialClone);
        socialClone.x = (mobileWidth - socialClone.width) / 2;
        socialClone.y = currentY;
        currentY += socialClone.height + 10; // 10px gap above menu links
      }

      const linksTotalWidth = colWidth * linksArray.length;
      const startX = (mobileWidth - linksTotalWidth) / 2;
      
      const rowCenterY = currentY + (maxTextHeight / 2);
      
      textNodes.forEach((text, index) => {
        frame.appendChild(text);
        text.textAlignHorizontal = "CENTER";
        text.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
        
        text.x = startX + (index * colWidth);
        text.y = rowCenterY - (text.height / 2);

        if (index < linksArray.length - 1 && sepNode) {
          const sepClone = sepNode.clone();
          frame.appendChild(sepClone);
          sepClone.resize(sepNode.width, sepNode.height);
          sepClone.x = startX + (index + 1) * colWidth - (sepClone.width / 2);
          sepClone.y = rowCenterY - (sepClone.height / 2);
          
          sepClone.children.forEach(child => {
            child.x = (sepClone.width - child.width) / 2;
            child.y = (sepClone.height - child.height) / 2;
          });
        }
      });

      currentY += maxTextHeight + 8;

      // Add Mobile Feature
      if (featureMobileNode) {
        const featureClone = featureMobileNode.clone();
        frame.appendChild(featureClone);
        featureClone.x = (mobileWidth - featureClone.width) / 2;
        featureClone.y = currentY;
        currentY += featureClone.height + 10;
      }

      // Add Social Links if aligned to bottom
      if (social_align_mobile === "bottom" && socialLinksNode) {
        const socialClone = socialLinksNode.clone();
        frame.appendChild(socialClone);
        socialClone.x = (mobileWidth - socialClone.width) / 2;
        socialClone.y = currentY;
      }
    } else {
      // Desktop: Left-aligned group for links
      const items = [];
      let totalWidth = 0;
      const gap = 8; // Tighter gap for desktop

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
      const linksY = vPadding + 6; // Balanced top padding
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

      // Add Desktop Feature and Social Links
      // Both "left" and "right" arrangements are side-by-side and bottom-aligned
      const bottomY = height - vPadding;
      
      let fClone = null;
      if (featureDesktopNode) {
        fClone = featureDesktopNode.clone();
      }
      
      let sClone = null;
      if (socialLinksNode) {
        sClone = socialLinksNode.clone();
      }

      const h1 = fClone ? fClone.height : 0;
      const h2 = sClone ? sClone.height : 0;

      if (social_align_desktop === "right") {
        // Feature Left, Social Right
        if (fClone) {
          frame.appendChild(fClone);
          fClone.x = padding;
          fClone.y = bottomY - h1;
          alignFrameContent(fClone, "left");
        }
        if (sClone) {
          frame.appendChild(sClone);
          sClone.x = width - padding - sClone.width;
          sClone.y = bottomY - h2;
          alignFrameContent(sClone, "right");
        }
      } else {
        // social_align_desktop === "left": Feature Right, Social Left
        if (sClone) {
          frame.appendChild(sClone);
          sClone.x = padding;
          sClone.y = bottomY - h2;
          alignFrameContent(sClone, "left");
        }
        if (fClone) {
          frame.appendChild(fClone);
          fClone.x = width - padding - fClone.width;
          fClone.y = bottomY - h1;
          alignFrameContent(fClone, "right");
        }
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
  const footer1920 = createFooter(1920, 75, false);
  const footer1280 = createFooter(1280, 75, false);
  const footer390 = createFooter(390, 180, true);

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
