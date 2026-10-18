import * as THREE from 'three';
import { Reflector } from 'three/addons/objects/Reflector.js';
import {
  addAnimeOutline,
  makeAnimeMaterial,
  createYorkstoneTexture,
  createCobblestoneTexture,
} from './materials.js';

/**
 * Creates the wet asphalt road canvas texture with British road markings:
 * - Reflective Zebra Crossing & Zig-Zag lines
 * - Double Yellow Lines around the street corner
 * - Roadside Parking Bay dashed lines
 * - Wet puddle masks
 */
function createRoadMarkingsTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 2048;
  canvas.height = 2048;
  const ctx = canvas.getContext('2d');

  // Deep wet blue-charcoal tarmac base
  ctx.fillStyle = '#121824';
  ctx.fillRect(0, 0, 2048, 2048);

  // Subtle tarmac aggregate noise & wet sheen patches
  let seed = 303;
  const rand = () => {
    seed = (seed * 16807) % 2147483647;
    return (seed - 1) / 2147483646;
  };

  for (let i = 0; i < 90; i++) {
    const x = rand() * 2048;
    const y = rand() * 2048;
    const r = 60 + rand() * 180;
    const g = ctx.createRadialGradient(x, y, 10, x, y, r);
    g.addColorStop(0, 'rgba(32, 46, 72, 0.28)');
    g.addColorStop(1, 'rgba(14, 20, 32, 0)');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  }

  // Helper to map world (x, z) in [-12, +12] to canvas [0, 2048]
  const toPx = (w) => ((w + 12) / 24) * 2048;
  const toLen = (l) => (l / 24) * 2048;

  // 1. Double Yellow Lines along the South & East Curb
  ctx.strokeStyle = '#d9a726';
  ctx.lineWidth = 7;
  const curbOffsets = [0.28, 0.44];
  curbOffsets.forEach((off) => {
    ctx.beginPath();
    // South curb from X = -11.6 to -5.2
    ctx.moveTo(toPx(-11.6), toPx(4.0 + off));
    ctx.lineTo(toPx(-5.2), toPx(4.0 + off));
    ctx.stroke();

    // Corner curve from X = -0.4 to +5.0, then up East curb to Z = +1.4
    ctx.beginPath();
    ctx.moveTo(toPx(-0.4), toPx(4.0 + off));
    ctx.lineTo(toPx(4.5 + off), toPx(4.0 + off));
    ctx.lineTo(toPx(5.0 + off), toPx(3.5 + off));
    ctx.lineTo(toPx(5.0 + off), toPx(1.5));
    ctx.stroke();
  });

  // 2. Roadside Parking Bay on East Roadway (X: +5.35 to +7.85, Z: -10.8 to +1.0)
  ctx.strokeStyle = 'rgba(230, 238, 250, 0.85)';
  ctx.lineWidth = 8;
  ctx.setLineDash([28, 22]);
  ctx.strokeRect(
    toPx(5.35),
    toPx(-10.8),
    toLen(2.5),
    toLen(11.8)
  );
  ctx.setLineDash([]);

  // Divider lines between 2 parking spaces
  ctx.beginPath();
  ctx.moveTo(toPx(5.35), toPx(-4.9));
  ctx.lineTo(toPx(7.85), toPx(-4.9));
  ctx.stroke();

  // 3. Reflective Zebra Crossing across South Roadway (X: -4.6 to -1.2, Z: +4.4 to +11.4)
  // Give lines at ends of crossing
  ctx.lineWidth = 8;
  ctx.setLineDash([20, 16]);
  ctx.beginPath();
  ctx.moveTo(toPx(-4.7), toPx(4.4));
  ctx.lineTo(toPx(-4.7), toPx(11.4));
  ctx.moveTo(toPx(-1.1), toPx(4.4));
  ctx.lineTo(toPx(-1.1), toPx(11.4));
  ctx.stroke();
  ctx.setLineDash([]);

  // Bold white Zebra Stripes
  const stripeCount = 7;
  const zStart = 4.65;
  const zSpan = 6.5;
  const stepZ = zSpan / stripeCount;
  for (let i = 0; i < stripeCount; i++) {
    const sz = zStart + i * stepZ;
    // Slight wet glow around stripe
    ctx.fillStyle = 'rgba(210, 230, 255, 0.18)';
    ctx.fillRect(toPx(-4.55) - 6, toPx(sz) - 6, toLen(3.3) + 12, toLen(stepZ * 0.56) + 12);

    ctx.fillStyle = '#edf3fc';
    ctx.fillRect(toPx(-4.55), toPx(sz), toLen(3.3), toLen(stepZ * 0.56));
  }

  // Center lane divider dashes on South & East roads
  ctx.strokeStyle = 'rgba(220, 230, 245, 0.72)';
  ctx.lineWidth = 9;
  ctx.setLineDash([48, 42]);
  ctx.beginPath();
  ctx.moveTo(toPx(-11.5), toPx(8.0));
  ctx.lineTo(toPx(-5.4), toPx(8.0));
  ctx.moveTo(toPx(0.2), toPx(8.0));
  ctx.lineTo(toPx(8.6), toPx(8.0));
  ctx.moveTo(toPx(8.8), toPx(7.2));
  ctx.lineTo(toPx(8.8), toPx(-11.5));
  ctx.stroke();
  ctx.setLineDash([]);

  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

export function buildBaseAndStreet(scene) {
  const group = new THREE.Group();
  group.name = 'BaseAndStreet';

  // ==========================================================================
  // 1. COLLECTIBLE SQUARE DIORAMA BASE PLINTH (正方形微缩模型底座)
  // ==========================================================================
  const plinthGroup = new THREE.Group();

  // Main upper earth/stone cut block (24.0 x 1.1 x 24.0)
  const corePlinthGeo = new THREE.BoxGeometry(24.0, 1.1, 24.0);
  const corePlinthMat = makeAnimeMaterial({
    color: 0x1b1614,
    roughness: 0.75,
    metalness: 0.08,
  });
  const corePlinth = new THREE.Mesh(corePlinthGeo, corePlinthMat);
  corePlinth.position.set(0, -0.55, 0);
  corePlinth.receiveShadow = true;
  addAnimeOutline(corePlinth, { thickness: 0.008, color: 0x080b12, useHull: false, useEdges: true });
  plinthGroup.add(corePlinth);

  // Molded dark walnut display frame (24.45 x 0.36 x 24.45)
  const midFrameGeo = new THREE.BoxGeometry(24.45, 0.36, 24.45);
  const walnutMat = makeAnimeMaterial({
    color: 0x26150d,
    roughness: 0.45,
    metalness: 0.15,
  });
  const midFrame = new THREE.Mesh(midFrameGeo, walnutMat);
  midFrame.position.set(0, -1.22, 0);
  addAnimeOutline(midFrame, { useHull: false, useEdges: true, color: 0x090604 });
  plinthGroup.add(midFrame);

  // Stepped bottom museum foot (24.9 x 0.32 x 24.9)
  const footGeo = new THREE.BoxGeometry(24.9, 0.32, 24.9);
  const footMat = makeAnimeMaterial({
    color: 0x140b07,
    roughness: 0.5,
    metalness: 0.2,
  });
  const footMesh = new THREE.Mesh(footGeo, footMat);
  footMesh.position.set(0, -1.54, 0);
  addAnimeOutline(footMesh, { useHull: false, useEdges: true, color: 0x050403 });
  plinthGroup.add(footMesh);

  // Brass pinstripe trim ring around the plinth perimeter
  const brassMat = makeAnimeMaterial({
    color: 0xd4af37,
    roughness: 0.28,
    metalness: 0.85,
  });
  const trimGeo = new THREE.BoxGeometry(24.16, 0.06, 24.16);
  const trimMesh = new THREE.Mesh(trimGeo, brassMat);
  trimMesh.position.set(0, -0.04, 0);
  plinthGroup.add(trimMesh);

  // Cross-section details on the South & East vertical faces of the plinth (sewer arch & pipes)
  const sewerArchGeo = new THREE.CylinderGeometry(0.36, 0.36, 0.18, 16);
  sewerArchGeo.rotateX(Math.PI / 2);
  const sewerDarkMat = makeAnimeMaterial({ color: 0x070a0f, roughness: 0.9 });
  const sewerBrickMat = makeAnimeMaterial({ color: 0x6e2a1f, roughness: 0.7 });

  const sewerRing = new THREE.Mesh(new THREE.TorusGeometry(0.38, 0.07, 10, 20), sewerBrickMat);
  sewerRing.position.set(2.4, -0.62, 12.01);
  plinthGroup.add(sewerRing);

  const sewerHole = new THREE.Mesh(sewerArchGeo, sewerDarkMat);
  sewerHole.position.set(2.4, -0.62, 11.95);
  plinthGroup.add(sewerHole);

  // Collectible brass nameplate on the front-south bevel
  const plaqueFrame = new THREE.Mesh(new THREE.BoxGeometry(3.2, 0.26, 0.08), brassMat);
  plaqueFrame.position.set(0, -1.22, 12.24);
  addAnimeOutline(plaqueFrame, { thickness: 0.02, color: 0x120b04 });
  plinthGroup.add(plaqueFrame);

  group.add(plinthGroup);

  // ==========================================================================
  // 2. REAL-TIME REFLECTIVE WET LONDON ROADWAY (街道与积水镜面反射)
  // ==========================================================================
  const roadPlaneGeo = new THREE.PlaneGeometry(23.96, 23.96);

  // Real-time Planar Reflector for wet street & puddle reflections
  const groundReflector = new Reflector(roadPlaneGeo, {
    clipBias: 0.003,
    textureWidth: Math.min(1024, window.innerWidth * window.devicePixelRatio * 0.75),
    textureHeight: Math.min(1024, window.innerHeight * window.devicePixelRatio * 0.75),
    color: 0x5c7396,
  });
  groundReflector.rotation.x = -Math.PI / 2;
  groundReflector.position.y = 0.012;
  group.add(groundReflector);

  // Semi-transparent wet asphalt & road markings overlay on top of Reflector
  const roadTex = createRoadMarkingsTexture();
  const roadOverlayMat = new THREE.MeshStandardMaterial({
    map: roadTex,
    roughness: 0.18,
    metalness: 0.25,
    transparent: true,
    opacity: 0.76,
  });
  const roadOverlay = new THREE.Mesh(roadPlaneGeo, roadOverlayMat);
  roadOverlay.rotation.x = -Math.PI / 2;
  roadOverlay.position.y = 0.02;
  roadOverlay.receiveShadow = true;
  group.add(roadOverlay);

  // ==========================================================================
  // 3. RAISED YORKSTONE SIDEWALK & COBBLESTONE ALLEY (石质人行道与小巷)
  // ==========================================================================
  const yorkTex = createYorkstoneTexture();
  yorkTex.repeat.set(4.5, 4.5);

  const sidewalkMat = makeAnimeMaterial({
    map: yorkTex,
    color: 0x9aa9c0,
    roughness: 0.24,
    metalness: 0.16,
  });

  // Main Café & Corner Sidewalk Platform (X: -7.8 to +5.0, Z: -11.98 to +4.0 -> width 12.8, depth 15.98)
  const mainWalkGeo = new THREE.BoxGeometry(12.8, 0.22, 15.98);
  const mainWalk = new THREE.Mesh(mainWalkGeo, sidewalkMat);
  mainWalk.position.set(-1.4, 0.11, -3.99);
  mainWalk.receiveShadow = true;
  mainWalk.castShadow = true;
  addAnimeOutline(mainWalk, { useHull: false, useEdges: true, color: 0x0e1420 });
  group.add(mainWalk);

  // West Sidewalk Block past the Alley (X: -11.98 to -10.2, Z: -11.98 to +4.0 -> width 1.78, depth 15.98)
  const westWalkGeo = new THREE.BoxGeometry(1.78, 0.22, 15.98);
  const westWalk = new THREE.Mesh(westWalkGeo, sidewalkMat);
  westWalk.position.set(-11.09, 0.11, -3.99);
  westWalk.receiveShadow = true;
  westWalk.castShadow = true;
  addAnimeOutline(westWalk, { useHull: false, useEdges: true, color: 0x0e1420 });
  group.add(westWalk);

  // Sidewalk Apron in front of the Alley Entrance (X: -10.2 to -7.8, Z: +1.4 to +4.0)
  const alleyApronGeo = new THREE.BoxGeometry(2.4, 0.18, 2.6);
  const alleyApron = new THREE.Mesh(alleyApronGeo, sidewalkMat);
  alleyApron.position.set(-9.0, 0.09, 2.7);
  alleyApron.receiveShadow = true;
  addAnimeOutline(alleyApron, { useHull: false, useEdges: true, color: 0x0e1420 });
  group.add(alleyApron);

  // Cobblestone Alley Floor (X: -10.2 to -7.8, Z: -11.98 to +1.4)
  const cobbleTex = createCobblestoneTexture();
  cobbleTex.repeat.set(2, 9);
  const cobbleMat = makeAnimeMaterial({
    map: cobbleTex,
    color: 0x8d9db8,
    roughness: 0.2,
    metalness: 0.22,
  });
  const alleyFloorGeo = new THREE.BoxGeometry(2.4, 0.16, 13.38);
  const alleyFloor = new THREE.Mesh(alleyFloorGeo, cobbleMat);
  alleyFloor.position.set(-9.0, 0.08, -5.29);
  alleyFloor.receiveShadow = true;
  group.add(alleyFloor);

  // ==========================================================================
  // 4. GRANITE CURBSTONES (路缘石) & TACTILE PAVING
  // ==========================================================================
  const curbMat = makeAnimeMaterial({
    color: 0x5c687d,
    roughness: 0.35,
    metalness: 0.12,
  });

  // South edge curbstones along Z = 4.02 (from X = -11.8 to +4.8)
  for (let x = -11.5; x <= 4.6; x += 0.95) {
    // Slightly lower curb at zebra crossing (-4.5 to -1.3)
    const isCrossing = x >= -4.6 && x <= -1.2;
    const h = isCrossing ? 0.14 : 0.24;
    const curbStone = new THREE.Mesh(new THREE.BoxGeometry(0.91, h, 0.24), curbMat);
    curbStone.position.set(x, h * 0.5, 4.02);
    curbStone.castShadow = true;
    curbStone.receiveShadow = true;
    addAnimeOutline(curbStone, { useHull: false, useEdges: true, color: 0x101622, edgeOpacity: 0.7 });
    group.add(curbStone);
  }

  // East edge curbstones along X = 5.02 (from Z = -11.5 to +3.6)
  for (let z = -11.5; z <= 3.6; z += 0.95) {
    const curbStone = new THREE.Mesh(new THREE.BoxGeometry(0.24, 0.24, 0.91), curbMat);
    curbStone.position.set(5.02, 0.12, z);
    curbStone.castShadow = true;
    curbStone.receiveShadow = true;
    addAnimeOutline(curbStone, { useHull: false, useEdges: true, color: 0x101622, edgeOpacity: 0.7 });
    group.add(curbStone);
  }

  // Corner Keystone at (5.02, 4.02)
  const cornerCurb = new THREE.Mesh(new THREE.CylinderGeometry(0.32, 0.32, 0.25, 12), curbMat);
  cornerCurb.position.set(4.92, 0.125, 3.92);
  addAnimeOutline(cornerCurb, { useHull: false, useEdges: true, color: 0x101622 });
  group.add(cornerCurb);

  // Red/Buff Tactile Blister Paving at Zebra Crossing Curb Drop (X: -4.5 to -1.3, Z: 3.45)
  const tactileMat = makeAnimeMaterial({
    color: 0x8f4b3e,
    roughness: 0.45,
  });
  const tactileSlab = new THREE.Mesh(new THREE.BoxGeometry(3.3, 0.03, 0.75), tactileMat);
  tactileSlab.position.set(-2.9, 0.23, 3.48);
  addAnimeOutline(tactileSlab, { useHull: false, useEdges: true, color: 0x22100d });
  group.add(tactileSlab);

  // ==========================================================================
  // 5. STORM DRAIN GUTTERS & CAST-IRON GRATES (下水道排水沟与篦子)
  // ==========================================================================
  const grateMat = makeAnimeMaterial({
    color: 0x1c222d,
    roughness: 0.3,
    metalness: 0.75,
  });
  const grateSlotMat = new THREE.MeshBasicMaterial({ color: 0x05070b });

  const grateLocations = [
    { x: 1.6, z: 4.32, rotY: 0 },
    { x: -6.4, z: 4.32, rotY: 0 },
    { x: 5.32, z: -1.8, rotY: Math.PI / 2 },
    { x: -9.0, z: 1.55, rotY: 0 }, // Alley drain grate
  ];

  grateLocations.forEach(({ x, z, rotY }) => {
    const gGroup = new THREE.Group();
    gGroup.position.set(x, 0.025, z);
    gGroup.rotation.y = rotY;

    const frame = new THREE.Mesh(new THREE.BoxGeometry(0.68, 0.025, 0.44), grateMat);
    addAnimeOutline(frame, { useHull: false, useEdges: true, color: 0x080b10 });
    gGroup.add(frame);

    const pit = new THREE.Mesh(new THREE.PlaneGeometry(0.58, 0.34), grateSlotMat);
    pit.rotation.x = -Math.PI / 2;
    pit.position.y = 0.014;
    gGroup.add(pit);

    for (let i = -3; i <= 3; i++) {
      const bar = new THREE.Mesh(new THREE.BoxGeometry(0.04, 0.03, 0.36), grateMat);
      bar.position.set(i * 0.08, 0.015, 0);
      gGroup.add(bar);
    }

    group.add(gGroup);
  });

  // Circular Victorian Cast-Iron Manhole Cover in the Intersection
  const manhole = new THREE.Mesh(new THREE.CylinderGeometry(0.58, 0.58, 0.025, 20), grateMat);
  manhole.position.set(2.8, 0.022, 6.8);
  addAnimeOutline(manhole, { useHull: false, useEdges: true, color: 0x070a10 });
  group.add(manhole);

  // ==========================================================================
  // 6. MIRROR PUDDLES ON STREET, SIDEWALK & ALLEY (雨水积洼)
  // ==========================================================================
  const puddleMat = new THREE.MeshStandardMaterial({
    color: 0x16243b,
    roughness: 0.03,
    metalness: 0.85,
    transparent: true,
    opacity: 0.42,
  });

  const puddleSpecs = [
    // Road puddles (let underlying Reflector shine strongly through)
    { x: -0.6, y: 0.024, z: 5.5, rx: 2.2, rz: 1.4, rot: 0.2 },
    { x: 3.6, y: 0.024, z: 5.2, rx: 1.8, rz: 1.3, rot: -0.3 },
    { x: 6.4, y: 0.024, z: 1.8, rx: 1.5, rz: 2.1, rot: 0.1 },
    { x: -6.8, y: 0.024, z: 5.4, rx: 1.9, rz: 1.2, rot: 0.15 },
    // Sidewalk & Alley puddles
    { x: -2.4, y: 0.224, z: 2.6, rx: 1.2, rz: 0.75, rot: 0.1 },
    { x: 3.4, y: 0.224, z: 2.2, rx: 0.95, rz: 0.85, rot: -0.25 },
    { x: 3.6, y: 0.224, z: -4.2, rx: 0.8, rz: 1.3, rot: 0.05 },
    { x: -9.0, y: 0.165, z: -1.5, rx: 0.75, rz: 1.6, rot: 0.0 },
  ];

  const puddleLocations = [];
  puddleSpecs.forEach((p) => {
    const geo = new THREE.CircleGeometry(1, 28);
    geo.scale(p.rx, p.rz, 1);
    const mesh = new THREE.Mesh(geo, puddleMat);
    mesh.rotation.x = -Math.PI / 2;
    mesh.rotation.z = p.rot;
    mesh.position.set(p.x, p.y, p.z);
    group.add(mesh);

    // Subtle dark wet ring outline around each puddle
    const ringGeo = new THREE.RingGeometry(0.97, 1.02, 28);
    ringGeo.scale(p.rx, p.rz, 1);
    const ringMesh = new THREE.Mesh(
      ringGeo,
      new THREE.MeshBasicMaterial({
        color: 0x0c1422,
        transparent: true,
        opacity: 0.45,
        side: THREE.DoubleSide,
      })
    );
    ringMesh.rotation.x = -Math.PI / 2;
    ringMesh.rotation.z = p.rot;
    ringMesh.position.set(p.x, p.y + 0.001, p.z);
    group.add(ringMesh);

    puddleLocations.push(p);
  });

  // ==========================================================================
  // 7. BELISHA BEACONS AT ZEBRA CROSSING (斑马线闪烁黄球灯柱)
  // ==========================================================================
  const beaconGlobes = [];
  const beaconLights = [];
  const beaconCoords = [
    { x: -4.85, y: 0.22, z: 3.65 },
    { x: -0.95, y: 0.22, z: 3.65 },
  ];

  const whiteStripeMat = makeAnimeMaterial({ color: 0xf0f4fa, roughness: 0.3 });
  const blackStripeMat = makeAnimeMaterial({ color: 0x151922, roughness: 0.4 });

  beaconCoords.forEach(({ x, y, z }) => {
    const bGroup = new THREE.Group();
    bGroup.position.set(x, y, z);

    // Striped pole
    for (let s = 0; s < 7; s++) {
      const seg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.055, 0.055, 0.34, 12),
        s % 2 === 0 ? blackStripeMat : whiteStripeMat
      );
      seg.position.y = 0.17 + s * 0.34;
      seg.castShadow = true;
      addAnimeOutline(seg, { thickness: 0.025, color: 0x0a0e17, useEdges: false });
      bGroup.add(seg);
    }

    // Amber glowing globe
    const globeMat = new THREE.MeshStandardMaterial({
      color: 0xffaa00,
      emissive: 0xff9900,
      emissiveIntensity: 2.2,
      roughness: 0.15,
    });
    const globe = new THREE.Mesh(new THREE.SphereGeometry(0.19, 16, 16), globeMat);
    globe.position.y = 2.65;
    addAnimeOutline(globe, { thickness: 0.035, color: 0x261200, useEdges: false });
    bGroup.add(globe);
    beaconGlobes.push(globeMat);

    const bLight = new THREE.PointLight(0xffa01a, 1.2, 4.5, 2.0);
    bLight.position.set(0, 2.65, 0);
    bGroup.add(bLight);
    beaconLights.push(bLight);

    group.add(bGroup);
  });

  scene.add(group);

  return {
    group,
    groundReflector,
    puddleLocations,
    beaconGlobes,
    beaconLights,
  };
}
