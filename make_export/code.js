figma.showUI(__html__, { width: 400, height: 500 });

figma.ui.onmessage = async (msg) => {
  if (msg.type === 'run-export') {
    const selection = figma.currentPage.selection;
    if (selection.length === 0) {
      figma.notify("Please select a node to export.");
      return;
    }

    let code = "async function createDesign() {\n";
    code += "  // Load fonts first\n";
    
    // Find all fonts used in selection
    const fonts = new Set();
    const findFonts = (node) => {
      if (node.type === "TEXT") {
        fonts.add(JSON.stringify(node.fontName));
      }
      if ("children" in node) {
        for (const child of node.children) findFonts(child);
      }
    };
    selection.forEach(findFonts);
    
    for (const fontStr of fonts) {
      code += `  await figma.loadFontAsync(${fontStr});\n`;
    }
    code += "\n";

    let varCounter = 0;
    const processNode = (node, parentVar = null) => {
      const varName = `node${varCounter++}`;
      let nodeCode = "";

      const serialize = (val) => {
        if (val === figma.mixed) return "undefined /* mixed */";
        return JSON.stringify(val);
      };

      if (node.type === "FRAME" || node.type === "GROUP" || node.type === "COMPONENT" || node.type === "INSTANCE") {
        nodeCode += `  const ${varName} = figma.createFrame();\n`;
        nodeCode += `  ${varName}.name = "${node.name}";\n`;
        if (node.layoutMode && node.layoutMode !== "NONE") {
          nodeCode += `  ${varName}.layoutMode = "${node.layoutMode}";\n`;
          nodeCode += `  ${varName}.itemSpacing = ${node.itemSpacing};\n`;
          nodeCode += `  ${varName}.paddingLeft = ${node.paddingLeft};\n`;
          nodeCode += `  ${varName}.paddingRight = ${node.paddingRight};\n`;
          nodeCode += `  ${varName}.paddingTop = ${node.paddingTop};\n`;
          nodeCode += `  ${varName}.paddingBottom = ${node.paddingBottom};\n`;
          
          // Force FIXED for row3 and cat_final if user requested
          if (node.name === "row3" || node.name === "cat_final") {
            nodeCode += `  ${varName}.primaryAxisSizingMode = "FIXED";\n`;
            nodeCode += `  ${varName}.counterAxisSizingMode = "FIXED";\n`;
          } else {
            nodeCode += `  ${varName}.primaryAxisSizingMode = "${node.primaryAxisSizingMode}";\n`;
            nodeCode += `  ${varName}.counterAxisSizingMode = "${node.counterAxisSizingMode}";\n`;
          }
          
          nodeCode += `  ${varName}.primaryAxisAlignItems = "${node.primaryAxisAlignItems}";\n`;
          nodeCode += `  ${varName}.counterAxisAlignItems = "${node.counterAxisAlignItems}";\n`;
        }
      } else if (node.type === "TEXT") {
        nodeCode += `  const ${varName} = figma.createText();\n`;
        nodeCode += `  ${varName}.name = "${node.name}";\n`;
        nodeCode += `  ${varName}.fontName = ${serialize(node.fontName)};\n`;
        nodeCode += `  ${varName}.characters = ${serialize(node.characters)};\n`;
        nodeCode += `  ${varName}.fontSize = ${serialize(node.fontSize)};\n`;
        if (node.lineHeight) nodeCode += `  ${varName}.lineHeight = ${serialize(node.lineHeight)};\n`;
        if (node.letterSpacing) nodeCode += `  ${varName}.letterSpacing = ${serialize(node.letterSpacing)};\n`;
      } else if (node.type === "RECTANGLE") {
        nodeCode += `  const ${varName} = figma.createRectangle();\n`;
        nodeCode += `  ${varName}.name = "${node.name}";\n`;
      } else if (node.type === "VECTOR") {
        nodeCode += `  const ${varName} = figma.createVector();\n`;
        nodeCode += `  ${varName}.name = "${node.name}";\n`;
        if (node.vectorPaths) nodeCode += `  ${varName}.vectorPaths = ${serialize(node.vectorPaths)};\n`;
      } else {
        nodeCode += `  // Node type ${node.type} not fully supported, creating as frame\n`;
        nodeCode += `  const ${varName} = figma.createFrame();\n`;
        nodeCode += `  ${varName}.name = "${node.name}";\n`;
      }

      // Common properties
      nodeCode += `  ${varName}.resize(${node.width}, ${node.height});\n`;
      if ("visible" in node && node.visible === false) {
        nodeCode += `  ${varName}.visible = false;\n`;
      }
      if ("clipsContent" in node && node.clipsContent === true) {
        nodeCode += `  ${varName}.clipsContent = true;\n`;
      }
      if ("cornerRadius" in node && node.cornerRadius !== figma.mixed && node.cornerRadius !== 0) {
        nodeCode += `  ${varName}.cornerRadius = ${node.cornerRadius};\n`;
      }
      if ("layoutAlign" in node) nodeCode += `  ${varName}.layoutAlign = "${node.layoutAlign}";\n`;
      if ("layoutGrow" in node) {
        // Force layoutGrow for row3/cat_final if needed, otherwise respect original
        if (node.name === "cat_final") {
           nodeCode += `  ${varName}.layoutGrow = 0;\n`;
        } else {
           nodeCode += `  ${varName}.layoutGrow = ${node.layoutGrow};\n`;
        }
      }
      
      // Fills & Opacity
      if (node.name.includes("Field - ")) {
        nodeCode += `  ${varName}.fills = [{ type: "SOLID", visible: true, opacity: 1, blendMode: "NORMAL", color: { r: 1, g: 1, b: 1 } }];\n`;
      } else if ("fills" in node && node.fills !== figma.mixed && Array.isArray(node.fills) && node.fills.length > 0) {
        nodeCode += `  ${varName}.fills = ${serialize(node.fills)};\n`;
      } else if ("fills" in node && node.fills !== figma.mixed && Array.isArray(node.fills) && node.fills.length === 0) {
        nodeCode += `  ${varName}.fills = [];\n`;
      }

      if ("opacity" in node && node.opacity !== 1) {
        nodeCode += `  ${varName}.opacity = ${node.opacity};\n`;
      }

      // Strokes
      if ("strokes" in node && node.strokes !== figma.mixed && Array.isArray(node.strokes) && node.strokes.length > 0) {
        nodeCode += `  ${varName}.strokes = ${serialize(node.strokes)};\n`;
        nodeCode += `  ${varName}.strokeWeight = ${node.strokeWeight};\n`;
        nodeCode += `  ${varName}.strokeAlign = "${node.strokeAlign}";\n`;
      }

      if (parentVar) {
        nodeCode += `  ${parentVar}.appendChild(${varName});\n`;
      } else {
        nodeCode += `  figma.currentPage.appendChild(${varName});\n`;
      }

      nodeCode += "\n";

      if ("children" in node) {
        for (const child of node.children) {
          nodeCode += processNode(child, varName);
        }
      }

      return nodeCode;
    };

    selection.forEach(node => {
      code += processNode(node);
    });

    code += "  figma.notify('Design recreated!');\n";
    code += "}\n";
    code += "createDesign();";

    figma.ui.postMessage({ type: 'export-result', code });
  }
};
