import * as THREE from 'three';

export function createCafeInterior(materials) {
  const group = new THREE.Group();
  const steamEmitters = [];

  // Interior bounds:
  // Floor y = 0.25
  // X: -1.8 to 9.2
  // Z: -9.4 to -1.4

  // 1. Warm Interior Lighting System
  // Main warm amber ambient fill
  const interiorLight = new THREE.PointLight(0xffb86b, 2.8, 12, 1.2);
  interiorLight.position.set(2.5, 2.6, -4.5);
  interiorLight.castShadow = true;
  interiorLight.shadow.bias = -0.002;
  group.add(interiorLight);

  // Counter spot light
  const counterLight = new THREE.SpotLight(0xffd59e, 3.2, 8, Math.PI / 3, 0.4);
  counterLight.position.set(2.0, 3.2, -3.2);
  counterLight.target.position.set(2.0, 1.2, -4.0);
  group.add(counterLight);
  group.add(counterLight.target);

  // Window seating cozy warm glow
  const windowGlow = new THREE.PointLight(0xffaa44, 1.8, 6, 1.5);
  windowGlow.position.set(-0.5, 1.8, -1.8);
  group.add(windowGlow);

  // 2. Main L-Shaped Bar Counter
  // Counter dimensions: Main section along X, short return along Z
  const counterGroup = new THREE.Group();
  counterGroup.position.set(2.2, 0.25, -4.2);

  // Mahogany Counter Top
  const topGeo = new THREE.BoxGeometry(4.8, 0.12, 1.4);
  const topMesh = new THREE.Mesh(topGeo, materials.counterTop);
  topMesh.position.set(0, 1.05, 0);
  topMesh.castShadow = true;
  counterGroup.add(topMesh);

  // Brass Counter Top Rim
  const rimMesh = new THREE.Mesh(
    new THREE.BoxGeometry(4.84, 0.04, 1.44),
    materials.shopfrontTrimGold
  );
  rimMesh.position.set(0, 1.02, 0);
  counterGroup.add(rimMesh);

  // Front Slat Wooden Body
  const bodyGeo = new THREE.BoxGeometry(4.7, 0.98, 1.3);
  const bodyMesh = new THREE.Mesh(bodyGeo, materials.counterFront);
  bodyMesh.position.set(0, 0.5, 0);
  bodyMesh.castShadow = true;
  bodyMesh.receiveShadow = true;
  counterGroup.add(bodyMesh);

  // Brass Foot Rail
  const footRail = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 4.6, 8),
    materials.shopfrontTrimGold
  );
  footRail.rotation.z = Math.PI / 2;
  footRail.position.set(0, 0.15, 0.72);
  counterGroup.add(footRail);

  group.add(counterGroup);

  // 3. Professional Dual-Group Chrome & Brass Espresso Machine
  const machineGroup = new THREE.Group();
  machineGroup.position.set(1.4, 1.38, -4.2);

  // Machine main body
  const body = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.65, 0.7),
    materials.espressoMachineChrome
  );
  machineGroup.add(body);

  // Brass side accent panels
  [-0.61, 0.61].forEach(sx => {
    const sidePlate = new THREE.Mesh(
      new THREE.BoxGeometry(0.04, 0.62, 0.68),
      materials.espressoMachineBrass
    );
    sidePlate.position.x = sx;
    machineGroup.add(sidePlate);
  });

  // Group heads & portafilters (2 groups)
  [-0.25, 0.25].forEach(gx => {
    // Group collar
    const collar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.12, 10),
      materials.espressoMachineChrome
    );
    collar.position.set(gx, -0.12, 0.38);
    machineGroup.add(collar);

    // Portafilter handle
    const handle = new THREE.Mesh(
      new THREE.CylinderGeometry(0.02, 0.02, 0.32, 8),
      materials.darkWood
    );
    handle.rotation.x = Math.PI / 2.3;
    handle.position.set(gx, -0.18, 0.52);
    machineGroup.add(handle);
  });

  // Dual pressure dials (circular gauges)
  [-0.45, 0.45].forEach(dx => {
    const dial = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.02, 12),
      materials.whiteTrim
    );
    dial.rotation.x = Math.PI / 2;
    dial.position.set(dx, 0.14, 0.36);
    machineGroup.add(dial);
  });

  // Steam wands (bent brass tubes)
  [-0.55, 0.55].forEach(wx => {
    const wand = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.25, 6),
      materials.espressoMachineBrass
    );
    wand.rotation.z = wx > 0 ? -0.4 : 0.4;
    wand.position.set(wx, -0.15, 0.36);
    machineGroup.add(wand);
  });

  // Top warming tray with neatly stacked white ceramic espresso cups
  const cupGeo = new THREE.CylinderGeometry(0.05, 0.035, 0.06, 8);
  for (let cx = -0.45; cx <= 0.45; cx += 0.15) {
    for (let cz = -0.2; cz <= 0.2; cz += 0.16) {
      const cup = new THREE.Mesh(cupGeo, materials.ceramicCup);
      cup.position.set(cx, 0.36, cz);
      machineGroup.add(cup);
    }
  }

  group.add(machineGroup);

  // Steam emitter point at espresso machine
  steamEmitters.push(new THREE.Vector3(1.4, 1.7, -3.8));

  // 4. Glass Pastry Display Case (Croissants, Tarts, Cakes)
  const pastryCase = new THREE.Group();
  pastryCase.position.set(3.4, 1.38, -4.2);

  // Glass enclosure
  const caseGlass = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 0.55, 0.7),
    materials.cafeGlass
  );
  pastryCase.add(caseGlass);

  // Brass frame edges
  const caseBase = new THREE.Mesh(
    new THREE.BoxGeometry(1.24, 0.06, 0.74),
    materials.shopfrontTrimGold
  );
  caseBase.position.y = -0.28;
  pastryCase.add(caseBase);

  // Middle glass shelf
  const shelf = new THREE.Mesh(
    new THREE.BoxGeometry(1.15, 0.02, 0.65),
    materials.cafeGlass
  );
  shelf.position.y = 0;
  pastryCase.add(shelf);

  // Baked Treats:
  // Top tier: Golden Croissants
  const croissantGeo = new THREE.TorusGeometry(0.07, 0.035, 8, 12, Math.PI * 1.2);
  croissantGeo.rotateX(Math.PI / 2);
  [-0.35, 0, 0.35].forEach(px => {
    const croissant = new THREE.Mesh(croissantGeo, materials.pastryCroissant);
    croissant.position.set(px, 0.06, 0);
    pastryCase.add(croissant);
  });

  // Bottom tier: Chocolate Slices & Berry Tarts
  const cakeGeo = new THREE.BoxGeometry(0.14, 0.1, 0.18);
  [-0.38, -0.15].forEach(cx => {
    const cake = new THREE.Mesh(cakeGeo, materials.pastryCake);
    cake.position.set(cx, -0.22, 0);
    pastryCase.add(cake);
  });

  const tartGeo = new THREE.CylinderGeometry(0.08, 0.06, 0.06, 10);
  [0.15, 0.38].forEach(tx => {
    const tart = new THREE.Mesh(tartGeo, materials.pastryCroissant);
    tart.position.set(tx, -0.24, 0);
    pastryCase.add(tart);

    // Fruit topping
    const berry = new THREE.Mesh(
      new THREE.SphereGeometry(0.03, 6, 6),
      materials.trafficLightRed
    );
    berry.position.set(tx, -0.19, 0);
    pastryCase.add(berry);
  });

  group.add(pastryCase);

  // 5. Cash Register / Antique Brass Till & Takeaway Cups
  const till = new THREE.Group();
  till.position.set(0.1, 1.38, -4.2);

  const tillBody = new THREE.Mesh(
    new THREE.BoxGeometry(0.5, 0.35, 0.45),
    materials.espressoMachineBrass
  );
  till.add(tillBody);

  // Digital / Brass pop-up price display
  const tillDisplay = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.12, 0.06),
    materials.filamentOrange
  );
  tillDisplay.position.set(0, 0.24, -0.1);
  till.add(tillDisplay);

  // Takeaway paper cups stacked next to till
  [-0.15, -0.05].forEach((offset, idx) => {
    for (let h = 0; h < 4; h++) {
      const paperCup = new THREE.Mesh(
        new THREE.CylinderGeometry(0.06, 0.045, 0.14, 10),
        materials.ceramicCup
      );
      paperCup.position.set(-0.45 + offset, 0.07 + h * 0.04, 0.05 * idx);
      till.add(paperCup);
    }
  });

  // Ceramic Tip Jar with "TIPS"
  const tipJar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.07, 0.18, 10),
    materials.cafeGlass
  );
  tipJar.position.set(-0.35, 0.09, 0.25);
  till.add(tipJar);

  group.add(till);

  // 6. Back Wall Multi-Tier Shelving (Behind the Bar)
  const backShelf = new THREE.Group();
  backShelf.position.set(2.4, 1.8, -9.4);

  // Upright wooden supports
  [-2.2, 0, 2.2].forEach(ux => {
    const post = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, 2.4, 0.35),
      materials.darkWood
    );
    post.position.set(ux, 0, 0);
    backShelf.add(post);
  });

  // 3 Shelves
  [-0.6, 0.1, 0.8].forEach(sy => {
    const plank = new THREE.Mesh(
      new THREE.BoxGeometry(4.8, 0.06, 0.4),
      materials.darkWood
    );
    plank.position.set(0, sy, 0);
    backShelf.add(plank);
  });

  // Items on shelves:
  // Top shelf: Jars of roasted coffee beans & syrup bottles
  for (let jx = -2.0; jx <= -0.4; jx += 0.28) {
    const jar = new THREE.Mesh(
      new THREE.CylinderGeometry(0.09, 0.09, 0.28, 10),
      materials.cafeGlass
    );
    jar.position.set(jx, 0.98, 0);
    backShelf.add(jar);

    // Beans inside jar
    const beans = new THREE.Mesh(
      new THREE.CylinderGeometry(0.08, 0.08, 0.22, 8),
      materials.counterTop
    );
    beans.position.set(jx, 0.95, 0);
    backShelf.add(beans);
  }

  // Middle shelf: Ceramic mugs in neat rows
  for (let mx = 0.2; mx <= 2.0; mx += 0.22) {
    const mug = new THREE.Mesh(
      new THREE.CylinderGeometry(0.07, 0.06, 0.15, 8),
      materials.ceramicCup
    );
    mug.position.set(mx, 0.22, 0);
    backShelf.add(mug);
  }

  // Books row on middle shelf
  for (let bx = -2.0; bx <= -0.8; bx += 0.12) {
    const bHeight = 0.24 + Math.sin(bx * 10) * 0.06;
    const bMat = materials.bookCovers[Math.floor(Math.abs(bx * 7)) % materials.bookCovers.length];
    const book = new THREE.Mesh(
      new THREE.BoxGeometry(0.08, bHeight, 0.25),
      bMat
    );
    book.position.set(bx, 0.1 + bHeight / 2, 0);
    backShelf.add(book);
  }

  // Bottom shelf: Authentic burlap coffee bean sacks
  [-1.5, -0.6, 0.5, 1.4].forEach(bx => {
    const sack = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.65, 0.38),
      materials.burlap
    );
    sack.position.set(bx, -0.28, 0.05);
    sack.rotation.z = (Math.sin(bx) * 0.08);
    backShelf.add(sack);
  });

  group.add(backShelf);

  // 7. Large Chalkboard Menu Board on Back Wall
  const menuMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(2.4, 1.6),
    materials.menuBoard
  );
  menuMesh.position.set(6.4, 2.3, -9.5);
  group.add(menuMesh);

  // Wooden frame around menu
  const menuFrame = new THREE.Mesh(
    new THREE.BoxGeometry(2.5, 1.7, 0.05),
    materials.darkWood
  );
  menuFrame.position.set(6.4, 2.3, -9.54);
  group.add(menuFrame);

  // Framed vintage travel poster on side interior wall
  const posterMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.3, 1.8),
    materials.poster
  );
  posterMesh.rotation.y = -Math.PI / 2;
  posterMesh.position.set(9.2, 2.3, -4.5);
  group.add(posterMesh);

  // 8. Window Bar Seating (Facing the Street)
  // Window counter bar
  const winCounter = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.08, 0.5),
    materials.counterTop
  );
  winCounter.position.set(0.6, 1.15, -1.35);
  winCounter.castShadow = true;
  group.add(winCounter);

  // 2 High Wooden Barstools
  [-0.6, 1.4].forEach(sx => {
    const stool = new THREE.Group();
    stool.position.set(sx, 0.25, -2.0);

    // Stool seat cushion
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.24, 0.24, 0.08, 12),
      materials.darkWood
    );
    seat.position.y = 0.72;
    stool.add(seat);

    // 4 Splayed legs
    [-0.14, 0.14].forEach(lx => {
      [-0.14, 0.14].forEach(lz => {
        const leg = new THREE.Mesh(
          new THREE.CylinderGeometry(0.02, 0.02, 0.72, 6),
          materials.wroughtIron
        );
        leg.position.set(lx, 0.36, lz);
        stool.add(leg);
      });
    });

    // Circular footrest ring
    const ring = new THREE.Mesh(
      new THREE.TorusGeometry(0.18, 0.015, 6, 16),
      materials.wroughtIron
    );
    ring.rotation.x = Math.PI / 2;
    ring.position.y = 0.25;
    stool.add(ring);

    group.add(stool);
  });

  // Table items on window bar:
  // Steaming cup of coffee with saucer and latte art
  const coffeeCupGroup = new THREE.Group();
  coffeeCupGroup.position.set(-0.6, 1.2, -1.35);

  const saucer = new THREE.Mesh(
    new THREE.CylinderGeometry(0.14, 0.12, 0.02, 12),
    materials.ceramicCup
  );
  coffeeCupGroup.add(saucer);

  const barCup = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.06, 0.1, 10),
    materials.ceramicCup
  );
  barCup.position.y = 0.06;
  coffeeCupGroup.add(barCup);

  const liquid = new THREE.Mesh(
    new THREE.CircleGeometry(0.075, 10),
    materials.coffeeLiquid
  );
  liquid.rotation.x = -Math.PI / 2;
  liquid.position.y = 0.11;
  coffeeCupGroup.add(liquid);

  // Latte art leaf pattern
  const artLeaf = new THREE.Mesh(
    new THREE.CircleGeometry(0.04, 8),
    materials.latteArt
  );
  artLeaf.rotation.x = -Math.PI / 2;
  artLeaf.position.y = 0.112;
  coffeeCupGroup.add(artLeaf);

  // Silver teaspoon
  const spoon = new THREE.Mesh(
    new THREE.BoxGeometry(0.02, 0.008, 0.2),
    materials.espressoMachineChrome
  );
  spoon.position.set(0.12, 0.02, 0.02);
  spoon.rotation.y = 0.4;
  coffeeCupGroup.add(spoon);

  // Open sketchbook next to cup
  const book = new THREE.Mesh(
    new THREE.BoxGeometry(0.4, 0.02, 0.28),
    materials.whiteTrim
  );
  book.position.set(0.35, 0.01, 0);
  book.rotation.y = -0.15;
  coffeeCupGroup.add(book);

  group.add(coffeeCupGroup);

  // Steam emitter point at window cup
  steamEmitters.push(new THREE.Vector3(-0.6, 1.35, -1.35));

  // 9. Corner Cafe Table with Bentwood Chairs
  const tableGroup = new THREE.Group();
  tableGroup.position.set(-0.8, 0.25, -6.8);

  // Round wood table top
  const tableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.55, 0.55, 0.05, 16),
    materials.counterTop
  );
  tableTop.position.y = 0.85;
  tableGroup.add(tableTop);

  // Center cast iron pedestal
  const tablePedestal = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.08, 0.85, 8),
    materials.wroughtIron
  );
  tablePedestal.position.y = 0.42;
  tableGroup.add(tablePedestal);

  // Ceramic flower vase on table
  const vase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.05, 0.04, 0.16, 8),
    materials.ceramicCup
  );
  vase.position.y = 0.95;
  tableGroup.add(vase);

  // 2 Bentwood Cafe Chairs
  [-0.65, 0.65].forEach(cx => {
    const chair = new THREE.Group();
    chair.position.set(cx, 0, 0);

    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.22, 0.22, 0.04, 10),
      materials.darkWood
    );
    seat.position.y = 0.5;
    chair.add(seat);

    // Curved backrest
    const backRest = new THREE.Mesh(
      new THREE.TorusGeometry(0.2, 0.025, 6, 12, Math.PI),
      materials.darkWood
    );
    backRest.rotation.x = Math.PI / 2;
    backRest.rotation.z = cx > 0 ? -Math.PI / 2 : Math.PI / 2;
    backRest.position.set(cx > 0 ? 0.18 : -0.18, 0.75, 0);
    chair.add(backRest);

    tableGroup.add(chair);
  });

  group.add(tableGroup);

  // 10. Large Potted Monstera Deliciosa Plant
  const plantGroup = new THREE.Group();
  plantGroup.position.set(-1.4, 0.25, -1.8);

  // Terracotta pot
  const pot = new THREE.Mesh(
    new THREE.CylinderGeometry(0.3, 0.22, 0.55, 12),
    materials.terracotta
  );
  pot.position.y = 0.28;
  plantGroup.add(pot);

  // Monstera broad leaves
  const leafAngles = [0, 1.2, 2.4, 3.8, 5.0];
  leafAngles.forEach((ang, idx) => {
    const stem = new THREE.Mesh(
      new THREE.CylinderGeometry(0.015, 0.015, 0.65, 6),
      materials.plantGreen
    );
    stem.position.set(0, 0.5 + idx * 0.05, 0);
    stem.rotation.y = ang;
    stem.rotation.z = 0.45;

    // Big green leaf blade
    const leaf = new THREE.Mesh(
      new THREE.SphereGeometry(0.22, 6, 4),
      materials.plantGreen
    );
    leaf.scale.set(1.4, 0.15, 0.9);
    leaf.position.set(0, 0.35, 0);
    stem.add(leaf);

    plantGroup.add(stem);
  });

  group.add(plantGroup);

  // 11. Hanging Brass Edison Filament Pendant Lamps
  const lampGroup = new THREE.Group();
  const pendantPositions = [
    [0.0, 3.3, -3.2],
    [2.2, 3.3, -3.2],
    [4.2, 3.3, -3.2],
    [-0.8, 3.3, -6.8]
  ];

  pendantPositions.forEach(([lx, ly, lz]) => {
    // Hanging cord
    const cord = new THREE.Mesh(
      new THREE.CylinderGeometry(0.008, 0.008, 0.7, 6),
      materials.wroughtIron
    );
    cord.position.set(lx, ly - 0.35, lz);
    lampGroup.add(cord);

    // Brass socket
    const socket = new THREE.Mesh(
      new THREE.CylinderGeometry(0.04, 0.04, 0.09, 8),
      materials.shopfrontTrimGold
    );
    socket.position.set(lx, ly - 0.74, lz);
    lampGroup.add(socket);

    // Glowing Edison bulb glass
    const bulb = new THREE.Mesh(
      new THREE.SphereGeometry(0.075, 10, 8),
      materials.filamentOrange
    );
    bulb.position.set(lx, ly - 0.85, lz);
    lampGroup.add(bulb);

    // Cone shade (vintage dark green enamel)
    const shade = new THREE.Mesh(
      new THREE.ConeGeometry(0.24, 0.14, 12, 1, true),
      materials.shopfrontGreen
    );
    shade.position.set(lx, ly - 0.78, lz);
    lampGroup.add(shade);
  });

  group.add(lampGroup);

  // 12. Staff Door to Back Kitchen / Roastery
  const staffDoor = new THREE.Mesh(
    new THREE.BoxGeometry(1.2, 2.4, 0.06),
    materials.shopfrontGreen
  );
  staffDoor.position.set(8.2, 1.45, -9.5);
  group.add(staffDoor);

  const staffPlate = new THREE.Mesh(
    new THREE.BoxGeometry(0.6, 0.15, 0.02),
    materials.shopfrontTrimGold
  );
  staffPlate.position.set(8.2, 1.7, -9.46);
  group.add(staffPlate);

  return {
    group,
    interiorLight,
    counterLight,
    windowGlow,
    steamEmitters
  };
}
