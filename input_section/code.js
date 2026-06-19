async function run() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const section = figma.createSection();
  section.name = "Parameter Here";
  section.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  section.resize(450, 500);

  const whiteFill = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  // Instruction
  const instruction = figma.createText();
  instruction.characters = "Please replace the parameters below before running any plugins e.g. navbar_maker";
  instruction.fontSize = 14;
  instruction.fontName = { family: "Inter", style: "Bold" };
  instruction.fills = whiteFill;
  instruction.resize(400, instruction.height);

  // 1. Color Hex Code
  const colorLabel = figma.createText();
  colorLabel.characters = "Base Color:";
  colorLabel.fontSize = 12;
  colorLabel.fontName = { family: "Inter", style: "Bold" };
  colorLabel.fills = whiteFill;
  
  const colorValue = figma.createText();
  colorValue.characters = "#006937";
  colorValue.fontSize = 14;
  colorValue.name = "param_color";
  colorValue.fills = whiteFill;

  // 2. Menu Links
  const linksLabel = figma.createText();
  linksLabel.characters = "Menu Links:";
  linksLabel.fontSize = 12;
  linksLabel.fontName = { family: "Inter", style: "Bold" };
  linksLabel.fills = whiteFill;

  const linksValue = figma.createText();
  linksValue.characters = "Home, Promotions, Events, Check Status, Campaigns";
  linksValue.fontSize = 14;
  linksValue.name = "param_links";
  linksValue.fills = whiteFill;

  // 3. Logo Placeholder
  const logoLabel = figma.createText();
  logoLabel.characters = "Logo:";
  logoLabel.fontSize = 12;
  logoLabel.fontName = { family: "Inter", style: "Bold" };
  logoLabel.fills = whiteFill;

  const logoValue = figma.createFrame();
  logoValue.name = "param_logo";
  logoValue.resize(90, 35);
  logoValue.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];
  
  const logoText = figma.createText();
  logoText.characters = "LOGO";
  logoText.fontSize = 12;
  logoText.fontName = { family: "Inter", style: "Bold" };
  logoText.fills = whiteFill;
  logoValue.appendChild(logoText);
  logoText.x = (logoValue.width - logoText.width) / 2;
  logoText.y = (logoValue.height - logoText.height) / 2;

  // 4. Feature Placeholder
  const featureLabel = figma.createText();
  featureLabel.characters = "Feature:";
  featureLabel.fontSize = 12;
  featureLabel.fontName = { family: "Inter", style: "Bold" };
  featureLabel.fills = whiteFill;

  const featureValue = figma.createFrame();
  featureValue.name = "param_feature";
  featureValue.resize(72, 35); 
  featureValue.fills = [{ type: 'SOLID', color: { r: 0.4, g: 0.4, b: 0.4 } }];

  const featureText = figma.createText();
  featureText.characters = "EN | CH";
  featureText.fontSize = 12;
  featureText.fontName = { family: "Inter", style: "Bold" };
  featureText.fills = whiteFill;
  featureValue.appendChild(featureText);
  featureText.x = (featureValue.width - featureText.width) / 2;
  featureText.y = (featureValue.height - featureText.height) / 2;

  // 5. Mobile Menu Alignment
  const alignLabel = figma.createText();
  alignLabel.characters = "Mobile Menu Alignment (left, center, right):";
  alignLabel.fontSize = 12;
  alignLabel.fontName = { family: "Inter", style: "Bold" };
  alignLabel.fills = whiteFill;

  const alignValue = figma.createText();
  alignValue.characters = "left";
  alignValue.fontSize = 14;
  alignValue.name = "param_align";
  alignValue.fills = whiteFill;

  // Layout inside section
  section.appendChild(instruction);
  section.appendChild(colorLabel);
  section.appendChild(colorValue);
  section.appendChild(linksLabel);
  section.appendChild(linksValue);
  section.appendChild(logoLabel);
  section.appendChild(logoValue);
  section.appendChild(featureLabel);
  section.appendChild(featureValue);
  section.appendChild(alignLabel);
  section.appendChild(alignValue);

  instruction.x = 20; instruction.y = 40;
  
  colorLabel.x = 20; colorLabel.y = 100;
  colorValue.x = 20; colorValue.y = 120;
  
  linksLabel.x = 20; linksLabel.y = 160;
  linksValue.x = 20; linksValue.y = 180;
  
  logoLabel.x = 20; logoLabel.y = 220;
  logoValue.x = 20; logoValue.y = 240;

  featureLabel.x = 20; featureLabel.y = 300;
  featureValue.x = 20; featureValue.y = 320;

  alignLabel.x = 20; alignLabel.y = 380;
  alignValue.x = 20; alignValue.y = 400;

  section.resize(450, alignValue.y + alignValue.height + 40);

  figma.viewport.scrollAndZoomIntoView([section]);
  figma.closePlugin();
}

run();
