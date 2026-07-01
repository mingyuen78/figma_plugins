const targetDimensions = [
  { w: 1280, h: 550 },
  { w: 1280, h: 585 },
  { w: 1280, h: 665 },
  { w: 1280, h: 695 },
  { w: 1536, h: 695 },
  { w: 1536, h: 730 },
  { w: 1536, h: 826 },
  { w: 1707, h: 825 },
  { w: 1920, h: 1080 },
  { w: 2880, h: 1418 },
  { w: 2880, h: 1367 }
];

const tolerance = 5;
const gap = 120;
const padding = 60;

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

          const newName = suffix 
            ? `${prefix}_${dimKey}_${suffix}`
            : `${prefix}_${dimKey}`;
          
          child.name = newName;
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
  
  setTimeout(() => figma.closePlugin(), 500);
}
