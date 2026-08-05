figma.showUI(__html__, { width: 320, height: 480 });

function getTextNodesFromSelection() {
  const selection = figma.currentPage.selection;
  let nodes = [];
  
  if (selection.length > 0) {
    function traverse(node) {
      if (node.type === "TEXT") {
        nodes.push(node);
      } else if ("children" in node) {
        for (const child of node.children) {
          traverse(child);
        }
      }
    }
    selection.forEach(traverse);
  }
  return nodes;
}

function updateUI() {
  const textNodes = getTextNodesFromSelection();
  // Group by text content to create a unique mapping list
  const uniqueTexts = new Map();
  
  textNodes.forEach(node => {
    if (!uniqueTexts.has(node.characters)) {
      uniqueTexts.set(node.characters, []);
    }
    uniqueTexts.get(node.characters).push(node.id);
  });

  const data = Array.from(uniqueTexts.entries()).map(([text, ids]) => ({
    text,
    ids,
    newText: text
  }));

  figma.ui.postMessage({ type: 'text-layers-found', data });
}

// Initial update
updateUI();

// Update on selection change
figma.on("selectionchange", updateUI);

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'do-replace') {
    const { mappings } = msg;
    let count = 0;

    for (const mapping of mappings) {
      if (mapping.text === mapping.newText) continue;

      for (const id of mapping.ids) {
        const node = figma.getNodeById(id);
        if (node && node.type === "TEXT") {
          try {
            // Load fonts before changing text
            if (node.fontName === figma.mixed) {
              const segments = node.getStyledTextSegments(['fontName']);
              for (const segment of segments) {
                await figma.loadFontAsync(segment.fontName);
              }
            } else {
              await figma.loadFontAsync(node.fontName);
            }
            
            node.characters = mapping.newText;
            count++;
          } catch (e) {
            console.error("Error updating node:", id, e);
          }
        }
      }
    }

    figma.notify(`Successfully replaced ${count} labels!`);
    // Refresh UI after replacement
    updateUI();
  }
};
