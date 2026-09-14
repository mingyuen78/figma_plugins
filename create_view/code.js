figma.showUI(__html__, { width: 240, height: 280 });

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

  if (msg.type === 'create-decorator') {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("Please select a view first.");
      return;
    }

    const createdDecorators = [];
    for (const node of selection) {
      const width = node.width;
      const height = Math.ceil(node.height / 3);

      const decorator = figma.createFrame();
      decorator.name = "section_decorator";
      decorator.resize(width, height);
      decorator.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

      if ("appendChild" in node && node.type !== "INSTANCE") {
        node.appendChild(decorator);
      } else if (node.parent && "appendChild" in node.parent && node.parent.type !== "INSTANCE") {
        node.parent.appendChild(decorator);
        decorator.x = node.x;
        decorator.y = node.y;
      } else {
        figma.currentPage.appendChild(decorator);
        decorator.x = node.x;
        decorator.y = node.y;
      }

      createdDecorators.push(decorator);
    }

    figma.currentPage.selection = createdDecorators;
    figma.notify("Created section_decorator");
    figma.closePlugin();
  }

  if (msg.type === 'create-feathered-bg') {
    const { width, height } = msg;

    const frame = figma.createFrame();
    frame.resize(width, height);
    frame.name = "feathered_bg";

    frame.fills = [{
      type: 'GRADIENT_LINEAR',
      gradientTransform: [
        [0, 1, 0],
        [-1, 0, 1]
      ],
      gradientStops: [
        {
          position: 0,
          color: { r: 1, g: 1, b: 1, a: 1 }
        },
        {
          position: 1,
          color: { r: 153 / 255, g: 153 / 255, b: 153 / 255, a: 0.5 }
        }
      ]
    }];

    frame.x = figma.viewport.center.x - width / 2;
    frame.y = figma.viewport.center.y - height / 2;

    figma.currentPage.selection = [frame];
    figma.viewport.scrollAndZoomIntoView([frame]);

    figma.notify(`Created ${width}x${height} feathered background`);
     figma.closePlugin();
  }
};
