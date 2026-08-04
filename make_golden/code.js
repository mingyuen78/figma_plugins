figma.showUI(__html__, { width: 300, height: 380 });

function hexToRgb(hex) {
  const r = parseInt(hex.substring(1, 3), 16) / 255;
  const g = parseInt(hex.substring(3, 5), 16) / 255;
  const b = parseInt(hex.substring(5, 7), 16) / 255;
  return { r, g, b };
}

function angleToTransform(angle) {
  const rad = (angle * Math.PI) / 180;
  const cos = Math.cos(rad);
  const sin = Math.sin(rad);
  
  // Figma linear gradient transform maps (0,0) to start and (1,0) to end
  // For CSS angle to Figma transform:
  // Center is (0.5, 0.5)
  return [
    [cos, sin, 0.5 - 0.5 * cos - 0.5 * sin],
    [-sin, cos, 0.5 + 0.5 * sin - 0.5 * cos]
  ];
}

figma.ui.onmessage = msg => {
  if (msg.type === 'create-golden') {
    const rect = figma.createRectangle();
    rect.name = "Golden Texture";
    rect.resize(200, 200);
    
    const colors = ["#bf953f", "#fcf6ba", "#b38728", "#fbf5b7", "#aa771c"];
    const gradientStops = colors.map((hex, index) => ({
      position: index / (colors.length - 1),
      color: { ...hexToRgb(hex), a: 1 }
    }));

    const fills = [{
      type: "GRADIENT_LINEAR",
      gradientTransform: angleToTransform(msg.angle || 0),
      gradientStops: gradientStops
    }];

    rect.fills = fills;

    figma.currentPage.appendChild(rect);
    figma.currentPage.selection = [rect];
    figma.viewport.scrollAndZoomIntoView([rect]);
    
    figma.notify("Golden texture created!");
  }
};
