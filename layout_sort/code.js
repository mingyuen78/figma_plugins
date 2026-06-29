const selection = figma.currentPage.selection;

if (selection.length !== 1) {
  figma.notify("Please select exactly one frame with auto layout.");
  figma.closePlugin();
} else {
  const node = selection[0];
  
  // Check if it's a frame and has auto layout
  if (node.type !== "FRAME" && node.type !== "COMPONENT" && node.type !== "INSTANCE") {
    figma.notify("Selected node must be a Frame, Component, or Instance.");
    figma.closePlugin();
  } else if (node.layoutMode === "NONE") {
    figma.notify("Selected node must have Auto Layout enabled.");
    figma.closePlugin();
  } else {
    // Get all children
    const children = [...node.children];
    
    // Sort children alphabetically by name (case-insensitive)
    children.sort((a, b) => {
      return a.name.toLowerCase().localeCompare(b.name.toLowerCase(), undefined, { numeric: true });
    });
    
    // Reorder children in the layer stack
    // In Figma Auto Layout, index 0 is visually the first (top/left)
    children.forEach((child, index) => {
      node.insertChild(index, child);
    });
    
    figma.notify("Children sorted alphabetically.");
    
    // Brief delay before closing to ensure notification is visible if needed, 
    // although notify() works even after closePlugin() in some cases.
    setTimeout(() => figma.closePlugin(), 100);
  }
}
