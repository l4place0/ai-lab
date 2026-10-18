import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

import { MaterialManager } from './materials.js';
import { createDioramaBase } from './base.js';
import { createCoffeeShopBuilding } from './building.js';
import { createCafeInterior } from './interior.js';
import { createStreetProps } from './props.js';
import { AtmosphericEffects } from './effects.js';

// Setup Application
class RainyLondonDiorama {
  constructor() {
    this.container = document.getElementById('canvas-container');
    this.initScene();
    this.initCamera();
    this.initRenderer();
    this.initLights();
    this.initControls();
    this.buildWorld();
    this.initEvents();
    this.animate = this.animate.bind(this);

    this.clock = new THREE.Clock();
    requestAnimationFrame(this.animate);
  }

  initScene() {
    this.scene = new THREE.Scene();
    // Moody London rain night background
    this.scene.background = new THREE.Color(0x0c1017);
    this.scene.fog = new THREE.FogExp2(0x0d121c, 0.014);
  }

  initCamera() {
    const aspect = window.innerWidth / window.innerHeight;
    this.camera = new THREE.PerspectiveCamera(38, aspect, 0.5, 100);
    // Beautiful third-person isometric-leaning diorama perspective
    this.camera.position.set(17, 14, 18);
  }

  initRenderer() {
    this.renderer = new THREE.WebGLRenderer({
      antialias: true,
      powerPreference: 'high-performance',
      preserveDrawingBuffer: true
    });
    this.renderer.setSize(window.innerWidth, window.innerHeight);
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
    this.renderer.toneMappingExposure = 1.18;
    this.renderer.outputColorSpace = THREE.SRGBColorSpace;

    this.container.appendChild(this.renderer.domElement);
  }

  initLights() {
    // 1. Cool ambient light representing London rainy overcast sky
    const ambientLight = new THREE.AmbientLight(0x425875, 1.4);
    this.scene.add(ambientLight);

    // 2. Directional cool moonlight filtering through rain clouds
    const dirLight = new THREE.DirectionalLight(0x789ac2, 1.1);
    dirLight.position.set(-12, 22, 14);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 2048;
    dirLight.shadow.mapSize.height = 2048;
    dirLight.shadow.camera.near = 1;
    dirLight.shadow.camera.far = 50;
    dirLight.shadow.camera.left = -16;
    dirLight.shadow.camera.right = 16;
    dirLight.shadow.camera.top = 16;
    dirLight.shadow.camera.bottom = -16;
    dirLight.shadow.bias = -0.0005;
    dirLight.shadow.normalBias = 0.02;
    this.scene.add(dirLight);

    // 3. Subtle bottom bounce light to soften harsh shadows on diorama base
    const bounceLight = new THREE.DirectionalLight(0x1a2638, 0.4);
    bounceLight.position.set(0, -10, 0);
    this.scene.add(bounceLight);
  }

  initControls() {
    this.controls = new OrbitControls(this.camera, this.renderer.domElement);
    this.controls.enableDamping = true;
    this.controls.dampingFactor = 0.05;
    this.controls.target.set(1.2, 2.6, 0); // Focus on coffee shop entrance & window
    this.controls.maxPolarAngle = Math.PI / 2.08; // Prevent viewing underneath the pedestal
    this.controls.minDistance = 7;
    this.controls.maxDistance = 42;
    this.controls.autoRotate = false;
  }

  buildWorld() {
    // 1. Initialize cel-shaded anime materials
    this.materials = new MaterialManager();

    // 2. Base Pedestal, Road, Curved Curb, Sidewalk, Puddles
    const baseData = createDioramaBase(this.materials);
    this.scene.add(baseData.group);

    // 3. Coffee Shop Architecture (Shopfront, bay windows, brickwork, awning)
    const buildingData = createCoffeeShopBuilding(this.materials);
    this.scene.add(buildingData.group);

    // 4. Detailed Interior visible through glass
    const interiorData = createCafeInterior(this.materials);
    this.scene.add(interiorData.group);

    // 5. Exterior London Street Furniture & Props
    const propsData = createStreetProps(this.materials);
    this.scene.add(propsData.group);

    // 6. Dynamic Atmospheric FX (Rain, drips, ripples, steam, flickers)
    this.effects = new AtmosphericEffects(this.scene, {
      steamEmitters: interiorData.steamEmitters,
      animatables: propsData.animatables,
      bellGroup: buildingData.bellGroup,
      puddles: baseData.puddles
    });
  }

  initEvents() {
    window.addEventListener('resize', () => {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();
      this.renderer.setSize(window.innerWidth, window.innerHeight);
    });
  }

  animate() {
    requestAnimationFrame(this.animate);
    const delta = this.clock.getDelta();
    const time = this.clock.getElapsedTime();

    this.controls.update();

    if (this.effects) {
      this.effects.update(delta, time);
    }

    this.renderer.render(this.scene, this.camera);
  }
}

// Start diorama
window.addEventListener('DOMContentLoaded', () => {
  new RainyLondonDiorama();
});
