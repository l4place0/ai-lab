import * as THREE from 'three';

export function createStreetProps(materials) {
  const group = new THREE.Group();
  const animatables = {};

  // 1. Ornate Victorian Cast-Iron Street Lamp (Sidewalk Corner)
  const lampGroup = new THREE.Group();
  lampGroup.position.set(-4.2, 0.2, 4.2);

  // Octagonal base
  const lampBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.35, 0.45, 0.7, 8),
    materials.victorianLampMetal
  );
  lampBase.position.y = 0.35;
  lampGroup.add(lampBase);

  // Fluted column post
  const lampPost = new THREE.Mesh(
    new THREE.CylinderGeometry(0.09, 0.14, 4.2, 10),
    materials.victorianLampMetal
  );
  lampPost.position.y = 2.8;
  lampGroup.add(lampPost);

  // Ladder Bar (Horizontal maintenance bar for Victorian lamplighter)
  const ladderBar = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.03, 0.9, 6),
    materials.victorianLampMetal
  );
  ladderBar.rotation.z = Math.PI / 2;
  ladderBar.position.set(0, 4.4, 0);
  lampGroup.add(ladderBar);

  // Hexagonal Lantern Casing
  const lanternGlass = new THREE.Mesh(
    new THREE.CylinderGeometry(0.32, 0.22, 0.75, 6),
    materials.gasLampGlow
  );
  lanternGlass.position.y = 5.15;
  lampGroup.add(lanternGlass);

  // Lantern Top Cap & Finial
  const lanternCap = new THREE.Mesh(
    new THREE.ConeGeometry(0.38, 0.4, 6),
    materials.victorianLampMetal
  );
  lanternCap.position.y = 5.7;
  lampGroup.add(lanternCap);

  // Warm glowing street light
  const streetLight = new THREE.PointLight(0xffdf88, 3.5, 14, 1.2);
  streetLight.position.set(0, 5.15, 0);
  streetLight.castShadow = true;
  streetLight.shadow.bias = -0.001;
  lampGroup.add(streetLight);

  // Light cone / rain halo
  const haloGeo = new THREE.ConeGeometry(2.4, 5.2, 16, 1, true);
  const haloMat = new THREE.MeshBasicMaterial({
    color: 0xffe89e,
    transparent: true,
    opacity: 0.12,
    side: THREE.DoubleSide
  });
  const haloMesh = new THREE.Mesh(haloGeo, haloMat);
  haloMesh.position.set(0, 2.6, 0);
  lampGroup.add(haloMesh);

  group.add(lampGroup);
  animatables.streetLight = streetLight;

  // 2. Classic British Red Pillar Box (Royal Mail Post Box)
  const postBox = new THREE.Group();
  postBox.position.set(-2.8, 0.2, 4.8);

  // Black base ring
  const pbBase = new THREE.Mesh(
    new THREE.CylinderGeometry(0.38, 0.4, 0.2, 16),
    materials.victorianLampMetal
  );
  pbBase.position.y = 0.1;
  postBox.add(pbBase);

  // Red cylindrical body
  const pbBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.36, 0.36, 1.35, 16),
    materials.postBoxRed
  );
  pbBody.position.y = 0.85;
  postBox.add(pbBody);

  // Domed cap
  const pbCap = new THREE.Mesh(
    new THREE.SphereGeometry(0.37, 16, 10, 0, Math.PI * 2, 0, Math.PI / 2),
    materials.postBoxRed
  );
  pbCap.position.y = 1.52;
  postBox.add(pbCap);

  // Mail aperture slot
  const slot = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.05, 0.08),
    materials.victorianLampMetal
  );
  slot.position.set(0, 1.25, 0.34);
  postBox.add(slot);

  // White collection timetable plate
  const plate = new THREE.Mesh(
    new THREE.PlaneGeometry(0.18, 0.24),
    materials.whiteTrim
  );
  plate.position.set(0, 0.85, 0.37);
  postBox.add(plate);

  group.add(postBox);

  // 3. London Street Name Enamel Sign ("ST. MARTIN'S LANE WC2")
  const streetSignMesh = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 0.5),
    materials.streetSign
  );
  streetSignMesh.position.set(-2.3, 3.8, 0.5);
  streetSignMesh.rotation.y = -Math.PI / 2;
  group.add(streetSignMesh);

  // Sign bracket
  const signBack = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.54, 1.64),
    materials.victorianLampMetal
  );
  signBack.position.set(-2.28, 3.8, 0.5);
  group.add(signBack);

  // 4. Outdoor Cafe Bistro Table & Folded Chairs (Under Awning)
  const bistroGroup = new THREE.Group();
  bistroGroup.position.set(3.8, 0.2, 1.8);

  // Wrought iron round table
  const bTableTop = new THREE.Mesh(
    new THREE.CylinderGeometry(0.48, 0.48, 0.03, 16),
    materials.wroughtIron
  );
  bTableTop.position.y = 0.8;
  bistoGroupAdd(bTableTop);

  const bTableLeg = new THREE.Mesh(
    new THREE.CylinderGeometry(0.03, 0.04, 0.8, 8),
    materials.wroughtIron
  );
  bTableLeg.position.y = 0.4;
  bistoGroupAdd(bTableLeg);

  // Bistro chairs (2 folded chairs)
  [-0.55, 0.55].forEach(cx => {
    const chair = new THREE.Group();
    chair.position.set(cx, 0, 0);

    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(0.18, 0.18, 0.02, 10),
      materials.darkWood
    );
    seat.position.y = 0.48;
    chair.add(seat);

    // Legs
    [-0.1, 0.1].forEach(lx => {
      const leg = new THREE.Mesh(
        new THREE.CylinderGeometry(0.015, 0.015, 0.48, 6),
        materials.wroughtIron
      );
      leg.position.set(lx, 0.24, 0);
      chair.add(leg);
    });

    // Curved backrest
    const back = new THREE.Mesh(
      new THREE.TorusGeometry(0.16, 0.015, 6, 10, Math.PI),
      materials.wroughtIron
    );
    back.rotation.x = Math.PI / 2;
    back.position.set(0, 0.72, -0.15);
    chair.add(back);

    bistoGroupAdd(chair);
  });

  function bistoGroupAdd(obj) {
    bistroGroup.add(obj);
  }

  group.add(bistroGroup);

  // 5. Standing A-Frame Chalkboard Menu ("TODAY'S SPECIAL")
  const aFrameGroup = new THREE.Group();
  aFrameGroup.position.set(7.2, 0.2, 0.8);
  aFrameGroup.rotation.y = -0.35;

  // Front chalkboard
  const aFront = new THREE.Mesh(
    new THREE.PlaneGeometry(0.65, 0.95),
    materials.menuBoard
  );
  aFront.rotation.x = -0.22;
  aFront.position.set(0, 0.55, 0.12);
  aFrameGroup.add(aFront);

  // Front wooden frame
  const aFrameWood = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 1.05, 0.04),
    materials.darkWood
  );
  aFrameWood.rotation.x = -0.22;
  aFrameWood.position.set(0, 0.55, 0.1);
  aFrameGroup.add(aFrameWood);

  // Back leg
  const aBackLeg = new THREE.Mesh(
    new THREE.BoxGeometry(0.72, 1.05, 0.04),
    materials.darkWood
  );
  aBackLeg.rotation.x = 0.22;
  aBackLeg.position.set(0, 0.55, -0.1);
  aFrameGroup.add(aBackLeg);

  group.add(aFrameGroup);

  // 6. Window Flower Planter Box (Ferns, Ivy, Damp Blossoms)
  const planterGroup = new THREE.Group();
  planterGroup.position.set(1.3, 0.8, -0.8);

  // Wooden trough box
  const box = new THREE.Mesh(
    new THREE.BoxGeometry(5.2, 0.26, 0.35),
    materials.shopfrontGreen
  );
  planterGroup.add(box);

  // Lush greenery clusters inside box
  for (let fx = -2.3; fx <= 2.3; fx += 0.32) {
    const fern = new THREE.Mesh(
      new THREE.SphereGeometry(0.18 + Math.sin(fx * 4) * 0.05, 6, 6),
      materials.plantGreen
    );
    fern.scale.set(1.1, 0.8, 0.9);
    fern.position.set(fx, 0.18, 0.02);
    planterGroup.add(fern);

    // Occasional little red/white blossom
    if (Math.abs(fx % 0.6) < 0.2) {
      const flower = new THREE.Mesh(
        new THREE.SphereGeometry(0.04, 5, 4),
        materials.trafficLightRed
      );
      flower.position.set(fx + 0.05, 0.28, 0.1);
      planterGroup.add(flower);
    }
  }

  group.add(planterGroup);

  // 7. Vintage British City Bicycle (Leaning against alley wall)
  const bikeGroup = new THREE.Group();
  bikeGroup.position.set(-2.0, 0.2, -1.8);
  bikeGroup.rotation.y = 0.15;
  bikeGroup.rotation.z = -0.12; // tilted leaning

  // Wheels (Front & Back)
  const wheelGeo = new THREE.TorusGeometry(0.38, 0.025, 8, 20);
  const spokeGeo = new THREE.CylinderGeometry(0.005, 0.005, 0.74, 4);

  [-0.6, 0.6].forEach(wx => {
    const wheel = new THREE.Mesh(wheelGeo, materials.bicycleMetal);
    wheel.position.set(wx, 0.38, 0);
    bikeGroup.add(wheel);

    // Spokes
    [0, Math.PI / 4, Math.PI / 2, Math.PI * 0.75].forEach(ang => {
      const spoke = new THREE.Mesh(spokeGeo, materials.whiteTrim);
      spoke.rotation.z = ang;
      spoke.position.set(wx, 0.38, 0);
      bikeGroup.add(spoke);
    });
  });

  // Diamond Frame tubes
  const frameMat = materials.bicycleMetal;
  const tube1 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.65, 6), frameMat);
  tube1.position.set(0, 0.45, 0);
  bikeGroup.add(tube1);

  const tube2 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.62, 6), frameMat);
  tube2.rotation.z = 0.8;
  tube2.position.set(-0.25, 0.42, 0);
  bikeGroup.add(tube2);

  const tube3 = new THREE.Mesh(new THREE.CylinderGeometry(0.02, 0.02, 0.7, 6), frameMat);
  tube3.rotation.z = -0.8;
  tube3.position.set(0.3, 0.46, 0);
  bikeGroup.add(tube3);

  // Leather saddle
  const saddle = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.05, 0.12), materials.darkWood);
  saddle.position.set(-0.05, 0.82, 0);
  bikeGroup.add(saddle);

  // Curved Handlebars
  const handlebars = new THREE.Mesh(
    new THREE.TorusGeometry(0.16, 0.015, 6, 12, Math.PI),
    materials.whiteTrim
  );
  handlebars.rotation.x = Math.PI / 2;
  handlebars.position.set(0.55, 0.85, 0);
  bikeGroup.add(handlebars);

  // Front Wicker Basket
  const basket = new THREE.Mesh(
    new THREE.BoxGeometry(0.24, 0.22, 0.32),
    materials.wickerBasket
  );
  basket.position.set(0.72, 0.75, 0);
  bikeGroup.add(basket);

  group.add(bikeGroup);

  // 8. Cast Iron Bollards (Along Sidewalk Curb)
  const bollardPositions = [
    [-4.5, 5.8],
    [-1.5, 5.8],
    [1.5, 5.8],
    [6.5, 5.8],
    [-5.8, 1.8],
    [-5.8, -1.8]
  ];

  bollardPositions.forEach(([bx, bz]) => {
    const bollard = new THREE.Group();
    bollard.position.set(bx, 0.2, bz);

    const base = new THREE.Mesh(
      new THREE.CylinderGeometry(0.14, 0.16, 0.2, 10),
      materials.wroughtIron
    );
    base.position.y = 0.1;
    bollard.add(base);

    const post = new THREE.Mesh(
      new THREE.CylinderGeometry(0.1, 0.12, 0.75, 10),
      materials.wroughtIron
    );
    post.position.y = 0.48;
    bollard.add(post);

    // Reflective white ring
    const ring = new THREE.Mesh(
      new THREE.CylinderGeometry(0.105, 0.105, 0.08, 10),
      materials.whiteTrim
    );
    ring.position.y = 0.75;
    bollard.add(ring);

    // Domed top
    const top = new THREE.Mesh(
      new THREE.SphereGeometry(0.11, 10, 8),
      materials.wroughtIron
    );
    top.position.y = 0.88;
    bollard.add(top);

    group.add(bollard);
  });

  // 9. Traditional British Park Bench (Sidewalk)
  const benchGroup = new THREE.Group();
  benchGroup.position.set(9.2, 0.2, 3.8);
  benchGroup.rotation.y = -Math.PI / 2;

  // Slatted seat & back
  for (let s = 0; s < 4; s++) {
    const slat = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.03, 0.09),
      materials.darkWood
    );
    slat.position.set(0, 0.45, -0.15 + s * 0.11);
    benchGroup.add(slat);
  }

  for (let b = 0; b < 3; b++) {
    const bSlat = new THREE.Mesh(
      new THREE.BoxGeometry(1.6, 0.09, 0.03),
      materials.darkWood
    );
    bSlat.position.set(0, 0.65 + b * 0.12, -0.2);
    benchGroup.add(bSlat);
  }

  // Cast iron bench ends
  [-0.75, 0.75].forEach(bx => {
    const leg = new THREE.Mesh(
      new THREE.BoxGeometry(0.06, 0.8, 0.5),
      materials.wroughtIron
    );
    leg.position.set(bx, 0.4, 0);
    benchGroup.add(leg);
  });

  group.add(benchGroup);

  // 10. British Cast-Iron Street Rubbish Bin
  const binGroup = new THREE.Group();
  binGroup.position.set(-5.6, 0.2, 3.5);

  const binBody = new THREE.Mesh(
    new THREE.CylinderGeometry(0.24, 0.22, 0.85, 12),
    materials.wroughtIron
  );
  binBody.position.y = 0.42;
  binGroup.add(binBody);

  const binLid = new THREE.Mesh(
    new THREE.CylinderGeometry(0.26, 0.26, 0.12, 12),
    materials.shopfrontTrimGold
  );
  binLid.position.y = 0.88;
  binGroup.add(binLid);

  group.add(binGroup);

  // 11. Pedestrian Zebra Crossing Beacon (Belisha Beacon)
  const beaconGroup = new THREE.Group();
  beaconGroup.position.set(-5.8, 0.2, 6.2);

  // Striped black and white post
  for (let p = 0; p < 7; p++) {
    const bandMat = p % 2 === 0 ? materials.wroughtIron : materials.whiteTrim;
    const band = new THREE.Mesh(
      new THREE.CylinderGeometry(0.06, 0.06, 0.4, 8),
      bandMat
    );
    band.position.y = 0.2 + p * 0.4;
    beaconGroup.add(band);
  }

  // Amber glowing globe
  const globe = new THREE.Mesh(
    new THREE.SphereGeometry(0.24, 16, 12),
    materials.trafficLightYellow
  );
  globe.position.y = 3.1;
  beaconGroup.add(globe);

  const beaconLight = new THREE.PointLight(0xffb703, 1.4, 6, 1.5);
  beaconLight.position.y = 3.1;
  beaconGroup.add(beaconLight);

  group.add(beaconGroup);
  animatables.beaconLight = beaconLight;

  // 12. London Atmospheric Element: Classic Red Double-Decker Bus (At road edge)
  const busGroup = new THREE.Group();
  busGroup.position.set(7.5, 0.05, 9.6);
  busGroup.rotation.y = Math.PI;

  // Bus Main Red Body (Lower & Upper Deck)
  const busBody = new THREE.Mesh(
    new THREE.BoxGeometry(6.5, 3.2, 2.3),
    materials.doubleDeckerRed
  );
  busBody.position.y = 1.8;
  busGroup.add(busBody);

  // Bus Cream dividing horizontal stripe
  const busStripe = new THREE.Mesh(
    new THREE.BoxGeometry(6.52, 0.15, 2.32),
    materials.whiteTrim
  );
  busStripe.position.y = 1.95;
  busGroup.add(busStripe);

  // Glowing Passenger Windows (Upper Deck)
  const winUpper = new THREE.Mesh(
    new THREE.BoxGeometry(5.6, 0.75, 2.34),
    materials.warmLightGlow
  );
  winUpper.position.y = 2.65;
  busGroup.add(winUpper);

  // Glowing Passenger Windows (Lower Deck)
  const winLower = new THREE.Mesh(
    new THREE.BoxGeometry(4.2, 0.75, 2.34),
    materials.warmLightGlow
  );
  winLower.position.set(-0.6, 1.25, 0);
  busGroup.add(winLower);

  // Destination Blind ("15 TRAFALGAR SQ")
  const destBlind = new THREE.Mesh(
    new THREE.BoxGeometry(0.04, 0.35, 1.2),
    materials.filamentOrange
  );
  destBlind.position.set(-3.26, 2.2, 0);
  busGroup.add(destBlind);

  // Rear / Front round glowing lamps
  const tailLamp1 = new THREE.Mesh(
    new THREE.CylinderGeometry(0.08, 0.08, 0.04, 8),
    materials.trafficLightRed
  );
  tailLamp1.rotation.z = Math.PI / 2;
  tailLamp1.position.set(-3.26, 0.8, -0.85);
  busGroup.add(tailLamp1);

  const tailLamp2 = tailLamp1.clone();
  tailLamp2.position.z = 0.85;
  busGroup.add(tailLamp2);

  // Headlights casting wet rain beam onto the road
  const headlight1 = new THREE.SpotLight(0xfff0c4, 4.0, 10, Math.PI / 4, 0.5);
  headlight1.position.set(3.4, 0.8, -0.85);
  headlight1.target.position.set(10.0, 0.2, -0.85);
  busGroup.add(headlight1);
  busGroup.add(headlight1.target);

  // Black wheels
  [-1.8, 1.8].forEach(wx => {
    [-1.05, 1.05].forEach(wz => {
      const wheel = new THREE.Mesh(
        new THREE.CylinderGeometry(0.42, 0.42, 0.25, 12),
        materials.victorianLampMetal
      );
      wheel.rotation.x = Math.PI / 2;
      wheel.position.set(wx, 0.42, wz);
      busGroup.add(wheel);
    });
  });

  group.add(busGroup);

  return {
    group,
    animatables
  };
}
