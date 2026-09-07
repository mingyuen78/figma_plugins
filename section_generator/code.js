const targetDimensions = [
  { w: 500, h: 900 },
  { w: 1280, h: 550 },
  { w: 1280, h: 585 },
  { w: 1280, h: 665 },
  { w: 1280, h: 695 },
  { w: 1536, h: 695 },
  { w: 1536, h: 730 },
  { w: 1536, h: 826 },
  { w: 1920, h: 1080 },
  { w: 2880, h: 1418 },
  { w: 2880, h: 1367 }
];

const tolerance = 5;
const gap = 120;
const padding = 60;

function createPlaceholders(frame) {
  if (!("appendChild" in frame)) return;

  const is1280 = Math.abs(Math.round(frame.width) - 1280) <= tolerance;
  const is2880 = Math.abs(Math.round(frame.width) - 2880) <= tolerance;
  const headerHeight = is1280 ? 40 : (is2880 ? 60 * 1.5 : 60);
  let header = null;
  if ("children" in frame) {
    header = frame.children.find(c => c.name === "header_zone");
  }
  if (!header) {
    header = figma.createFrame();
    header.name = "header_zone";
    frame.appendChild(header);
  }
  header.resize(frame.width, headerHeight);
  header.x = 0;
  header.y = 0;
  header.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 }, opacity: 0.2 }];

  const footerHeight = is2880 ? 120 * 1.5 : 120;
  let footer = null;
  if ("children" in frame) {
    footer = frame.children.find(c => c.name === "footer_zone");
  }
  if (!footer) {
    footer = figma.createFrame();
    footer.name = "footer_zone";
    frame.appendChild(footer);
  }
  footer.resize(frame.width, footerHeight);
  footer.x = 0;
  footer.y = frame.height - footerHeight;
  footer.fills = [{ type: 'SOLID', color: { r: 1, g: 0, b: 0 }, opacity: 0.2 }];

  const is500 = Math.abs(Math.round(frame.width) - 500) <= tolerance;
  const buttonWidth = is500 ? 240 : (is2880 ? 200 * 1.5 : 200);
  const buttonHeight = is500 ? 50 : (is2880 ? 40 * 1.5 : 40);
  let button = null;
  if ("children" in footer) {
    button = footer.children.find(c => c.name === "button_zone");
  }
  if (!button) {
    button = figma.createFrame();
    button.name = "button_zone";
    footer.appendChild(button);
  }
  button.resize(buttonWidth, buttonHeight);
  button.x = (footer.width - buttonWidth) / 2;
  button.y = (footer.height - buttonHeight) / 2;
  button.fills = [{ type: 'SOLID', color: { r: 0, g: 1, b: 0 }, opacity: 0.2 }];
}

function findClosestDimension(width, height) {
  const roundedW = Math.round(width);
  const roundedH = Math.round(height);
  
  for (const dim of targetDimensions) {
    if (Math.abs(roundedW - dim.w) <= tolerance && Math.abs(roundedH - dim.h) <= tolerance) {
      return dim;
    }
  }
  return null;
}

function getSectionsFromSelection() {
  const sections = new Set();
  for (const node of figma.currentPage.selection) {
    if (node.type === "SECTION") {
      sections.add(node);
    } else {
      let parent = node.parent;
      while (parent && parent.type !== "PAGE" && parent.type !== "DOCUMENT") {
        if (parent.type === "SECTION") {
          sections.add(parent);
          break;
        }
        parent = parent.parent;
      }
    }
  }
  return Array.from(sections);
}

const selectedSections = getSectionsFromSelection();

if (selectedSections.length === 0) {
  figma.notify("Please select a section first.");
  figma.closePlugin();
} else {
  figma.showUI(__html__, { width: 300, height: 150 });

  figma.ui.onmessage = (msg) => {
    if (msg.type === 'cancel') {
      figma.closePlugin();
      return;
    }

    if (msg.type === 'generate' || msg.type === 'rename') {
      const keywords = msg.keywords || [];
      let totalProcessed = 0;
      
      selectedSections.forEach(section => {
        const sectionName = section.name;
        const lastIndex = sectionName.lastIndexOf('_');
        
        let prefix, suffix;
        if (lastIndex !== -1) {
          prefix = sectionName.substring(0, lastIndex);
          suffix = sectionName.substring(lastIndex + 1);
        } else {
          prefix = sectionName;
          suffix = "";
        }

        const matchedChildren = [];
        const foundDimensions = new Set();

        // 1. Rename existing matching children and track which dimensions are found
        section.children.forEach(child => {
          if ("width" in child && "height" in child) {
            const dim = findClosestDimension(child.width, child.height);
            
            if (dim) {
              const dimKey = `${dim.w}x${dim.h}`;
              foundDimensions.add(dimKey);

              // Find if any keyword is in the child name
              let foundKeyword = "";
              for (const kw of keywords) {
                if (child.name.includes(kw)) {
                  foundKeyword = kw;
                  break;
                }
              }

              let newName;
              if (foundKeyword) {
                newName = suffix 
                  ? `${prefix}_${foundKeyword}_${dimKey}_${suffix}`
                  : `${prefix}_${foundKeyword}_${dimKey}`;
              } else {
                newName = suffix 
                  ? `${prefix}_${dimKey}_${suffix}`
                  : `${prefix}_${dimKey}`;
              }
              
              child.name = newName;
              createPlaceholders(child);
              matchedChildren.push(child);
            }
          }
        });

        // 2. Create missing frames for all target dimensions
        targetDimensions.forEach(dim => {
          const dimKey = `${dim.w}x${dim.h}`;
          if (!foundDimensions.has(dimKey)) {
            const newFrame = figma.createFrame();
            newFrame.resize(dim.w, dim.h);
            const newName = suffix 
              ? `${prefix}_${dimKey}_${suffix}`
              : `${prefix}_${dimKey}`;
            newFrame.name = newName;
            createPlaceholders(newFrame);
            section.appendChild(newFrame);
            matchedChildren.push(newFrame);
          }
        });

        totalProcessed += matchedChildren.length;

        // 3. Rearrange items: sort by width then height (smallest range to largest)
        matchedChildren.sort((a, b) => {
          if (a.width !== b.width) return a.width - b.width;
          return a.height - b.height;
        });

        if (matchedChildren.length > 0) {
          const maxWidth = Math.max(...matchedChildren.map(c => c.width));
          let currentY = padding;
          
          matchedChildren.forEach(child => {
            // Align right within the content area, then add padding
            child.x = (maxWidth - child.width) + padding;
            child.y = currentY;
            currentY += child.height + gap;
          });

          // 4. Update layer order: Smallest on top of the layer stack
          for (let i = matchedChildren.length - 1; i >= 0; i--) {
            section.appendChild(matchedChildren[i]);
          }

          // 5. Calculate final section dimensions including padding
          const finalWidth = maxWidth + (padding * 2);
          const finalHeight = (currentY - gap) + padding;
          section.resize(finalWidth, finalHeight);
        }
      });

      if (totalProcessed > 0) {
        figma.notify(`Successfully organized all banner sizes!`);
      }
      
      figma.closePlugin();
    }
  };
}
