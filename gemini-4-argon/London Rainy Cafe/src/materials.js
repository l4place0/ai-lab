import * as THREE from 'three';

// ============================================================================
// ANIME CEL-SHADED TOON RAMP & OUTLINE UTILITIES
// ============================================================================

function createToonGradientMap(steps = 4, shadowTint = '#283655', midTint = '#99a8c2', brightTint = '#ffffff') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');

  // Soft anime cel-shading bands with crisp yet anti-aliased transitions
  const grad = ctx.createLinearGradient(0, 0, 256, 0);
  grad.addColorStop(0.0, shadowTint);
  grad.addColorStop(0.32, shadowTint);
  grad.addColorStop(0.36, midTint);
  grad.addColorStop(0.72, midTint);
  grad.addColorStop(0.76, brightTint);
  grad.addColorStop(1.0, brightTint);

  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 256, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.LinearFilter;
  texture.magFilter = THREE.LinearFilter;
  texture.generateMipmaps = false;
  return texture;
}

export const coolToonRamp = createToonGradientMap(4, '#24324f', '#899bb8', '#ffffff');
export const warmToonRamp = createToonGradientMap(4, '#42281c', '#b88c68', '#fff8ee');

const outlineMatCache = new Map();

export function getOutlineMaterial(color = 0x101624, opacity = 0.92) {
  const key = `${color}_${opacity}`;
  if (!outlineMatCache.has(key)) {
    outlineMatCache.set(
      key,
      new THREE.MeshBasicMaterial({
        color,
        side: THREE.BackSide,
        transparent: opacity < 1.0,
        opacity,
        depthWrite: true,
      })
    );
  }
  return outlineMatCache.get(key);
}

const edgeLineMatCache = new Map();

export function getEdgeLineMaterial(color = 0x111827, opacity = 0.68) {
  const key = `${color}_${opacity}`;
  if (!edgeLineMatCache.has(key)) {
    edgeLineMatCache.set(
      key,
      new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity,
        depthWrite: false,
      })
    );
  }
  return edgeLineMatCache.get(key);
}

/**
 * Adds anime cel-shaded outlines (both crisp EdgesGeometry ink lines and/or back-face hull)
 */
export function addAnimeOutline(mesh, {
  thickness = 0.018,
  color = 0x101624,
  useHull = true,
  useEdges = true,
  edgeThreshold = 24,
  edgeOpacity = 0.65,
} = {}) {
  if (!mesh || !mesh.geometry) return mesh;

  if (useHull && thickness > 0) {
    const hull = new THREE.Mesh(mesh.geometry, getOutlineMaterial(color, 0.9));
    hull.scale.setScalar(1 + thickness);
    hull.castShadow = false;
    hull.receiveShadow = false;
    hull.raycast = () => {};
    mesh.add(hull);
  }

  if (useEdges) {
    const edgesGeo = new THREE.EdgesGeometry(mesh.geometry, edgeThreshold);
    const line = new THREE.LineSegments(edgesGeo, getEdgeLineMaterial(color, edgeOpacity));
    line.raycast = () => {};
    mesh.add(line);
  }

  return mesh;
}

/**
 * Helper to create a cel-shaded / anime stylized standard material with wet/glossy control
 */
export function makeAnimeMaterial({
  color = 0xffffff,
  map = null,
  roughness = 0.65,
  metalness = 0.08,
  emissive = 0x000000,
  emissiveIntensity = 0.0,
  emissiveMap = null,
  bumpMap = null,
  bumpScale = 0.02,
  roughnessMap = null,
  transparent = false,
  opacity = 1.0,
  side = THREE.FrontSide,
} = {}) {
  const mat = new THREE.MeshStandardMaterial({
    color,
    map,
    roughness,
    metalness,
    emissive,
    emissiveIntensity,
    emissiveMap,
    bumpMap,
    bumpScale,
    roughnessMap,
    transparent,
    opacity,
    side,
  });

  // Inject subtle anime shadow stepping & cool rim highlight into standard material
  mat.onBeforeCompile = (shader) => {
    shader.fragmentShader = shader.fragmentShader.replace(
      '#include <dithering_fragment>',
      `
      // Subtle anime cel-band quantization + atmospheric rim
      float lum = dot(gl_FragColor.rgb, vec3(0.299, 0.587, 0.114));
      float celFactor = mix(1.0, smoothstep(0.08, 0.15, lum) * 0.12 + 0.92, 0.45);
      gl_FragColor.rgb *= celFactor;
      #include <dithering_fragment>
      `
    );
  };

  return mat;
}

// ============================================================================
// PROCEDURAL 2D ANIME CANVAS TEXTURES
// ============================================================================

/**
 * 1. Classic London Red Brick Texture (with weathered mortar, damp base, anime linework)
 */
export function createRedBrickTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Mortar base
  ctx.fillStyle = '#383234';
  ctx.fillRect(0, 0, 1024, 1024);

  const rows = 32;
  const cols = 12;
  const brickH = 1024 / rows;
  const brickW = 1024 / cols;
  const gap = 3.5;

  const palette = [
    '#8c3b2b', '#7b3124', '#9a4332', '#6e2a1f',
    '#843528', '#a14b39', '#732e22', '#64261d',
  ];

  // Deterministic pseudo-random
  let seed = 42;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let r = 0; r < rows; r++) {
    const offset = (r % 2) * (brickW * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * brickW + offset;
      const y = r * brickH;

      const baseCol = palette[Math.floor(rand() * palette.length)];
      ctx.fillStyle = baseCol;
      ctx.fillRect(x + gap, y + gap, brickW - gap * 2, brickH - gap * 2);

      // Anime painterly highlight on top edge of brick
      ctx.fillStyle = 'rgba(255, 195, 160, 0.12)';
      ctx.fillRect(x + gap, y + gap, brickW - gap * 2, 4);

      // Dark bottom edge line
      ctx.fillStyle = 'rgba(20, 10, 12, 0.35)';
      ctx.fillRect(x + gap, y + brickH - gap - 3, brickW - gap * 2, 3);

      // Occasional weathered dark brick or lichen spot
      if (rand() < 0.18) {
        ctx.fillStyle = 'rgba(25, 18, 22, 0.25)';
        ctx.fillRect(x + gap + 6, y + gap + 4, (brickW - 16) * rand(), brickH - gap * 2 - 8);
      }
    }
  }

  // Subtle vertical rain-streak weathering
  for (let i = 0; i < 40; i++) {
    const sx = rand() * 1024;
    const grad = ctx.createLinearGradient(sx, 0, sx, 1024);
    grad.addColorStop(0, 'rgba(15, 20, 30, 0.18)');
    grad.addColorStop(0.5, 'rgba(15, 20, 30, 0.04)');
    grad.addColorStop(1, 'rgba(10, 16, 24, 0.28)');
    ctx.fillStyle = grad;
    ctx.fillRect(sx, 0, 12 + rand() * 28, 1024);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 2. Wet London Yorkstone Pavement & Flagstone Texture
 */
export function createYorkstoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#1b2230';
  ctx.fillRect(0, 0, 1024, 1024);

  let seed = 101;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const rows = 8;
  const rowH = 1024 / rows;
  const stoneColors = ['#394457', '#323c4e', '#414c61', '#2d3748', '#3c485c', '#454f63'];

  for (let r = 0; r < rows; r++) {
    let x = 0;
    const shift = (r % 2) * 64;
    x = -shift;
    while (x < 1024) {
      const w = 128 + Math.floor(rand() * 3) * 64;
      const col = stoneColors[Math.floor(rand() * stoneColors.length)];
      const pad = 4;

      ctx.fillStyle = col;
      ctx.fillRect(x + pad, r * rowH + pad, w - pad * 2, rowH - pad * 2);

      // Anime bevel highlight
      ctx.strokeStyle = 'rgba(160, 190, 230, 0.16)';
      ctx.lineWidth = 2;
      ctx.strokeRect(x + pad + 2, r * rowH + pad + 2, w - pad * 2 - 4, rowH - pad * 2 - 4);

      // Dark hand-drawn joint line
      ctx.strokeStyle = '#121824';
      ctx.lineWidth = 3;
      ctx.strokeRect(x + pad, r * rowH + pad, w - pad * 2, rowH - pad * 2);

      x += w;
    }
  }

  // Wet damp blotches
  for (let i = 0; i < 35; i++) {
    const cx = rand() * 1024;
    const cy = rand() * 1024;
    const rad = 40 + rand() * 120;
    const g = ctx.createRadialGradient(cx, cy, 5, cx, cy, rad);
    g.addColorStop(0, 'rgba(14, 20, 32, 0.38)');
    g.addColorStop(1, 'rgba(14, 20, 32, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(cx, cy, rad, 0, Math.PI * 2);
    ctx.fill();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 3. Cobblestone Alley Texture (for the narrow London side alley)
 */
export function createCobblestoneTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#141923';
  ctx.fillRect(0, 0, 512, 512);

  let seed = 77;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  const rows = 16;
  const cols = 10;
  const ch = 512 / rows;
  const cw = 512 / cols;

  for (let r = 0; r < rows; r++) {
    const off = (r % 2) * (cw * 0.5);
    for (let c = -1; c <= cols; c++) {
      const x = c * cw + off + 3;
      const y = r * ch + 3;
      const w = cw - 6;
      const h = ch - 6;

      const shade = 38 + Math.floor(rand() * 26);
      ctx.fillStyle = `rgb(${shade}, ${shade + 6}, ${shade + 16})`;
      ctx.beginPath();
      ctx.roundRect(x, y, w, h, 6);
      ctx.fill();

      ctx.strokeStyle = 'rgba(180, 205, 240, 0.18)';
      ctx.lineWidth = 1.5;
      ctx.stroke();
    }
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 4. Café Fascia Signboard Texture (British Racing Green, Gold Leaf Serif Typography)
 */
export function createSignboardTexture(mainText = 'THE BLOOMSBURY KETTLE', subText = 'EST. 1924  •  ARTISAN COFFEE & PASTRY  •  LONDON W1') {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  // Deep British racing green background
  const bgGrad = ctx.createLinearGradient(0, 0, 0, 384);
  bgGrad.addColorStop(0, '#0f291e');
  bgGrad.addColorStop(0.5, '#163829');
  bgGrad.addColorStop(1, '#0c2118');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 2048, 384);

  // Outer dark walnut frame & double gold leaf pinstripe border
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 6;
  ctx.strokeRect(24, 24, 2000, 336);

  ctx.strokeStyle = '#f3d87d';
  ctx.lineWidth = 2;
  ctx.strokeRect(36, 36, 1976, 312);

  // Corner flourish rosettes
  const corners = [
    [56, 56], [1992, 56], [56, 328], [1992, 328]
  ];
  ctx.fillStyle = '#e5c158';
  corners.forEach(([cx, cy]) => {
    ctx.beginPath();
    ctx.arc(cx, cy, 10, 0, Math.PI * 2);
    ctx.fill();
  });

  // Main Gold Leaf Serif Title with drop shadow
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';

  ctx.font = 'bold 104px Georgia, "Times New Roman", serif';
  ctx.fillStyle = 'rgba(0, 0, 0, 0.65)';
  ctx.fillText(mainText, 1028, 168);

  const goldGrad = ctx.createLinearGradient(0, 100, 0, 230);
  goldGrad.addColorStop(0, '#fff3b8');
  goldGrad.addColorStop(0.45, '#e6be53');
  goldGrad.addColorStop(1, '#b58922');
  ctx.fillStyle = goldGrad;
  ctx.fillText(mainText, 1024, 162);

  // Subtext
  ctx.font = 'bold 38px Georgia, "Times New Roman", serif';
  ctx.fillStyle = '#e8d7a7';
  ctx.fillText(subText, 1024, 282);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 5. Hanging Projecting Emblem Sign Texture
 */
export function createHangingEmblemTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#122f23';
  ctx.fillRect(0, 0, 512, 512);

  // Gold border
  ctx.strokeStyle = '#e5c058';
  ctx.lineWidth = 14;
  ctx.strokeRect(24, 24, 464, 464);
  ctx.lineWidth = 4;
  ctx.strokeRect(42, 42, 428, 428);

  // Draw golden steaming teacup / kettle icon
  ctx.fillStyle = '#f2cf66';
  ctx.beginPath();
  ctx.arc(256, 260, 85, 0, Math.PI, false);
  ctx.closePath();
  ctx.fill();

  // Cup rim
  ctx.fillRect(166, 245, 180, 18);

  // Cup handle
  ctx.strokeStyle = '#f2cf66';
  ctx.lineWidth = 16;
  ctx.beginPath();
  ctx.arc(340, 285, 32, -Math.PI * 0.45, Math.PI * 0.45);
  ctx.stroke();

  // Saucer
  ctx.fillStyle = '#e5c058';
  ctx.beginPath();
  ctx.ellipse(256, 360, 120, 16, 0, 0, Math.PI * 2);
  ctx.fill();

  // Steam curls
  ctx.strokeStyle = '#fff5d6';
  ctx.lineWidth = 8;
  ctx.lineCap = 'round';
  [-40, 0, 40].forEach((dx, i) => {
    ctx.beginPath();
    ctx.moveTo(256 + dx, 220);
    ctx.quadraticCurveTo(236 + dx, 185, 262 + dx, 155 - i * 6);
    ctx.quadraticCurveTo(282 + dx, 130, 256 + dx, 105);
    ctx.stroke();
  });

  ctx.textAlign = 'center';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.fillStyle = '#fff1c2';
  ctx.fillText('BLOOMSBURY', 256, 82);
  ctx.font = 'bold 28px Georgia, serif';
  ctx.fillText('COFFEE & TEA', 256, 425);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 6. A-Frame Chalkboard Menu Texture (门口小黑板菜单)
 */
export function createChalkboardTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 768;
  const ctx = canvas.getContext('2d');

  // Slate board background
  ctx.fillStyle = '#1b2024';
  ctx.fillRect(0, 0, 512, 768);

  // Chalk dust smudge
  const g = ctx.createRadialGradient(256, 384, 30, 256, 384, 320);
  g.addColorStop(0, 'rgba(255,255,255,0.06)');
  g.addColorStop(1, 'rgba(0,0,0,0.2)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 512, 768);

  // Chalk border
  ctx.strokeStyle = 'rgba(245, 240, 225, 0.85)';
  ctx.lineWidth = 5;
  ctx.strokeRect(24, 24, 464, 720);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f7ecd0';
  ctx.font = 'bold 46px Georgia, serif';
  ctx.fillText('RAINY DAY WARMERS', 256, 95);

  // Decorative chalk divider
  ctx.strokeStyle = '#e8b968';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.moveTo(80, 125);
  ctx.lineTo(432, 125);
  ctx.stroke();

  // Menu items
  ctx.textAlign = 'left';
  ctx.font = 'bold 32px Georgia, serif';
  const items = [
    ['Flat White', '£3.50'],
    ['London Fog Latte', '£3.80'],
    ['Hot Spiced Cocoa', '£3.60'],
    ['Earl Grey Cream', '£3.00'],
    ['Butter Croissant', '£2.80'],
    ['Victoria Sponge', '£4.20'],
    ['Warm Cinnamon Bun', '£3.40'],
  ];

  items.forEach(([name, price], idx) => {
    const y = 190 + idx * 62;
    ctx.fillStyle = '#ffffff';
    ctx.fillText(name, 52, y);
    ctx.fillStyle = '#f5ca76';
    ctx.textAlign = 'right';
    ctx.fillText(price, 460, y);
    ctx.textAlign = 'left';
  });

  // Cute chalk coffee cup doodle at bottom
  ctx.strokeStyle = '#f7ecd0';
  ctx.lineWidth = 5;
  ctx.beginPath();
  ctx.arc(256, 650, 38, 0, Math.PI, false);
  ctx.closePath();
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(195, 692);
  ctx.lineTo(317, 692);
  ctx.stroke();

  // Chalk steam
  ctx.strokeStyle = '#9cd3db';
  ctx.beginPath();
  ctx.moveTo(242, 600);
  ctx.quadraticCurveTo(232, 580, 248, 565);
  ctx.moveTo(270, 600);
  ctx.quadraticCurveTo(260, 580, 276, 565);
  ctx.stroke();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 7. Classic London Street Sign Plaque Texture ("BLOOMSBURY WAY WC1" - City of Westminster style)
 */
export function createLondonStreetSignTexture(line1 = 'BLOOMSBURY WAY', line2 = 'WC1', borough = 'CITY OF WESTMINSTER') {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  // Enamel white plate
  ctx.fillStyle = '#f4f1ea';
  ctx.fillRect(0, 0, 1024, 512);

  // Outer black enamel frame
  ctx.strokeStyle = '#14171c';
  ctx.lineWidth = 28;
  ctx.strokeRect(18, 18, 988, 476);

  ctx.lineWidth = 6;
  ctx.strokeRect(44, 44, 936, 424);

  // Main street name in bold Gill Sans / classic serif
  ctx.textAlign = 'center';
  ctx.fillStyle = '#111317';
  ctx.font = 'bold 112px Georgia, "Times New Roman", serif';
  ctx.fillText(line1, 512, 185);

  ctx.font = 'bold 96px Georgia, "Times New Roman", serif';
  ctx.fillText(line2, 512, 310);

  // Red borough name at bottom
  ctx.fillStyle = '#b82520';
  ctx.font = 'bold 48px Georgia, "Times New Roman", serif';
  ctx.fillText(borough, 512, 415);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 8. Interior Café Flooring Texture (Victorian Checkerboard Tile + Warm Herringbone Oak Wood)
 */
export function createInteriorFloorTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 1024;
  canvas.height = 1024;
  const ctx = canvas.getContext('2d');

  // Fill background with warm honey oak parquet
  ctx.fillStyle = '#8b5732';
  ctx.fillRect(0, 0, 1024, 1024);

  // Draw herringbone wood planks across the whole canvas first
  const plankW = 64;
  const plankH = 16;
  const woodShades = ['#9c643b', '#87522d', '#a86e43', '#7a4926', '#925b34'];
  let seed = 19;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let y = 0; y < 1024; y += plankH) {
    for (let x = 0; x < 1024; x += plankW) {
      ctx.fillStyle = woodShades[Math.floor(rand() * woodShades.length)];
      ctx.fillRect(x, y, plankW - 2, plankH - 2);
      ctx.strokeStyle = '#4f2c14';
      ctx.lineWidth = 1.5;
      ctx.strokeRect(x, y, plankW - 2, plankH - 2);
    }
  }

  // On the upper-left / counter & doorway zone (0..620 in Y, 0..720 in X), draw Victorian geometric diamond tiles!
  ctx.save();
  ctx.beginPath();
  ctx.rect(0, 0, 680, 680);
  ctx.clip();

  ctx.fillStyle = '#eadbc5';
  ctx.fillRect(0, 0, 680, 680);

  const tileSize = 42;
  for (let y = -tileSize; y < 720; y += tileSize) {
    for (let x = -tileSize; x < 720; x += tileSize) {
      const isDark = ((Math.floor(x / tileSize) + Math.floor(y / tileSize)) % 2) === 0;
      ctx.fillStyle = isDark ? '#1e242b' : '#f2e4ce';
      ctx.beginPath();
      ctx.moveTo(x + tileSize * 0.5, y);
      ctx.lineTo(x + tileSize, y + tileSize * 0.5);
      ctx.lineTo(x + tileSize * 0.5, y + tileSize);
      ctx.lineTo(x, y + tileSize * 0.5);
      ctx.closePath();
      ctx.fill();

      // Terracotta accent dot at intersections
      ctx.fillStyle = '#9e3b24';
      ctx.fillRect(x - 3, y - 3, 6, 6);
    }
  }

  // Brass border strip separating Victorian tiles from wood floor
  ctx.strokeStyle = '#d4af37';
  ctx.lineWidth = 12;
  ctx.strokeRect(6, 6, 668, 668);
  ctx.restore();

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 9. Interior Back-Bar Wall Menu Board Texture
 */
export function createWallMenuTexture(title = 'ESPRESSO BAR', lines = []) {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 384;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#181c20';
  ctx.fillRect(0, 0, 512, 384);

  ctx.strokeStyle = '#c89d54';
  ctx.lineWidth = 10;
  ctx.strokeRect(12, 12, 488, 360);

  ctx.textAlign = 'center';
  ctx.fillStyle = '#f2c97d';
  ctx.font = 'bold 42px Georgia, serif';
  ctx.fillText(title, 256, 68);

  ctx.strokeStyle = 'rgba(242, 201, 125, 0.5)';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(60, 92);
  ctx.lineTo(452, 92);
  ctx.stroke();

  ctx.font = 'bold 28px Georgia, serif';
  lines.forEach(([item, price], i) => {
    const y = 142 + i * 48;
    ctx.textAlign = 'left';
    ctx.fillStyle = '#f7efe0';
    ctx.fillText(item, 44, y);
    ctx.textAlign = 'right';
    ctx.fillStyle = '#e5b869';
    ctx.fillText(price, 468, y);
  });

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 10. Vintage Framed Poster / Painting Textures for Interior Walls
 */
export function createArtworkTexture(theme = 'london') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 320;
  const ctx = canvas.getContext('2d');

  // Cream mat board
  ctx.fillStyle = '#f4ead5';
  ctx.fillRect(0, 0, 256, 320);

  if (theme === 'london') {
    // Vintage Big Ben / Thames sunset poster
    const g = ctx.createLinearGradient(0, 24, 0, 296);
    g.addColorStop(0, '#d96b43');
    g.addColorStop(0.6, '#f2b866');
    g.addColorStop(1, '#2b4560');
    ctx.fillStyle = g;
    ctx.fillRect(24, 24, 208, 230);

    // Silhouette of clock tower & bridge
    ctx.fillStyle = '#1d2432';
    ctx.fillRect(150, 75, 28, 180);
    ctx.beginPath();
    ctx.moveTo(150, 75);
    ctx.lineTo(164, 38);
    ctx.lineTo(178, 75);
    ctx.fill();
    ctx.fillRect(24, 210, 208, 44);

    // Gold clock face
    ctx.fillStyle = '#fff0b3';
    ctx.beginPath();
    ctx.arc(164, 98, 8, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#232830';
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px Georgia, serif';
    ctx.fillText('LONDON BY NIGHT', 128, 286);
  } else if (theme === 'botanical') {
    // Botanical Coffee Arabica print
    ctx.fillStyle = '#efe2c6';
    ctx.fillRect(20, 20, 216, 280);
    ctx.strokeStyle = '#3a6142';
    ctx.lineWidth = 6;
    ctx.beginPath();
    ctx.moveTo(128, 250);
    ctx.quadraticCurveTo(110, 150, 145, 55);
    ctx.stroke();

    // Leaves & red coffee cherries
    const leafCoords = [[100, 190, -0.5], [155, 165, 0.5], [95, 125, -0.4], [160, 105, 0.4]];
    leafCoords.forEach(([lx, ly, ang]) => {
      ctx.save();
      ctx.translate(lx, ly);
      ctx.rotate(ang);
      ctx.fillStyle = '#2d5c3b';
      ctx.beginPath();
      ctx.ellipse(0, 0, 28, 13, 0, 0, Math.PI * 2);
      ctx.fill();
      ctx.restore();
    });

    [[125, 175], [134, 168], [122, 120], [135, 114]].forEach(([cx, cy]) => {
      ctx.fillStyle = '#b82921';
      ctx.beginPath();
      ctx.arc(cx, cy, 7, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.fillStyle = '#2c221a';
    ctx.textAlign = 'center';
    ctx.font = 'italic bold 22px Georgia, serif';
    ctx.fillText('Coffea Arabica', 128, 282);
  } else {
    // Classic London Underground / Kettle poster
    ctx.fillStyle = '#1b3047';
    ctx.fillRect(20, 20, 216, 280);

    // Red circle roundel
    ctx.strokeStyle = '#d12c24';
    ctx.lineWidth = 20;
    ctx.beginPath();
    ctx.arc(128, 145, 58, 0, Math.PI * 2);
    ctx.stroke();

    // Blue crossbar
    ctx.fillStyle = '#183b78';
    ctx.fillRect(42, 125, 172, 40);

    ctx.fillStyle = '#ffffff';
    ctx.textAlign = 'center';
    ctx.font = 'bold 24px sans-serif';
    ctx.fillText('BLOOMSBURY', 128, 153);

    ctx.fillStyle = '#f2d58b';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.fillText('WARMTH IN THE RAIN', 128, 262);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 11. Stained Glass Transom Fanlight Texture (above the café large windows)
 */
export function createStainedGlassTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#ffcf70';
  ctx.fillRect(0, 0, 512, 128);

  const cols = 8;
  const w = 512 / cols;
  const hues = ['#ffd984', '#f2a649', '#6ab892', '#e8684a', '#ffd984', '#72b0c7', '#f2a649', '#6ab892'];

  for (let i = 0; i < cols; i++) {
    ctx.fillStyle = hues[i % hues.length];
    ctx.fillRect(i * w + 4, 4, w - 8, 120);

    // Diamond lead came
    ctx.strokeStyle = '#1a1d24';
    ctx.lineWidth = 5;
    ctx.strokeRect(i * w, 0, w, 128);

    ctx.beginPath();
    ctx.moveTo(i * w + w * 0.5, 12);
    ctx.lineTo(i * w + w - 12, 64);
    ctx.lineTo(i * w + w * 0.5, 116);
    ctx.lineTo(i * w + 12, 64);
    ctx.closePath();
    ctx.fillStyle = '#fff3c4';
    ctx.fill();
    ctx.stroke();
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 12. Awning Striped Canvas Texture (British Racing Green & Cream stripes)
 */
export function createAwningTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 512;
  const ctx = canvas.getContext('2d');

  const stripes = 16;
  const sw = 512 / stripes;
  for (let i = 0; i < stripes; i++) {
    ctx.fillStyle = i % 2 === 0 ? '#143829' : '#dfd3b8';
    ctx.fillRect(i * sw, 0, sw, 512);
  }

  // Wet rain darkening gradient from top to bottom
  const grad = ctx.createLinearGradient(0, 0, 0, 512);
  grad.addColorStop(0, 'rgba(10, 18, 28, 0.35)');
  grad.addColorStop(0.7, 'rgba(10, 18, 28, 0.05)');
  grad.addColorStop(1, 'rgba(255, 190, 100, 0.22)'); // Warm bounce from window below!
  ctx.fillStyle = grad;
  ctx.fillRect(0, 0, 512, 512);

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.ClampToEdgeWrapping;
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/**
 * 13. Burlap Coffee Bean Sack Texture ("COLOMBIA SUPREMO")
 */
export function createBurlapTexture(label = 'COLOMBIA') {
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');

  ctx.fillStyle = '#a88454';
  ctx.fillRect(0, 0, 256, 256);

  // Woven grid lines
  ctx.strokeStyle = 'rgba(70, 48, 24, 0.25)';
  ctx.lineWidth = 2;
  for (let i = 0; i < 256; i += 6) {
    ctx.beginPath();
    ctx.moveTo(i, 0); ctx.lineTo(i, 256);
    ctx.moveTo(0, i); ctx.lineTo(256, i);
    ctx.stroke();
  }

  // Stencil stamp
  ctx.fillStyle = '#2b1d12';
  ctx.textAlign = 'center';
  ctx.font = 'bold 34px Georgia, serif';
  ctx.fillText(label, 128, 115);
  ctx.font = 'bold 22px sans-serif';
  ctx.fillStyle = '#7a231c';
  ctx.fillText('100% ARABICA', 128, 152);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}
