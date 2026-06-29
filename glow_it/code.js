figma.showUI(__html__, { width: 240, height: 260 });

figma.ui.onmessage = msg => {
  if (msg.type === 'apply-glow') {
    const selection = figma.currentPage.selection;
    
    if (selection.length === 0) {
      figma.notify("Please select at least one object.");
      return;
    }

    let count = 0;
    const { color: hex, x, y, blur } = msg;

    let r = 1, g = 1, b = 1;
    if (hex.length === 6) {
      r = parseInt(hex.substring(0, 2), 16) / 255;
      g = parseInt(hex.substring(2, 4), 16) / 255;
      b = parseInt(hex.substring(4, 6), 16) / 255;
    }

    selection.forEach(node => {
      if (!("effects" in node)) return;

      const newEffect = {
        type: "DROP_SHADOW",
        color: { r, g, b, a: 1 },
        offset: { x, y },
        radius: blur,
        spread: 0,
        visible: true,
        blendMode: "NORMAL"
      };

      const newEffects = [];
      for (var i = 0; i < node.effects.length; i++) {
        newEffects.push(node.effects[i]);
      }
      newEffects.push(newEffect);
      node.effects = newEffects;
      count++;
    });

    if (count > 0) {
      figma.notify(`Neonized ${count} object(s)!`);
    } else {
      figma.notify("No valid objects selected.");
    }
  }
};
