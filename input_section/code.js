async function run() {
  await figma.loadFontAsync({ family: "Inter", style: "Regular" });
  await figma.loadFontAsync({ family: "Inter", style: "Bold" });

  const section = figma.createSection();
  section.name = "Parameter Here";
  section.fills = [{ type: 'SOLID', color: { r: 0.2, g: 0.2, b: 0.2 } }];
  section.resize(1000, 500);

  const whiteFill = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];

  // Instruction
  const instruction = figma.createText();
  instruction.characters = "Please replace the parameters below before running any plugins e.g. navbar_maker";
  instruction.fontSize = 14;
  instruction.fontName = { family: "Inter", style: "Bold" };
  instruction.fills = whiteFill;
  instruction.resize(960, instruction.height);

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
  logoValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.2 }];
  
  const logoText = figma.createText();
  logoText.characters = "LOGO";
  logoText.fontSize = 12;
  logoText.fontName = { family: "Inter", style: "Bold" };
  logoText.fills = whiteFill;
  logoValue.appendChild(logoText);
  logoText.x = (logoValue.width - logoText.width) / 2;
  logoText.y = (logoValue.height - logoText.height) / 2;

  // 4. Footer Feature (desktop) Placeholder
  const featureDesktopLabel = figma.createText();
  featureDesktopLabel.characters = "Footer Feature (desktop):";
  featureDesktopLabel.fontSize = 12;
  featureDesktopLabel.fontName = { family: "Inter", style: "Bold" };
  featureDesktopLabel.fills = whiteFill;

  const featureDesktopValue = figma.createFrame();
  featureDesktopValue.name = "param_feature_desktop";
  featureDesktopValue.resize(960, 40); 
  featureDesktopValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.2 }];

  const featureDesktopText = figma.createText();
  featureDesktopText.characters = "FOOTER FEATURE (DESKTOP)";
  featureDesktopText.fontSize = 12;
  featureDesktopText.fontName = { family: "Inter", style: "Bold" };
  featureDesktopText.fills = whiteFill;
  featureDesktopValue.appendChild(featureDesktopText);
  featureDesktopText.x = (featureDesktopValue.width - featureDesktopText.width) / 2;
  featureDesktopText.y = (featureDesktopValue.height - featureDesktopText.height) / 2;

  // 5. Footer Feature (mobile) Placeholder
  const featureMobileLabel = figma.createText();
  featureMobileLabel.characters = "Footer Feature (mobile):";
  featureMobileLabel.fontSize = 12;
  featureMobileLabel.fontName = { family: "Inter", style: "Bold" };
  featureMobileLabel.fills = whiteFill;

  const featureMobileValue = figma.createFrame();
  featureMobileValue.name = "param_feature_mobile";
  featureMobileValue.resize(360, 80); 
  featureMobileValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0.2 }];

  const featureMobileText = figma.createText();
  featureMobileText.characters = "FOOTER FEATURE (MOBILE)";
  featureMobileText.fontSize = 12;
  featureMobileText.fontName = { family: "Inter", style: "Bold" };
  featureMobileText.fills = whiteFill;
  featureMobileValue.appendChild(featureMobileText);
  featureMobileText.x = (featureMobileValue.width - featureMobileText.width) / 2;
  featureMobileText.y = (featureMobileValue.height - featureMobileText.height) / 2;

  // 6. Mobile Menu Alignment
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
  section.appendChild(featureDesktopLabel);
  section.appendChild(featureDesktopValue);
  section.appendChild(featureMobileLabel);
  section.appendChild(featureMobileValue);
  section.appendChild(alignLabel);
  section.appendChild(alignValue);

  instruction.x = 20; instruction.y = 40;
  
  colorLabel.x = 20; colorLabel.y = 100;
  colorValue.x = 20; colorValue.y = 120;
  
  linksLabel.x = 20; linksLabel.y = 160;
  linksValue.x = 20; linksValue.y = 180;
  
  logoLabel.x = 20; logoLabel.y = 220;
  logoValue.x = 20; logoValue.y = 240;

  featureDesktopLabel.x = 20; featureDesktopLabel.y = 300;
  featureDesktopValue.x = 20; featureDesktopValue.y = 320;

  featureMobileLabel.x = 20; featureMobileLabel.y = 380;
  featureMobileValue.x = 20; featureMobileValue.y = 400;

  alignLabel.x = 20; alignLabel.y = 500;
  alignValue.x = 20; alignValue.y = 520;

  // 7. Footer Links
  const footerLabel = figma.createText();
  footerLabel.characters = "Footer Links (use | for line break in mobile):";
  footerLabel.fontSize = 12;
  footerLabel.fontName = { family: "Inter", style: "Bold" };
  footerLabel.fills = whiteFill;

  const footerValue = figma.createText();
  footerValue.characters = "TERMS &|CONDITIONS, FAQ, PRIVACY|POLICY, BEERS|YOU LOVE, RESPONSIBLE|DRINKING";
  footerValue.fontSize = 14;
  footerValue.name = "param_footer_links";
  footerValue.fills = whiteFill;

  section.appendChild(footerLabel);
  section.appendChild(footerValue);

  footerLabel.x = 20; footerLabel.y = 580;
  footerValue.x = 20; footerValue.y = 600;

  // 8. Footer Separator
  const sepLabel = figma.createText();
  sepLabel.characters = "Footer Separator:";
  sepLabel.fontSize = 12;
  sepLabel.fontName = { family: "Inter", style: "Bold" };
  sepLabel.fills = whiteFill;

  const sepValue = figma.createFrame();
  sepValue.name = "param_footer_sep";
  sepValue.resize(20, 55);
  sepValue.fills = [{ type: 'SOLID', color: { r: 0, g: 0, b: 0 }, opacity: 0 }];

  const innerSep = figma.createFrame();
  innerSep.resize(2, 25);
  innerSep.fills = [{ type: 'SOLID', color: { r: 1, g: 1, b: 1 } }];
  sepValue.appendChild(innerSep);
  innerSep.x = (sepValue.width - innerSep.width) / 2;
  innerSep.y = (sepValue.height - innerSep.height) / 2;

  section.appendChild(sepLabel);
  section.appendChild(sepValue);

  sepLabel.x = 20; sepLabel.y = 660;
  sepValue.x = 20; sepValue.y = 680;

  section.resize(1000, sepValue.y + sepValue.height + 40);

  figma.viewport.scrollAndZoomIntoView([section]);
  figma.closePlugin();
}

run();
