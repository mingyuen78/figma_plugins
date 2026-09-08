figma.showUI(__html__, { width: 400, height: 560, themeColors: true });

function updateUI() {
  const selection = figma.currentPage.selection;
  
  if (selection.length === 0) {
    figma.ui.postMessage({
      type: 'selection-updated',
      data: {
        layerCount: 0,
        layers: [],
        commonTokens: [],
        uncommonTokens: []
      }
    });
    return;
  }

  const layers = [];
  const tokenCounts = new Map();
  const tokenLayerSets = new Map();
  const tokenOrder = [];

  selection.forEach(node => {
    const name = node.name;
    const tokens = name.split('_');
    layers.push({
      id: node.id,
      name: name,
      tokens: tokens
    });

    tokens.forEach(token => {
      if (!tokenCounts.has(token)) {
        tokenCounts.set(token, 0);
        tokenLayerSets.set(token, new Set());
        tokenOrder.push(token);
      }
      tokenCounts.set(token, tokenCounts.get(token) + 1);
      tokenLayerSets.get(token).add(node.id);
    });
  });

  const isSingleLayer = selection.length === 1;
  const commonTokens = [];
  const uncommonTokens = [];

  tokenOrder.forEach(token => {
    const totalCount = tokenCounts.get(token);
    const layerCount = tokenLayerSets.get(token).size;
    const item = {
      token: token,
      count: totalCount,
      layerCount: layerCount
    };

    if (isSingleLayer || layerCount >= 2 || totalCount >= 2) {
      commonTokens.push(item);
    } else {
      uncommonTokens.push(item);
    }
  });

  figma.ui.postMessage({
    type: 'selection-updated',
    data: {
      layerCount: selection.length,
      layers: layers,
      commonTokens: commonTokens,
      uncommonTokens: uncommonTokens
    }
  });
}

updateUI();

figma.on("selectionchange", updateUI);

figma.ui.onmessage = (msg) => {
  if (msg.type === 'cancel') {
    figma.closePlugin();
    return;
  }

  if (msg.type === 'replace') {
    const replacements = msg.replacements || {};
    const selection = figma.currentPage.selection;
    let modifiedCount = 0;

    selection.forEach(node => {
      const tokens = node.name.split('_');
      let changed = false;
      
      const newTokens = [];
      tokens.forEach(token => {
        if (Object.prototype.hasOwnProperty.call(replacements, token)) {
          const newVal = replacements[token];
          if (newVal !== null && newVal !== undefined && newVal !== '') {
            newTokens.push(newVal);
          }
          if (newVal !== token) {
            changed = true;
          }
        } else {
          newTokens.push(token);
        }
      });

      const newName = newTokens.join('_') || node.name;
      if (changed || newName !== node.name) {
        node.name = newName;
        modifiedCount++;
      }
    });

    figma.notify(`Successfully updated ${modifiedCount} layer name(s)!`);
    updateUI();
  }
};
