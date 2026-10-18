import * as THREE from 'three';

// Utility: Create Canvas Texture with crisp settings
function createTextureFromCanvas(canvas) {
  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.wrapS = THREE.RepeatWrapping;
  texture.wrapT = THREE.RepeatWrapping;
  texture.minFilter = THREE.LinearMipmapLinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = true;
  return texture;
}

// 1. London Red Brick Texture (Anime / Toon stylized)
export function createBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Base mortar color (cool grey beige)
  ctx.fillStyle = '#6a6b74';
  ctx.fillRect(0, 0, 512, 512);

  const rows = 16;
  const cols = 8;
  const rowHeight = 512 / rows;
  const colWidth = 512 / cols;
  const mortar = 3;

  const brickTones = ['#a24838', '#b55342', '#8c3b2e', '#9e4334', '#b85a49', '#7f3327'];

  for (let r = 0; r < rows; r++) {
    const isOffset = r % 2 === 1;
    const startX = isOffset ? -colWidth / 2 : 0;
    for (let c = 0; c <= cols + 1; c++) {
      const x = startX + c * colWidth;
      const y = r * rowHeight;
      const color = brickTones[(r * 7 + c * 13) % brickTones.length];
      ctx.fillStyle = color;
      ctx.fillRect(x + mortar, y + mortar, colWidth - mortar * 2, rowHeight - mortar * 2);

      // Subtle anime highlight on top edge of brick
      ctx.fillStyle = 'rgba(255, 230, 210, 0.15)';
      ctx.fillRect(x + mortar, y + mortar, colWidth - mortar * 2, 2);

      // Subtle shadow on bottom edge of brick
      ctx.fillStyle = 'rgba(20, 10, 10, 0.2)';
      ctx.fillRect(x + mortar, y + rowHeight - mortar - 2, colWidth - mortar * 2, 2);
    }
  }

  return createTextureFromCanvas(canvas);
}

// 2. Wet London Pavement / Stone Flagstones
export function createPavementTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#3a3f47';
  ctx.fillRect(0, 0, 512, 512);

  const stoneCols = 8;
  const stoneRows = 8;
  const w = 512 / stoneCols;
  const h = 512 / stoneRows;
  const gap = 3;

  const stoneTones = ['#444a54', '#3e434c', '#4d5460', '#373c44', '#515866'];

  for (let r = 0; r < stoneRows; r++) {
    const offset = (r % 2) * (w / 2);
    for (let c = -1; c <= stoneCols; c++) {
      const x = c * w + offset;
      const y = r * h;
      const tone = stoneTones[(r * 5 + c * 3 + 11) % stoneTones.length];
      ctx.fillStyle = tone;
      ctx.fillRect(x + gap, y + gap, w - gap * 2, h - gap * 2);

      // Wet sheen outline
      ctx.fillStyle = 'rgba(180, 210, 240, 0.18)';
      ctx.fillRect(x + gap, y + gap, w - gap * 2, 2);
      ctx.fillStyle = 'rgba(15, 20, 30, 0.35)';
      ctx.fillRect(x + gap, y + h - gap - 2, w - gap * 2, 2);
    }
  }

  return createTextureFromCanvas(canvas);
}

// 3. Wet Asphalt Road Texture with crosswalk zebra and lane lines
export function createRoadTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Deep dark rainy wet asphalt
  ctx.fillStyle = '#1c2028';
  ctx.fillRect(0, 0, 1024, 1024);

  // Subtle wet noise/glistening grain
  for (let i = 0; i < 4000; i++) {
    const x = Math.random() * 1024;
    const y = Math.random() * 1024;
    const alpha = Math.random() * 0.08;
    ctx.fillStyle = `rgba(200, 225, 255, ${alpha})`;
    ctx.fillRect(x, y, 2, 2);
  }

  // Double Yellow Lines along curb edge (British Road Marking)
  ctx.fillStyle = '#e8b839';
  ctx.fillRect(40, 0, 16, 1024);
  ctx.fillRect(72, 0, 16, 1024);

  // Pedestrian Zebra Crossing stripes across the road
  ctx.fillStyle = '#e6edf5';
  for (let y = 160; y < 860; y += 90) {
    ctx.fillRect(220, y, 320, 50);
  }

  // Cast iron storm drain cover
  ctx.fillStyle = '#121418';
  ctx.fillRect(30, 850, 60, 120);
  ctx.strokeStyle = '#282f3a';
  ctx.lineWidth = 3;
  ctx.strokeRect(30, 850, 60, 120);
  for (let s = 860; s < 960; s += 12) {
    ctx.fillStyle = '#0a0c10';
    ctx.fillRect(35, s, 50, 6);
  }

  return createTextureFromCanvas(canvas);
}

// 4. Cafe Main Fascia Signboard ("THE MONOCLE & BEAN")
export function createSignboardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  // Deep British Racing Green background
  ctx.fillStyle = '#133527';
  ctx.fillRect(0, 0, 1024, 256);

  // Ornate gold border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(16, 16, 992, 224);
  ctx.lineWidth = 2;
  ctx.strokeRect(26, 26, 972, 204);

  // Small corner flourishes
  ctx.fillStyle = '#f3cf58';
  ctx.beginPath();
  ctx.arc(36, 36, 6, 0, Math.PI * 2);
  ctx.arc(988, 36, 6, 0, Math.PI * 2);
  ctx.arc(36, 220, 6, 0, Math.PI * 2);
  ctx.arc(988, 220, 6, 0, Math.PI * 2);
  ctx.fill();

  // Typography: Title
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#f8d968';
  ctx.font = 'bold 58px "Georgia", "Times New Roman", serif';
  ctx.fillText('THE MONOCLE & BEAN', 512, 105);

  // Subtitle
  ctx.fillStyle = '#e2c56a';
  ctx.font = 'italic 26px "Georgia", serif';
  ctx.letterSpacing = '4px';
  ctx.fillText('COFFEE ROASTERS & PATISSERIE • LONDON EST. 1892', 512, 175);

  return createTextureFromCanvas(canvas);
}

// 5. Standing Chalkboard Menu Texture
export function createMenuBoardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Slate blackboard
  ctx.fillStyle = '#1c2226';
  ctx.fillRect(0, 0, 512, 768);

  // Chalk border
  ctx.strokeStyle = '#e0eaec';
  ctx.lineWidth = 3;
  ctx.setLineDash([8, 4]);
  ctx.strokeRect(24, 24, 464, 720);
  ctx.setLineDash([]);

  // Chalk Header
  ctx.textAlign = 'center';
  ctx.fillStyle = '#ffdf78';
  ctx.font = 'bold 44px "Comic Sans MS", "Chalkboard SE", cursive, sans-serif';
  ctx.fillText('TODAY\'S SPECIAL', 256, 80);

  // Little chalk coffee cup icon
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(230, 110, 52, 40, [0, 0, 15, 15]);
  ctx.stroke();
  // Handle
  ctx.beginPath();
  ctx.arc(285, 125, 12, -Math.PI / 2, Math.PI / 2);
  ctx.stroke();
  // Steam lines
  ctx.strokeStyle = '#aae2ff';
  ctx.beginPath();
  ctx.moveTo(242, 102); ctx.quadraticCurveTo(240, 92, 246, 84);
  ctx.moveTo(256, 102); ctx.quadraticCurveTo(254, 92, 260, 84);
  ctx.moveTo(270, 102); ctx.quadraticCurveTo(268, 92, 274, 84);
  ctx.stroke();

  // Menu Items
  ctx.textAlign = 'left';
  ctx.font = '28px "Georgia", serif';
  ctx.fillStyle = '#ffffff';

  const items = [
    { name: 'Flat White', price: '£3.80' },
    { name: 'London Fog Latte', price: '£4.20' },
    { name: 'Pour Over Geisha', price: '£5.00' },
    { name: 'Hot Spiced Apple Cider', price: '£4.00' },
    { name: 'Warm Croissant & Jam', price: '£3.50' },
    { name: 'Earl Grey Tea Cake', price: '£4.50' },
    { name: 'Toasted Banana Bread', price: '£3.80' }
  ];

  let curY = 200;
  items.forEach(it => {
    ctx.fillStyle = '#f0f5f8';
    ctx.fillText(it.name, 50, curY);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#ffdf78';
    ctx.fillText(it.price, 460, curY);
    ctx.textAlign = 'left';

    // Dotted separator line
    ctx.strokeStyle = 'rgba(255, 255, 255, 0.2)';
    ctx.setLineDash([4, 4]);
    ctx.beginPath();
    ctx.moveTo(50, curY + 14);
    ctx.lineTo(460, curY + 14);
    ctx.stroke();
    ctx.setLineDash([]);

    curY += 65;
  });

  // Footer quote
  ctx.textAlign = 'center';
  ctx.fillStyle = '#a6c8e0';
  ctx.font = 'italic 22px "Georgia", serif';
  ctx.fillText('~ Warm drinks for rainy days ~', 256, 680);

  return createTextureFromCanvas(canvas);
}

// 6. London Street Name Enamel Sign ("ST. MARTIN'S LANE WC2")
export function createStreetSignTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 160;
  const ctx = canvas.getContext('2d');

  // White enamel background with worn edges
  ctx.fillStyle = '#e8ecf0';
  ctx.fillRect(0, 0, 512, 160);

  // Black inset border
  ctx.strokeStyle = '#181b20';
  ctx.lineWidth = 6;
  ctx.strokeRect(10, 10, 492, 140);

  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  ctx.fillStyle = '#101418';
  ctx.font = '900 48px "Arial Black", "Impact", sans-serif';
  ctx.fillText("ST. MARTIN'S LANE", 256, 65);

  ctx.fillStyle = '#c8102e'; // Red postal district
  ctx.font = 'bold 36px "Arial", sans-serif';
  ctx.fillText('CITY OF WESTMINSTER  WC2', 256, 115);

  return createTextureFromCanvas(canvas);
}

// 7. Interior Chevron / Parquet Wood Floor
export function createParquetFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#3e2417';
  ctx.fillRect(0, 0, 512, 512);

  const planks = 16;
  const pw = 512 / planks;

  const woodTones = ['#75472d', '#673b22', '#865134', '#59321c', '#7d4d30', '#6e4127'];

  for (let i = 0; i < planks; i++) {
    for (let j = 0; j < 8; j++) {
      const tone = woodTones[(i * 3 + j * 7) % woodTones.length];
      ctx.fillStyle = tone;
      ctx.fillRect(i * pw + 1, j * 64 + 1, pw - 2, 62);

      // Wood grain lines
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(i * pw + 6, j * 64 + 1);
      ctx.lineTo(i * pw + 6, j * 64 + 63);
      ctx.stroke();
    }
  }

  return createTextureFromCanvas(canvas);
}

// 8. Coffee Bean Sack Burlap Texture
export function createBurlapSackTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#c7a36f';
  ctx.fillRect(0, 0, 256, 256);

  // Weave lines
  ctx.strokeStyle = '#ab8551';
  ctx.lineWidth = 2;
  for (let x = 0; x < 256; x += 6) {
    ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, 256); ctx.stroke();
  }
  for (let y = 0; y < 256; y += 6) {
    ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(256, y); ctx.stroke();
  }

  // Stamp
  ctx.fillStyle = '#2c1e13';
  ctx.textAlign = 'center';
  ctx.font = 'bold 24px "Arial Black", sans-serif';
  ctx.fillText('100% ARABICA', 128, 100);
  ctx.font = '16px "Georgia", serif';
  ctx.fillText('ETHIOPIA YIRGACHEFFE', 128, 130);
  ctx.fillText('NET WT. 60 KG', 128, 160);

  return createTextureFromCanvas(canvas);
}

// 9. Framed Vintage Poster Art for Interior Walls
export function createPosterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#213344';
  ctx.fillRect(0, 0, 256, 384);

  // Art deco border
  ctx.strokeStyle = '#e8c878';
  ctx.lineWidth = 4;
  ctx.strokeRect(12, 12, 232, 360);

  // Graphic sun / mountain / coffee
  ctx.fillStyle = '#d96443';
  ctx.beginPath();
  ctx.arc(128, 160, 60, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#f0c760';
  ctx.beginPath();
  ctx.arc(128, 160, 40, 0, Math.PI * 2);
  ctx.fill();

  ctx.fillStyle = '#e8e6d8';
  ctx.textAlign = 'center';
  ctx.font = 'bold 28px "Georgia", serif';
  ctx.fillText('LONDON', 128, 65);
  ctx.font = '16px "Arial", sans-serif';
  ctx.letterSpacing = '2px';
  ctx.fillText('UNDERGROUND', 128, 92);

  ctx.font = 'italic 18px "Georgia", serif';
  ctx.fillStyle = '#e8c878';
  ctx.fillText('Winter in the City', 128, 290);
  ctx.font = 'bold 22px "Georgia", serif';
  ctx.fillStyle = '#ffffff';
  ctx.fillText('WARM REFUGE', 128, 330);

  return createTextureFromCanvas(canvas);
}

// 10. Water Ripple Normal Map for Puddles
export function createRippleTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#8080ff'; // flat normal (0, 0, 1)
  ctx.fillRect(0, 0, 256, 256);

  // Concentric ripple rings
  ctx.lineWidth = 6;
  for (let r = 20; r <= 110; r += 28) {
    const alpha = 1.0 - (r / 120);
    ctx.strokeStyle = `rgba(160, 120, 255, ${alpha * 0.7})`;
    ctx.beginPath();
    ctx.arc(128, 128, r, 0, Math.PI * 2);
    ctx.stroke();
  }

  return createTextureFromCanvas(canvas);
}
