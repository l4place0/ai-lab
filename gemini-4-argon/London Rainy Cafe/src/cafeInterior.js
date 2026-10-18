import * as THREE from 'three';
import {
  addAnimeOutline,
  makeAnimeMaterial,
  createInteriorFloorTexture,
  createWallMenuTexture,
  createArtworkTexture,
  createBurlapTexture,
} from './materials.js';

export function buildCafeInterior(scene) {
  const group = new THREE.Group();
  group.name = 'CafeInterior';

  // Interior floor sits at Y = 0.24 (just above sidewalk slab at 0.22)
  // Footprint inside walls: X from -7.4 to +2.2, Z from -7.8 to +1.2
  const floorY = 0.24;

  // Shared Materials
  const walnutMat = makeAnimeMaterial({ color: 0x3b2112, roughness: 0.42, metalness: 0.12 });
  const oakMat = makeAnimeMaterial({ color: 0x8c5832, roughness: 0.48, metalness: 0.08 });
  const creamMarbleMat = makeAnimeMaterial({ color: 0xf4ead8, roughness: 0.22, metalness: 0.1 });
  const brassMat = makeAnimeMaterial({ color: 0xe3b94f, roughness: 0.22, metalness: 0.85 });
  const chromeMat = makeAnimeMaterial({ color: 0xdce3ec, roughness: 0.16, metalness: 0.9 });
  const darkGreenMat = makeAnimeMaterial({ color: 0x163b2c, roughness: 0.38, metalness: 0.12 });
  const ceramicWhiteMat = makeAnimeMaterial({ color: 0xfaf6ee, roughness: 0.2, metalness: 0.08 });
  const ceramicTealMat = makeAnimeMaterial({ color: 0x2d7a78, roughness: 0.25, metalness: 0.1 });
  const ceramicTerracottaMat = makeAnimeMaterial({ color: 0xc45a3f, roughness: 0.35, metalness: 0.08 });
  const croissantMat = makeAnimeMaterial({ color: 0xd98a36, roughness: 0.45 });
  const breadCrustMat = makeAnimeMaterial({ color: 0xb56928, roughness: 0.58 });
  const cakeSpongeMat = makeAnimeMaterial({ color: 0xf5d487, roughness: 0.55 });
  const frostingMat = makeAnimeMaterial({ color: 0xfff8f0, roughness: 0.35 });
  const berryMat = makeAnimeMaterial({ color: 0xc92626, roughness: 0.3 });
  const chocoMat = makeAnimeMaterial({ color: 0x361c10, roughness: 0.38 });

  // ==========================================================================
  // 1. PATTERNED VICTORIAN MOSAIC TILE & HERRINGBONE WOOD FLOOR (地面拼花与木地板)
  // ==========================================================================
  const floorTex = createInteriorFloorTexture();
  const floorMat = makeAnimeMaterial({
    map: floorTex,
    roughness: 0.32,
    metalness: 0.1,
  });
  const floorMesh = new THREE.Mesh(new THREE.BoxGeometry(9.6, 0.04, 9.0), floorMat);
  floorMesh.position.set(-2.6, floorY, -3.3);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // ==========================================================================
  // 2. WOODEN BAR COUNTER (木质吧台 — L-Shaped Centerpiece)
  // ==========================================================================
  // Main Front Counter running East-West: X from -5.4 to -0.4 (len 5.0), Z = -3.2 (depth 0.95)
  const counterGroup = new THREE.Group();
  counterGroup.position.set(0, floorY, 0);

  const mainCounterBody = new THREE.Mesh(new THREE.BoxGeometry(5.0, 1.05, 0.92), walnutMat);
  mainCounterBody.position.set(-2.9, 0.525, -3.2);
  mainCounterBody.castShadow = true;
  mainCounterBody.receiveShadow = true;
  addAnimeOutline(mainCounterBody, { useHull: false, useEdges: true, color: 0x170b04 });
  counterGroup.add(mainCounterBody);

  // Decorative recessed British-green & brass front panels on the counter
  for (let i = 0; i < 5; i++) {
    const px = -4.9 + i * 1.0;
    const inset = new THREE.Mesh(new THREE.BoxGeometry(0.82, 0.72, 0.04), darkGreenMat);
    inset.position.set(px, 0.525, -2.73);
    addAnimeOutline(inset, { useHull: false, useEdges: true, color: 0xd4af37, edgeOpacity: 0.85 });
    counterGroup.add(inset);
  }

  // Cream Marble & Oak Countertop Overhang
  const mainCounterTop = new THREE.Mesh(new THREE.BoxGeometry(5.18, 0.08, 1.06), creamMarbleMat);
  mainCounterTop.position.set(-2.9, 1.08, -3.2);
  addAnimeOutline(mainCounterTop, { useHull: false, useEdges: true, color: 0x26170c });
  counterGroup.add(mainCounterTop);

  // Side Return Counter running North-South (X = -0.65, Z from -6.2 to -3.6)
  const sideCounterBody = new THREE.Mesh(new THREE.BoxGeometry(0.88, 1.05, 2.7), walnutMat);
  sideCounterBody.position.set(-0.65, 0.525, -4.95);
  sideCounterBody.castShadow = true;
  addAnimeOutline(sideCounterBody, { useHull: false, useEdges: true, color: 0x170b04 });
  counterGroup.add(sideCounterBody);

  const sideCounterTop = new THREE.Mesh(new THREE.BoxGeometry(1.0, 0.08, 2.8), oakMat);
  sideCounterTop.position.set(-0.65, 1.08, -4.95);
  addAnimeOutline(sideCounterTop, { useHull: false, useEdges: true, color: 0x26170c });
  counterGroup.add(sideCounterTop);

  // Brass Footrail along the front & side of the Bar Counter
  const footRailFront = new THREE.Mesh(new THREE.CylinderGeometry(0.024, 0.024, 4.9, 10), brassMat);
  footRailFront.rotation.z = Math.PI / 2;
  footRailFront.position.set(-2.9, 0.16, -2.58);
  counterGroup.add(footRailFront);

  // ==========================================================================
  // 3. ESPRESSO MACHINE & COFFEE GRINDERS (咖啡机与磨豆机)
  // ==========================================================================
  // Placed at X = -4.2, Y = 1.12, Z = -3.2 (with steam emitter point exported!)
  const espressoGroup = new THREE.Group();
  espressoGroup.position.set(-4.2, 1.12, -3.2);

  // Main Chrome & Brass Vintage Italian Espresso Body
  const machineBase = new THREE.Mesh(new THREE.BoxGeometry(0.92, 0.54, 0.56), chromeMat);
  machineBase.position.y = 0.27;
  addAnimeOutline(machineBase, { useHull: false, useEdges: true, color: 0x18202c });
  espressoGroup.add(machineBase);

  const brassArch = new THREE.Mesh(new THREE.BoxGeometry(0.96, 0.12, 0.6), brassMat);
  brassArch.position.y = 0.56;
  addAnimeOutline(brassArch, { useHull: false, useEdges: true, color: 0x261906 });
  espressoGroup.add(brassArch);

  // Two Group Heads & Portafilter Handles facing South (+Z so visible through South window!)
  [-0.22, 0.22].forEach((gx) => {
    const groupHead = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.06, 0.12, 10), brassMat);
    groupHead.position.set(gx, 0.32, 0.3);
    espressoGroup.add(groupHead);

    const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.024, 0.24, 8), walnutMat);
    handle.rotation.x = Math.PI / 2;
    handle.position.set(gx, 0.29, 0.42);
    espressoGroup.add(handle);
  });

  // Stacked white ceramic espresso cups on the machine's cup warmer tray
  for (let cx = -0.3; cx <= 0.3; cx += 0.2) {
    for (let s = 0; s < 2; s++) {
      const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.07, 10), ceramicWhiteMat);
      cup.position.set(cx, 0.66 + s * 0.07, 0);
      addAnimeOutline(cup, { thickness: 0.025, color: 0x241a12, useEdges: false });
      espressoGroup.add(cup);
    }
  }

  // Two Burr Coffee Grinders next to the Espresso Machine
  [-0.72, -1.02].forEach((gx) => {
    const gBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.13, 0.32, 12), darkGreenMat);
    gBase.position.set(gx, 0.16, 0);
    addAnimeOutline(gBase, { thickness: 0.02, color: 0x0a1c14 });
    espressoGroup.add(gBase);

    const hopper = new THREE.Mesh(
      new THREE.CylinderGeometry(0.12, 0.06, 0.26, 12),
      new THREE.MeshPhysicalMaterial({ color: 0xffeacc, transparent: true, opacity: 0.55, roughness: 0.1 })
    );
    hopper.position.set(gx, 0.45, 0);
    espressoGroup.add(hopper);

    const beans = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.05, 0.16, 10), chocoMat);
    beans.position.set(gx, 0.41, 0);
    espressoGroup.add(beans);
  });

  counterGroup.add(espressoGroup);

  // ==========================================================================
  // 4. PASTRY DISPLAY CASE WITH CAKES & CROISSANTS (甜点展示柜、蛋糕与可颂)
  // ==========================================================================
  // Placed at X = -2.2, Y = 1.12, Z = -3.15
  const pastryCase = new THREE.Group();
  pastryCase.position.set(-2.2, 1.12, -3.15);

  const caseBase = new THREE.Mesh(new THREE.BoxGeometry(1.45, 0.16, 0.76), walnutMat);
  caseBase.position.y = 0.08;
  addAnimeOutline(caseBase, { useHull: false, useEdges: true, color: 0x1a0c04 });
  pastryCase.add(caseBase);

  // Brass & Glass Display Enclosure
  const caseGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff5e0,
    transparent: true,
    opacity: 0.24,
    roughness: 0.08,
    depthWrite: false,
  });
  const caseEnclosure = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.68, 0.72), caseGlassMat);
  caseEnclosure.position.y = 0.5;
  addAnimeOutline(caseEnclosure, { useHull: false, useEdges: true, color: 0xd4af37, edgeOpacity: 0.9 });
  pastryCase.add(caseEnclosure);

  // Internal warm LED glow inside Pastry Case
  const caseLight = new THREE.PointLight(0xffc966, 1.4, 3.0, 2.0);
  caseLight.position.set(0, 0.72, 0);
  pastryCase.add(caseLight);

  // Two interior glass shelves
  [0.34, 0.58].forEach((sy) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.34, 0.025, 0.62), creamMarbleMat);
    shelf.position.y = sy;
    pastryCase.add(shelf);
  });

  // Croissants (可颂) on bottom & middle trays
  for (let i = 0; i < 4; i++) {
    const cMesh = new THREE.Mesh(new THREE.TorusGeometry(0.075, 0.036, 8, 12, Math.PI * 1.35), croissantMat);
    cMesh.rotation.x = Math.PI / 2;
    cMesh.rotation.z = 0.3;
    cMesh.position.set(-0.48 + i * 0.16, 0.2, 0.12);
    addAnimeOutline(cMesh, { thickness: 0.03, color: 0x3b1f08, useEdges: false });
    pastryCase.add(cMesh);
  }

  // Whole Strawberry Shortcake & Victoria Sponge Cake (蛋糕) on middle & top shelves
  const cakePositions = [
    { x: 0.28, y: 0.24, z: 0.05, mainMat: frostingMat, topMat: berryMat },
    { x: -0.32, y: 0.44, z: 0.0, mainMat: cakeSpongeMat, topMat: frostingMat },
    { x: 0.25, y: 0.44, z: 0.0, mainMat: chocoMat, topMat: berryMat },
    { x: -0.1, y: 0.66, z: 0.0, mainMat: frostingMat, topMat: berryMat },
  ];
  cakePositions.forEach(({ x, y, z, mainMat, topMat }) => {
    const cakeStand = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.14, 0.03, 14), ceramicWhiteMat);
    cakeStand.position.set(x, y - 0.04, z);
    pastryCase.add(cakeStand);

    const cakeBody = new THREE.Mesh(new THREE.CylinderGeometry(0.15, 0.15, 0.12, 14), mainMat);
    cakeBody.position.set(x, y + 0.03, z);
    addAnimeOutline(cakeBody, { thickness: 0.025, color: 0x2b160c, useEdges: false });
    pastryCase.add(cakeBody);

    for (let b = 0; b < 5; b++) {
      const ang = (b / 5) * Math.PI * 2;
      const berry = new THREE.Mesh(new THREE.SphereGeometry(0.028, 8, 8), topMat);
      berry.position.set(x + Math.cos(ang) * 0.09, y + 0.1, z + Math.sin(ang) * 0.09);
      pastryCase.add(berry);
    }
  });

  counterGroup.add(pastryCase);

  // ==========================================================================
  // 5. ORDER & CASHIER AREA (点单收银区)
  // ==========================================================================
  // Placed at the corner of the counter (X = -0.85, Y = 1.12, Z = -3.15)
  const cashierGroup = new THREE.Group();
  cashierGroup.position.set(-0.85, 1.12, -3.15);

  const registerBase = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.14, 0.38), brassMat);
  registerBase.position.y = 0.07;
  addAnimeOutline(registerBase, { useHull: false, useEdges: true, color: 0x261904 });
  cashierGroup.add(registerBase);

  const registerBody = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.26), brassMat);
  registerBody.position.set(0, 0.26, -0.04);
  addAnimeOutline(registerBody, { useHull: false, useEdges: true, color: 0x261904 });
  cashierGroup.add(registerBody);

  // Little counter bell & tip jar
  const bell = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 8, 0, Math.PI * 2, 0, Math.PI * 0.6), brassMat);
  bell.position.set(-0.34, 0.04, 0.12);
  cashierGroup.add(bell);

  counterGroup.add(cashierGroup);
  group.add(counterGroup);

  // ==========================================================================
  // 6. BACK-BAR SHELVES, WALL MENU BOARDS, MUGS & GLASSWARE (菜单板、玻璃杯与马克杯)
  // ==========================================================================
  // Along the North Interior Wall (Z = -7.45, X from -5.6 to -0.6)
  const backBarCredenza = new THREE.Mesh(new THREE.BoxGeometry(5.2, 0.98, 0.68), walnutMat);
  backBarCredenza.position.set(-3.0, floorY + 0.49, -7.42);
  addAnimeOutline(backBarCredenza, { useHull: false, useEdges: true, color: 0x170b04 });
  group.add(backBarCredenza);

  const backBarTop = new THREE.Mesh(new THREE.BoxGeometry(5.32, 0.07, 0.76), creamMarbleMat);
  backBarTop.position.set(-3.0, floorY + 1.01, -7.42);
  addAnimeOutline(backBarTop, { useHull: false, useEdges: true, color: 0x26170c });
  group.add(backBarTop);

  // Two Floating Wooden Shelves holding Mugs, Glass Carafes & Syrup Bottles
  [1.75, 2.35].forEach((sy, sIdx) => {
    const shelf = new THREE.Mesh(new THREE.BoxGeometry(4.8, 0.06, 0.38), oakMat);
    shelf.position.set(-3.0, floorY + sy, -7.62);
    addAnimeOutline(shelf, { useHull: false, useEdges: true, color: 0x241409 });
    group.add(shelf);

    // Populate with rows of colorful ceramic mugs & glass carafes
    const mugMaterials = [ceramicWhiteMat, ceramicTealMat, ceramicTerracottaMat, brassMat];
    for (let mx = -5.1; mx <= -0.9; mx += 0.28) {
      const mMat = mugMaterials[Math.abs(Math.round(mx * 10) + sIdx) % mugMaterials.length];
      const mug = new THREE.Mesh(new THREE.CylinderGeometry(0.065, 0.058, 0.14, 10), mMat);
      mug.position.set(mx, floorY + sy + 0.1, -7.6);
      addAnimeOutline(mug, { thickness: 0.025, color: 0x1a120b, useEdges: false });
      group.add(mug);
    }
  });

  // Three Framed Menu Boards (菜单板) hanging at Y = 3.35 on the North Wall (Z = -7.76)
  const menuConfigs = [
    {
      x: -4.65,
      title: 'ESPRESSO BAR',
      lines: [
        ['Espresso / Macchiato', '£2.80'],
        ['Flat White', '£3.50'],
        ['Cappuccino / Latte', '£3.60'],
        ['Mocha Valencia', '£4.00'],
      ],
    },
    {
      x: -3.0,
      title: 'LONDON TEAS',
      lines: [
        ['Earl Grey Imperial', '£3.20'],
        ['English Breakfast', '£3.00'],
        ['London Fog', '£3.80'],
        ['Chamomile Honey', '£3.30'],
      ],
    },
    {
      x: -1.35,
      title: 'FRESH BAKERY',
      lines: [
        ['Butter Croissant', '£2.80'],
        ['Victoria Sponge', '£4.20'],
        ['Scone & Clotted Cream', '£4.50'],
        ['Cinnamon Brioche', '£3.50'],
      ],
    },
  ];

  menuConfigs.forEach(({ x, title, lines }) => {
    const mTex = createWallMenuTexture(title, lines);
    const mMat = new THREE.MeshStandardMaterial({
      map: mTex,
      emissiveMap: mTex,
      emissive: 0xffd184,
      emissiveIntensity: 0.38,
      roughness: 0.4,
    });
    const board = new THREE.Mesh(new THREE.BoxGeometry(1.42, 1.02, 0.06), mMat);
    board.position.set(x, floorY + 3.12, -7.76);
    addAnimeOutline(board, { useHull: false, useEdges: true, color: 0xd4af37 });
    group.add(board);
  });

  // ==========================================================================
  // 7. BREAD DISPLAY RACK & COFFEE BEAN SACKS (面包陈列与咖啡豆袋)
  // ==========================================================================
  // Artisan Bread Display Rack at X = -6.75, Z = -4.2 (Visible through both East & South windows!)
  const breadRack = new THREE.Group();
  breadRack.position.set(-6.75, floorY, -4.2);

  const rackFrame = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.65, 1.65), oakMat);
  rackFrame.position.y = 0.825;
  addAnimeOutline(rackFrame, { useHull: false, useEdges: true, color: 0x241308 });
  breadRack.add(rackFrame);

  // Loaves of artisan sourdough, baguettes, and brioche on 3 slanted wicker tiers
  [0.45, 0.95, 1.45].forEach((ty) => {
    for (let bz = -0.55; bz <= 0.55; bz += 0.36) {
      const loaf = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 10), breadCrustMat);
      loaf.scale.set(1.2, 0.75, 0.95);
      loaf.position.set(0.15, ty + 0.12, bz);
      addAnimeOutline(loaf, { thickness: 0.025, color: 0x2b1608, useEdges: false });
      breadRack.add(loaf);
    }
  });
  group.add(breadRack);

  // Burlap Coffee Bean Sacks (咖啡豆袋) at X = -6.5, Z = -2.1
  const sackLabels = ['COLOMBIA', 'ETHIOPIA', 'KENYA AA'];
  const sackCoords = [
    { x: -6.65, y: floorY + 0.32, z: -2.15, rotY: 0.25, rotZ: 0.08 },
    { x: -6.15, y: floorY + 0.3, z: -2.05, rotY: -0.3, rotZ: -0.06 },
    { x: -6.42, y: floorY + 0.62, z: -2.25, rotY: 0.1, rotZ: 0.15 },
  ];
  sackCoords.forEach((sc, idx) => {
    const bTex = createBurlapTexture(sackLabels[idx]);
    const bMat = makeAnimeMaterial({ map: bTex, roughness: 0.85 });
    const sackGeo = new THREE.SphereGeometry(0.34, 14, 12);
    sackGeo.scale(0.88, 1.15, 0.72);
    const sack = new THREE.Mesh(sackGeo, bMat);
    sack.position.set(sc.x, sc.y, sc.z);
    sack.rotation.set(0.1, sc.rotY, sc.rotZ);
    sack.castShadow = true;
    addAnimeOutline(sack, { thickness: 0.025, color: 0x26180a, useEdges: false });
    group.add(sack);
  });

  // ==========================================================================
  // 8. COZY WINDOW-SIDE TABLES, CHAIRS, LAMPS, CUPS & BOOKS (靠窗小桌)
  // ==========================================================================
  // Placed right inside the huge South & East plate glass windows so every table shines!
  const windowTableLocations = [
    { x: -5.6, z: 0.18, hasBook: true, hasCake: true },   // South window left
    { x: -3.3, z: 0.18, hasBook: false, hasCake: true },  // South window center
    { x: -1.0, z: 0.18, hasBook: true, hasCake: false },  // South window right
    { x: 1.18, z: -2.15, hasBook: true, hasCake: true },  // East window front
    { x: 1.18, z: -4.45, hasBook: false, hasCake: true }, // East window middle
    { x: 1.18, z: -6.55, hasBook: true, hasCake: false }, // East window back
  ];

  const steamCupPositions = [];

  windowTableLocations.forEach(({ x, z, hasBook, hasCake }, idx) => {
    const tGroup = new THREE.Group();
    tGroup.position.set(x, floorY, z);

    // Cast-iron & brass pedestal base
    const baseDisc = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.32, 0.05, 16), walnutMat);
    baseDisc.position.y = 0.025;
    tGroup.add(baseDisc);

    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.055, 0.72, 12), brassMat);
    post.position.y = 0.38;
    tGroup.add(post);

    // Round Walnut & Brass Rim Tabletop
    const top = new THREE.Mesh(new THREE.CylinderGeometry(0.54, 0.54, 0.055, 22), oakMat);
    top.position.y = 0.75;
    top.castShadow = true;
    top.receiveShadow = true;
    addAnimeOutline(top, { thickness: 0.02, color: 0x1f1006 });
    tGroup.add(top);

    // Small Glowing Brass Table Lamp on each window table!
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.08, 0.14, 10), brassMat);
    lampBase.position.set(0, 0.84, 0);
    tGroup.add(lampBase);

    const shadeMat = new THREE.MeshStandardMaterial({
      color: 0xffe6a3,
      emissive: 0xffa62b,
      emissiveIntensity: 1.85,
      roughness: 0.3,
    });
    const lampShade = new THREE.Mesh(new THREE.ConeGeometry(0.15, 0.16, 14), shadeMat);
    lampShade.position.set(0, 0.98, 0);
    addAnimeOutline(lampShade, { thickness: 0.025, color: 0x3b2006, useEdges: false });
    tGroup.add(lampShade);

    // Ceramic Coffee Cup & Saucer (with steaming latte!)
    const saucer = new THREE.Mesh(new THREE.CylinderGeometry(0.095, 0.07, 0.018, 12), ceramicWhiteMat);
    saucer.position.set(-0.22, 0.785, 0.15);
    tGroup.add(saucer);

    const cup = new THREE.Mesh(
      new THREE.CylinderGeometry(0.062, 0.05, 0.085, 12),
      idx % 2 === 0 ? ceramicTealMat : ceramicWhiteMat
    );
    cup.position.set(-0.22, 0.825, 0.15);
    addAnimeOutline(cup, { thickness: 0.025, color: 0x1a120a, useEdges: false });
    tGroup.add(cup);

    steamCupPositions.push(new THREE.Vector3(x - 0.22, floorY + 0.88, z + 0.15));

    // Plate with a Golden Croissant or Slice of Cake
    if (hasCake) {
      const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.1, 0.018, 14), ceramicWhiteMat);
      plate.position.set(0.22, 0.785, 0.16);
      tGroup.add(plate);

      const pastry = new THREE.Mesh(new THREE.TorusGeometry(0.065, 0.03, 8, 12, Math.PI * 1.3), croissantMat);
      pastry.rotation.x = Math.PI / 2;
      pastry.position.set(0.22, 0.81, 0.16);
      addAnimeOutline(pastry, { thickness: 0.025, color: 0x381c06, useEdges: false });
      tGroup.add(pastry);
    }

    // Open Hardcover Book on the Table
    if (hasBook) {
      const bookCover = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.022, 0.18), darkGreenMat);
      bookCover.position.set(0.04, 0.788, -0.24);
      bookCover.rotation.y = 0.35;
      tGroup.add(bookCover);

      const pages = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.026, 0.16), ceramicWhiteMat);
      pages.position.set(0.04, 0.795, -0.24);
      pages.rotation.y = 0.35;
      addAnimeOutline(pages, { useHull: false, useEdges: true, color: 0x261a10 });
      tGroup.add(pages);
    }

    // Two Bentwood Thonet Café Chairs flanking the Table
    const isEastSide = x > 0;
    const chairOffsets = isEastSide
      ? [
          { dx: 0, dz: -0.68, rotY: 0 },
          { dx: 0, dz: 0.68, rotY: Math.PI },
        ]
      : [
          { dx: -0.68, dz: 0, rotY: Math.PI / 2 },
          { dx: 0.68, dz: 0, rotY: -Math.PI / 2 },
        ];

    chairOffsets.forEach(({ dx, dz, rotY }) => {
      const chair = new THREE.Group();
      chair.position.set(dx, 0, dz);
      chair.rotation.y = rotY;

      const seat = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.04, 16), walnutMat);
      seat.position.y = 0.46;
      addAnimeOutline(seat, { thickness: 0.02, color: 0x1a0d05 });
      chair.add(seat);

      [
        [-0.14, -0.14],
        [0.14, -0.14],
        [-0.14, 0.14],
        [0.14, 0.14],
      ].forEach(([lx, lz]) => {
        const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.014, 0.46, 8), walnutMat);
        leg.position.set(lx, 0.23, lz);
        chair.add(leg);
      });

      const backLoop = new THREE.Mesh(new THREE.TorusGeometry(0.2, 0.022, 8, 16, Math.PI), walnutMat);
      backLoop.position.set(0, 0.68, -0.19);
      addAnimeOutline(backLoop, { thickness: 0.02, color: 0x1a0d05, useEdges: false });
      chair.add(backLoop);

      tGroup.add(chair);
    });

    group.add(tGroup);
  });

  // ==========================================================================
  // 9. TALL MAHOGANY BOOKSHELF, FRAMED WALL ART & IN-STORE POSTERS (书架、装饰画、海报)
  // ==========================================================================
  // Tall Bookshelf against the West Wall (X = -7.08, Z = -0.8)
  const bookcase = new THREE.Group();
  bookcase.position.set(-7.08, floorY, -0.8);

  const bcFrame = new THREE.Mesh(new THREE.BoxGeometry(0.52, 2.65, 1.55), walnutMat);
  bcFrame.position.y = 1.325;
  addAnimeOutline(bcFrame, { useHull: false, useEdges: true, color: 0x170b04 });
  bookcase.add(bcFrame);

  const bookColors = [0x9e2b25, 0x1d4d38, 0x264b78, 0xd49b35, 0x6e3562, 0xc45a3f];
  for (let s = 0; s < 5; s++) {
    const sy = 0.35 + s * 0.48;
    for (let b = 0; b < 11; b++) {
      const bz = -0.62 + b * 0.115;
      const bCol = bookColors[(s * 7 + b) % bookColors.length];
      const book = new THREE.Mesh(
        new THREE.BoxGeometry(0.28, 0.32 + (b % 3) * 0.04, 0.095),
        makeAnimeMaterial({ color: bCol, roughness: 0.55 })
      );
      book.position.set(0.14, sy + 0.16, bz);
      addAnimeOutline(book, { useHull: false, useEdges: true, color: 0x140c08 });
      bookcase.add(book);
    }
  }
  group.add(bookcase);

  // Framed Wall Paintings & Vintage London Posters (墙面装饰画与店内海报)
  const artConfigs = [
    { x: -7.38, y: floorY + 2.45, z: -2.7, rotY: Math.PI / 2, theme: 'london', w: 0.95, h: 1.2 },
    { x: -7.38, y: floorY + 2.45, z: -4.2, rotY: Math.PI / 2, theme: 'botanical', w: 0.85, h: 1.1 },
    { x: -7.38, y: floorY + 2.45, z: -5.6, rotY: Math.PI / 2, theme: 'underground', w: 0.95, h: 1.2 },
    { x: 0.65, y: floorY + 2.45, z: -7.76, rotY: 0, theme: 'london', w: 1.05, h: 1.3 },
    { x: 1.75, y: floorY + 2.45, z: -7.76, rotY: 0, theme: 'botanical', w: 0.85, h: 1.1 },
  ];

  artConfigs.forEach(({ x, y, z, rotY, theme, w, h }) => {
    const tex = createArtworkTexture(theme);
    const artMat = new THREE.MeshStandardMaterial({
      map: tex,
      emissiveMap: tex,
      emissive: 0xffe0a3,
      emissiveIntensity: 0.28,
      roughness: 0.45,
    });
    const frame = new THREE.Mesh(new THREE.BoxGeometry(w, h, 0.05), artMat);
    frame.position.set(x, y, z);
    frame.rotation.y = rotY;
    addAnimeOutline(frame, { useHull: false, useEdges: true, color: 0xd4af37 });
    group.add(frame);
  });

  // ==========================================================================
  // 10. BACK KITCHEN DOOR WITH GLOWING PORTHOLE & STORAGE AREA (后厨小门与储物区)
  // ==========================================================================
  // Located at North-West back corner (X = -6.35, Z = -7.76)
  const kitchenDoorGroup = new THREE.Group();
  kitchenDoorGroup.position.set(-6.35, floorY, -7.76);

  const kDoorFrame = new THREE.Mesh(new THREE.BoxGeometry(1.26, 2.45, 0.14), walnutMat);
  kDoorFrame.position.y = 1.225;
  addAnimeOutline(kDoorFrame, { useHull: false, useEdges: true, color: 0x170b04 });
  kitchenDoorGroup.add(kDoorFrame);

  const kDoorPanel = new THREE.Mesh(new THREE.BoxGeometry(1.1, 2.32, 0.1), darkGreenMat);
  kDoorPanel.position.set(0, 1.16, 0.03);
  addAnimeOutline(kDoorPanel, { useHull: false, useEdges: true, color: 0x071710 });
  kitchenDoorGroup.add(kDoorPanel);

  // Brass Porthole Window glowing warmly from the Kitchen behind!
  const portholeRim = new THREE.Mesh(new THREE.TorusGeometry(0.24, 0.035, 10, 20), brassMat);
  portholeRim.position.set(0, 1.65, 0.09);
  kitchenDoorGroup.add(portholeRim);

  const portholeGlass = new THREE.Mesh(
    new THREE.CircleGeometry(0.22, 18),
    new THREE.MeshStandardMaterial({
      color: 0xffe49e,
      emissive: 0xffa834,
      emissiveIntensity: 1.6,
    })
  );
  portholeGlass.position.set(0, 1.65, 0.095);
  kitchenDoorGroup.add(portholeGlass);

  // Brass kickplate & push plate on Kitchen Door
  const kKick = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.25, 0.02), brassMat);
  kKick.position.set(0, 0.16, 0.09);
  kitchenDoorGroup.add(kKick);

  group.add(kitchenDoorGroup);

  // ==========================================================================
  // 11. LUSH CORNER INDOOR PLANTS (角落绿植)
  // ==========================================================================
  const plantCoords = [
    { x: -6.85, z: 0.45, scale: 1.15 },   // South-West Front Window Corner
    { x: 1.55, z: -7.15, scale: 1.1 },    // North-East Back Window Corner
    { x: -0.25, z: -2.25, scale: 0.85 },  // Beside Counter Corner
  ];
  const leafMat = makeAnimeMaterial({ color: 0x246942, roughness: 0.45 });

  plantCoords.forEach(({ x, z, scale }) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(x, floorY, z);
    pGroup.scale.setScalar(scale);

    const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.21, 0.46, 12), ceramicTerracottaMat);
    pot.position.y = 0.23;
    addAnimeOutline(pot, { thickness: 0.025, color: 0x2e120a, useEdges: false });
    pGroup.add(pot);

    for (let l = 0; l < 9; l++) {
      const ang = (l / 9) * Math.PI * 2;
      const leaf = new THREE.Mesh(new THREE.SphereGeometry(0.22, 10, 8), leafMat);
      leaf.scale.set(1.3, 0.35, 0.85);
      leaf.position.set(
        Math.cos(ang) * 0.24,
        0.55 + (l % 3) * 0.22,
        Math.sin(ang) * 0.24
      );
      leaf.rotation.set(0.3, ang, 0.2);
      addAnimeOutline(leaf, { thickness: 0.025, color: 0x0b2616, useEdges: false });
      pGroup.add(leaf);
    }

    group.add(pGroup);
  });

  // ==========================================================================
  // 12. PENDANT LIGHTS, WARM WALL SCONCES & INTERIOR GOLDEN LIGHTING (吊灯与暖色壁灯)
  // ==========================================================================
  const pendantBulbMats = [];
  const pendantCoords = [
    // Over Window Tables (South & East)
    { x: -5.6, z: 0.18, dropY: 2.65 },
    { x: -3.3, z: 0.18, dropY: 2.65 },
    { x: -1.0, z: 0.18, dropY: 2.65 },
    { x: 1.18, z: -2.15, dropY: 2.65 },
    { x: 1.18, z: -4.45, dropY: 2.65 },
    { x: 1.18, z: -6.55, dropY: 2.65 },
    // Over Main Wooden Bar Counter
    { x: -4.2, z: -3.2, dropY: 2.85 },
    { x: -2.5, z: -3.2, dropY: 2.85 },
    { x: -0.9, z: -3.2, dropY: 2.85 },
  ];

  pendantCoords.forEach(({ x, z, dropY }) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(x, 0, z);

    const cordLen = 4.48 - dropY;
    const cord = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, cordLen, 6), walnutMat);
    cord.position.y = dropY + cordLen * 0.5;
    pGroup.add(cord);

    // Vintage Brass & Holophane Glass Shade
    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.24, 0.18, 14), brassMat);
    shade.position.y = dropY + 0.08;
    addAnimeOutline(shade, { thickness: 0.025, color: 0x261704, useEdges: false });
    pGroup.add(shade);

    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfff5cc,
      emissive: 0xffaa33,
      emissiveIntensity: 2.8,
    });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.085, 12, 12), bulbMat);
    bulb.position.y = dropY - 0.02;
    pGroup.add(bulb);
    pendantBulbMats.push(bulbMat);

    group.add(pGroup);
  });

  // Warm Wall Sconces (暖色壁灯) along the Interior Walls
  const sconceCoords = [
    { x: -7.36, y: 2.35, z: -1.8, rotY: Math.PI / 2 },
    { x: -7.36, y: 2.35, z: -4.9, rotY: Math.PI / 2 },
    { x: -5.6, y: 2.35, z: -7.72, rotY: 0 },
    { x: -0.1, y: 2.35, z: -7.72, rotY: 0 },
  ];

  sconceCoords.forEach(({ x, y, z, rotY }) => {
    const sGroup = new THREE.Group();
    sGroup.position.set(x, y, z);
    sGroup.rotation.y = rotY;

    const plate = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.09, 0.03, 12), brassMat);
    plate.rotation.x = Math.PI / 2;
    sGroup.add(plate);

    const globeMat = new THREE.MeshStandardMaterial({
      color: 0xffebad,
      emissive: 0xff9d2e,
      emissiveIntensity: 2.2,
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.09, 10, 10), globeMat);
    globe.position.set(0, 0.08, 0.14);
    addAnimeOutline(globe, { thickness: 0.025, color: 0x291704, useEdges: false });
    sGroup.add(globe);

    group.add(sGroup);
  });

  // ==========================================================================
  // 13. WARM GOLDEN INTERIOR LIGHT SOURCES (Creating the Vivid Warm/Cool Contrast!)
  // ==========================================================================
  const interiorLights = [];

  // Primary warm amber core lights inside the café that spill out through the glass onto the wet sidewalk!
  const lightSpecs = [
    { x: -3.5, y: 2.9, z: -0.6, color: 0xffa838, intensity: 6.5, dist: 12.0 }, // South window lounge
    { x: 0.4, y: 2.9, z: -3.5, color: 0xffa838, intensity: 6.5, dist: 12.0 },  // East window lounge
    { x: -3.2, y: 2.8, z: -4.5, color: 0xffb84d, intensity: 5.5, dist: 10.5 }, // Bar counter & back wall
    { x: 0.8, y: 2.6, z: 0.1, color: 0xffb040, intensity: 4.2, dist: 8.5 },    // Entrance vestibule glow
  ];

  lightSpecs.forEach(({ x, y, z, color, intensity, dist }) => {
    const pt = new THREE.PointLight(color, intensity, dist, 1.65);
    pt.position.set(x, y, z);
    group.add(pt);
    interiorLights.push(pt);
  });

  scene.add(group);

  return {
    group,
    espressoSteamOrigin: new THREE.Vector3(-4.2, floorY + 1.55, -2.92),
    steamCupPositions,
    pendantBulbMats,
    interiorLights,
  };
}
