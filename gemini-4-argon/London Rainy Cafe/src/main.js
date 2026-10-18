import * as THREE from 'three';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';

import { buildBaseAndStreet } from './baseAndStreet.js';
import { buildCafeBuilding } from './cafeBuilding.js';
import { buildCafeInterior } from './cafeInterior.js';
import { buildStreetProps } from './streetProps.js';
import { buildDynamicEffects } from './effects.js';

// ============================================================================
// 1. SCENE, CAMERA & RENDERER SETUP (ZERO UI, FULLSCREEN DIORAMA VIEWER)
// ============================================================================
const scene = new THREE.Scene();
scene.background = new THREE.Color(0x0b101b);
scene.fog = new THREE.FogExp2(0x0b101b, 0.0135);

// 36° FOV gives a refined collectible miniature model / tabletop diorama perspective
const camera = new THREE.PerspectiveCamera(
  36,
  window.innerWidth / window.innerHeight,
  0.5,
  160
);
camera.position.set(17.2, 11.4, 18.2);

const renderer = new THREE.WebGLRenderer({
  antialias: true,
  preserveDrawingBuffer: true,
  powerPreference: 'high-performance',
});
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.08;
document.body.appendChild(renderer.domElement);

// Free Drag, Rotate, Pan & Zoom Controls
const controls = new OrbitControls(camera, renderer.domElement);
controls.target.set(-0.8, 2.3, -1.0);
controls.enableDamping = true;
controls.dampingFactor = 0.06;
controls.rotateSpeed = 0.85;
controls.zoomSpeed = 0.95;
controls.panSpeed = 0.85;
controls.minDistance = 6.0;
controls.maxDistance = 46.0;
controls.maxPolarAngle = Math.PI * 0.488; // Allow low street-level peering into café windows
controls.update();

// ============================================================================
// 2. RAINY LONDON NIGHT & WARM CAFÉ LIGHTING RIG
// ============================================================================
// Soft Anime Hemisphere Ambient (Cool rainy London night sky vs. warm dark earth)
const hemiLight = new THREE.HemisphereLight(0x476596, 0x1f1712, 0.92);
hemiLight.position.set(0, 25, 0);
scene.add(hemiLight);

// Cool Rainy Moonlight Directional Light
const moonLight = new THREE.DirectionalLight(0x7ca2de, 1.18);
moonLight.position.set(14, 24, 16);
moonLight.castShadow = true;
moonLight.shadow.mapSize.width = 2048;
moonLight.shadow.mapSize.height = 2048;
moonLight.shadow.camera.near = 2;
moonLight.shadow.camera.far = 60;
const d = 16;
moonLight.shadow.camera.left = -d;
moonLight.shadow.camera.right = d;
moonLight.shadow.camera.top = d;
moonLight.shadow.camera.bottom = -d;
moonLight.shadow.bias = -0.0005;
scene.add(moonLight);

// Subtle Cool Back-Rim Light to make the red brick & roof silhouette pop
const rimLight = new THREE.DirectionalLight(0x4f74b3, 0.55);
rimLight.position.set(-16, 14, -15);
scene.add(rimLight);

// Warm Golden Window Spill Lights projecting out from the South & East Café Windows onto the Wet Sidewalk
const southWindowSpill = new THREE.SpotLight(0xffa636, 5.2, 11.5, Math.PI * 0.42, 0.65, 1.6);
southWindowSpill.position.set(-3.6, 2.8, 0.5);
southWindowSpill.target.position.set(-3.6, 0.0, 4.2);
scene.add(southWindowSpill);
scene.add(southWindowSpill.target);

const eastWindowSpill = new THREE.SpotLight(0xffa636, 5.2, 11.5, Math.PI * 0.42, 0.65, 1.6);
eastWindowSpill.position.set(1.4, 2.8, -4.2);
eastWindowSpill.target.position.set(5.2, 0.0, -4.2);
scene.add(eastWindowSpill);
scene.add(eastWindowSpill.target);

// ============================================================================
// 3. BUILD ALL DIORAMA MODULES
// ============================================================================
const baseRefs = buildBaseAndStreet(scene);
const buildingRefs = buildCafeBuilding(scene);
const interiorRefs = buildCafeInterior(scene);
const propRefs = buildStreetProps(scene);

const effects = buildDynamicEffects(scene, {
  base: baseRefs,
  building: buildingRefs,
  interior: interiorRefs,
  props: propRefs,
});

// ============================================================================
// 4. ANIME CEL-SHADED POST-PROCESSING (BLOOM + INK OUTLINE & COLOR GRADE)
// ============================================================================
const composer = new EffectComposer(renderer);
composer.addPass(new RenderPass(scene, camera));

const bloomPass = new UnrealBloomPass(
  new THREE.Vector2(window.innerWidth, window.innerHeight),
  0.34, // Subtle warm halation around streetlamps & café interior lights
  0.55,
  0.76
);
composer.addPass(bloomPass);

// Custom Screen-Space Anime Ink Line & Cinematic Color-Grading ShaderPass
const AnimeFinishingShader = {
  uniforms: {
    tDiffuse: { value: null },
    uResolution: {
      value: new THREE.Vector2(
        window.innerWidth * Math.min(window.devicePixelRatio, 2),
        window.innerHeight * Math.min(window.devicePixelRatio, 2)
      ),
    },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    uniform sampler2D tDiffuse;
    uniform vec2 uResolution;
    varying vec2 vUv;

    float getLuma(vec3 c) {
      return dot(c, vec3(0.299, 0.587, 0.114));
    }

    void main() {
      vec2 texel = 1.0 / uResolution;
      vec4 center = texture2D(tDiffuse, vUv);

      // Sobel screen-space edge detection for crisp 2D anime ink contour reinforcement
      float tl = getLuma(texture2D(tDiffuse, vUv + texel * vec2(-1.0,  1.0)).rgb);
      float t  = getLuma(texture2D(tDiffuse, vUv + texel * vec2( 0.0,  1.0)).rgb);
      float tr = getLuma(texture2D(tDiffuse, vUv + texel * vec2( 1.0,  1.0)).rgb);
      float l  = getLuma(texture2D(tDiffuse, vUv + texel * vec2(-1.0,  0.0)).rgb);
      float r  = getLuma(texture2D(tDiffuse, vUv + texel * vec2( 1.0,  0.0)).rgb);
      float bl = getLuma(texture2D(tDiffuse, vUv + texel * vec2(-1.0, -1.0)).rgb);
      float b  = getLuma(texture2D(tDiffuse, vUv + texel * vec2( 0.0, -1.0)).rgb);
      float br = getLuma(texture2D(tDiffuse, vUv + texel * vec2( 1.0, -1.0)).rgb);

      float gx = -tl - 2.0 * l - bl + tr + 2.0 * r + br;
      float gy = -tl - 2.0 * t - tr + bl + 2.0 * b + br;
      float edge = smoothstep(0.18, 0.55, sqrt(gx * gx + gy * gy));

      vec3 col = center.rgb;

      // Blend subtle dark indigo anime ink line on high-contrast edges
      vec3 inkColor = vec3(0.05, 0.07, 0.12);
      col = mix(col, inkColor, edge * 0.28);

      // Subtle warm/cool anime film grading & soft vignette
      float dist = length(vUv - vec2(0.5));
      float vig = smoothstep(0.88, 0.32, dist);
      col *= mix(0.82, 1.03, vig);

      gl_FragColor = vec4(col, center.a);
    }
  `,
};

const animePass = new ShaderPass(AnimeFinishingShader);
composer.addPass(animePass);

const outputPass = new OutputPass();
composer.addPass(outputPass);

// ============================================================================
// 5. RESPONSIVE RESIZE & ANIMATION LOOP
// ============================================================================
window.addEventListener('resize', () => {
  const w = window.innerWidth;
  const h = window.innerHeight;
  const pr = Math.min(window.devicePixelRatio, 2);

  camera.aspect = w / h;
  camera.updateProjectionMatrix();

  renderer.setSize(w, h);
  composer.setSize(w, h);
  bloomPass.resolution.set(w, h);
  animePass.uniforms.uResolution.value.set(w * pr, h * pr);
});

const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);

  const delta = clock.getDelta();
  const elapsed = clock.getElapsedTime();

  controls.update();
  effects.update(elapsed, delta);

  composer.render();
}

animate();
