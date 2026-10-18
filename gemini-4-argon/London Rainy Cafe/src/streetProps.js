import * as THREE from 'three';
import {
  addAnimeOutline,
  makeAnimeMaterial,
  createChalkboardTexture,
  createLondonStreetSignTexture,
} from './materials.js';

export function buildStreetProps(scene) {
  const group = new THREE.Group();
  group.name = 'StreetProps';

  const walkY = 0.22; // Top of raised Yorkstone sidewalk

  // Shared Materials
  const darkIronMat = makeAnimeMaterial({ color: 0x151a24, roughness: 0.35, metalness: 0.78 });
  const goldMat = makeAnimeMaterial({ color: 0xe3b94b, roughness: 0.25, metalness: 0.85 });
  const chromeMat = makeAnimeMaterial({ color: 0xdce4ee, roughness: 0.15, metalness: 0.9 });
  const walnutMat = makeAnimeMaterial({ color: 0x3b2213, roughness: 0.48, metalness: 0.1 });
  const royalRedMat = makeAnimeMaterial({ color: 0xc4211d, roughness: 0.28, metalness: 0.18 });
  const darkGreenMat = makeAnimeMaterial({ color: 0x133325, roughness: 0.38, metalness: 0.15 });
  const foliageMat = makeAnimeMaterial({ color: 0x1f5938, roughness: 0.52 });

  // ==========================================================================
  // 1. A-FRAME CHALKBOARD MENU BY THE DOOR (门口小黑板菜单)
  // ==========================================================================
  const chalkGroup = new THREE.Group();
  chalkGroup.position.set(2.45, walkY, 1.58);
  chalkGroup.rotation.y = Math.PI / 4 + 0.15;

  const chalkTex = createChalkboardTexture();
  const chalkFaceMat = makeAnimeMaterial({ map: chalkTex, roughness: 0.65 });

  [-1, 1].forEach((side) => {
    const board = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.92, 0.04), walnutMat);
    board.position.set(0, 0.46, side * 0.16);
    board.rotation.x = -side * 0.18;
    board.castShadow = true;
    addAnimeOutline(board, { useHull: false, useEdges: true, color: 0x140a04 });
    chalkGroup.add(board);

    const slate = new THREE.Mesh(new THREE.PlaneGeometry(0.48, 0.72), chalkFaceMat);
    slate.position.set(0, 0.5, side * 0.185);
    slate.rotation.x = -side * 0.18;
    if (side < 0) slate.rotation.y = Math.PI;
    chalkGroup.add(slate);
  });
  group.add(chalkGroup);

  // ==========================================================================
  // 2. FLOWER BOXES WITH HYDRANGEAS & ENGLISH ROSES (花箱)
  // ==========================================================================
  const flowerBoxSpecs = [
    { x: -6.15, z: 1.68, len: 1.85, rotY: 0 },
    { x: -3.62, z: 1.68, len: 1.95, rotY: 0 },
    { x: -1.1, z: 1.68, len: 1.85, rotY: 0 },
    { x: 2.68, z: -2.0, len: 1.8, rotY: Math.PI / 2 },
    { x: 2.68, z: -4.3, len: 1.8, rotY: Math.PI / 2 },
    { x: 2.68, z: -6.5, len: 1.8, rotY: Math.PI / 2 },
  ];
  const flowerPalette = [
    makeAnimeMaterial({ color: 0x5c8be6, roughness: 0.4 }), // Hydrangea blue
    makeAnimeMaterial({ color: 0xd9383a, roughness: 0.4 }), // English rose red
    makeAnimeMaterial({ color: 0xf5e8d3, roughness: 0.4 }), // Cream blossom
    makeAnimeMaterial({ color: 0x9b6be3, roughness: 0.4 }), // Violet
  ];

  flowerBoxSpecs.forEach(({ x, z, len, rotY }, bIdx) => {
    const fbGroup = new THREE.Group();
    fbGroup.position.set(x, walkY, z);
    fbGroup.rotation.y = rotY;

    const trough = new THREE.Mesh(new THREE.BoxGeometry(len, 0.34, 0.36), darkGreenMat);
    trough.position.y = 0.17;
    trough.castShadow = true;
    addAnimeOutline(trough, { useHull: false, useEdges: true, color: 0x07140e });
    fbGroup.add(trough);

    const count = Math.floor(len / 0.24);
    for (let i = 0; i < count; i++) {
      const fx = -len * 0.42 + (i / (count - 1)) * (len * 0.84);
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.16, 10, 8), foliageMat);
      bush.position.set(fx, 0.38, (i % 2) * 0.04 - 0.02);
      addAnimeOutline(bush, { thickness: 0.025, color: 0x091f12, useEdges: false });
      fbGroup.add(bush);

      const bloomMat = flowerPalette[(bIdx + i) % flowerPalette.length];
      const bloom = new THREE.Mesh(new THREE.SphereGeometry(0.075, 8, 8), bloomMat);
      bloom.position.set(fx + 0.03, 0.49, 0.04);
      addAnimeOutline(bloom, { thickness: 0.03, color: 0x1a1018, useEdges: false });
      fbGroup.add(bloom);
    }

    group.add(fbGroup);
  });

  // ==========================================================================
  // 3. OUTDOOR BISTRO ROUND TABLES & FOLDING CHAIRS (户外小圆桌与折叠椅)
  // ==========================================================================
  const outdoorSets = [
    { x: -2.35, z: 2.28, rotY: 0.2 },
    { x: 3.32, z: -3.15, rotY: -0.4 },
  ];
  const creamMetalMat = makeAnimeMaterial({ color: 0xe8dec8, roughness: 0.35, metalness: 0.3 });

  outdoorSets.forEach(({ x, z, rotY }) => {
    const bistro = new THREE.Group();
    bistro.position.set(x, walkY, z);
    bistro.rotation.y = rotY;

    // Round Bistro Table
    const tableTop = new THREE.Mesh(new THREE.CylinderGeometry(0.44, 0.44, 0.035, 20), creamMetalMat);
    tableTop.position.y = 0.72;
    tableTop.castShadow = true;
    addAnimeOutline(tableTop, { thickness: 0.02, color: 0x1a1814 });
    bistro.add(tableTop);

    const stem = new THREE.Mesh(new THREE.CylinderGeometry(0.025, 0.03, 0.7, 10), darkIronMat);
    stem.position.y = 0.35;
    bistro.add(stem);

    const foot = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.28, 0.03, 14), darkIronMat);
    foot.position.y = 0.015;
    bistro.add(foot);

    // Small porcelain saucer & cup left on table under awning
    const cup = new THREE.Mesh(new THREE.CylinderGeometry(0.05, 0.04, 0.07, 10), creamMetalMat);
    cup.position.set(0.1, 0.77, 0.08);
    addAnimeOutline(cup, { thickness: 0.025, color: 0x1a1410, useEdges: false });
    bistro.add(cup);

    // Two Folding Bistro Chairs
    [-0.58, 0.58].forEach((cx, cIdx) => {
      const chair = new THREE.Group();
      chair.position.set(cx, 0, 0.05);
      chair.rotation.y = cIdx === 0 ? Math.PI / 2 - 0.15 : -Math.PI / 2 + 0.15;

      const seat = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.03, 0.34), walnutMat);
      seat.position.y = 0.44;
      addAnimeOutline(seat, { useHull: false, useEdges: true, color: 0x170b04 });
      chair.add(seat);

      // X-frame folding legs
      const leg1 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.54, 0.025), darkIronMat);
      leg1.position.set(0, 0.24, 0);
      leg1.rotation.x = 0.38;
      chair.add(leg1);

      const leg2 = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.86, 0.025), darkIronMat);
      leg2.position.set(0, 0.41, -0.04);
      leg2.rotation.x = -0.28;
      chair.add(leg2);

      // Slatted wooden backrest
      const back = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.16, 0.03), walnutMat);
      back.position.set(0, 0.74, -0.16);
      addAnimeOutline(back, { useHull: false, useEdges: true, color: 0x170b04 });
      chair.add(back);

      bistro.add(chair);
    });

    group.add(bistro);
  });

  // ==========================================================================
  // 4. WROUGHT-IRON RAILINGS WITH GOLD SPEAR FINIALS (铁艺栏杆)
  // ==========================================================================
  function createIronRailing(length, x, z, rotY) {
    const rGroup = new THREE.Group();
    rGroup.position.set(x, walkY, z);
    rGroup.rotation.y = rotY;

    // Top & bottom horizontal rails
    [0.14, 0.88].forEach((ry) => {
      const rail = new THREE.Mesh(new THREE.BoxGeometry(length, 0.035, 0.035), darkIronMat);
      rail.position.y = ry;
      rGroup.add(rail);
    });

    const bars = Math.floor(length / 0.18);
    for (let i = 0; i <= bars; i++) {
      const bx = -length * 0.5 + (i / bars) * length;
      const isPost = i === 0 || i === bars;
      const bar = new THREE.Mesh(
        new THREE.CylinderGeometry(isPost ? 0.035 : 0.015, isPost ? 0.035 : 0.015, 0.96, 8),
        darkIronMat
      );
      bar.position.set(bx, 0.48, 0);
      bar.castShadow = true;
      rGroup.add(bar);

      // Gold Spear Finial on top of each bar
      const finial = new THREE.Mesh(new THREE.ConeGeometry(isPost ? 0.05 : 0.028, 0.1, 6), goldMat);
      finial.position.set(bx, 1.01, 0);
      rGroup.add(finial);
    }

    return rGroup;
  }

  group.add(createIronRailing(2.8, -6.0, 2.38, 0));
  group.add(createIronRailing(2.5, 3.45, -6.5, Math.PI / 2));

  // ==========================================================================
  // 5. VINTAGE BRITISH ROADSTER BICYCLE (自行车 — Leaning against Railing!)
  // ==========================================================================
  const bikeGroup = new THREE.Group();
  bikeGroup.position.set(-4.95, walkY, 2.55);
  bikeGroup.rotation.set(-0.14, 0.12, 0); // Leaning naturally against the iron railing!

  const bikeFrameMat = makeAnimeMaterial({ color: 0x7a1c24, roughness: 0.25, metalness: 0.45 }); // Vintage Burgundy
  const tireMat = makeAnimeMaterial({ color: 0x161920, roughness: 0.7 });
  const leatherMat = makeAnimeMaterial({ color: 0x5c3419, roughness: 0.5 });
  const wickerMat = makeAnimeMaterial({ color: 0xb88b52, roughness: 0.75 });

  // Front & Rear Spoked Wheels
  [-0.52, 0.52].forEach((wx) => {
    const wheel = new THREE.Group();
    wheel.position.set(wx, 0.36, 0);

    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.33, 0.028, 10, 24), tireMat);
    addAnimeOutline(tire, { thickness: 0.02, color: 0x080a0e, useEdges: false });
    wheel.add(tire);

    const rim = new THREE.Mesh(new THREE.TorusGeometry(0.3, 0.012, 8, 24), chromeMat);
    wheel.add(rim);

    // Spokes
    for (let s = 0; s < 6; s++) {
      const spoke = new THREE.Mesh(new THREE.CylinderGeometry(0.004, 0.004, 0.6, 6), chromeMat);
      spoke.rotation.z = (s / 6) * Math.PI;
      wheel.add(spoke);
    }

    // Chrome Mudguard
    const guard = new THREE.Mesh(new THREE.TorusGeometry(0.355, 0.022, 8, 18, Math.PI * 1.1), chromeMat);
    guard.rotation.z = -0.05;
    wheel.add(guard);

    bikeGroup.add(wheel);
  });

  // Diamond Frame Tubes
  const tubeSpecs = [
    { x: -0.15, y: 0.56, len: 0.58, rotZ: -0.65 }, // Down tube
    { x: -0.05, y: 0.76, len: 0.56, rotZ: Math.PI / 2 }, // Top tube
    { x: 0.22, y: 0.58, len: 0.54, rotZ: 0.22 }, // Seat tube
    { x: -0.42, y: 0.58, len: 0.58, rotZ: 0.32 }, // Front fork
  ];
  tubeSpecs.forEach(({ x, y, len, rotZ }) => {
    const tube = new THREE.Mesh(new THREE.CylinderGeometry(0.016, 0.016, len, 8), bikeFrameMat);
    tube.position.set(x, y, 0);
    tube.rotation.z = rotZ;
    bikeGroup.add(tube);
  });

  // Brooks Leather Saddle & Swept Chrome Handlebars
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.06, 0.15), leatherMat);
  saddle.position.set(0.26, 0.88, 0);
  addAnimeOutline(saddle, { useHull: false, useEdges: true, color: 0x1f1006 });
  bikeGroup.add(saddle);

  const handlebar = new THREE.Mesh(new THREE.CylinderGeometry(0.014, 0.014, 0.46, 8), chromeMat);
  handlebar.rotation.x = Math.PI / 2;
  handlebar.position.set(-0.34, 0.96, 0);
  bikeGroup.add(handlebar);

  // Front Wicker Basket with Baguette
  const basket = new THREE.Mesh(new THREE.BoxGeometry(0.22, 0.2, 0.28), wickerMat);
  basket.position.set(-0.48, 0.78, 0);
  addAnimeOutline(basket, { useHull: false, useEdges: true, color: 0x2b1b0a });
  bikeGroup.add(basket);

  group.add(bikeGroup);

  // ==========================================================================
  // 6. STREET-CORNER GUARDRAILS & BOLLARDS (街角护栏)
  // ==========================================================================
  function createPedestrianGuardrail(length, x, z, rotY) {
    const gGroup = new THREE.Group();
    gGroup.position.set(x, walkY, z);
    gGroup.rotation.y = rotY;

    [-length * 0.5, length * 0.5].forEach((px) => {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.045, 0.98, 10), darkIronMat);
      post.position.set(px, 0.49, 0);
      post.castShadow = true;
      addAnimeOutline(post, { thickness: 0.025, color: 0x070a10, useEdges: false });
      gGroup.add(post);

      const goldBand = new THREE.Mesh(new THREE.CylinderGeometry(0.046, 0.046, 0.06, 10), goldMat);
      goldBand.position.set(px, 0.92, 0);
      gGroup.add(goldBand);
    });

    [0.2, 0.86].forEach((ry) => {
      const hBar = new THREE.Mesh(new THREE.BoxGeometry(length, 0.04, 0.04), darkIronMat);
      hBar.position.y = ry;
      gGroup.add(hBar);
    });

    const infillCount = Math.floor(length / 0.16);
    for (let i = 1; i < infillCount; i++) {
      const ix = -length * 0.5 + (i / infillCount) * length;
      const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.64, 6), darkIronMat);
      rod.position.set(ix, 0.53, 0);
      gGroup.add(rod);
    }

    return gGroup;
  }

  // Guardrails curving along the South-East street corner curb
  group.add(createPedestrianGuardrail(2.2, 1.3, 3.68, 0));
  group.add(createPedestrianGuardrail(1.8, 3.4, 3.68, 0));
  group.add(createPedestrianGuardrail(2.0, 4.65, 2.35, Math.PI / 2));

  // Classic London Cannon Bollards at the Corner & Alley Mouth
  const bollardCoords = [
    { x: 4.55, z: 3.55 },
    { x: -7.65, z: 3.65 },
    { x: -10.35, z: 3.65 },
  ];
  bollardCoords.forEach(({ x, z }) => {
    const bMesh = new THREE.Mesh(new THREE.CylinderGeometry(0.085, 0.12, 0.88, 12), darkIronMat);
    bMesh.position.set(x, walkY + 0.44, z);
    bMesh.castShadow = true;
    addAnimeOutline(bMesh, { thickness: 0.03, color: 0x070a10, useEdges: false });
    group.add(bMesh);

    const cap = new THREE.Mesh(new THREE.SphereGeometry(0.095, 10, 10), goldMat);
    cap.position.set(x, walkY + 0.9, z);
    group.add(cap);
  });

  // ==========================================================================
  // 7. ICONIC RED ROYAL MAIL PILLAR BOX & LITTER BIN (邮箱与垃圾桶)
  // ==========================================================================
  // Royal Mail Pillar Box at (X: 4.15, Z: -1.1)
  const postbox = new THREE.Group();
  postbox.position.set(4.15, walkY, -1.1);

  const pbBase = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.39, 0.24, 18), darkIronMat);
  pbBase.position.y = 0.12;
  addAnimeOutline(pbBase, { thickness: 0.025, color: 0x080a10, useEdges: false });
  postbox.add(pbBase);

  const pbBody = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 1.26, 18), royalRedMat);
  pbBody.position.y = 0.87;
  pbBody.castShadow = true;
  addAnimeOutline(pbBody, { thickness: 0.025, color: 0x2b0706, useEdges: false });
  postbox.add(pbBody);

  const pbCap = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.37, 0.12, 18), royalRedMat);
  pbCap.position.y = 1.54;
  addAnimeOutline(pbCap, { thickness: 0.025, color: 0x2b0706, useEdges: false });
  postbox.add(pbCap);

  const pbDome = new THREE.Mesh(new THREE.SphereGeometry(0.36, 16, 12, 0, Math.PI * 2, 0, Math.PI * 0.5), royalRedMat);
  pbDome.position.y = 1.58;
  postbox.add(pbDome);

  // Mail Slot, White Collection Plate & Gold Royal Cypher
  const slot = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.07, 0.26), darkIronMat);
  slot.position.set(0.32, 1.28, 0);
  postbox.add(slot);

  const infoPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.22, 0.18),
    makeAnimeMaterial({ color: 0xf4f0e6, roughness: 0.3 })
  );
  infoPlate.position.set(0.33, 1.02, 0);
  addAnimeOutline(infoPlate, { useHull: false, useEdges: true, color: 0x141820 });
  postbox.add(infoPlate);

  const cypher = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.14, 0.14), goldMat);
  cypher.position.set(0.33, 0.74, 0);
  postbox.add(cypher);

  group.add(postbox);

  // Westminster Black & Gold Cast-Iron Litter Bin at (X: 4.3, Z: 0.25)
  const binGroup = new THREE.Group();
  binGroup.position.set(4.3, walkY, 0.25);

  const binBody = new THREE.Mesh(new THREE.CylinderGeometry(0.27, 0.25, 0.92, 16), darkIronMat);
  binBody.position.y = 0.46;
  binBody.castShadow = true;
  addAnimeOutline(binBody, { thickness: 0.025, color: 0x070a10, useEdges: false });
  binGroup.add(binBody);

  [0.18, 0.76].forEach((by) => {
    const gRing = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.28, 0.045, 16), goldMat);
    gRing.position.y = by;
    binGroup.add(gRing);
  });

  const binDome = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.28, 0.18, 16), darkIronMat);
  binDome.position.y = 1.01;
  binGroup.add(binDome);

  group.add(binGroup);

  // ==========================================================================
  // 8. WET WOODEN & CAST-IRON STREET BENCH (街边长椅)
  // ==========================================================================
  const benchGroup = new THREE.Group();
  benchGroup.position.set(-6.15, walkY, 3.18);

  // Wooden seat & backrest slats
  for (let s = 0; s < 4; s++) {
    const seatSlat = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.035, 0.1), walnutMat);
    seatSlat.position.set(0, 0.44, -0.14 + s * 0.11);
    seatSlat.castShadow = true;
    addAnimeOutline(seatSlat, { useHull: false, useEdges: true, color: 0x140a04 });
    benchGroup.add(seatSlat);

    const backSlat = new THREE.Mesh(new THREE.BoxGeometry(1.75, 0.09, 0.035), walnutMat);
    backSlat.position.set(0, 0.56 + s * 0.11, -0.24 - s * 0.02);
    backSlat.rotation.x = -0.18;
    addAnimeOutline(backSlat, { useHull: false, useEdges: true, color: 0x140a04 });
    benchGroup.add(backSlat);
  }

  // Ornate Cast-Iron End Frames & Armrests
  [-0.78, 0.78].forEach((bx) => {
    const leg = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.68, 0.52), darkIronMat);
    leg.position.set(bx, 0.34, -0.02);
    addAnimeOutline(leg, { useHull: false, useEdges: true, color: 0x070a10 });
    benchGroup.add(leg);
  });

  group.add(benchGroup);

  // ==========================================================================
  // 9. VINTAGE LONDON CAST-IRON STREETLAMPS & DIRECTIONAL SIGNPOST (复古路灯与路牌)
  // ==========================================================================
  const lampPostCoords = [
    { x: 4.15, z: 3.15, hasSignpost: true },   // Main Corner Streetlamp + Directional Signs
    { x: -6.95, z: 3.25, hasSignpost: false }, // Zebra Crossing / Alley Streetlamp
    { x: 4.25, z: -6.8, hasSignpost: false },  // East Roadway Streetlamp
  ];

  const streetLampLights = [];

  lampPostCoords.forEach(({ x, z, hasSignpost }) => {
    const lpGroup = new THREE.Group();
    lpGroup.position.set(x, walkY, z);

    // Ornate Octagonal Base
    const base1 = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.22, 0.65, 8), darkIronMat);
    base1.position.y = 0.325;
    addAnimeOutline(base1, { thickness: 0.025, color: 0x070a10, useEdges: false });
    lpGroup.add(base1);

    const base2 = new THREE.Mesh(new THREE.CylinderGeometry(0.09, 0.15, 0.45, 8), darkIronMat);
    base2.position.y = 0.85;
    lpGroup.add(base2);

    // Tall Fluted Column
    const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.085, 2.9, 10), darkIronMat);
    pole.position.y = 2.52;
    pole.castShadow = true;
    addAnimeOutline(pole, { thickness: 0.025, color: 0x070a10, useEdges: false });
    lpGroup.add(pole);

    // Ladder Crossbar with Gold Tips
    const crossbar = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.72, 8), goldMat);
    crossbar.rotation.z = Math.PI / 2;
    crossbar.position.y = 3.68;
    lpGroup.add(crossbar);

    // Four-Sided Victorian Glass Lantern Head
    const lanternBase = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.1, 0.12, 4), darkIronMat);
    lanternBase.rotation.y = Math.PI / 4;
    lanternBase.position.y = 4.02;
    lpGroup.add(lanternBase);

    const lanternGlassMat = new THREE.MeshStandardMaterial({
      color: 0xffe49e,
      emissive: 0xffa630,
      emissiveIntensity: 2.8,
      roughness: 0.15,
    });
    const lanternGlass = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.17, 0.46, 4), lanternGlassMat);
    lanternGlass.rotation.y = Math.PI / 4;
    lanternGlass.position.y = 4.31;
    addAnimeOutline(lanternGlass, { useHull: false, useEdges: true, color: 0x141822, edgeOpacity: 0.9 });
    lpGroup.add(lanternGlass);

    const lanternRoof = new THREE.Mesh(new THREE.ConeGeometry(0.28, 0.28, 4), darkIronMat);
    lanternRoof.rotation.y = Math.PI / 4;
    lanternRoof.position.y = 4.68;
    addAnimeOutline(lanternRoof, { useHull: false, useEdges: true, color: 0x070a10 });
    lpGroup.add(lanternRoof);

    // Soft Volumetric Glow Halo Sprite Sphere around the Lantern
    const haloGeo = new THREE.SphereGeometry(0.68, 16, 16);
    const haloMat = new THREE.MeshBasicMaterial({
      color: 0xffb84d,
      transparent: true,
      opacity: 0.16,
      depthWrite: false,
    });
    const halo = new THREE.Mesh(haloGeo, haloMat);
    halo.position.y = 4.31;
    lpGroup.add(halo);

    // Warm Amber PointLight illuminating sidewalk, props, and wet road reflections
    const lampLight = new THREE.PointLight(0xffad42, 4.2, 11.5, 1.75);
    lampLight.position.set(0, 4.18, 0);
    lpGroup.add(lampLight);
    streetLampLights.push(lampLight);

    // Directional Street Sign Plates on the Main Corner Post (街道路牌)
    if (hasSignpost) {
      const sign1Tex = createLondonStreetSignTexture('CHARING CROSS RD', 'WC2', 'WESTMINSTER');
      const sign1 = new THREE.Mesh(
        new THREE.BoxGeometry(0.88, 0.34, 0.04),
        makeAnimeMaterial({ map: sign1Tex, roughness: 0.3 })
      );
      sign1.position.set(-0.46, 3.05, 0);
      addAnimeOutline(sign1, { useHull: false, useEdges: true, color: 0x10141c });
      lpGroup.add(sign1);

      const sign2Tex = createLondonStreetSignTexture('COVENT GARDEN', 'WC2', 'WESTMINSTER');
      const sign2 = new THREE.Mesh(
        new THREE.BoxGeometry(0.04, 0.34, 0.88),
        makeAnimeMaterial({ map: sign2Tex, roughness: 0.3 })
      );
      sign2.position.set(0, 2.65, -0.46);
      addAnimeOutline(sign2, { useHull: false, useEdges: true, color: 0x10141c });
      lpGroup.add(sign2);
    }

    group.add(lpGroup);
  });

  // ==========================================================================
  // 10. UK TRAFFIC SIGNAL LIGHT AT THE CORNER (交通信号灯)
  // ==========================================================================
  const trafficGroup = new THREE.Group();
  trafficGroup.position.set(4.55, walkY, 1.35);
  trafficGroup.rotation.y = -0.35; // Angled toward the street intersection

  const tPole = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.065, 3.45, 10), darkIronMat);
  tPole.position.y = 1.725;
  tPole.castShadow = true;
  addAnimeOutline(tPole, { thickness: 0.025, color: 0x070a10, useEdges: false });
  trafficGroup.add(tPole);

  // British White-Bordered Black Signal Backing Board
  const backingWhite = new THREE.Mesh(
    new THREE.BoxGeometry(0.56, 1.24, 0.06),
    makeAnimeMaterial({ color: 0xf0f4fa, roughness: 0.3 })
  );
  backingWhite.position.set(0, 3.05, 0.08);
  trafficGroup.add(backingWhite);

  const signalHousing = new THREE.Mesh(new THREE.BoxGeometry(0.46, 1.14, 0.24), darkIronMat);
  signalHousing.position.set(0, 3.05, 0.14);
  addAnimeOutline(signalHousing, { useHull: false, useEdges: true, color: 0x070a10 });
  trafficGroup.add(signalHousing);

  // Red, Amber, and Green Lenses + Dynamic PointLight
  const redLensMat = new THREE.MeshStandardMaterial({
    color: 0xff2a22,
    emissive: 0xff1e14,
    emissiveIntensity: 3.0,
  });
  const amberLensMat = new THREE.MeshStandardMaterial({
    color: 0xffaa00,
    emissive: 0xff9900,
    emissiveIntensity: 0.15,
  });
  const greenLensMat = new THREE.MeshStandardMaterial({
    color: 0x1ee66b,
    emissive: 0x12d95c,
    emissiveIntensity: 0.15,
  });

  const lensSpecs = [
    { y: 3.38, mat: redLensMat },
    { y: 3.05, mat: amberLensMat },
    { y: 2.72, mat: greenLensMat },
  ];
  lensSpecs.forEach(({ y, mat }) => {
    const lens = new THREE.Mesh(new THREE.SphereGeometry(0.11, 14, 12), mat);
    lens.position.set(0, y, 0.24);
    trafficGroup.add(lens);

    // Visor hood over lens
    const hood = new THREE.Mesh(
      new THREE.CylinderGeometry(0.125, 0.125, 0.16, 12, 1, true, 0, Math.PI),
      darkIronMat
    );
    hood.rotation.z = Math.PI / 2;
    hood.rotation.y = Math.PI / 2;
    hood.position.set(0, y + 0.02, 0.3);
    trafficGroup.add(hood);
  });

  const trafficPointLight = new THREE.PointLight(0xff2a22, 2.2, 8.5, 1.8);
  trafficPointLight.position.set(0, 3.05, 0.55);
  trafficGroup.add(trafficPointLight);

  group.add(trafficGroup);

  // ==========================================================================
  // 11. LONDON BLACK CAB IN ROADSIDE PARKING BAY (黑色出租车氛围元素)
  // ==========================================================================
  const cabGroup = new THREE.Group();
  cabGroup.position.set(6.65, 0.02, -5.4);
  cabGroup.rotation.y = 0; // Facing South (+Z) along East Roadway

  const cabBlackMat = makeAnimeMaterial({
    color: 0x12161f,
    roughness: 0.16,
    metalness: 0.65,
  });
  const cabWindowMat = new THREE.MeshStandardMaterial({
    color: 0x26354d,
    emissive: 0xffb85c,
    emissiveIntensity: 0.18,
    roughness: 0.1,
  });

  // Lower Chassis Body
  const cabBody = new THREE.Mesh(new THREE.BoxGeometry(1.72, 0.68, 4.15), cabBlackMat);
  cabBody.position.y = 0.56;
  cabBody.castShadow = true;
  addAnimeOutline(cabBody, { thickness: 0.018, color: 0x05070c });
  cabGroup.add(cabBody);

  // Rounded Austin FX4 Cabin Greenhouse
  const cabCabin = new THREE.Mesh(new THREE.BoxGeometry(1.52, 0.62, 2.35), cabBlackMat);
  cabCabin.position.set(0, 1.18, -0.25);
  cabCabin.castShadow = true;
  addAnimeOutline(cabCabin, { thickness: 0.018, color: 0x05070c });
  cabGroup.add(cabCabin);

  // Windshield & Side Windows
  const cabWindshield = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.48, 2.42), cabWindowMat);
  cabWindshield.position.set(0, 1.18, -0.25);
  cabGroup.add(cabWindshield);

  // Iconic Glowing Amber "TAXI" Roof Sign
  const taxiSignMat = new THREE.MeshStandardMaterial({
    color: 0xffb833,
    emissive: 0xff9d00,
    emissiveIntensity: 2.6,
  });
  const taxiSign = new THREE.Mesh(new THREE.BoxGeometry(0.46, 0.16, 0.18), taxiSignMat);
  taxiSign.position.set(0, 1.56, 0.72);
  addAnimeOutline(taxiSign, { thickness: 0.03, color: 0x261400 });
  cabGroup.add(taxiSign);

  // Chrome Grille & Bumpers
  const grille = new THREE.Mesh(new THREE.BoxGeometry(0.62, 0.48, 0.08), chromeMat);
  grille.position.set(0, 0.58, 2.08);
  addAnimeOutline(grille, { useHull: false, useEdges: true, color: 0x080b12 });
  cabGroup.add(grille);

  [-2.1, 2.1].forEach((bz) => {
    const bumper = new THREE.Mesh(new THREE.BoxGeometry(1.78, 0.12, 0.14), chromeMat);
    bumper.position.set(0, 0.32, bz);
    cabGroup.add(bumper);
  });

  // Four Wheels with Chrome Hubcaps
  [
    [-0.86, 1.32], [0.86, 1.32],
    [-0.86, -1.32], [0.86, -1.32],
  ].forEach(([wx, wz]) => {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.22, 16), tireMat);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(wx, 0.34, wz);
    cabGroup.add(wheel);

    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.18, 0.18, 0.24, 12), chromeMat);
    hub.rotation.z = Math.PI / 2;
    hub.position.set(wx, 0.34, wz);
    cabGroup.add(hub);
  });

  // Twin Round Headlights & Red Taillights
  const headlightMat = new THREE.MeshStandardMaterial({
    color: 0xfff6d6,
    emissive: 0xffd27d,
    emissiveIntensity: 3.2,
  });
  const taillightMat = new THREE.MeshStandardMaterial({
    color: 0xff221a,
    emissive: 0xff1108,
    emissiveIntensity: 2.5,
  });

  [-0.58, 0.58].forEach((hx) => {
    const hl = new THREE.Mesh(new THREE.SphereGeometry(0.14, 12, 12), headlightMat);
    hl.position.set(hx, 0.66, 2.06);
    cabGroup.add(hl);

    const tl = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.24, 0.08), taillightMat);
    tl.position.set(hx, 0.58, -2.08);
    cabGroup.add(tl);
  });

  const cabHeadlightGlow = new THREE.PointLight(0xffcf78, 2.4, 7.5, 1.8);
  cabHeadlightGlow.position.set(0, 0.65, 2.8);
  cabGroup.add(cabHeadlightGlow);

  group.add(cabGroup);

  // ==========================================================================
  // 12. RED LONDON ROUTEMASTER DOUBLE-DECKER BUS IN OUTER LANE (双层巴士氛围元素)
  // ==========================================================================
  const busGroup = new THREE.Group();
  busGroup.position.set(5.4, 0.02, 9.65);
  busGroup.rotation.y = -Math.PI / 2; // Facing West (-X) along South Roadway

  const busRedMat = makeAnimeMaterial({
    color: 0xc9221e,
    roughness: 0.26,
    metalness: 0.22,
  });
  const busCreamMat = makeAnimeMaterial({ color: 0xf4ead2, roughness: 0.35 });
  const busWarmWinMat = new THREE.MeshStandardMaterial({
    color: 0xffe299,
    emissive: 0xffa630,
    emissiveIntensity: 1.45,
    roughness: 0.15,
  });

  // Main Double-Decker Body (Width 2.15, Height 3.65, Length 6.8)
  const busBody = new THREE.Mesh(new THREE.BoxGeometry(2.15, 3.65, 6.8), busRedMat);
  busBody.position.y = 2.12;
  busBody.castShadow = true;
  addAnimeOutline(busBody, { thickness: 0.015, color: 0x1c0605 });
  busGroup.add(busBody);

  // Classic Cream Horizontal Waistband Strip between Lower & Upper Decks
  const creamBand = new THREE.Mesh(new THREE.BoxGeometry(2.19, 0.18, 6.84), busCreamMat);
  creamBand.position.y = 2.18;
  busGroup.add(creamBand);

  // Glowing Upper & Lower Deck Windows on Both Sides
  [1.38, 3.05].forEach((wy) => {
    for (let wz = -2.4; wz <= 2.4; wz += 1.2) {
      const winPane = new THREE.Mesh(new THREE.BoxGeometry(2.2, 0.72, 0.96), busWarmWinMat);
      winPane.position.set(0, wy, wz);
      addAnimeOutline(winPane, { useHull: false, useEdges: true, color: 0x1a0806 });
      busGroup.add(winPane);
    }
  });

  // Front Upper Windshield & Illuminated Destination Blind ("24 CAMDEN TOWN")
  const destBlind = new THREE.Mesh(
    new THREE.BoxGeometry(1.45, 0.34, 0.08),
    new THREE.MeshStandardMaterial({
      color: 0xfff4cc,
      emissive: 0xffbf4d,
      emissiveIntensity: 2.2,
    })
  );
  destBlind.position.set(0, 2.32, 3.42);
  addAnimeOutline(destBlind, { useHull: false, useEdges: true, color: 0x141414 });
  busGroup.add(destBlind);

  // Routemaster Half-Cab Engine Hood & Chrome Radiator Grille
  const hoodBox = new THREE.Mesh(new THREE.BoxGeometry(0.95, 1.05, 0.72), busRedMat);
  hoodBox.position.set(-0.48, 0.88, 3.65);
  addAnimeOutline(hoodBox, { useHull: false, useEdges: true, color: 0x1c0605 });
  busGroup.add(hoodBox);

  const busGrille = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.78, 0.08), chromeMat);
  busGrille.position.set(-0.48, 0.88, 4.02);
  busGroup.add(busGrille);

  // Bus Wheels
  [
    [-1.08, 2.2], [1.08, 2.2],
    [-1.08, -2.1], [1.08, -2.1],
  ].forEach(([wx, wz]) => {
    const bWheel = new THREE.Mesh(new THREE.CylinderGeometry(0.46, 0.46, 0.28, 18), tireMat);
    bWheel.rotation.z = Math.PI / 2;
    bWheel.position.set(wx, 0.46, wz);
    busGroup.add(bWheel);
  });

  // Bus Headlights & Taillights
  [-0.82, 0.82].forEach((bx) => {
    const bhl = new THREE.Mesh(new THREE.SphereGeometry(0.15, 12, 12), headlightMat);
    bhl.position.set(bx, 0.78, 3.42);
    busGroup.add(bhl);

    const btl = new THREE.Mesh(new THREE.SphereGeometry(0.13, 10, 10), taillightMat);
    btl.position.set(bx, 0.78, -3.42);
    busGroup.add(btl);
  });

  const busHeadlightGlow = new THREE.PointLight(0xffcf78, 3.2, 10.0, 1.7);
  busHeadlightGlow.position.set(0, 0.85, 4.4);
  busGroup.add(busHeadlightGlow);

  const busTailGlow = new THREE.PointLight(0xff261b, 2.2, 7.5, 1.8);
  busTailGlow.position.set(0, 0.85, -4.2);
  busGroup.add(busTailGlow);

  group.add(busGroup);

  scene.add(group);

  return {
    group,
    streetLampLights,
    trafficLights: {
      redLensMat,
      amberLensMat,
      greenLensMat,
      trafficPointLight,
    },
    busGroup,
    cabGroup,
  };
}
