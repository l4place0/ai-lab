import * as THREE from 'three';

export function createCoffeeShopBuilding(materials) {
  const group = new THREE.Group();

  // Building Footprint:
  // X: -2.2 to 9.5 (Width: 11.7)
  // Z: -9.8 to -1.0 (Depth: 8.8)
  // Ground floor height: 3.4
  // 1st floor height: 2.7
  // 2nd floor / Attics height: 2.7
  // Total building height ~ 8.8

  const bWidth = 11.7;
  const bDepth = 8.8;
  const bHeight = 8.8;
  const posX = ( -2.2 + 9.5 ) / 2; // 3.65
  const posZ = ( -9.8 + -1.0 ) / 2; // -5.4

  // 1. Core Upper Brick Wall Shell (2nd & 3rd Floors)
  const upperHeight = 5.4;
  const upperGeo = new THREE.BoxGeometry(bWidth, upperHeight, bDepth);
  const upperMesh = new THREE.Mesh(upperGeo, materials.brick);
  upperMesh.position.set(posX, 3.4 + upperHeight / 2, posZ);
  upperMesh.castShadow = true;
  upperMesh.receiveShadow = true;
  group.add(upperMesh);

  // Brick outline
  group.add(materials.createOutline(upperMesh, 0.008, 0x1a1c22));

  // 2. Ground Floor Back & Side Solid Walls (Interior enclosure)
  // Back Wall (z = -9.8)
  const backWall = new THREE.Mesh(
    new THREE.BoxGeometry(bWidth, 3.4, 0.4),
    materials.darkWood
  );
  backWall.position.set(posX, 1.7 + 0.2, -9.6);
  group.add(backWall);

  // Right Side Wall (x = 9.5)
  const rightWall = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 3.4, bDepth),
    materials.brick
  );
  rightWall.position.set(9.3, 1.7 + 0.2, posZ);
  group.add(rightWall);

  // Interior Floor Slab (Parquet)
  const floorGeo = new THREE.BoxGeometry(bWidth - 0.4, 0.1, bDepth - 0.4);
  const floorMesh = new THREE.Mesh(floorGeo, materials.parquet);
  floorMesh.position.set(posX, 0.25, posZ);
  floorMesh.receiveShadow = true;
  group.add(floorMesh);

  // 3. Ground Floor Shopfront Framework (British Racing Green Wooden Structure)
  // Pilasters (Vertical wooden fluted columns on corners and door frames)
  const pilasterPositions = [
    [-2.2, -1.0], // Front-left corner
    [4.8, -1.0],  // Next to front door
    [6.6, -1.0],  // Other side of front door
    [9.4, -1.0],  // Front-right corner
    [-2.2, -5.5], // Side window division
    [-2.2, -9.8]  // Side-back corner
  ];

  pilasterPositions.forEach(([px, pz]) => {
    // Column shaft
    const pilaster = new THREE.Mesh(
      new THREE.BoxGeometry(0.35, 3.2, 0.35),
      materials.shopfrontGreen
    );
    pilaster.position.set(px, 1.8, pz);
    pilaster.castShadow = true;
    group.add(pilaster);

    // Decorative Capital / Corbel bracket
    const cap = new THREE.Mesh(
      new THREE.BoxGeometry(0.45, 0.2, 0.45),
      materials.shopfrontTrimGold
    );
    cap.position.set(px, 3.3, pz);
    group.add(cap);

    // Column Base
    const base = new THREE.Mesh(
      new THREE.BoxGeometry(0.42, 0.3, 0.42),
      materials.shopfrontGreen
    );
    base.position.set(px, 0.35, pz);
    group.add(base);
  });

  // Low Wooden Stallriser (Base beneath the windows)
  // Front window stallriser
  const frontStall = new THREE.Mesh(
    new THREE.BoxGeometry(6.7, 0.6, 0.25),
    materials.shopfrontGreen
  );
  frontStall.position.set(1.3, 0.5, -1.0);
  group.add(frontStall);

  // Side window stallriser
  const sideStall = new THREE.Mesh(
    new THREE.BoxGeometry(0.25, 0.6, 4.3),
    materials.shopfrontGreen
  );
  sideStall.position.set(-2.2, 0.5, -3.25);
  group.add(sideStall);

  // 4. Large Panoramic Glass Windows (Allowing clear view inside)
  // Front Main Cafe Window Glass
  const frontGlassGeo = new THREE.PlaneGeometry(6.7, 2.4);
  const frontGlass = new THREE.Mesh(frontGlassGeo, materials.cafeGlass);
  frontGlass.position.set(1.3, 2.0, -1.0);
  group.add(frontGlass);

  // Front Window Mullions (Dark green / brass window frames)
  // Horizontal bar
  const frontMidBar = new THREE.Mesh(
    new THREE.BoxGeometry(6.7, 0.08, 0.12),
    materials.shopfrontGreen
  );
  frontMidBar.position.set(1.3, 2.5, -1.0);
  group.add(frontMidBar);

  // Vertical bars (3 panes)
  [-0.9, 1.3, 3.5].forEach(vx => {
    const vBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.4, 0.12),
      materials.shopfrontGreen
    );
    vBar.position.set(vx, 2.0, -1.0);
    group.add(vBar);
  });

  // Side Cafe Window Glass
  const sideGlassGeo = new THREE.PlaneGeometry(4.3, 2.4);
  sideGlassGeo.rotateY(Math.PI / 2);
  const sideGlass = new THREE.Mesh(sideGlassGeo, materials.cafeGlass);
  sideGlass.position.set(-2.2, 2.0, -3.25);
  group.add(sideGlass);

  // Side Window Mullions
  const sideMidBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.12, 0.08, 4.3),
    materials.shopfrontGreen
  );
  sideMidBar.position.set(-2.2, 2.5, -3.25);
  group.add(sideMidBar);

  [-4.3, -2.2].forEach(vz => {
    const vBar = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 2.4, 0.08),
      materials.shopfrontGreen
    );
    vBar.position.set(-2.2, 2.0, vz);
    group.add(vBar);
  });

  // 5. Entrance Door (Recessed slightly, glazed wooden door with brass handle)
  const doorFrame = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 2.9, 0.3),
    materials.shopfrontGreen
  );
  doorFrame.position.set(5.7, 1.65, -1.1);
  group.add(doorFrame);

  // Glass inset on door
  const doorGlass = new THREE.Mesh(
    new THREE.PlaneGeometry(1.0, 1.6),
    materials.cafeGlass
  );
  doorGlass.position.set(5.7, 2.0, -1.08);
  group.add(doorGlass);

  // Polished brass door handle
  const handle = new THREE.Mesh(
    new THREE.CylinderGeometry(0.025, 0.025, 0.45, 8),
    materials.shopfrontTrimGold
  );
  handle.position.set(6.25, 1.6, -0.98);
  group.add(handle);

  // Brass entrance windchime / bell (swaying gently)
  const bellGroup = new THREE.Group();
  bellGroup.position.set(5.7, 3.1, -1.0);
  const bellDome = new THREE.Mesh(
    new THREE.SphereGeometry(0.08, 10, 8, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.shopfrontTrimGold
  );
  bellDome.rotation.x = Math.PI;
  bellGroup.add(bellDome);
  const clapper = new THREE.Mesh(
    new THREE.CylinderGeometry(0.015, 0.015, 0.14, 6),
    materials.shopfrontTrimGold
  );
  clapper.position.y = -0.12;
  bellGroup.add(clapper);
  group.add(bellGroup);

  // 6. Fascia Signboard ("THE MONOCLE & BEAN")
  const signGeo = new THREE.BoxGeometry(7.2, 0.85, 0.18);
  const signMesh = new THREE.Mesh(signGeo, [
    materials.shopfrontGreen, // px
    materials.shopfrontGreen, // nx
    materials.shopfrontGreen, // py
    materials.shopfrontGreen, // ny
    materials.signboard,      // pz (Front facing)
    materials.shopfrontGreen  // nz
  ]);
  signMesh.position.set(1.3, 3.55, -0.9);
  group.add(signMesh);

  // Molded cornice above fascia
  const signCornice = new THREE.Mesh(
    new THREE.BoxGeometry(7.6, 0.16, 0.35),
    materials.shopfrontTrimGold
  );
  signCornice.position.set(1.3, 4.02, -0.85);
  group.add(signCornice);

  // 7. Retractable Striped Awning (Canopy) with Dripping Water Edge
  const awningGroup = new THREE.Group();
  awningGroup.position.set(1.3, 3.25, -0.85);

  const awningWidth = 6.6;
  const awningSlopeDepth = 1.9;
  const awningSlopeAngle = 0.28; // radians tilt down

  // Slanted canvas
  const canvasMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(awningWidth, awningSlopeDepth),
    materials.awning
  );
  canvasMesh.rotation.x = Math.PI / 2 + awningSlopeAngle;
  canvasMesh.position.set(0, -0.22, awningSlopeDepth * 0.48);
  awningGroup.add(canvasMesh);

  // Scalloped / Hanging Valance front border
  const valance = new THREE.Mesh(
    new THREE.PlaneGeometry(awningWidth, 0.28),
    materials.awningStripe
  );
  valance.position.set(0, -0.56, awningSlopeDepth * 0.95);
  awningGroup.add(valance);

  // Awning metal support armatures
  [-awningWidth / 2 + 0.2, awningWidth / 2 - 0.2].forEach(ax => {
    const arm = new THREE.Mesh(
      new THREE.CylinderGeometry(0.025, 0.025, 1.8, 6),
      materials.wroughtIron
    );
    arm.rotation.x = Math.PI / 3.8;
    arm.position.set(ax, -0.5, 0.8);
    awningGroup.add(arm);
  });
  group.add(awningGroup);

  // 8. Upper Floor Sash Windows (4 on Front, 3 on Side)
  const createSashWindow = (x, y, z, rotY = 0) => {
    const winGroup = new THREE.Group();
    winGroup.position.set(x, y, z);
    winGroup.rotation.y = rotY;

    // Stone lintel (top) & sill (bottom)
    const lintel = new THREE.Mesh(new THREE.BoxGeometry(1.2, 0.2, 0.25), materials.stoneCornice);
    lintel.position.y = 0.95;
    winGroup.add(lintel);

    const sill = new THREE.Mesh(new THREE.BoxGeometry(1.25, 0.12, 0.3), materials.stoneCornice);
    sill.position.y = -0.95;
    winGroup.add(sill);

    // Window frame (White timber)
    const frame = new THREE.Mesh(new THREE.BoxGeometry(1.05, 1.7, 0.12), materials.whiteTrim);
    winGroup.add(frame);

    // Warm glass pane with cozy interior glow peeking through
    const glass = new THREE.Mesh(
      new THREE.PlaneGeometry(0.95, 1.6),
      new THREE.MeshBasicMaterial({ color: 0xffe6a3, transparent: true, opacity: 0.82 })
    );
    glass.position.z = 0.07;
    winGroup.add(glass);

    // Translucent curtain silhouettes inside
    const curtain = new THREE.Mesh(
      new THREE.PlaneGeometry(0.4, 1.5),
      new THREE.MeshBasicMaterial({ color: 0x9b4b3c, transparent: true, opacity: 0.85 })
    );
    curtain.position.set(-0.25, 0, 0.08);
    winGroup.add(curtain);

    const curtain2 = curtain.clone();
    curtain2.position.set(0.25, 0, 0.08);
    winGroup.add(curtain2);

    // Sash mullion cross
    const hMullion = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.04, 0.05), materials.whiteTrim);
    hMullion.position.z = 0.09;
    winGroup.add(hMullion);

    const vMullion = new THREE.Mesh(new THREE.BoxGeometry(0.04, 1.6, 0.05), materials.whiteTrim);
    vMullion.position.z = 0.09;
    winGroup.add(vMullion);

    return winGroup;
  };

  // Front facade sash windows (Floor 1 & Floor 2)
  const frontWinXs = [-0.5, 2.2, 5.0, 7.5];
  [5.2, 7.3].forEach(wy => {
    frontWinXs.forEach(wx => {
      group.add(createSashWindow(wx, wy, -0.95));
    });
  });

  // Side facade sash windows
  const sideWinZs = [-3.2, -5.8, -8.2];
  [5.2, 7.3].forEach(wy => {
    sideWinZs.forEach(wz => {
      group.add(createSashWindow(-2.25, wy, wz, -Math.PI / 2));
    });
  });

  // 9. Roof Parapet, Stone Cornice, Chimney Stacks
  // Stone Cornice running around the roof perimeter
  const corniceFront = new THREE.Mesh(
    new THREE.BoxGeometry(bWidth + 0.5, 0.4, 0.4),
    materials.stoneCornice
  );
  corniceFront.position.set(posX, 8.8, -0.9);
  group.add(corniceFront);

  const corniceSide = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.4, bDepth + 0.5),
    materials.stoneCornice
  );
  corniceSide.position.set(-2.3, 8.8, posZ);
  group.add(corniceSide);

  // Flat roof with dark slate parapet
  const roofSlab = new THREE.Mesh(
    new THREE.BoxGeometry(bWidth, 0.3, bDepth),
    materials.slateRoof
  );
  roofSlab.position.set(posX, 8.95, posZ);
  group.add(roofSlab);

  // Chimney Stack on top
  const chimney = new THREE.Mesh(
    new THREE.BoxGeometry(1.6, 1.8, 1.2),
    materials.brick
  );
  chimney.position.set(1.5, 9.8, -7.5);
  group.add(chimney);

  // Terracotta chimney pots
  [-0.45, 0.45].forEach(cx => {
    const pot = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.22, 0.8, 12),
      materials.chimneyPot
    );
    pot.position.set(1.5 + cx, 10.9, -7.5);
    group.add(pot);

    // Rim
    const rim = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.12, 12),
      materials.chimneyPot
    );
    rim.position.set(1.5 + cx, 11.25, -7.5);
    group.add(rim);
  });

  // 10. Victorian Downspout Pipe & Hopper (Rainwater Drainage)
  const pipe = new THREE.Mesh(
    new THREE.CylinderGeometry(0.06, 0.06, 8.2, 8),
    materials.copperPipe
  );
  pipe.position.set(-2.25, 4.4, -0.85);
  group.add(pipe);

  // Hopper Head at top of downspout
  const hopper = new THREE.Mesh(
    new THREE.ConeGeometry(0.24, 0.4, 6),
    materials.copperPipe
  );
  hopper.rotation.x = Math.PI;
  hopper.position.set(-2.25, 8.4, -0.85);
  group.add(hopper);

  // Downspout shoe at bottom leading water to pavement drain
  const shoe = new THREE.Mesh(
    new THREE.TorusGeometry(0.15, 0.055, 6, 8, Math.PI / 2),
    materials.copperPipe
  );
  shoe.position.set(-2.25, 0.4, -0.75);
  group.add(shoe);

  return {
    group,
    bellGroup,
    awningGroup,
    frontGlass,
    sideGlass
  };
}
