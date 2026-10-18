import * as THREE from 'three';

export function createDioramaBase(materials) {
  const group = new THREE.Group();

  // 1. Collectible Diorama Pedestal (Heavy dark slate block with chamfered edge)
  const pedestalGeo = new THREE.BoxGeometry(24, 1.4, 24);
  const pedestalMesh = new THREE.Mesh(pedestalGeo, materials.pedestal);
  pedestalMesh.position.y = -0.7;
  pedestalMesh.receiveShadow = true;
  group.add(pedestalMesh);

  // Brass Trim Ring around the top edge of the pedestal
  const trimGeo = new THREE.BoxGeometry(24.15, 0.08, 24.15);
  const trimMesh = new THREE.Mesh(trimGeo, materials.pedestalTrim);
  trimMesh.position.y = -0.06;
  group.add(trimMesh);

  // Base outline for clean cel-shaded contour
  const baseOutline = materials.createOutline(pedestalMesh, 0.015, 0x0a0c10);
  group.add(baseOutline);

  // 2. Road Surface (L-shaped intersection, wet asphalt)
  // Horizontal road strip (z: 6.2 to 12)
  const roadHorizGeo = new THREE.BoxGeometry(24, 0.1, 5.8);
  const roadHoriz = new THREE.Mesh(roadHorizGeo, materials.road);
  roadHoriz.position.set(0, 0.05, 9.1);
  roadHoriz.receiveShadow = true;
  group.add(roadHoriz);

  // Vertical road strip (x: -12 to -6.2, z: -12 to 6.2)
  const roadVertGeo = new THREE.BoxGeometry(5.8, 0.1, 18.2);
  const roadVert = new THREE.Mesh(roadVertGeo, materials.road);
  roadVert.position.set(-9.1, 0.05, -2.9);
  roadVert.rotation.y = Math.PI / 2;
  roadVert.receiveShadow = true;
  group.add(roadVert);

  // 3. Sidewalk / Pavement (Elevated curb by 0.18 units)
  // Main corner sidewalk slab (x: -6 to 12, z: -12 to 6)
  const sidewalkShape = new THREE.Shape();
  // Outer curb boundary (curving smoothly at corner (-6, 6))
  sidewalkShape.moveTo(12, -12);
  sidewalkShape.lineTo(12, 6.0);
  sidewalkShape.lineTo(-4.5, 6.0);
  // Rounded corner curb
  sidewalkShape.quadraticCurveTo(-6.0, 6.0, -6.0, 4.5);
  sidewalkShape.lineTo(-6.0, -12);
  sidewalkShape.lineTo(12, -12);

  const extrudeSettings = {
    steps: 1,
    depth: 0.18,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.03,
    bevelSegments: 2
  };

  const sidewalkGeo = new THREE.ExtrudeGeometry(sidewalkShape, extrudeSettings);
  sidewalkGeo.rotateX(Math.PI / 2);
  const sidewalkMesh = new THREE.Mesh(sidewalkGeo, materials.pavement);
  sidewalkMesh.position.set(0, 0.2, 0);
  sidewalkMesh.receiveShadow = true;
  group.add(sidewalkMesh);

  // 4. Granite Curb Stones (running along the sidewalk edge)
  const curbMat = materials.curbStone;
  const curbHeight = 0.22;
  const curbWidth = 0.25;

  // Horizontal curb segments
  for (let x = -4.2; x <= 11.5; x += 1.2) {
    const curbGeo = new THREE.BoxGeometry(1.15, curbHeight, curbWidth);
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.set(x + 0.55, curbHeight / 2 + 0.02, 6.1);
    curb.receiveShadow = true;
    group.add(curb);
  }

  // Vertical curb segments
  for (let z = -11.5; z <= 4.2; z += 1.2) {
    const curbGeo = new THREE.BoxGeometry(curbWidth, curbHeight, 1.15);
    const curb = new THREE.Mesh(curbGeo, curbMat);
    curb.position.set(-6.1, curbHeight / 2 + 0.02, z + 0.55);
    curb.receiveShadow = true;
    group.add(curb);
  }

  // Rounded Corner curb segment
  const cornerArc = new THREE.CylinderGeometry(curbWidth * 1.5, curbWidth * 1.5, curbHeight, 8, 1, false, Math.PI, Math.PI / 2);
  const cornerCurb = new THREE.Mesh(cornerArc, curbMat);
  cornerCurb.position.set(-5.0, curbHeight / 2 + 0.02, 5.0);
  group.add(cornerCurb);

  // 5. Rain Puddles with ripples on the road and pavement
  const puddles = [];

  // Puddle 1: In the road gutter near corner
  const p1Geo = new THREE.CircleGeometry(1.4, 24);
  p1Geo.rotateX(-Math.PI / 2);
  const p1 = new THREE.Mesh(p1Geo, materials.puddle);
  p1.position.set(-5.2, 0.11, 7.8);
  group.add(p1);
  puddles.push(p1);

  // Puddle 2: Road crossing area
  const p2Geo = new THREE.CircleGeometry(1.9, 24);
  p2Geo.rotateX(-Math.PI / 2);
  const p2 = new THREE.Mesh(p2Geo, materials.puddle);
  p2.position.set(2.8, 0.11, 9.4);
  group.add(p2);
  puddles.push(p2);

  // Puddle 3: Sidewalk shallow puddle near lamp
  const p3Geo = new THREE.CircleGeometry(0.85, 20);
  p3Geo.rotateX(-Math.PI / 2);
  const p3 = new THREE.Mesh(p3Geo, materials.puddle);
  p3.position.set(-3.2, 0.22, 4.2);
  group.add(p3);
  puddles.push(p3);

  // Puddle 4: Sidewalk cafe terrace area puddle
  const p4Geo = new THREE.CircleGeometry(0.7, 18);
  p4Geo.rotateX(-Math.PI / 2);
  const p4 = new THREE.Mesh(p4Geo, materials.puddle);
  p4.position.set(4.5, 0.22, 4.8);
  group.add(p4);
  puddles.push(p4);

  // 6. Cast Iron Road Storm Drain
  const drainGrateGeo = new THREE.BoxGeometry(0.9, 0.04, 0.6);
  const drainMat = new THREE.MeshToonMaterial({ color: 0x141820, gradientMap: materials.gradientMap });
  const drainGrate = new THREE.Mesh(drainGrateGeo, drainMat);
  drainGrate.position.set(-4.8, 0.105, 6.6);
  group.add(drainGrate);

  // Grate slits
  for (let s = -0.35; s <= 0.35; s += 0.12) {
    const slit = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.05, 0.45),
      new THREE.MeshBasicMaterial({ color: 0x080a0e })
    );
    slit.position.set(-4.8 + s, 0.11, 6.6);
    group.add(slit);
  }

  // 7. Sewer Manhole Cover on Road
  const manholeCover = new THREE.Mesh(
    new THREE.CylinderGeometry(0.65, 0.65, 0.05, 18),
    new THREE.MeshStandardMaterial({
      color: 0x22262d,
      roughness: 0.4,
      metalness: 0.6
    })
  );
  manholeCover.position.set(-9.2, 0.105, 3.5);
  group.add(manholeCover);

  return {
    group,
    puddles
  };
}
