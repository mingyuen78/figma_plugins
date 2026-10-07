const selection = figma.currentPage.selection;

if (selection.length === 0) {
  figma.notify("Select one or more elements to resize.");
  figma.closePlugin();
} else {
  figma.showUI(__html__, { width: 280, height: 190 });

  figma.ui.onmessage = msg => {
    if (msg.type !== "resize-selection") return;

    const width = Number(msg.width);
    const height = Number(msg.height);

    if (!Number.isFinite(width) || !Number.isFinite(height) || width <= 0 || height <= 0) {
      figma.notify("Enter a valid width and height greater than zero.");
      return;
    }

    let resizedCount = 0;

    for (const node of selection) {
      if (typeof node.resize !== "function") continue;

      try {
        node.resize(width, height);
        resizedCount += 1;
      } catch (error) {
        continue;
      }
    }

    figma.notify(`Resized ${resizedCount} of ${selection.length} selected elements to ${width} x ${height}.`);
    figma.closePlugin();
  };
}
