import * as THREE from 'three';

/**
 * Soft radial particle texture for steam puffs and misty vehicle light sweeps
 */
function createSoftGlowTexture(colorStop0 = 'rgba(255, 250, 240, 0.75)', colorStop1 = 'rgba(255, 240, 220, 0)') {
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  const g = ctx.createRadialGradient(64, 64, 4, 64, 64, 60);
  g.addColorStop(0, colorStop0);
  g.addColorStop(0.5, colorStop0.replace('0.75', '0.28'));
  g.addColorStop(1, colorStop1);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 128, 128);
  return new THREE.CanvasTexture(canvas);
}

/**
 * Animated flowing water rivulet texture for stone pavement & gutter streams
 */
function createFlowingWaterTexture() {
  const canvas = document.createElement('canvas');
  canvas.width = 512;
  canvas.height = 64;
  const ctx = canvas.getContext('2d');

  ctx.clearRect(0, 0, 512, 64);

  // Shimmering anime water streaks
  for (let i = 0; i < 18; i++) {
    const x = (i * 31) % 460;
    const y = 10 + (i * 17) % 44;
    const len = 32 + (i % 4) * 18;
    const g = ctx.createLinearGradient(x, y, x + len, y);
    g.addColorStop(0, 'rgba(160, 210, 255, 0)');
    g.addColorStop(0.5, 'rgba(220, 240, 255, 0.65)');
    g.addColorStop(1, 'rgba(255, 215, 150, 0)');
    ctx.fillStyle = g;
    ctx.fillRect(x, y, len, 3);
  }

  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  return tex;
}

export function buildDynamicEffects(scene, refs) {
  const group = new THREE.Group();
  group.name = 'DynamicEffects';

  // Helper to check if an (x, z) point is inside the covered café footprint
  const isInsideCafe = (x, z) => x > -7.85 && x < 2.55 && z > -8.25 && z < 1.55;

  // ==========================================================================
  // 1. CONTINUOUS SLANTED ANIME RAINFALL (持续降雨)
  // ==========================================================================
  const rainCount = 1500;
  const rainPositions = new Float32Array(rainCount * 6);
  const rainData = [];

  for (let i = 0; i < rainCount; i++) {
    let rx = (Math.random() - 0.5) * 23.2;
    let rz = (Math.random() - 0.5) * 23.2;
    let ry = Math.random() * 13.5 + 0.5;

    // Keep low rain outside the indoor café volume
    if (isInsideCafe(rx, rz) && ry < 9.5) {
      if (Math.random() < 0.5) rx = 3.0 + Math.random() * 8.5;
      else rz = 1.8 + Math.random() * 9.8;
    }

    const len = 0.52 + Math.random() * 0.35;
    const speed = 13.5 + Math.random() * 4.5;
    rainData.push({ x: rx, y: ry, z: rz, len, speed });
  }

  const rainGeo = new THREE.BufferGeometry();
  rainGeo.setAttribute('position', new THREE.BufferAttribute(rainPositions, 3));
  const rainMat = new THREE.LineBasicMaterial({
    color: 0xaec8eb,
    transparent: true,
    opacity: 0.38,
    depthWrite: false,
  });
  const rainLines = new THREE.LineSegments(rainGeo, rainMat);
  group.add(rainLines);

  // ==========================================================================
  // 2. AWNING EAVE WATER DRIPPING (屋檐滴水)
  // ==========================================================================
  const dripCount = 34;
  const dripGeo = new THREE.SphereGeometry(0.022, 6, 6);
  dripGeo.scale(0.8, 2.2, 0.8);
  const dripMat = new THREE.MeshBasicMaterial({
    color: 0xd8ecff,
    transparent: true,
    opacity: 0.78,
  });

  const drips = [];
  for (let i = 0; i < dripCount; i++) {
    const mesh = new THREE.Mesh(dripGeo, dripMat);
    const isSouth = i < 18;
    const startX = isSouth ? -7.1 + (i / 17) * 7.1 : 3.57;
    const startZ = isSouth ? 2.57 : -7.4 + ((i - 18) / 15) * 6.4;
    const startY = 3.01;

    mesh.position.set(startX, startY - Math.random() * 2.7, startZ);
    group.add(mesh);

    drips.push({
      mesh,
      startX,
      startY,
      startZ,
      y: mesh.position.y,
      vel: 1.5 + Math.random() * 1.5,
      pause: Math.random() * 0.6,
    });
  }

  // ==========================================================================
  // 3. RAINDROPS SLIDING DOWN LARGE GLASS WINDOWS (玻璃窗雨滴滑落)
  // ==========================================================================
  const winDropCount = 48;
  const winDropGeo = new THREE.PlaneGeometry(0.022, 0.14);
  const winDropMat = new THREE.MeshBasicMaterial({
    color: 0xffe8b8, // Refracts the warm golden café light inside!
    transparent: true,
    opacity: 0.65,
    side: THREE.DoubleSide,
    depthWrite: false,
  });

  const windowDrops = [];
  for (let i = 0; i < winDropCount; i++) {
    const mesh = new THREE.Mesh(winDropGeo, winDropMat);
    const isSouth = i < 26;
    const basePos = isSouth
      ? -7.1 + Math.random() * 7.0
      : -7.4 + Math.random() * 6.3;
    const y = 1.05 + Math.random() * 2.45;

    if (isSouth) {
      mesh.position.set(basePos, y, 1.405);
    } else {
      mesh.rotation.y = Math.PI / 2;
      mesh.position.set(2.405, y, basePos);
    }

    group.add(mesh);
    windowDrops.push({
      mesh,
      isSouth,
      baseCoord: basePos,
      y,
      speed: 0.22 + Math.random() * 0.35,
      seed: Math.random() * 100,
    });
  }

  // ==========================================================================
  // 4. EXPANDING GROUND PUDDLE RIPPLES (地面积水波纹)
  // ==========================================================================
  const rippleCount = 70;
  const rippleRingGeo = new THREE.RingGeometry(0.08, 0.115, 20);
  rippleRingGeo.rotateX(-Math.PI / 2);

  const ripples = [];
  for (let i = 0; i < rippleCount; i++) {
    const rMat = new THREE.MeshBasicMaterial({
      color: 0xcbe0ff,
      transparent: true,
      opacity: 0.5,
      depthWrite: false,
    });
    const rMesh = new THREE.Mesh(rippleRingGeo, rMat);

    // Pick a random spot on the street, puddles, sidewalk, or alley outside the café
    let rx = (Math.random() - 0.5) * 22.5;
    let rz = (Math.random() - 0.5) * 22.5;
    if (isInsideCafe(rx, rz)) {
      rz = 2.0 + Math.random() * 9.2;
    }
    // Determine surface height (sidewalk = 0.228, alley = 0.17, road = 0.028)
    let ry = 0.028;
    if (rx < 5.0 && rz < 4.0) {
      ry = rx < -7.8 && rx > -10.2 && rz < 1.4 ? 0.172 : 0.228;
    }

    rMesh.position.set(rx, ry, rz);
    group.add(rMesh);

    ripples.push({
      mesh: rMesh,
      mat: rMat,
      phase: Math.random(),
      speed: 0.65 + Math.random() * 0.55,
      maxScale: 1.4 + Math.random() * 1.8,
    });
  }

  // ==========================================================================
  // 5. RAINWATER FLOWING ALONG STONE PAVEMENT & GUTTERS (雨水顺着石砖路面流淌)
  // ==========================================================================
  const flowTex = createFlowingWaterTexture();
  flowTex.repeat.set(6, 1);
  const flowMat = new THREE.MeshBasicMaterial({
    map: flowTex,
    transparent: true,
    opacity: 0.52,
    depthWrite: false,
  });

  // South Curb Gutter Stream (flowing toward storm drain grates)
  const southStream = new THREE.Mesh(new THREE.PlaneGeometry(16.0, 0.26), flowMat);
  southStream.rotation.x = -Math.PI / 2;
  southStream.position.set(-3.2, 0.026, 4.24);
  group.add(southStream);

  // East Curb Gutter Stream
  const eastStream = new THREE.Mesh(new THREE.PlaneGeometry(15.0, 0.26), flowMat);
  eastStream.rotation.x = -Math.PI / 2;
  eastStream.rotation.z = Math.PI / 2;
  eastStream.position.set(5.24, 0.026, -3.8);
  group.add(eastStream);

  // Cobblestone Alley Center Water Rivulet
  const alleyStream = new THREE.Mesh(new THREE.PlaneGeometry(12.0, 0.34), flowMat);
  alleyStream.rotation.x = -Math.PI / 2;
  alleyStream.rotation.z = -Math.PI / 2;
  alleyStream.position.set(-9.0, 0.168, -4.5);
  group.add(alleyStream);

  // ==========================================================================
  // 6. ESPRESSO MACHINE & COFFEE CUP RISING STEAM (咖啡机与咖啡杯微弱蒸汽感)
  // ==========================================================================
  const steamTex = createSoftGlowTexture('rgba(255, 248, 235, 0.42)', 'rgba(255, 248, 235, 0)');
  const steamParticles = [];

  const steamOrigins = [
    { pos: refs.interior.espressoSteamOrigin, scale: 0.26, count: 10 },
    ...refs.interior.steamCupPositions.map((pos) => ({ pos, scale: 0.13, count: 4 })),
  ];

  steamOrigins.forEach(({ pos, scale, count }) => {
    for (let i = 0; i < count; i++) {
      const sMat = new THREE.SpriteMaterial({
        map: steamTex,
        transparent: true,
        opacity: 0.3,
        depthWrite: false,
      });
      const sprite = new THREE.Sprite(sMat);
      sprite.position.copy(pos);
      sprite.scale.setScalar(scale);
      group.add(sprite);

      steamParticles.push({
        sprite,
        mat: sMat,
        origin: pos.clone(),
        baseScale: scale,
        phase: i / count + Math.random() * 0.2,
        speed: 0.28 + Math.random() * 0.16,
        swirlSeed: Math.random() * 10,
      });
    }
  });

  // ==========================================================================
  // 7. DISTANT VEHICLE LIGHTS HAZILY SWEEPING PAST (远处车辆灯光朦胧掠过)
  // ==========================================================================
  const warmSweepTex = createSoftGlowTexture('rgba(255, 210, 125, 0.55)', 'rgba(255, 190, 90, 0)');
  const redSweepTex = createSoftGlowTexture('rgba(255, 60, 45, 0.55)', 'rgba(255, 40, 30, 0)');

  // Headlight sweep gliding along South Roadway (Z = 6.4)
  const southLightSweep = new THREE.Mesh(
    new THREE.PlaneGeometry(5.5, 1.6),
    new THREE.MeshBasicMaterial({
      map: warmSweepTex,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  southLightSweep.rotation.x = -Math.PI / 2;
  southLightSweep.position.set(0, 0.032, 6.4);
  group.add(southLightSweep);

  // Red Taillight sweep gliding along East Roadway (X = 9.2)
  const eastLightSweep = new THREE.Mesh(
    new THREE.PlaneGeometry(1.6, 5.2),
    new THREE.MeshBasicMaterial({
      map: redSweepTex,
      transparent: true,
      opacity: 0.4,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    })
  );
  eastLightSweep.rotation.x = -Math.PI / 2;
  eastLightSweep.position.set(9.2, 0.032, 0);
  group.add(eastLightSweep);

  scene.add(group);

  // ==========================================================================
  // MASTER UPDATE FUNCTION FOR ALL 11 DYNAMIC ANIMATIONS
  // ==========================================================================
  function update(elapsedTime, delta) {
    const dt = Math.min(delta, 0.05);

    // 1. Update Slanted Rainfall
    const posAttr = rainGeo.attributes.position;
    const arr = posAttr.array;
    const windX = -1.35;
    const windZ = 0.65;

    for (let i = 0; i < rainCount; i++) {
      const r = rainData[i];
      r.y -= r.speed * dt;
      r.x += windX * dt;
      r.z += windZ * dt;

      const minY = isInsideCafe(r.x, r.z) ? 9.5 : 0.15;
      if (r.y < minY) {
        r.y = 12.8 + Math.random() * 2.2;
        r.x = (Math.random() - 0.5) * 23.0;
        r.z = (Math.random() - 0.5) * 23.0;
        if (isInsideCafe(r.x, r.z) && Math.random() < 0.7) {
          r.z = 1.8 + Math.random() * 9.8;
        }
      }

      const idx = i * 6;
      arr[idx] = r.x;
      arr[idx + 1] = r.y;
      arr[idx + 2] = r.z;
      arr[idx + 3] = r.x + windX * 0.06 * r.len;
      arr[idx + 4] = r.y - r.len;
      arr[idx + 5] = r.z + windZ * 0.06 * r.len;
    }
    posAttr.needsUpdate = true;

    // 2. Update Eave Water Dripping from Café Awnings
    for (let i = 0; i < drips.length; i++) {
      const d = drips[i];
      if (d.pause > 0) {
        d.pause -= dt;
        d.mesh.position.y = d.startY;
        const grow = Math.max(0.2, 1.0 - d.pause * 1.2);
        d.mesh.scale.setScalar(grow);
      } else {
        d.mesh.scale.setScalar(1.0);
        d.vel += 7.8 * dt;
        d.y -= d.vel * dt;
        d.mesh.position.y = d.y;
        if (d.y <= 0.25) {
          d.y = d.startY;
          d.vel = 0.8 + Math.random() * 0.6;
          d.pause = 0.15 + Math.random() * 0.55;
        }
      }
    }

    // 3. Update Raindrops Sliding Down Café Display Windows
    for (let i = 0; i < windowDrops.length; i++) {
      const wd = windowDrops[i];
      // Intermittent pause-and-slide motion like real raindrops on glass
      const slideFactor = 0.6 + 0.5 * Math.sin(elapsedTime * 3.2 + wd.seed);
      wd.y -= wd.speed * slideFactor * dt;
      if (wd.y < 1.02) {
        wd.y = 3.48;
      }
      const wiggle = Math.sin(wd.y * 9.0 + wd.seed) * 0.018;
      if (wd.isSouth) {
        wd.mesh.position.set(wd.baseCoord + wiggle, wd.y, 1.405);
      } else {
        wd.mesh.position.set(2.405, wd.y, wd.baseCoord + wiggle);
      }
    }

    // 4. Update Expanding Puddle Ripples
    for (let i = 0; i < ripples.length; i++) {
      const rp = ripples[i];
      rp.phase += rp.speed * dt;
      if (rp.phase >= 1.0) {
        rp.phase -= 1.0;
      }
      const s = 0.1 + rp.phase * rp.maxScale;
      rp.mesh.scale.set(s, 1, s);
      rp.mat.opacity = (1.0 - rp.phase) * 0.45;
    }

    // 5. Update Flowing Rainwater Along Gutters & Cobblestones
    flowTex.offset.x = -elapsedTime * 0.85;

    // 6. Update Rising Espresso Machine & Coffee Cup Steam
    for (let i = 0; i < steamParticles.length; i++) {
      const sp = steamParticles[i];
      sp.phase += sp.speed * dt;
      if (sp.phase >= 1.0) {
        sp.phase -= 1.0;
      }
      const p = sp.phase;
      sp.sprite.position.x = sp.origin.x + Math.sin(elapsedTime * 2.0 + sp.swirlSeed + p * 4.0) * 0.055 * p;
      sp.sprite.position.y = sp.origin.y + p * 0.48;
      sp.sprite.position.z = sp.origin.z + Math.cos(elapsedTime * 1.7 + sp.swirlSeed + p * 4.0) * 0.045 * p;

      const curScale = sp.baseScale * (0.65 + p * 1.15);
      sp.sprite.scale.setScalar(curScale);
      sp.mat.opacity = Math.sin(p * Math.PI) * 0.28;
    }

    // 7. Update Doorway Wind Chime, Door & Hanging Sign Gentle Breeze Sway
    if (refs.building.windChimePivot) {
      refs.building.windChimePivot.rotation.z = Math.sin(elapsedTime * 2.6) * 0.09 + Math.sin(elapsedTime * 5.1) * 0.03;
      refs.building.windChimePivot.rotation.x = Math.cos(elapsedTime * 2.1) * 0.06;
    }
    if (refs.building.hangingSignPivot) {
      refs.building.hangingSignPivot.rotation.z = Math.sin(elapsedTime * 1.85) * 0.065;
    }
    if (refs.building.doorLeafPivot) {
      refs.building.doorLeafPivot.rotation.y = 0.12 + Math.sin(elapsedTime * 1.1) * 0.025;
    }

    // 8. Update Café Signboard & Window Light Subtle Warm Flicker
    const flickerWave =
      1.0 +
      Math.sin(elapsedTime * 7.5) * 0.03 +
      (Math.sin(elapsedTime * 23.0) > 0.92 ? -0.14 : 0.0);

    refs.building.signBulbMats.forEach((mat, idx) => {
      mat.emissiveIntensity = 2.3 * (idx === 1 ? flickerWave : 1.0 + Math.sin(elapsedTime * 4.0 + idx) * 0.04);
    });
    refs.building.signLights.forEach((lt) => {
      lt.intensity = 1.8 * flickerWave;
    });
    refs.interior.pendantBulbMats.forEach((mat, idx) => {
      mat.emissiveIntensity = 2.7 + Math.sin(elapsedTime * 3.0 + idx * 1.3) * 0.15;
    });

    // 9. Update UK Traffic Signal Light Cycling & Belisha Beacons Pulsing
    // Cycle period = 14 seconds:
    // 0..6s: RED, 6..7.5s: RED+AMBER, 7.5..12s: GREEN, 12..14s: AMBER
    const cycle = elapsedTime % 14.0;
    const tl = refs.props.trafficLights;
    if (tl) {
      if (cycle < 6.0) {
        tl.redLensMat.emissiveIntensity = 3.2;
        tl.amberLensMat.emissiveIntensity = 0.12;
        tl.greenLensMat.emissiveIntensity = 0.12;
        tl.trafficPointLight.color.setHex(0xff2a22);
        tl.trafficPointLight.intensity = 2.2;
      } else if (cycle < 7.5) {
        tl.redLensMat.emissiveIntensity = 2.8;
        tl.amberLensMat.emissiveIntensity = 2.8;
        tl.greenLensMat.emissiveIntensity = 0.12;
        tl.trafficPointLight.color.setHex(0xff6a14);
        tl.trafficPointLight.intensity = 2.4;
      } else if (cycle < 12.0) {
        tl.redLensMat.emissiveIntensity = 0.12;
        tl.amberLensMat.emissiveIntensity = 0.12;
        tl.greenLensMat.emissiveIntensity = 3.2;
        tl.trafficPointLight.color.setHex(0x1ee66b);
        tl.trafficPointLight.intensity = 2.1;
      } else {
        tl.redLensMat.emissiveIntensity = 0.12;
        tl.amberLensMat.emissiveIntensity = 3.2;
        tl.greenLensMat.emissiveIntensity = 0.12;
        tl.trafficPointLight.color.setHex(0xffaa00);
        tl.trafficPointLight.intensity = 2.2;
      }
    }

    // Zebra Crossing Belisha Beacons Pulsing
    const beaconPulse = 1.4 + Math.sin(elapsedTime * 4.2) * 0.9;
    refs.base.beaconGlobes.forEach((gMat) => {
      gMat.emissiveIntensity = beaconPulse;
    });
    refs.base.beaconLights.forEach((bLight) => {
      bLight.intensity = beaconPulse * 0.65;
    });

    // 10. Update Distant Vehicle Light Sweeps & Subtle Bus/Cab Engine Idle
    const sweepT1 = ((elapsedTime * 0.28) % 1.0) * 22.0 - 11.0;
    southLightSweep.position.x = sweepT1;
    southLightSweep.material.opacity = Math.sin(((sweepT1 + 11.0) / 22.0) * Math.PI) * 0.42;

    const sweepT2 = 11.0 - ((elapsedTime * 0.22 + 0.4) % 1.0) * 22.0;
    eastLightSweep.position.z = sweepT2;
    eastLightSweep.material.opacity = Math.sin(((sweepT2 + 11.0) / 22.0) * Math.PI) * 0.38;

    if (refs.props.busGroup) {
      refs.props.busGroup.position.y = 0.02 + Math.sin(elapsedTime * 18.0) * 0.0035;
    }
    if (refs.props.cabGroup) {
      refs.props.cabGroup.position.y = 0.02 + Math.cos(elapsedTime * 16.0) * 0.0025;
    }
  }

  return {
    group,
    update,
  };
}
