import * as THREE from 'three';

export class AtmosphericEffects {
  constructor(scene, options = {}) {
    this.scene = scene;
    this.steamEmitters = options.steamEmitters || [];
    this.animatables = options.animatables || {};
    this.bellGroup = options.bellGroup;
    this.puddles = options.puddles || [];

    this.initRain();
    this.initAwningDrips();
    this.initPuddleRipples();
    this.initSteam();
    this.initWindowRain();
  }

  // 1. Falling Rain Streaks (Continuous angled British rain)
  initRain() {
    const rainCount = 1800;
    const positions = new Float32Array(rainCount * 6); // 2 vertices per line streak
    const colors = new Float32Array(rainCount * 6);

    this.rainBounds = {
      minX: -12, maxX: 12,
      minY: 0.1, maxY: 15,
      minZ: -12, maxZ: 12
    };

    const streakLength = 0.45;
    const slantX = -0.08;
    const slantZ = 0.04;

    for (let i = 0; i < rainCount; i++) {
      const idx = i * 6;
      const rx = this.rainBounds.minX + Math.random() * 24;
      const ry = this.rainBounds.minY + Math.random() * 15;
      const rz = this.rainBounds.minZ + Math.random() * 24;

      // Top of streak
      positions[idx] = rx;
      positions[idx + 1] = ry;
      positions[idx + 2] = rz;

      // Bottom of streak
      positions[idx + 3] = rx + slantX;
      positions[idx + 4] = ry - streakLength;
      positions[idx + 5] = rz + slantZ;

      // Soft rainy cyan-blue anime color
      colors[idx] = 0.72;
      colors[idx + 1] = 0.88;
      colors[idx + 2] = 1.0;

      // Alpha fade at bottom
      colors[idx + 3] = 0.65;
      colors[idx + 4] = 0.82;
      colors[idx + 5] = 0.95;
    }

    const rainGeo = new THREE.BufferGeometry();
    rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    rainGeo.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const rainMat = new THREE.LineBasicMaterial({
      vertexColors: true,
      transparent: true,
      opacity: 0.45,
      blending: THREE.AdditiveBlending
    });

    this.rainMesh = new THREE.LineSegments(rainGeo, rainMat);
    this.scene.add(this.rainMesh);
    this.rainCount = rainCount;
    this.rainSpeed = 22.0;
  }

  // 2. Awning Edge Water Drips
  initAwningDrips() {
    this.dripCount = 30;
    this.drips = [];
    const dripGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.12, 4);
    const dripMat = new THREE.MeshBasicMaterial({
      color: 0xcae8ff,
      transparent: true,
      opacity: 0.65
    });

    for (let i = 0; i < this.dripCount; i++) {
      const drip = new THREE.Mesh(dripGeo, dripMat);
      drip.position.set(
        -1.5 + Math.random() * 5.8,
        2.6 - Math.random() * 2.4,
        0.95
      );
      drip.userData = {
        speed: 4.5 + Math.random() * 3.0,
        startY: 2.6,
        floorY: 0.22
      };
      this.scene.add(drip);
      this.drips.push(drip);
    }
  }

  // 3. Puddle Concentric Ripples (Expanding rings on wet puddles)
  initPuddleRipples() {
    this.ripplePool = [];
    const rippleGeo = new THREE.RingGeometry(0.04, 0.08, 16);
    rippleGeo.rotateX(-Math.PI / 2);

    const puddleCenters = [
      { x: -5.2, y: 0.12, z: 7.8, r: 1.2 },
      { x: 2.8, y: 0.12, z: 9.4, r: 1.6 },
      { x: -3.2, y: 0.23, z: 4.2, r: 0.7 },
      { x: 4.5, y: 0.23, z: 4.8, r: 0.6 },
      { x: -4.8, y: 0.12, z: 6.6, r: 0.5 }
    ];

    for (let i = 0; i < 18; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xcae6ff,
        transparent: true,
        opacity: 0.0,
        side: THREE.DoubleSide
      });
      const ring = new THREE.Mesh(rippleGeo, mat);
      const targetPuddle = puddleCenters[i % puddleCenters.length];

      ring.userData = {
        active: true,
        puddle: targetPuddle,
        life: Math.random(),
        scaleSpeed: 0.8 + Math.random() * 0.4
      };

      this.scene.add(ring);
      this.ripplePool.push(ring);
    }
  }

  // 4. Steam Particles from Coffee Machine & Cup
  initSteam() {
    this.steamParticles = [];
    const steamGeo = new THREE.SphereGeometry(0.06, 6, 6);

    for (let i = 0; i < 40; i++) {
      const mat = new THREE.MeshBasicMaterial({
        color: 0xffeedb,
        transparent: true,
        opacity: 0.0
      });
      const particle = new THREE.Mesh(steamGeo, mat);
      const emitter = this.steamEmitters[i % this.steamEmitters.length] || new THREE.Vector3(1.4, 1.7, -3.8);

      particle.userData = {
        emitter: emitter,
        progress: Math.random(),
        speed: 0.25 + Math.random() * 0.2,
        wobbleOffset: Math.random() * Math.PI * 2
      };

      this.scene.add(particle);
      this.steamParticles.push(particle);
    }
  }

  // 5. Window Droplets Slipping Down Cafe Glass
  initWindowRain() {
    this.windowDrops = [];
    const dropGeo = new THREE.BoxGeometry(0.02, 0.12, 0.02);
    const dropMat = new THREE.MeshBasicMaterial({
      color: 0xd6edff,
      transparent: true,
      opacity: 0.5
    });

    for (let i = 0; i < 24; i++) {
      const drop = new THREE.Mesh(dropGeo, dropMat);
      drop.position.set(
        -1.5 + Math.random() * 5.6,
        1.2 + Math.random() * 1.6,
        -0.98
      );
      drop.userData = {
        speed: 0.4 + Math.random() * 0.8,
        startY: 2.8,
        endY: 1.0
      };
      this.scene.add(drop);
      this.windowDrops.push(drop);
    }
  }

  // Per-frame animation tick
  update(delta, time) {
    // 1. Rain streaks
    if (this.rainMesh) {
      const posAttr = this.rainMesh.geometry.attributes.position;
      const arr = posAttr.array;
      const count = this.rainCount;
      const streakLength = 0.45;
      const dropDist = this.rainSpeed * delta;

      for (let i = 0; i < count; i++) {
        const idx = i * 6;
        arr[idx + 1] -= dropDist;
        arr[idx + 4] = arr[idx + 1] - streakLength;

        // Reset if hitting floor
        if (arr[idx + 4] < this.rainBounds.minY) {
          arr[idx + 1] = this.rainBounds.maxY + Math.random() * 1.0;
          arr[idx + 4] = arr[idx + 1] - streakLength;
          arr[idx] = this.rainBounds.minX + Math.random() * 24;
          arr[idx + 3] = arr[idx] - 0.08;
          arr[idx + 2] = this.rainBounds.minZ + Math.random() * 24;
          arr[idx + 5] = arr[idx + 2] + 0.04;
        }
      }
      posAttr.needsUpdate = true;
    }

    // 2. Awning Drips
    this.drips.forEach(drip => {
      drip.position.y -= drip.userData.speed * delta;
      if (drip.position.y <= drip.userData.floorY) {
        drip.position.y = drip.userData.startY;
        drip.position.x = -1.5 + Math.random() * 5.8;
      }
    });

    // 3. Puddle Ripples
    this.ripplePool.forEach(ring => {
      ring.userData.life += delta * ring.userData.scaleSpeed;
      if (ring.userData.life >= 1.0) {
        ring.userData.life = 0;
        const p = ring.userData.puddle;
        const ang = Math.random() * Math.PI * 2;
        const rad = Math.random() * p.r * 0.7;
        ring.position.set(p.x + Math.cos(ang) * rad, p.y + 0.01, p.z + Math.sin(ang) * rad);
      }

      const life = ring.userData.life;
      const currentScale = 0.2 + life * 2.8;
      ring.scale.set(currentScale, currentScale, 1);
      ring.material.opacity = Math.sin(life * Math.PI) * 0.42;
    });

    // 4. Steam
    this.steamParticles.forEach(p => {
      p.userData.progress += delta * p.userData.speed;
      if (p.userData.progress >= 1.0) {
        p.userData.progress = 0;
      }

      const prog = p.userData.progress;
      const em = p.userData.emitter;
      const wobble = Math.sin(time * 3 + p.userData.wobbleOffset) * 0.08 * prog;

      p.position.set(
        em.x + wobble,
        em.y + prog * 0.8,
        em.z + Math.cos(time * 2.5 + p.userData.wobbleOffset) * 0.06 * prog
      );

      const currentScale = 0.8 + prog * 2.2;
      p.scale.set(currentScale, currentScale, currentScale);
      p.material.opacity = Math.sin(prog * Math.PI) * 0.35;
    });

    // 5. Window sliding drops
    this.windowDrops.forEach(drop => {
      drop.position.y -= drop.userData.speed * delta;
      if (drop.position.y <= drop.userData.endY) {
        drop.position.y = drop.userData.startY;
        drop.position.x = -1.5 + Math.random() * 5.6;
      }
    });

    // 6. Swaying Entrance Bell
    if (this.bellGroup) {
      this.bellGroup.rotation.z = Math.sin(time * 2.2) * 0.06;
    }

    // 7. Ambient Light Breathing / Flicker
    if (this.animatables.streetLight) {
      // Subtle gas mantle warmth flicker
      const flicker = 1.0 + Math.sin(time * 8.0) * 0.04 + (Math.random() - 0.5) * 0.03;
      this.animatables.streetLight.intensity = 3.5 * flicker;
    }

    if (this.animatables.beaconLight) {
      // Belisha beacon amber pulse (rhythmic pulse)
      const pulse = 0.5 + 0.5 * Math.sin(time * 3.5);
      this.animatables.beaconLight.intensity = 0.6 + pulse * 1.4;
    }
  }
}
