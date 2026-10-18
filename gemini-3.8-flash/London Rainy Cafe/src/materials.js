import * as THREE from 'three';
import {
  createBrickTexture,
  createPavementTexture,
  createRoadTexture,
  createSignboardTexture,
  createMenuBoardTexture,
  createStreetSignTexture,
  createParquetFloorTexture,
  createBurlapSackTexture,
  createPosterTexture,
  createRippleTexture
} from './textures.js';

// 3-step anime cel-shading gradient map
function createToonGradientMap() {
  const canvas = document.createElement('canvas');
  canvas.width = 4;
  canvas.height = 1;
  const ctx = canvas.getContext('2d');
  // 4 steps: Shadow -> Mid-dark -> Mid-bright -> Highlight
  ctx.fillStyle = '#666666';
  ctx.fillRect(0, 0, 1, 1);
  ctx.fillStyle = '#999999';
  ctx.fillRect(1, 0, 1, 1);
  ctx.fillStyle = '#cccccc';
  ctx.fillRect(2, 0, 1, 1);
  ctx.fillStyle = '#ffffff';
  ctx.fillRect(3, 0, 1, 1);

  const texture = new THREE.CanvasTexture(canvas);
  texture.minFilter = THREE.NearestFilter;
  texture.magFilter = THREE.NearestFilter;
  texture.generateMipmaps = false;
  return texture;
}

export class MaterialManager {
  constructor() {
    this.gradientMap = createToonGradientMap();
    this.textures = {
      brick: createBrickTexture(),
      pavement: createPavementTexture(),
      road: createRoadTexture(),
      signboard: createSignboardTexture(),
      menuBoard: createMenuBoardTexture(),
      streetSign: createStreetSignTexture(),
      parquet: createParquetFloorTexture(),
      burlap: createBurlapSackTexture(),
      poster: createPosterTexture(),
      ripple: createRippleTexture()
    };

    // Configure repeat for tileable textures
    this.textures.brick.repeat.set(3, 3);
    this.textures.pavement.repeat.set(6, 6);
    this.textures.parquet.repeat.set(4, 4);

    this.initMaterials();
  }

  initMaterials() {
    // 1. Diorama Pedestal Base (Dark slate block with subtle chamfer)
    this.pedestal = new THREE.MeshToonMaterial({
      color: 0x181a20,
      gradientMap: this.gradientMap
    });

    this.pedestalTrim = new THREE.MeshToonMaterial({
      color: 0xc49a45, // Brass accent line
      gradientMap: this.gradientMap
    });

    // 2. Road & Sidewalk Materials
    this.road = new THREE.MeshStandardMaterial({
      map: this.textures.road,
      roughness: 0.28,
      metalness: 0.12,
      color: 0x222630
    });

    this.pavement = new THREE.MeshToonMaterial({
      map: this.textures.pavement,
      gradientMap: this.gradientMap,
      color: 0x6e7682
    });

    this.curbStone = new THREE.MeshToonMaterial({
      color: 0x48505a,
      gradientMap: this.gradientMap
    });

    // 3. Wet Rain Puddles (Glossy mirror-like reflection with ripples)
    this.puddle = new THREE.MeshStandardMaterial({
      color: 0x121722,
      roughness: 0.04,
      metalness: 0.45,
      normalMap: this.textures.ripple,
      normalScale: new THREE.Vector2(0.2, 0.2),
      transparent: true,
      opacity: 0.92
    });

    // 4. Building Architecture
    this.brick = new THREE.MeshToonMaterial({
      map: this.textures.brick,
      gradientMap: this.gradientMap,
      color: 0xd88a78
    });

    // British Racing Green for Shopfront
    this.shopfrontGreen = new THREE.MeshToonMaterial({
      color: 0x183c2e,
      gradientMap: this.gradientMap
    });

    this.shopfrontTrimGold = new THREE.MeshToonMaterial({
      color: 0xdfb44e,
      gradientMap: this.gradientMap
    });

    this.darkWood = new THREE.MeshToonMaterial({
      color: 0x2e1e16,
      gradientMap: this.gradientMap
    });

    this.whiteTrim = new THREE.MeshToonMaterial({
      color: 0xe6ebf0,
      gradientMap: this.gradientMap
    });

    this.stoneCornice = new THREE.MeshToonMaterial({
      color: 0x8a929e,
      gradientMap: this.gradientMap
    });

    this.slateRoof = new THREE.MeshToonMaterial({
      color: 0x282f3a,
      gradientMap: this.gradientMap
    });

    this.chimneyPot = new THREE.MeshToonMaterial({
      color: 0xa85338,
      gradientMap: this.gradientMap
    });

    this.copperPipe = new THREE.MeshToonMaterial({
      color: 0x426859, // Aged verdigris copper
      gradientMap: this.gradientMap
    });

    // Striped Awning Canvas
    this.awning = new THREE.MeshToonMaterial({
      color: 0x163428,
      gradientMap: this.gradientMap
    });
    this.awningStripe = new THREE.MeshToonMaterial({
      color: 0xd6cbb0,
      gradientMap: this.gradientMap
    });

    // 5. Signboards & Wall Art
    this.signboard = new THREE.MeshBasicMaterial({
      map: this.textures.signboard
    });

    this.streetSign = new THREE.MeshBasicMaterial({
      map: this.textures.streetSign
    });

    this.menuBoard = new THREE.MeshBasicMaterial({
      map: this.textures.menuBoard
    });

    this.poster = new THREE.MeshBasicMaterial({
      map: this.textures.poster
    });

    // 6. Translucent Rainy Glass
    this.cafeGlass = new THREE.MeshPhysicalMaterial({
      color: 0xbde4ff,
      transmission: 0.88,
      opacity: 0.85,
      transparent: true,
      roughness: 0.12,
      ior: 1.5,
      thickness: 0.15,
      specularIntensity: 0.9
    });

    this.wetGlassDrips = new THREE.MeshStandardMaterial({
      color: 0xebf6ff,
      roughness: 0.05,
      transparent: true,
      opacity: 0.75
    });

    // 7. Cafe Interior
    this.parquet = new THREE.MeshToonMaterial({
      map: this.textures.parquet,
      gradientMap: this.gradientMap
    });

    this.counterTop = new THREE.MeshToonMaterial({
      color: 0x482415,
      gradientMap: this.gradientMap
    });

    this.counterFront = new THREE.MeshToonMaterial({
      color: 0x1c3a2f,
      gradientMap: this.gradientMap
    });

    this.espressoMachineChrome = new THREE.MeshStandardMaterial({
      color: 0xe6edf5,
      roughness: 0.15,
      metalness: 0.95
    });

    this.espressoMachineBrass = new THREE.MeshStandardMaterial({
      color: 0xd8a946,
      roughness: 0.25,
      metalness: 0.9
    });

    this.ceramicCup = new THREE.MeshToonMaterial({
      color: 0xf5f0eb,
      gradientMap: this.gradientMap
    });

    this.coffeeLiquid = new THREE.MeshToonMaterial({
      color: 0x3d2011,
      gradientMap: this.gradientMap
    });

    this.latteArt = new THREE.MeshToonMaterial({
      color: 0xffeedd,
      gradientMap: this.gradientMap
    });

    this.pastryCroissant = new THREE.MeshToonMaterial({
      color: 0xd88a38,
      gradientMap: this.gradientMap
    });

    this.pastryCake = new THREE.MeshToonMaterial({
      color: 0x4a2416,
      gradientMap: this.gradientMap
    });

    this.burlap = new THREE.MeshToonMaterial({
      map: this.textures.burlap,
      gradientMap: this.gradientMap
    });

    this.bookCovers = [
      new THREE.MeshToonMaterial({ color: 0x8b3a3a, gradientMap: this.gradientMap }),
      new THREE.MeshToonMaterial({ color: 0x2a5278, gradientMap: this.gradientMap }),
      new THREE.MeshToonMaterial({ color: 0x3d704d, gradientMap: this.gradientMap }),
      new THREE.MeshToonMaterial({ color: 0xb58934, gradientMap: this.gradientMap })
    ];

    this.plantGreen = new THREE.MeshToonMaterial({
      color: 0x2d6b3f,
      gradientMap: this.gradientMap
    });

    this.terracotta = new THREE.MeshToonMaterial({
      color: 0xb55a3c,
      gradientMap: this.gradientMap
    });

    // 8. Warm Glowing Interior Lighting
    this.warmLightGlow = new THREE.MeshBasicMaterial({
      color: 0xffbf66
    });

    this.filamentOrange = new THREE.MeshBasicMaterial({
      color: 0xffaa33
    });

    // 9. Street Props
    this.victorianLampMetal = new THREE.MeshToonMaterial({
      color: 0x1a2128,
      gradientMap: this.gradientMap
    });

    this.gasLampGlow = new THREE.MeshBasicMaterial({
      color: 0xffd97d
    });

    this.postBoxRed = new THREE.MeshToonMaterial({
      color: 0xc8182a,
      gradientMap: this.gradientMap
    });

    this.bicycleMetal = new THREE.MeshToonMaterial({
      color: 0x1f2937,
      gradientMap: this.gradientMap
    });

    this.wickerBasket = new THREE.MeshToonMaterial({
      color: 0x9c7a4a,
      gradientMap: this.gradientMap
    });

    this.wroughtIron = new THREE.MeshToonMaterial({
      color: 0x15191e,
      gradientMap: this.gradientMap
    });

    this.trafficLightYellow = new THREE.MeshBasicMaterial({
      color: 0xffb703
    });

    this.trafficLightRed = new THREE.MeshBasicMaterial({
      color: 0xef233c
    });

    this.trafficLightGreen = new THREE.MeshBasicMaterial({
      color: 0x06d6a0
    });

    this.doubleDeckerRed = new THREE.MeshToonMaterial({
      color: 0xba131f,
      gradientMap: this.gradientMap
    });

    // Outline Material (Inverted Hull / edge detection)
    this.outlineMaterial = new THREE.MeshBasicMaterial({
      color: 0x0e1116,
      side: THREE.BackSide
    });
  }

  // Create an outline mesh helper for cel-shading anime look
  createOutline(mesh, thickness = 0.035, color = 0x12161f) {
    const outlineGeo = mesh.geometry.clone();
    const mat = new THREE.MeshBasicMaterial({
      color: color,
      side: THREE.BackSide
    });
    const outlineMesh = new THREE.Mesh(outlineGeo, mat);
    outlineMesh.scale.multiplyScalar(1 + thickness);
    outlineMesh.position.copy(mesh.position);
    outlineMesh.rotation.copy(mesh.rotation);
    return outlineMesh;
  }
}
