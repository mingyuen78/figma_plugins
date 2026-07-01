figma.showUI(__html__, { width: 240, height: 200 });

function hexToRgb(hex) {
  let c = hex.replace(/^#/, '');
  if (c.length === 3) {
    c = c.split('').map(x => x + x).join('');
  }
  const result = /^([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(c);
  return result ? {
    r: parseInt(result[1], 16) / 255,
    g: parseInt(result[2], 16) / 255,
    b: parseInt(result[3], 16) / 255
  } : { r: 1, g: 1, b: 1 };
}

figma.ui.onmessage = msg => {
  if (msg.type === 'create-view') {
    const { width, height, baseColor } = msg;

    // Create the frame
    const frame = figma.createFrame();
    frame.resize(width, height);
    frame.name = `View_${width}x${height}`;
    
    // Set fill to baseColor
    const rgbBase = hexToRgb(baseColor);
    frame.fills = [{ type: 'SOLID', color: rgbBase }];
    
    // Set auto-layout to vertical (tile downwards) with fixed dimensions
    frame.layoutMode = "VERTICAL";
    frame.primaryAxisSizingMode = "FIXED";
    frame.counterAxisSizingMode = "FIXED";
    
    // Center the frame in view
    frame.x = figma.viewport.center.x - width / 2;
    frame.y = figma.viewport.center.y - height / 2;

    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);

    figma.notify(`Created ${width}x${height} view`);
    figma.closePlugin();
  }
};
