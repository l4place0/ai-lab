import * as THREE from 'three';
import {
  addAnimeOutline,
  makeAnimeMaterial,
  createRedBrickTexture,
  createSignboardTexture,
  createHangingEmblemTexture,
  createStainedGlassTexture,
  createAwningTexture,
  createLondonStreetSignTexture,
} from './materials.js';

export function buildCafeBuilding(scene) {
  const group = new THREE.Group();
  group.name = 'CafeBuilding';

  // Shared Architectural Materials
  const brickTex = createRedBrickTexture();
  brickTex.repeat.set(2.5, 1.8);
  const brickMat = makeAnimeMaterial({
    map: brickTex,
    color: 0xd98a76,
    roughness: 0.62,
    metalness: 0.05,
  });

  const darkGreenMat = makeAnimeMaterial({
    color: 0x123024,
    roughness: 0.32,
    metalness: 0.18,
  });

  const trimGreenMat = makeAnimeMaterial({
    color: 0x1a4232,
    roughness: 0.35,
    metalness: 0.15,
  });

  const walnutMat = makeAnimeMaterial({
    color: 0x2a160d,
    roughness: 0.38,
    metalness: 0.15,
  });

  const stoneMat = makeAnimeMaterial({
    color: 0xd8ceb8,
    roughness: 0.55,
    metalness: 0.06,
  });

  const brassMat = makeAnimeMaterial({
    color: 0xe0b84c,
    roughness: 0.24,
    metalness: 0.85,
  });

  const darkIronMat = makeAnimeMaterial({
    color: 0x161b24,
    roughness: 0.35,
    metalness: 0.75,
  });

  const slateRoofMat = makeAnimeMaterial({
    color: 0x21293a,
    roughness: 0.42,
    metalness: 0.22,
  });

  const interiorWallMat = makeAnimeMaterial({
    color: 0xf5e6c8,
    roughness: 0.75,
    metalness: 0.02,
  });

  const interiorWainscotMat = makeAnimeMaterial({
    color: 0x3b2214,
    roughness: 0.45,
    metalness: 0.1,
  });

  // ==========================================================================
  // 1. GROUND FLOOR STRUCTURAL SHELL (Open to South & East Display Windows)
  // ==========================================================================
  // Footprint: X from -7.8 to +2.4 (width 10.2), Z from -8.2 to +1.4 (depth 9.6)
  // Base sidewalk height = 0.22. Ground floor height = 0.22 to 4.65.

  // West Wall (separating Café from Cobblestone Alley at X = -7.8)
  const westWall = new THREE.Mesh(new THREE.BoxGeometry(0.32, 4.45, 9.6), brickMat);
  westWall.position.set(-7.64, 2.445, -3.4);
  westWall.castShadow = true;
  westWall.receiveShadow = true;
  addAnimeOutline(westWall, { useHull: false, useEdges: true, color: 0x120b09 });
  group.add(westWall);

  // Interior cream lining on West Wall
  const westInner = new THREE.Mesh(new THREE.BoxGeometry(0.05, 3.1, 9.2), interiorWallMat);
  westInner.position.set(-7.45, 2.95, -3.4);
  group.add(westInner);
  const westWainscot = new THREE.Mesh(new THREE.BoxGeometry(0.07, 1.25, 9.2), interiorWainscotMat);
  westWainscot.position.set(-7.44, 0.85, -3.4);
  group.add(westWainscot);

  // North Back Wall (at Z = -8.2)
  const northWall = new THREE.Mesh(new THREE.BoxGeometry(10.2, 4.45, 0.32), brickMat);
  northWall.position.set(-2.7, 2.445, -8.04);
  northWall.castShadow = true;
  northWall.receiveShadow = true;
  addAnimeOutline(northWall, { useHull: false, useEdges: true, color: 0x120b09 });
  group.add(northWall);

  const northInner = new THREE.Mesh(new THREE.BoxGeometry(9.8, 3.1, 0.05), interiorWallMat);
  northInner.position.set(-2.7, 2.95, -7.85);
  group.add(northInner);
  const northWainscot = new THREE.Mesh(new THREE.BoxGeometry(9.8, 1.25, 0.07), interiorWainscotMat);
  northWainscot.position.set(-2.7, 0.85, -7.84);
  group.add(northWainscot);

  // Ground Floor Ceiling Slab & Exposed Timber Beams (at Y = 4.55)
  const ceilingSlab = new THREE.Mesh(new THREE.BoxGeometry(10.1, 0.18, 9.5), interiorWallMat);
  ceilingSlab.position.set(-2.7, 4.56, -3.4);
  group.add(ceilingSlab);

  for (let x = -6.4; x <= 1.2; x += 1.9) {
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.22, 9.3), walnutMat);
    beam.position.set(x, 4.38, -3.4);
    addAnimeOutline(beam, { useHull: false, useEdges: true, color: 0x120904 });
    group.add(beam);
  }

  // ==========================================================================
  // 2. BRITISH RACING GREEN & WALNUT STOREFRONT (South, East & 45° Corner)
  // ==========================================================================
  // Pilaster columns framing the storefront
  const pilasterCoords = [
    { x: -7.45, z: 1.38 },
    { x: -4.9, z: 1.38 },
    { x: -2.35, z: 1.38 },
    { x: 0.2, z: 1.38 },   // Left of chamfered corner doorway
    { x: 2.38, z: -0.8 },  // Right of chamfered corner doorway
    { x: 2.38, z: -3.1 },
    { x: 2.38, z: -5.4 },
    { x: 2.38, z: -7.75 },
  ];

  pilasterCoords.forEach(({ x, z }) => {
    const pGroup = new THREE.Group();
    pGroup.position.set(x, 0.22, z);

    // Plinth base
    const base = new THREE.Mesh(new THREE.BoxGeometry(0.38, 0.45, 0.38), walnutMat);
    base.position.y = 0.225;
    addAnimeOutline(base, { useHull: false, useEdges: true, color: 0x0c0704 });
    pGroup.add(base);

    // Fluted shaft in British Racing Green
    const shaft = new THREE.Mesh(new THREE.BoxGeometry(0.32, 3.35, 0.32), darkGreenMat);
    shaft.position.y = 2.12;
    shaft.castShadow = true;
    addAnimeOutline(shaft, { useHull: false, useEdges: true, color: 0x081711 });
    pGroup.add(shaft);

    // Gold decorative capital & console bracket
    const cap = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.26, 0.4), brassMat);
    cap.position.y = 3.92;
    addAnimeOutline(cap, { useHull: false, useEdges: true, color: 0x261c06 });
    pGroup.add(cap);

    group.add(pGroup);
  });

  // Stallrisers (Low Panelled Wainscot Walls under the Large Glass Windows)
  // South Window Stallriser (X: -7.45 to +0.2, Z: 1.36, height 0.72)
  const southStallriser = new THREE.Mesh(new THREE.BoxGeometry(7.65, 0.72, 0.24), darkGreenMat);
  southStallriser.position.set(-3.62, 0.58, 1.36);
  southStallriser.castShadow = true;
  southStallriser.receiveShadow = true;
  addAnimeOutline(southStallriser, { useHull: false, useEdges: true, color: 0x07140e });
  group.add(southStallriser);

  // Decorative recessed walnut & gold panels on South Stallriser
  for (let i = 0; i < 6; i++) {
    const px = -6.8 + i * 1.26;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(1.02, 0.42, 0.04), walnutMat);
    panel.position.set(px, 0.58, 1.49);
    addAnimeOutline(panel, { useHull: false, useEdges: true, color: 0xd4af37, edgeOpacity: 0.75 });
    group.add(panel);
  }

  // South Window Sill (Walnut & Brass Lip at Y = 0.96)
  const southSill = new THREE.Mesh(new THREE.BoxGeometry(7.75, 0.09, 0.34), walnutMat);
  southSill.position.set(-3.62, 0.96, 1.38);
  addAnimeOutline(southSill, { useHull: false, useEdges: true, color: 0x120904 });
  group.add(southSill);

  // East Window Stallriser (X: 2.36, Z: -7.75 to -0.8 -> length 6.95)
  const eastStallriser = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.72, 6.95), darkGreenMat);
  eastStallriser.position.set(2.36, 0.58, -4.27);
  eastStallriser.castShadow = true;
  eastStallriser.receiveShadow = true;
  addAnimeOutline(eastStallriser, { useHull: false, useEdges: true, color: 0x07140e });
  group.add(eastStallriser);

  for (let i = 0; i < 6; i++) {
    const pz = -7.15 + i * 1.15;
    const panel = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.42, 0.92), walnutMat);
    panel.position.set(2.49, 0.58, pz);
    addAnimeOutline(panel, { useHull: false, useEdges: true, color: 0xd4af37, edgeOpacity: 0.75 });
    group.add(panel);
  }

  const eastSill = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.09, 7.05), walnutMat);
  eastSill.position.set(2.38, 0.96, -4.27);
  addAnimeOutline(eastSill, { useHull: false, useEdges: true, color: 0x120904 });
  group.add(eastSill);

  // ==========================================================================
  // 3. CRYSTAL-CLEAR LARGE DISPLAY WINDOWS & STAINED-GLASS TRANSOMS
  // ==========================================================================
  // Notice: Very low opacity (0.13) + no depthWrite so interior props are 100% sharp & vivid!
  const clearGlassMat = new THREE.MeshPhysicalMaterial({
    color: 0xfff3dc,
    transparent: true,
    opacity: 0.13,
    roughness: 0.06,
    metalness: 0.05,
    reflectivity: 0.6,
    depthWrite: false,
  });

  // South Main Plate Glass Window (X: -7.3 to +0.05, Y: 1.0 to 3.55, Z: 1.38)
  const southGlass = new THREE.Mesh(new THREE.PlaneGeometry(7.35, 2.55), clearGlassMat);
  southGlass.position.set(-3.62, 2.275, 1.38);
  group.add(southGlass);

  // East Main Plate Glass Window (X: 2.38, Y: 1.0 to 3.55, Z: -7.6 to -0.95)
  const eastGlass = new THREE.Mesh(new THREE.PlaneGeometry(6.65, 2.55), clearGlassMat);
  eastGlass.rotation.y = Math.PI / 2;
  eastGlass.position.set(2.38, 2.275, -4.27);
  group.add(eastGlass);

  // Slender Brass & Green Window Mullions & Transom Bars
  const southTransomBar = new THREE.Mesh(new THREE.BoxGeometry(7.65, 0.1, 0.26), trimGreenMat);
  southTransomBar.position.set(-3.62, 3.56, 1.38);
  addAnimeOutline(southTransomBar, { useHull: false, useEdges: true, color: 0xd4af37 });
  group.add(southTransomBar);

  const eastTransomBar = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.1, 6.95), trimGreenMat);
  eastTransomBar.position.set(2.38, 3.56, -4.27);
  addAnimeOutline(eastTransomBar, { useHull: false, useEdges: true, color: 0xd4af37 });
  group.add(eastTransomBar);

  // Glowing Stained-Glass Transom Fanlights (Y: 3.62 to 4.08)
  const stainedTex = createStainedGlassTexture();
  const stainedMat = new THREE.MeshStandardMaterial({
    map: stainedTex,
    emissiveMap: stainedTex,
    emissive: 0xffb84d,
    emissiveIntensity: 0.95,
    roughness: 0.2,
  });

  const southStained = new THREE.Mesh(new THREE.BoxGeometry(7.45, 0.44, 0.12), stainedMat);
  southStained.position.set(-3.62, 3.84, 1.38);
  addAnimeOutline(southStained, { useHull: false, useEdges: true, color: 0x141820 });
  group.add(southStained);

  const eastStained = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.44, 6.75), stainedMat);
  eastStained.position.set(2.38, 3.84, -4.27);
  addAnimeOutline(eastStained, { useHull: false, useEdges: true, color: 0x141820 });
  group.add(eastStained);

  // ==========================================================================
  // 4. RECESSED 45° CORNER ENTRANCE, EXQUISITE DOOR FRAME & SWAYING WIND CHIME
  // ==========================================================================
  // Spanning between (X: 0.2, Z: 1.38) and (X: 2.38, Z: -0.8)
  // Center of chamfer is at (X: 1.29, Z: 0.29), facing South-East (+X, +Z, angle = Math.PI / 4)
  const doorGroup = new THREE.Group();
  doorGroup.position.set(1.29, 0.22, 0.29);
  doorGroup.rotation.y = Math.PI / 4;

  // Recessed vestibule arch & narrow moulded frame (total span ~3.08, door opening in center)
  // Left & Right narrow panelled sidelights
  [-1.08, 1.08].forEach((dx) => {
    const sideStall = new THREE.Mesh(new THREE.BoxGeometry(0.76, 0.72, 0.22), darkGreenMat);
    sideStall.position.set(dx, 0.36, -0.18);
    addAnimeOutline(sideStall, { useHull: false, useEdges: true, color: 0x07140e });
    doorGroup.add(sideStall);

    const sideFrame = new THREE.Mesh(new THREE.BoxGeometry(0.14, 3.85, 0.26), walnutMat);
    sideFrame.position.set(dx > 0 ? 0.68 : -0.68, 1.925, -0.15);
    addAnimeOutline(sideFrame, { useHull: false, useEdges: true, color: 0xd4af37 });
    doorGroup.add(sideFrame);

    const sidePane = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 2.55), clearGlassMat);
    sidePane.position.set(dx, 2.02, -0.18);
    doorGroup.add(sidePane);
  });

  // Ornate Over-Door Transom Header & Fanlight ("NARROW & EXQUISITE DOOR FRAME")
  const doorHeader = new THREE.Mesh(new THREE.BoxGeometry(3.08, 0.56, 0.34), darkGreenMat);
  doorHeader.position.set(0, 3.66, -0.05);
  addAnimeOutline(doorHeader, { useHull: false, useEdges: true, color: 0xd4af37 });
  doorGroup.add(doorHeader);

  const fanlightMat = new THREE.MeshStandardMaterial({
    color: 0xffe49e,
    emissive: 0xffaa33,
    emissiveIntensity: 1.35,
    roughness: 0.2,
  });
  const fanlight = new THREE.Mesh(new THREE.BoxGeometry(1.22, 0.36, 0.14), fanlightMat);
  fanlight.position.set(0, 3.66, -0.02);
  addAnimeOutline(fanlight, { useHull: false, useEdges: true, color: 0x241508 });
  doorGroup.add(fanlight);

  // Brass Coir Welcome Mat at Threshold
  const matMesh = new THREE.Mesh(
    new THREE.BoxGeometry(1.18, 0.03, 0.68),
    makeAnimeMaterial({ color: 0x6e4726, roughness: 0.9 })
  );
  matMesh.position.set(0, 0.015, 0.12);
  addAnimeOutline(matMesh, { useHull: false, useEdges: true, color: 0x241508 });
  doorGroup.add(matMesh);

  // Hinged Café Door Pivot (Slightly ajar & gently swaying in the breeze!)
  const doorLeafPivot = new THREE.Group();
  doorLeafPivot.position.set(-0.58, 0, -0.22);
  doorLeafPivot.rotation.y = 0.12; // Slightly invitingly ajar

  // Lower timber panel of door
  const doorBottom = new THREE.Mesh(new THREE.BoxGeometry(1.16, 1.05, 0.09), walnutMat);
  doorBottom.position.set(0.58, 0.525, 0);
  addAnimeOutline(doorBottom, { useHull: false, useEdges: true, color: 0x120804 });
  doorLeafPivot.add(doorBottom);

  // Brass Kickplate
  const kickplate = new THREE.Mesh(new THREE.BoxGeometry(1.06, 0.22, 0.1), brassMat);
  kickplate.position.set(0.58, 0.14, 0);
  doorLeafPivot.add(kickplate);

  // Door stiles & top rail
  const leftStile = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.25, 0.09), darkGreenMat);
  leftStile.position.set(0.07, 2.15, 0);
  doorLeafPivot.add(leftStile);

  const rightStile = new THREE.Mesh(new THREE.BoxGeometry(0.14, 2.25, 0.09), darkGreenMat);
  rightStile.position.set(1.09, 2.15, 0);
  doorLeafPivot.add(rightStile);

  const topRail = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.18, 0.09), darkGreenMat);
  topRail.position.set(0.58, 3.24, 0);
  doorLeafPivot.add(topRail);

  // Door Glass Pane
  const doorGlass = new THREE.Mesh(new THREE.PlaneGeometry(0.88, 2.05), clearGlassMat);
  doorGlass.position.set(0.58, 2.12, 0);
  doorLeafPivot.add(doorGlass);

  // Vintage Brass Push Handle & Hanging "OPEN" Sign on Door
  const handle = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.42, 10), brassMat);
  handle.position.set(1.02, 1.25, 0.07);
  doorLeafPivot.add(handle);

  const openSign = new THREE.Mesh(
    new THREE.BoxGeometry(0.42, 0.22, 0.02),
    new THREE.MeshStandardMaterial({
      color: 0xfff0c2,
      emissive: 0xffb84d,
      emissiveIntensity: 0.7,
    })
  );
  openSign.position.set(0.58, 1.85, 0.05);
  addAnimeOutline(openSign, { useHull: false, useEdges: true, color: 0x2a160d });
  doorLeafPivot.add(openSign);

  doorGroup.add(doorLeafPivot);

  // Hanging Brass & Glass Wind Chime (门口风铃) in the Recessed Doorway
  const windChimePivot = new THREE.Group();
  windChimePivot.position.set(0.32, 3.32, 0.12);

  const chimeRing = new THREE.Mesh(new THREE.TorusGeometry(0.09, 0.012, 8, 16), brassMat);
  chimeRing.rotation.x = Math.PI / 2;
  chimeRing.position.y = -0.12;
  windChimePivot.add(chimeRing);

  const glassBellMat = new THREE.MeshStandardMaterial({
    color: 0xaee6ff,
    emissive: 0xffd280,
    emissiveIntensity: 0.6,
    transparent: true,
    opacity: 0.85,
  });
  const chimeBell = new THREE.Mesh(new THREE.SphereGeometry(0.075, 12, 10, 0, Math.PI * 2, 0, Math.PI * 0.7), glassBellMat);
  chimeBell.position.y = -0.06;
  windChimePivot.add(chimeBell);

  for (let c = 0; c < 4; c++) {
    const ang = (c / 4) * Math.PI * 2;
    const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.22 + (c % 2) * 0.05, 6), brassMat);
    rod.position.set(Math.cos(ang) * 0.065, -0.24, Math.sin(ang) * 0.065);
    windChimePivot.add(rod);
  }

  // Hanging paper/brass wind catcher slip (Tanzaku)
  const catcher = new THREE.Mesh(
    new THREE.BoxGeometry(0.06, 0.18, 0.006),
    new THREE.MeshStandardMaterial({
      color: 0xffdf9e,
      emissive: 0xffae42,
      emissiveIntensity: 0.8,
    })
  );
  catcher.position.set(0, -0.42, 0);
  windChimePivot.add(catcher);

  doorGroup.add(windChimePivot);
  group.add(doorGroup);

  // ==========================================================================
  // 5. VINTAGE ENGLISH FASCIA SIGNBOARDS, HANGING EMBLEM & SWAN-NECK LAMPS
  // ==========================================================================
  const southSignTex = createSignboardTexture(
    'THE BLOOMSBURY KETTLE',
    'EST. 1924  •  ARTISAN COFFEE & PASTRY  •  LONDON WC1'
  );
  const eastSignTex = createSignboardTexture(
    'BLOOMSBURY ROASTERS',
    'SINGLE ORIGIN ESPRESSO  •  AFTERNOON TEA & CAKES'
  );

  const southSignMat = new THREE.MeshStandardMaterial({
    map: southSignTex,
    emissiveMap: southSignTex,
    emissive: 0xffcf78,
    emissiveIntensity: 0.48,
    roughness: 0.3,
  });

  const eastSignMat = new THREE.MeshStandardMaterial({
    map: eastSignTex,
    emissiveMap: eastSignTex,
    emissive: 0xffcf78,
    emissiveIntensity: 0.48,
    roughness: 0.3,
  });

  // South Signboard Fascia (X: -7.65 to +0.55, Y: 4.38, Z: 1.54)
  const southSign = new THREE.Mesh(new THREE.BoxGeometry(8.2, 0.62, 0.16), southSignMat);
  southSign.position.set(-3.55, 4.38, 1.52);
  southSign.rotation.x = 0.06; // Slight vintage forward tilt
  addAnimeOutline(southSign, { useHull: false, useEdges: true, color: 0xd4af37 });
  group.add(southSign);

  // East Signboard Fascia (X: 2.52, Y: 4.38, Z: -7.85 to -0.45)
  const eastSign = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.62, 7.4), eastSignMat);
  eastSign.position.set(2.52, 4.38, -4.15);
  eastSign.rotation.z = -0.06;
  addAnimeOutline(eastSign, { useHull: false, useEdges: true, color: 0xd4af37 });
  group.add(eastSign);

  // Corner Chamfer Signboard Panel
  const cornerSign = new THREE.Mesh(new THREE.BoxGeometry(3.15, 0.62, 0.16), darkGreenMat);
  cornerSign.position.set(1.42, 4.38, 0.42);
  cornerSign.rotation.y = Math.PI / 4;
  addAnimeOutline(cornerSign, { useHull: false, useEdges: true, color: 0xd4af37 });
  group.add(cornerSign);

  // Swan-Neck Brass Signboard Lamps (with warm flickering bulbs!)
  const signBulbMats = [];
  const signLights = [];

  const signLampPositions = [
    { x: -6.0, z: 1.72, rotY: 0 },
    { x: -3.55, z: 1.72, rotY: 0 },
    { x: -1.1, z: 1.72, rotY: 0 },
    { x: 2.72, z: -1.8, rotY: Math.PI / 2 },
    { x: 2.72, z: -4.15, rotY: Math.PI / 2 },
    { x: 2.72, z: -6.5, rotY: Math.PI / 2 },
  ];

  signLampPositions.forEach(({ x, z, rotY }) => {
    const lGroup = new THREE.Group();
    lGroup.position.set(x, 4.78, z);
    lGroup.rotation.y = rotY;

    const arm = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.36, 8), brassMat);
    arm.rotation.x = Math.PI / 2;
    arm.position.z = -0.1;
    lGroup.add(arm);

    const shade = new THREE.Mesh(new THREE.ConeGeometry(0.14, 0.12, 12, 1, true), brassMat);
    shade.position.set(0, -0.04, 0.06);
    lGroup.add(shade);

    const bulbMat = new THREE.MeshStandardMaterial({
      color: 0xfff3c4,
      emissive: 0xffaa33,
      emissiveIntensity: 2.4,
    });
    const bulb = new THREE.Mesh(new THREE.SphereGeometry(0.055, 10, 10), bulbMat);
    bulb.position.set(0, -0.08, 0.06);
    lGroup.add(bulb);
    signBulbMats.push(bulbMat);

    group.add(lGroup);
  });

  // Two dedicated warm PointLights illuminating the South and East signboards
  const southSignLight = new THREE.PointLight(0xffb44c, 1.8, 7.5, 1.8);
  southSignLight.position.set(-3.55, 4.6, 2.2);
  group.add(southSignLight);
  signLights.push(southSignLight);

  const eastSignLight = new THREE.PointLight(0xffb44c, 1.8, 7.5, 1.8);
  eastSignLight.position.set(3.2, 4.6, -4.15);
  group.add(eastSignLight);
  signLights.push(eastSignLight);

  // Projecting Wrought-Iron Hanging Emblem Sign at the Corner (Gently Swaying!)
  const hangingSignBracket = new THREE.Group();
  hangingSignBracket.position.set(2.38, 4.25, 1.38);
  hangingSignBracket.rotation.y = Math.PI / 4;

  const ironBar = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.05, 1.05), darkIronMat);
  ironBar.position.set(0, 0.25, 0.52);
  hangingSignBracket.add(ironBar);

  const scrollBrace = new THREE.Mesh(new THREE.TorusGeometry(0.22, 0.02, 8, 18), darkIronMat);
  scrollBrace.rotation.y = Math.PI / 2;
  scrollBrace.position.set(0, 0.42, 0.35);
  hangingSignBracket.add(scrollBrace);

  const hangingSignPivot = new THREE.Group();
  hangingSignPivot.position.set(0, 0.22, 0.72);

  const emblemTex = createHangingEmblemTexture();
  const emblemMat = new THREE.MeshStandardMaterial({
    map: emblemTex,
    emissiveMap: emblemTex,
    emissive: 0xffc866,
    emissiveIntensity: 0.55,
    roughness: 0.3,
  });
  const emblemBoard = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.68, 0.68), emblemMat);
  emblemBoard.position.y = -0.38;
  addAnimeOutline(emblemBoard, { thickness: 0.025, color: 0xd4af37 });
  hangingSignPivot.add(emblemBoard);

  hangingSignBracket.add(hangingSignPivot);
  group.add(hangingSignBracket);

  // ==========================================================================
  // 6. STRIPED SCALLOPED EAVE AWNINGS (屋檐雨棚)
  // ==========================================================================
  const awningTex = createAwningTexture();
  const awningMat = makeAnimeMaterial({
    map: awningTex,
    roughness: 0.55,
    metalness: 0.05,
    side: THREE.DoubleSide,
  });

  // Helper to build a sloped awning with scalloped valance & iron support arms
  function createAwning(width, x, z, rotY) {
    const aGroup = new THREE.Group();
    aGroup.position.set(x, 3.62, z);
    aGroup.rotation.y = rotY;

    // Sloped canvas roof (depth 1.18, drops 0.48 vertically)
    const roofGeo = new THREE.BoxGeometry(width, 0.04, 1.22);
    const roofMesh = new THREE.Mesh(roofGeo, awningMat);
    roofMesh.position.set(0, -0.22, 0.56);
    roofMesh.rotation.x = 0.38;
    roofMesh.castShadow = true;
    roofMesh.receiveShadow = true;
    addAnimeOutline(roofMesh, { useHull: false, useEdges: true, color: 0x0b1c14 });
    aGroup.add(roofMesh);

    // Front scalloped valance strip at the lower eave edge (Z = +1.12, Y = -0.45)
    const valance = new THREE.Mesh(new THREE.BoxGeometry(width, 0.18, 0.03), awningMat);
    valance.position.set(0, -0.52, 1.12);
    addAnimeOutline(valance, { useHull: false, useEdges: true, color: 0x0b1c14 });
    aGroup.add(valance);

    // Scalloped semi-circular tabs along the bottom of the valance
    const tabCount = Math.floor(width / 0.34);
    const step = width / tabCount;
    for (let i = 0; i < tabCount; i++) {
      const tx = -width * 0.5 + (i + 0.5) * step;
      const tab = new THREE.Mesh(
        new THREE.CylinderGeometry(step * 0.46, step * 0.46, 0.03, 10),
        i % 2 === 0 ? darkGreenMat : stoneMat
      );
      tab.rotation.x = Math.PI / 2;
      tab.position.set(tx, -0.61, 1.12);
      aGroup.add(tab);
    }

    // Wrought-iron folding support arms at ends and middle
    [-width * 0.46, 0, width * 0.46].forEach((ax) => {
      const strut = new THREE.Mesh(new THREE.CylinderGeometry(0.018, 0.018, 1.18, 6), brassMat);
      strut.rotation.x = Math.PI / 2 + 0.18;
      strut.position.set(ax, -0.42, 0.55);
      aGroup.add(strut);
    });

    return aGroup;
  }

  const southAwning = createAwning(7.35, -3.62, 1.45, 0);
  group.add(southAwning);

  const eastAwning = createAwning(6.65, 2.45, -4.27, Math.PI / 2);
  group.add(eastAwning);

  // ==========================================================================
  // 7. RED BRICK UPPER FACADE, PORTLAND STONE QUOINS & SASH WINDOWS (红砖立面)
  // ==========================================================================
  // Upper story block (Y: 4.65 to 8.45, X: -7.8 to +2.4, Z: -8.2 to +1.4)
  const upperBrickBlock = new THREE.Mesh(new THREE.BoxGeometry(10.2, 3.8, 9.6), brickMat);
  upperBrickBlock.position.set(-2.7, 6.55, -3.4);
  upperBrickBlock.castShadow = true;
  upperBrickBlock.receiveShadow = true;
  addAnimeOutline(upperBrickBlock, { useHull: false, useEdges: true, color: 0x160a08 });
  group.add(upperBrickBlock);

  // Moulded Portland Stone String Course (at Y = 4.78) & Upper Cornice (at Y = 8.48)
  const lowerCornice = new THREE.Mesh(new THREE.BoxGeometry(10.52, 0.24, 9.92), stoneMat);
  lowerCornice.position.set(-2.7, 4.76, -3.4);
  addAnimeOutline(lowerCornice, { useHull: false, useEdges: true, color: 0x1c1814 });
  group.add(lowerCornice);

  const topCornice = new THREE.Mesh(new THREE.BoxGeometry(10.68, 0.34, 10.08), stoneMat);
  topCornice.position.set(-2.7, 8.48, -3.4);
  topCornice.castShadow = true;
  addAnimeOutline(topCornice, { useHull: false, useEdges: true, color: 0x1c1814 });
  group.add(topCornice);

  // Decorative Dentil Blocks under Top Cornice
  for (let x = -7.6; x <= 2.2; x += 0.45) {
    const dentil = new THREE.Mesh(new THREE.BoxGeometry(0.2, 0.14, 0.16), stoneMat);
    dentil.position.set(x, 8.26, 1.48);
    group.add(dentil);
  }
  for (let z = -7.8; z <= 1.2; z += 0.45) {
    const dentil = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.14, 0.2), stoneMat);
    dentil.position.set(2.48, 8.26, z);
    group.add(dentil);
  }

  // Portland Stone Corner Quoins (Alternating stone corner blocks)
  const quoinCorners = [
    [-7.78, 1.38],
    [2.38, 1.38],
    [2.38, -8.18],
  ];
  quoinCorners.forEach(([qx, qz]) => {
    for (let r = 0; r < 8; r++) {
      const isLongX = r % 2 === 0;
      const qBlock = new THREE.Mesh(
        new THREE.BoxGeometry(isLongX ? 0.48 : 0.32, 0.38, isLongX ? 0.32 : 0.48),
        stoneMat
      );
      qBlock.position.set(qx, 5.1 + r * 0.42, qz);
      addAnimeOutline(qBlock, { useHull: false, useEdges: true, color: 0x1c1814 });
      group.add(qBlock);
    }
  });

  // Helper to create Victorian 6-over-6 Sash Windows on the Red Brick Upper Facade
  function createSashWindow(x, y, z, rotY, isWarmLit = true) {
    const wGroup = new THREE.Group();
    wGroup.position.set(x, y, z);
    wGroup.rotation.y = rotY;

    // Carved Stone Keystone Lintel above window
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.36, 0.24, 0.18), stoneMat);
    lintel.position.set(0, 1.08, 0.05);
    addAnimeOutline(lintel, { useHull: false, useEdges: true, color: 0x1c1814 });
    wGroup.add(lintel);

    // Projecting Stone Sill
    const sill = new THREE.Mesh(new THREE.BoxGeometry(1.42, 0.14, 0.26), stoneMat);
    sill.position.set(0, -1.04, 0.08);
    addAnimeOutline(sill, { useHull: false, useEdges: true, color: 0x1c1814 });
    wGroup.add(sill);

    // Cream Timber Outer Box Frame
    const frameMat = makeAnimeMaterial({ color: 0xf0e8d8, roughness: 0.4 });
    const outerFrame = new THREE.Mesh(new THREE.BoxGeometry(1.22, 1.96, 0.12), frameMat);
    outerFrame.position.set(0, 0, 0.02);
    addAnimeOutline(outerFrame, { useHull: false, useEdges: true, color: 0x161a22 });
    wGroup.add(outerFrame);

    // Glowing Window Glass Backing (Cozy warm study light or soft moonlit reflection)
    const paneMat = new THREE.MeshStandardMaterial({
      color: isWarmLit ? 0xffd184 : 0x3b4e73,
      emissive: isWarmLit ? 0xff9b30 : 0x1b2b4a,
      emissiveIntensity: isWarmLit ? 1.15 : 0.35,
      roughness: 0.15,
    });
    const pane = new THREE.Mesh(new THREE.PlaneGeometry(1.04, 1.78), paneMat);
    pane.position.set(0, 0, 0.085);
    wGroup.add(pane);

    // Sash Muntin Bars (Horizontal meeting rail + vertical glazing bars)
    const meetingRail = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.07, 0.06), frameMat);
    meetingRail.position.set(0, 0.02, 0.1);
    wGroup.add(meetingRail);

    [-0.34, 0, 0.34].forEach((gx) => {
      const vBar = new THREE.Mesh(new THREE.BoxGeometry(0.035, 1.8, 0.04), frameMat);
      vBar.position.set(gx, 0, 0.095);
      wGroup.add(vBar);
    });

    // Small Window Flower Box on Sill
    const boxMesh = new THREE.Mesh(new THREE.BoxGeometry(1.12, 0.22, 0.22), darkGreenMat);
    boxMesh.position.set(0, -0.88, 0.16);
    addAnimeOutline(boxMesh, { useHull: false, useEdges: true, color: 0x0a1c14 });
    wGroup.add(boxMesh);

    const foliageMat = makeAnimeMaterial({ color: 0x265437, roughness: 0.65 });
    for (let f = -2; f <= 2; f++) {
      const bush = new THREE.Mesh(new THREE.SphereGeometry(0.14, 8, 8), foliageMat);
      bush.position.set(f * 0.21, -0.74, 0.16);
      wGroup.add(bush);
    }

    return wGroup;
  }

  // 4 Sash Windows on South Red Brick Facade (Z = 1.42, Y = 6.62)
  [-6.2, -3.9, -1.6, 0.7].forEach((wx, idx) => {
    group.add(createSashWindow(wx, 6.62, 1.42, 0, idx !== 1));
  });

  // 4 Sash Windows on East Red Brick Facade (X = 2.42, Y = 6.62)
  [-0.9, -3.1, -5.3, -7.1].forEach((wz, idx) => {
    group.add(createSashWindow(2.42, 6.62, wz, Math.PI / 2, idx !== 2));
  });

  // Copper Rainwater Downspouts with Hopper Heads along the Facade
  const copperMat = makeAnimeMaterial({
    color: 0x3b6e5c, // Weathered verdigris bronze/copper
    roughness: 0.35,
    metalness: 0.65,
  });
  const downspouts = [
    { x: -7.25, z: 1.46 },
    { x: 2.46, z: -7.85 },
  ];
  downspouts.forEach(({ x, z }) => {
    const pipe = new THREE.Mesh(new THREE.CylinderGeometry(0.055, 0.055, 8.2, 10), copperMat);
    pipe.position.set(x, 4.32, z);
    addAnimeOutline(pipe, { thickness: 0.02, color: 0x0d1c16, useEdges: false });
    group.add(pipe);

    const hopper = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.26, 0.22), copperMat);
    hopper.position.set(x, 8.15, z);
    addAnimeOutline(hopper, { useHull: false, useEdges: true, color: 0x0d1c16 });
    group.add(hopper);
  });

  // Classic London Enamel Street Name Plaque mounted on South-East Brick Wall
  const streetPlaqueTex = createLondonStreetSignTexture('BLOOMSBURY WAY', 'WC1', 'CITY OF WESTMINSTER');
  const streetPlaqueMat = makeAnimeMaterial({ map: streetPlaqueTex, roughness: 0.25 });
  const streetPlaque = new THREE.Mesh(new THREE.BoxGeometry(1.15, 0.58, 0.05), streetPlaqueMat);
  streetPlaque.position.set(-0.35, 5.22, 1.45);
  addAnimeOutline(streetPlaque, { useHull: false, useEdges: true, color: 0x10141c });
  group.add(streetPlaque);

  // ==========================================================================
  // 8. WELSH SLATE MANSARD ROOF, DORMERS & LONDON CHIMNEY POTS
  // ==========================================================================
  // Pitched / Mansard Roof above Y = 8.65
  const mansardGeo = new THREE.CylinderGeometry(6.1, 7.1, 1.55, 4);
  mansardGeo.rotateY(Math.PI / 4);
  const mansardRoof = new THREE.Mesh(mansardGeo, slateRoofMat);
  mansardRoof.scale.set(1.04, 1, 0.98);
  mansardRoof.position.set(-2.7, 9.42, -3.4);
  mansardRoof.castShadow = true;
  addAnimeOutline(mansardRoof, { useHull: false, useEdges: true, color: 0x0b0f18 });
  group.add(mansardRoof);

  // Flat lead roof deck cap
  const roofCap = new THREE.Mesh(new THREE.BoxGeometry(8.6, 0.14, 8.1), darkIronMat);
  roofCap.position.set(-2.7, 10.22, -3.4);
  addAnimeOutline(roofCap, { useHull: false, useEdges: true, color: 0x0b0f18 });
  group.add(roofCap);

  // Two Red-Brick Chimney Stacks with Terracotta London Chimney Pots
  const chimneyCoords = [
    { x: -6.8, z: -2.2 },
    { x: -1.5, z: -7.2 },
  ];
  const terracottaMat = makeAnimeMaterial({ color: 0xa84a32, roughness: 0.55 });

  chimneyCoords.forEach(({ x, z }) => {
    const stack = new THREE.Mesh(new THREE.BoxGeometry(1.45, 1.35, 0.82), brickMat);
    stack.position.set(x, 10.65, z);
    stack.castShadow = true;
    addAnimeOutline(stack, { useHull: false, useEdges: true, color: 0x180a08 });
    group.add(stack);

    const cap = new THREE.Mesh(new THREE.BoxGeometry(1.58, 0.14, 0.94), stoneMat);
    cap.position.set(x, 11.35, z);
    addAnimeOutline(cap, { useHull: false, useEdges: true, color: 0x1c1814 });
    group.add(cap);

    [-0.42, 0, 0.42].forEach((px) => {
      const pot = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.14, 0.52, 10), terracottaMat);
      pot.position.set(x + px, 11.66, z);
      addAnimeOutline(pot, { thickness: 0.03, color: 0x240e08, useEdges: false });
      group.add(pot);
    });
  });

  // ==========================================================================
  // 9. SIDE ALLEY ENTRANCE ARCHWAY, NEIGHBOR WALL, IVY & LANTERN (小巷入口)
  // ==========================================================================
  const alleyGroup = new THREE.Group();
  alleyGroup.name = 'SideAlley';

  // Neighboring Victorian Brick Wall on West edge of Alley (X: -11.9 to -10.2, Z: -11.8 to +1.4)
  const neighborWall = new THREE.Mesh(new THREE.BoxGeometry(1.7, 7.6, 13.2), brickMat);
  neighborWall.position.set(-11.05, 4.02, -5.2);
  neighborWall.castShadow = true;
  neighborWall.receiveShadow = true;
  addAnimeOutline(neighborWall, { useHull: false, useEdges: true, color: 0x140a08 });
  alleyGroup.add(neighborWall);

  const neighborCornice = new THREE.Mesh(new THREE.BoxGeometry(1.88, 0.28, 13.4), stoneMat);
  neighborCornice.position.set(-11.05, 7.88, -5.2);
  addAnimeOutline(neighborCornice, { useHull: false, useEdges: true, color: 0x1c1814 });
  alleyGroup.add(neighborCornice);

  // Overhead Red-Brick Alley Archway spanning X = -10.2 to -7.8 at Z = +1.15
  const archBeam = new THREE.Mesh(new THREE.BoxGeometry(2.4, 1.35, 0.56), brickMat);
  archBeam.position.set(-9.0, 4.65, 1.12);
  archBeam.castShadow = true;
  addAnimeOutline(archBeam, { useHull: false, useEdges: true, color: 0x140a08 });
  alleyGroup.add(archBeam);

  const archCapping = new THREE.Mesh(new THREE.BoxGeometry(2.56, 0.18, 0.68), stoneMat);
  archCapping.position.set(-9.0, 5.38, 1.12);
  addAnimeOutline(archCapping, { useHull: false, useEdges: true, color: 0x1c1814 });
  alleyGroup.add(archCapping);

  // Wrought-Iron Overhead Grille & Hanging Alley Lantern under Archway
  const archGrill = new THREE.Mesh(new THREE.BoxGeometry(2.35, 0.45, 0.06), darkIronMat);
  archGrill.position.set(-9.0, 3.75, 1.12);
  addAnimeOutline(archGrill, { useHull: false, useEdges: true, color: 0x080b12 });
  alleyGroup.add(archGrill);

  const alleyLanternMat = new THREE.MeshStandardMaterial({
    color: 0xffd27d,
    emissive: 0xff9d2e,
    emissiveIntensity: 2.2,
  });
  const alleyLantern = new THREE.Mesh(new THREE.CylinderGeometry(0.13, 0.09, 0.32, 6), alleyLanternMat);
  alleyLantern.position.set(-9.0, 3.38, 1.12);
  addAnimeOutline(alleyLantern, { thickness: 0.03, color: 0x1a1208 });
  alleyGroup.add(alleyLantern);

  const alleyLight = new THREE.PointLight(0xffa43b, 2.2, 7.5, 1.8);
  alleyLight.position.set(-9.0, 3.15, 0.8);
  alleyGroup.add(alleyLight);

  // Stacked Wooden Crates, Wine Barrel & Climbing Wet Ivy inside the Alley
  const crateMat = makeAnimeMaterial({ color: 0x6e4929, roughness: 0.7 });
  const crateCoords = [
    { x: -8.15, y: 0.38, z: -0.6, s: 0.44, r: 0.12 },
    { x: -8.18, y: 0.8, z: -0.65, s: 0.38, r: -0.2 },
    { x: -9.85, y: 0.4, z: -2.4, s: 0.48, r: 0.08 },
  ];
  crateCoords.forEach(({ x, y, z, s, r }) => {
    const crate = new THREE.Mesh(new THREE.BoxGeometry(s, s, s), crateMat);
    crate.position.set(x, y, z);
    crate.rotation.y = r;
    crate.castShadow = true;
    addAnimeOutline(crate, { useHull: false, useEdges: true, color: 0x211308 });
    alleyGroup.add(crate);
  });

  // Climbing English Ivy along the Alley Arch & Brick Wall
  const ivyMat = makeAnimeMaterial({ color: 0x1e4d32, roughness: 0.55 });
  for (let i = 0; i < 18; i++) {
    const leafCluster = new THREE.Mesh(new THREE.DodecahedronGeometry(0.18 + (i % 3) * 0.05, 1), ivyMat);
    leafCluster.position.set(
      -10.12 + (i > 10 ? (i - 10) * 0.25 : 0),
      1.2 + i * 0.22,
      1.15 - (i % 4) * 0.35
    );
    addAnimeOutline(leafCluster, { thickness: 0.025, color: 0x0a1f12, useEdges: false });
    alleyGroup.add(leafCluster);
  }

  group.add(alleyGroup);
  scene.add(group);

  return {
    group,
    doorLeafPivot,
    windChimePivot,
    hangingSignPivot,
    signBulbMats,
    signLights,
    southAwning,
    eastAwning,
  };
}
