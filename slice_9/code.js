figma.showUI(__html__, { width: 600, height: 800 });

function uint8ArrayToBase64(uint8Array) {
  let binary = "";
  const len = uint8Array.byteLength;
  for (let i = 0; i < len; i++) {
    binary += String.fromCharCode(uint8Array[i]);
  }
  return figma.base64Encode(uint8Array); // Use Figma's native helper if available, or fallback
}

async function updateSelection() {
  const selection = figma.currentPage.selection;
  if (selection.length > 0) {
    const node = selection[0];
    try {
      const bytes = await node.exportAsync({ format: "PNG", constraint: { type: "SCALE", value: 1 } });
      const base64 = figma.base64Encode(bytes);
      
      let autoOffsets = null;
      if ("children" in node) {
        const sliceObject = node.children.find(c => c.name.toLowerCase() === "slice object");
        if (sliceObject) {
          autoOffsets = {
            t: Math.round(sliceObject.height),
            b: Math.round(sliceObject.height),
            l: Math.round(sliceObject.width),
            r: Math.round(sliceObject.width)
          };
        }
      }

      figma.ui.postMessage({ 
        type: 'selection-change', 
        selected: true, 
        imageData: base64,
        width: node.width,
        height: node.height,
        autoOffsets: autoOffsets
      });
    } catch (e) {
      figma.ui.postMessage({ type: 'selection-change', selected: true });
    }
  } else {
    figma.ui.postMessage({ type: 'selection-change', selected: false });
  }
}

updateSelection();

figma.on("selectionchange", () => {
  updateSelection();
});

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'generate-css') {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("Please select an object first.");
      return;
    }

    const node = selection[0];
    const name = node.name.toLowerCase().replace(/[^a-z0-t0-9]/g, '-');
    const filename = `${name}-9slice.png`;
    
    const { t, r, b, l } = msg;
    
    // Tailwind / CSS border-image syntax
    const css = `/* 9-patch for ${filename} */
.slice-9-${name} {
  border-image-source: url('/assets/images/${filename}');
  border-image-slice: ${t} ${r} ${b} ${l} fill;
  border-width: ${t}px ${r}px ${b}px ${l}px;
  border-style: solid;
}

/* Tailwind utility version */
<div class="border-solid border-[url('/assets/images/${filename}')] [border-image-slice:${t}_${r}_${b}_${l}_fill] border-[${t}px_${r}px_${b}px_${l}px]"></div>`;

    figma.ui.postMessage({ type: 'css-result', css: css });
    figma.notify("CSS Generated!");
  }
};
