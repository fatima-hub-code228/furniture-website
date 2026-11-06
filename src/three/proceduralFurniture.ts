import * as THREE from 'three';
import {
  FurnitureModelType,
  ProductFinish,
  TransformationMode,
  computeTransformationStage,
} from '../data/catalog';

let cachedTravertineTex: THREE.CanvasTexture | null = null;
let cachedBlackMarbleTex: THREE.CanvasTexture | null = null;
let cachedWoodTex: THREE.CanvasTexture | null = null;
let cachedBumpTex: THREE.CanvasTexture | null = null;

export function detectSoftwareWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl2') || canvas.getContext('webgl');
    if (!gl) return true;
    const ext = gl.getExtension('WEBGL_debug_renderer_info');
    const param = ext ? ext.UNMASKED_RENDERER_WEBGL : gl.RENDERER;
    const gpu = String(gl.getParameter(param));
    gl.getExtension('WEBGL_lose_context')?.loseContext();
    return /SwiftShader|llvmpipe|softpipe|Software|Basic Render/i.test(gpu);
  } catch {
    return true;
  }
}

export function getBlackMarbleTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  if (cachedBlackMarbleTex) return cachedBlackMarbleTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#0B0A09';
    ctx.fillRect(0, 0, 256, 256);
    // Subtle gold and ivory Nero Marquina veins
    ctx.strokeStyle = '#D6A342';
    ctx.lineWidth = 1.4;
    ctx.globalAlpha = 0.35;
    for (let i = 0; i < 14; i++) {
      ctx.beginPath();
      let x = (i * 47) % 256;
      let y = 0;
      ctx.moveTo(x, y);
      while (y < 256) {
        y += 24;
        x += Math.sin(y * 0.05 + i) * 16;
        ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
    ctx.strokeStyle = '#4A3F35';
    ctx.lineWidth = 0.8;
    ctx.globalAlpha = 0.4;
    for (let j = 0; j < 20; j++) {
      ctx.beginPath();
      ctx.moveTo(0, (j * 29) % 256);
      ctx.lineTo(256, ((j * 29) + 64) % 256);
      ctx.stroke();
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  cachedBlackMarbleTex = tex;
  return tex;
}

export function getTravertineTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  if (cachedTravertineTex) return cachedTravertineTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#EAE0D0';
    ctx.fillRect(0, 0, 256, 256);
    for (let y = 0; y < 256; y += 3) {
      const wave = Math.sin(y * 0.08) * 8;
      ctx.fillStyle = y % 9 === 0 ? '#D8CBB6' : '#F2ECE1';
      ctx.globalAlpha = 0.35;
      ctx.fillRect(0, y + wave * 0.2, 256, 2);
    }
    ctx.globalAlpha = 0.18;
    for (let i = 0; i < 140; i++) {
      const px = (i * 73) % 256;
      const py = (i * 41) % 256;
      ctx.fillStyle = '#B8A890';
      ctx.fillRect(px, py, 6 + (i % 8), 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  cachedTravertineTex = tex;
  return tex;
}

export function getWoodGrainTexture(maxAnisotropy = 4): THREE.CanvasTexture {
  if (cachedWoodTex) return cachedWoodTex;
  const canvas = document.createElement('canvas');
  canvas.width = 256;
  canvas.height = 256;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#DFD3C2';
    ctx.fillRect(0, 0, 256, 256);
    for (let x = 0; x < 256; x += 2) {
      ctx.fillStyle = x % 6 === 0 ? '#C4B299' : '#ECE3D5';
      ctx.globalAlpha = 0.28;
      ctx.fillRect(x, 0, 1.5, 256);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.colorSpace = THREE.SRGBColorSpace;
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  tex.anisotropy = maxAnisotropy;
  cachedWoodTex = tex;
  return tex;
}

export function getMicroBumpTexture(): THREE.CanvasTexture {
  if (cachedBumpTex) return cachedBumpTex;
  const canvas = document.createElement('canvas');
  canvas.width = 128;
  canvas.height = 128;
  const ctx = canvas.getContext('2d');
  if (ctx) {
    ctx.fillStyle = '#808080';
    ctx.fillRect(0, 0, 128, 128);
    for (let i = 0; i < 600; i++) {
      const x = (i * 37) % 128;
      const y = (i * 53) % 128;
      ctx.fillStyle = i % 2 === 0 ? '#969696' : '#6A6A6A';
      ctx.fillRect(x, y, 2, 2);
    }
  }
  const tex = new THREE.CanvasTexture(canvas);
  tex.wrapS = THREE.RepeatWrapping;
  tex.wrapT = THREE.RepeatWrapping;
  cachedBumpTex = tex;
  return tex;
}

/**
 * Creates a futuristic glossy black marble circular display platform with golden LED light strips
 * and optional rotating golden energy rings.
 */
export function createShowroomPedestalGroup(
  radius = 1.9,
  includeOrbitalRings = true
): {
  pedestalGroup: THREE.Group;
  outerEnergyRing: THREE.Mesh;
  innerEnergyRing: THREE.Mesh;
} {
  const pedestalGroup = new THREE.Group();
  const blackMarble = getBlackMarbleTexture();

  const platformMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: blackMarble,
    roughness: 0.16,
    metalness: 0.35,
  });

  const goldStripMat = new THREE.MeshStandardMaterial({
    color: 0xffc857,
    emissive: new THREE.Color(0xd6a342),
    emissiveIntensity: 1.4,
    roughness: 0.2,
    metalness: 0.85,
  });

  // Main glossy black platform cylinder
  const baseDisc = new THREE.Mesh(
    new THREE.CylinderGeometry(radius, radius * 1.04, 0.12, 48),
    platformMat
  );
  baseDisc.position.y = -0.06;
  pedestalGroup.add(baseDisc);

  // Lower golden underglow strip
  const underglowRing = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 1.02, 0.018, 12, 64),
    goldStripMat
  );
  underglowRing.rotation.x = Math.PI / 2;
  underglowRing.position.y = -0.11;
  pedestalGroup.add(underglowRing);

  // Upper inlaid golden light ring on top surface
  const topInlayRing = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.86, 0.014, 12, 64),
    goldStripMat
  );
  topInlayRing.rotation.x = Math.PI / 2;
  topInlayRing.position.y = 0.008;
  pedestalGroup.add(topInlayRing);

  // Orbital Golden Energy Rings
  const outerEnergyRing = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.98, 0.016, 16, 72),
    goldStripMat
  );
  outerEnergyRing.position.y = 0.55;
  outerEnergyRing.rotation.x = Math.PI * 0.42;
  outerEnergyRing.visible = includeOrbitalRings;
  pedestalGroup.add(outerEnergyRing);

  const innerEnergyRing = new THREE.Mesh(
    new THREE.TorusGeometry(radius * 0.78, 0.012, 16, 72),
    goldStripMat
  );
  innerEnergyRing.position.y = 0.52;
  innerEnergyRing.rotation.x = -Math.PI * 0.38;
  innerEnergyRing.visible = includeOrbitalRings;
  pedestalGroup.add(innerEnergyRing);

  return { pedestalGroup, outerEnergyRing, innerEnergyRing };
}

function createContactShadow(radiusX: number, radiusZ: number): THREE.Mesh {
  const geo = new THREE.CircleGeometry(1, 28);
  geo.rotateX(-Math.PI / 2);
  const mat = new THREE.MeshBasicMaterial({
    color: 0x040302,
    transparent: true,
    opacity: 0.55,
    depthWrite: false,
  });
  const mesh = new THREE.Mesh(geo, mat);
  mesh.scale.set(radiusX, 1, radiusZ);
  mesh.position.y = 0.015;
  return mesh;
}

export function buildProceduralFurnitureGroup(
  modelType: FurnitureModelType,
  finish?: ProductFinish,
  enableShadows = false
): THREE.Group {
  const group = new THREE.Group();
  const travertineMap = getTravertineTexture();
  const blackMarbleMap = getBlackMarbleTexture();
  const woodMap = getWoodGrainTexture();
  const bumpMap = getMicroBumpTexture();

  const fabricColor = new THREE.Color(finish?.fabricHex || '#D8C3A5');
  const woodColor = new THREE.Color(finish?.woodHex || '#2B1D12');
  const accentColor = new THREE.Color(finish?.accentHex || '#D6A342');

  const boucleMat = new THREE.MeshStandardMaterial({
    color: fabricColor,
    map: travertineMap,
    roughness: 0.72,
    metalness: 0.05,
    bumpMap,
    bumpScale: 0.02,
  });

  const stoneMat = new THREE.MeshStandardMaterial({
    color: 0xffffff,
    map: blackMarbleMap,
    roughness: 0.22,
    metalness: 0.25,
    bumpMap,
    bumpScale: 0.01,
  });

  const timberMat = new THREE.MeshStandardMaterial({
    color: woodColor,
    map: woodMap,
    roughness: 0.32,
    metalness: 0.12,
  });

  const brassMat = new THREE.MeshStandardMaterial({
    color: accentColor,
    roughness: 0.16,
    metalness: 0.9,
  });

  const warmGlowMat = new THREE.MeshStandardMaterial({
    color: 0xffebb3,
    emissive: new THREE.Color(0xffc857),
    emissiveIntensity: 1.1,
    roughness: 0.25,
  });

  if (modelType === 'curved_sofa') {
    group.add(createContactShadow(1.65, 0.95));
    // 1. Recessed 24K Gold & Obsidian Plinth Base
    const plinth = new THREE.Mesh(
      new THREE.CylinderGeometry(1.42, 1.44, 0.12, 32, 1, false, 0, Math.PI * 1.15),
      brassMat
    );
    plinth.position.set(0, 0.06, 0.25);
    plinth.rotation.y = -Math.PI * 0.57;
    group.add(plinth);

    // 2. Main Curved Champagne Leather / Bouclé Seat Deck
    const seat = new THREE.Mesh(
      new THREE.CylinderGeometry(1.46, 1.45, 0.28, 32, 1, false, 0, Math.PI * 1.15),
      boucleMat
    );
    seat.position.set(0, 0.26, 0.25);
    seat.rotation.y = -Math.PI * 0.57;
    group.add(seat);

    // 3. Wrap-around Curved Backrest
    const back = new THREE.Mesh(
      new THREE.TorusGeometry(1.26, 0.24, 18, 36, Math.PI * 1.05),
      timberMat
    );
    back.rotation.x = Math.PI / 2;
    back.rotation.z = Math.PI * 0.98;
    back.position.set(0, 0.54, 0.18);
    group.add(back);

    // 4. Exterior 24K Gold Contour Piping Trim
    const shell = new THREE.Mesh(
      new THREE.TorusGeometry(1.39, 0.065, 12, 36, Math.PI * 1.02),
      brassMat
    );
    shell.rotation.x = Math.PI / 2;
    shell.rotation.z = Math.PI * 0.99;
    shell.position.set(0, 0.4, 0.18);
    group.add(shell);

    // 5-7. Sculptural Throw Pillows
    const pillowOffsets: [number, number, number, number][] = [
      [-0.78, 0.5, -0.05, 0.35],
      [0.0, 0.5, -0.34, 0.0],
      [0.78, 0.5, -0.05, -0.35],
    ];
    for (const [px, py, pz, rotY] of pillowOffsets) {
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.36, 0.28, 0.12), boucleMat);
      pillow.position.set(px, py, pz);
      pillow.rotation.y = rotY;
      pillow.rotation.x = -0.18;
      group.add(pillow);
    }
  } else if (modelType === 'platform_bed') {
    group.add(createContactShadow(1.6, 1.65));
    // 1. Recessed Nero Marble & Gold Plinth
    const shadowBase = new THREE.Mesh(new THREE.BoxGeometry(1.85, 0.1, 2.05), brassMat);
    shadowBase.position.set(0, 0.05, 0);
    shadowBase.name = 'bed_chassis';
    group.add(shadowBase);

    // 2. Cantilevered Smoked Walnut Perimeter Frame
    const frame = new THREE.Mesh(new THREE.BoxGeometry(2.15, 0.22, 2.28), timberMat);
    frame.position.set(0, 0.21, 0);
    frame.name = 'bed_frame';
    group.add(frame);

    // 3. Plush Layered King Mattress
    const mattress = new THREE.Mesh(new THREE.BoxGeometry(1.92, 0.24, 2.04), boucleMat);
    mattress.position.set(0, 0.39, 0.04);
    mattress.name = 'bed_mattress';
    group.add(mattress);

    // 4. Extended Architectural Walnut & Gold Wing Headboard
    const headboard = new THREE.Mesh(new THREE.BoxGeometry(2.95, 0.98, 0.12), timberMat);
    headboard.position.set(0, 0.49, -1.14);
    headboard.name = 'bed_headboard';
    group.add(headboard);

    // 5. Gold Headboard Trim & Cushion Panel
    const headCushion = new THREE.Mesh(new THREE.BoxGeometry(1.94, 0.64, 0.15), brassMat);
    headCushion.position.set(0, 0.58, -1.04);
    headCushion.name = 'bed_headcushion';
    group.add(headCushion);

    // 6-7. Pillows & Gold Silk Throw
    for (const side of [-0.46, 0.46]) {
      const pillow = new THREE.Mesh(new THREE.BoxGeometry(0.74, 0.18, 0.42), boucleMat);
      pillow.position.set(side, 0.56, -0.74);
      pillow.rotation.x = 0.22;
      pillow.name = 'bed_bedding';
      group.add(pillow);
    }
    const throwBlanket = new THREE.Mesh(new THREE.BoxGeometry(1.96, 0.08, 0.68), brassMat);
    throwBlanket.position.set(0, 0.52, 0.62);
    throwBlanket.name = 'bed_bedding';
    group.add(throwBlanket);
  } else if (modelType === 'travertine_dining') {
    group.add(createContactShadow(1.65, 1.05));
    // 1 & 2. Twin Sculptural Marble & Gold Pedestals
    for (const [idx, xOff] of [-0.68, 0.68].entries()) {
      const ped = new THREE.Mesh(new THREE.CylinderGeometry(0.28, 0.31, 0.72, 24), stoneMat);
      ped.position.set(xOff, 0.36, 0);
      ped.name = idx === 0 ? 'dining_pedestal_left' : 'dining_pedestal_right';
      group.add(ped);

      const collar = new THREE.Mesh(new THREE.CylinderGeometry(0.33, 0.33, 0.04, 24), brassMat);
      collar.position.set(xOff, 0.02, 0);
      collar.name = idx === 0 ? 'dining_collar_left' : 'dining_collar_right';
      group.add(collar);
    }
    // 3. Interlocking Gold Crossbar
    const goldBeam = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.08, 0.14), brassMat);
    goldBeam.position.set(0, 0.42, 0);
    goldBeam.name = 'dining_beam';
    group.add(goldBeam);

    // 4. Oval Nero Marquina Marble Tabletop
    const topGeo = new THREE.CylinderGeometry(1.15, 1.15, 0.06, 36);
    const topMesh = new THREE.Mesh(topGeo, stoneMat);
    topMesh.scale.set(1.38, 1, 0.78);
    topMesh.position.set(0, 0.75, 0);
    topMesh.name = 'dining_top';
    group.add(topMesh);

    // 5. Sculptural Golden Ring Centerpiece
    const ringSculpture = new THREE.Mesh(new THREE.TorusGeometry(0.18, 0.025, 16, 32), brassMat);
    ringSculpture.position.set(0, 0.96, 0);
    ringSculpture.name = 'dining_centerpiece';
    group.add(ringSculpture);
  } else if (modelType === 'executive_office_chair') {
    group.add(createContactShadow(0.68, 0.68));
    // 1. 5-Star Brushed 24K Gold Base
    for (let i = 0; i < 5; i++) {
      const angle = (i * Math.PI * 2) / 5;
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.035, 0.05), brassMat);
      spoke.position.set(Math.cos(angle) * 0.2, 0.06, Math.sin(angle) * 0.2);
      spoke.rotation.y = -angle;
      group.add(spoke);
    }
    // 2. Pneumatic Gold Column
    const column = new THREE.Mesh(new THREE.CylinderGeometry(0.04, 0.05, 0.42, 16), brassMat);
    column.position.set(0, 0.26, 0);
    group.add(column);

    // 3. Quilted Cognac Leather Seat Cushion
    const seat = new THREE.Mesh(new THREE.BoxGeometry(0.58, 0.1, 0.56), boucleMat);
    seat.position.set(0, 0.48, 0.02);
    group.add(seat);

    // 4. Sculpted High-Back Carbon & Leather Shell
    const backrest = new THREE.Mesh(new THREE.BoxGeometry(0.54, 0.78, 0.09), boucleMat);
    backrest.position.set(0, 0.9, -0.22);
    backrest.rotation.x = -0.12;
    group.add(backrest);

    // 5. Cast-Gold Exoskeleton Spine
    const goldSpine = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.82, 0.04), brassMat);
    goldSpine.position.set(0, 0.88, -0.27);
    goldSpine.rotation.x = -0.12;
    group.add(goldSpine);

    // 6. Headrest & Twin Gold Armrests
    const headrest = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.18, 0.08), timberMat);
    headrest.position.set(0, 1.36, -0.26);
    group.add(headrest);

    for (const side of [-0.32, 0.32]) {
      const arm = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.24, 0.34), brassMat);
      arm.position.set(side, 0.62, 0.02);
      group.add(arm);
    }
  } else if (modelType === 'fluted_wardrobe') {
    group.add(createContactShadow(1.45, 0.65));
    // 1. Main Cabinet Carcass
    const cabinet = new THREE.Mesh(new THREE.BoxGeometry(2.2, 2.35, 0.54), timberMat);
    cabinet.position.set(0, 1.175, -0.04);
    group.add(cabinet);

    // 2. Illuminated Center Vitrine Interior
    const vitrineInterior = new THREE.Mesh(new THREE.BoxGeometry(1.96, 2.18, 0.48), stoneMat);
    vitrineInterior.position.set(0, 1.175, 0.02);
    group.add(vitrineInterior);

    // 3-5. Warm Lit Golden Shelves inside Vitrine
    for (const sy of [0.65, 1.18, 1.72]) {
      const shelf = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.035, 0.46), warmGlowMat);
      shelf.position.set(0, sy, 0.05);
      shelf.name = 'wardrobe_shelf';
      group.add(shelf);
    }

    // 6 & 7. Articulated Left & Right Hinged Doors (with pivot groups for opening animation)
    const leftDoorPivot = new THREE.Group();
    leftDoorPivot.position.set(-1.08, 1.175, 0.26);
    leftDoorPivot.name = 'wardrobe_door_left';
    const leftDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.04, 2.28, 0.05), timberMat);
    leftDoorMesh.position.set(0.52, 0, 0);
    const leftHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.68, 0.05), brassMat);
    leftHandle.position.set(0.96, 0, 0.04);
    leftDoorPivot.add(leftDoorMesh, leftHandle);
    group.add(leftDoorPivot);

    const rightDoorPivot = new THREE.Group();
    rightDoorPivot.position.set(1.08, 1.175, 0.26);
    rightDoorPivot.name = 'wardrobe_door_right';
    const rightDoorMesh = new THREE.Mesh(new THREE.BoxGeometry(1.04, 2.28, 0.05), timberMat);
    rightDoorMesh.position.set(-0.52, 0, 0);
    const rightHandle = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.68, 0.05), brassMat);
    rightHandle.position.set(-0.96, 0, 0.04);
    rightDoorPivot.add(rightDoorMesh, rightHandle);
    group.add(rightDoorPivot);
  } else if (modelType === 'plinth_coffee_table') {
    group.add(createContactShadow(1.1, 0.9));
    const recess = new THREE.Mesh(new THREE.BoxGeometry(1.16, 0.05, 0.88), brassMat);
    recess.position.set(0, 0.025, 0);
    group.add(recess);

    const monolith = new THREE.Mesh(new THREE.BoxGeometry(1.28, 0.3, 0.98), stoneMat);
    monolith.position.set(0, 0.2, 0);
    group.add(monolith);

    const tray = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.22, 0.05, 24), brassMat);
    tray.position.set(0.22, 0.375, -0.05);
    group.add(tray);
  } else if (modelType === 'ceramic_vessels') {
    group.add(createContactShadow(0.68, 0.55));
    const consoleTop = new THREE.Mesh(new THREE.BoxGeometry(1.1, 0.06, 0.46), timberMat);
    consoleTop.position.set(0, 0.42, 0);
    group.add(consoleTop);
    for (const lx of [-0.38, 0.38]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.4, 0.38), brassMat);
      leg.position.set(lx, 0.2, 0);
      group.add(leg);
    }
    const lampBase = new THREE.Mesh(new THREE.CylinderGeometry(0.11, 0.12, 0.34, 24), stoneMat);
    lampBase.position.set(0.22, 0.62, 0);
    group.add(lampBase);

    const shade = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.24, 0.26, 28), warmGlowMat);
    shade.position.set(0.22, 0.96, 0);
    group.add(shade);

    const tallVase = new THREE.Mesh(new THREE.CylinderGeometry(0.06, 0.11, 0.32, 20), brassMat);
    tallVase.position.set(-0.24, 0.61, -0.04);
    group.add(tallVase);
  } else if (modelType === 'sculptural_lounge_chair' || modelType === 'curved_dining_chair') {
    group.add(createContactShadow(0.65, 0.65));
    const seatCushion = new THREE.Mesh(new THREE.CylinderGeometry(0.38, 0.36, 0.12, 24), boucleMat);
    seatCushion.position.set(0, 0.42, 0);
    group.add(seatCushion);

    const backArc = new THREE.Mesh(
      new THREE.TorusGeometry(0.36, 0.055, 14, 28, Math.PI * 1.1),
      brassMat
    );
    backArc.rotation.x = Math.PI / 2;
    backArc.rotation.z = Math.PI * 0.95;
    backArc.position.set(0, 0.72, 0);
    group.add(backArc);

    for (const [lx, lz] of [
      [-0.28, -0.26],
      [0.28, -0.26],
      [-0.28, 0.26],
      [0.28, 0.26],
    ]) {
      const leg = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.022, 0.42, 12), timberMat);
      leg.position.set(lx, 0.21, lz);
      group.add(leg);
    }
  } else if (modelType === 'brass_side_table') {
    group.add(createContactShadow(0.45, 0.45));
    const baseRing = new THREE.Mesh(new THREE.TorusGeometry(0.26, 0.02, 12, 32), brassMat);
    baseRing.rotation.x = Math.PI / 2;
    baseRing.position.set(0, 0.02, 0);
    group.add(baseRing);

    const spine = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.54, 0.025), brassMat);
    spine.position.set(0, 0.28, -0.24);
    group.add(spine);

    const walnutTop = new THREE.Mesh(new THREE.CylinderGeometry(0.3, 0.3, 0.04, 28), timberMat);
    walnutTop.position.set(0, 0.56, 0);
    group.add(walnutTop);
  } else {
    group.add(createContactShadow(1.1, 0.5));
    const body = new THREE.Mesh(new THREE.BoxGeometry(1.5, 0.52, 0.48), timberMat);
    body.position.set(0, 0.42, 0);
    group.add(body);

    const stoneTop = new THREE.Mesh(new THREE.BoxGeometry(1.54, 0.04, 0.5), stoneMat);
    stoneTop.position.set(0, 0.7, 0);
    group.add(stoneTop);

    for (const lx of [-0.62, 0.62]) {
      const leg = new THREE.Mesh(new THREE.BoxGeometry(0.06, 0.16, 0.42), brassMat);
      leg.position.set(lx, 0.08, 0);
      group.add(leg);
    }
  }

  group.traverse((obj) => {
    if ((obj as THREE.Mesh).isMesh && obj.position.y > 0.02) {
      obj.castShadow = enableShadows;
      obj.receiveShadow = enableShadows;
    }
  });

  return group;
}

/**
 * Applies real-time 3D kinematic transformations to the furniture group for Section 5:
 * - Dining table assembling from separate components
 * - Wardrobe opening doors to reveal interior
 * - Bed transforming from frame into luxury bed
 * - Sofa rotating 360 degrees
 */
export function applyKineticTransformationToGroup(
  group: THREE.Group,
  mode: TransformationMode,
  progress: number
): void {
  const metrics = computeTransformationStage(mode, progress);
  const eased = 1 - Math.pow(1 - metrics.progress, 3);

  if (mode === 'dining-assembly') {
    group.traverse((child) => {
      if (child.name === 'dining_pedestal_left') {
        child.position.x = -0.68 - metrics.pedestalSpreadX;
      } else if (child.name === 'dining_pedestal_right') {
        child.position.x = 0.68 + metrics.pedestalSpreadX;
      } else if (child.name === 'dining_collar_left') {
        child.position.x = -0.68 - metrics.pedestalSpreadX * 1.2;
      } else if (child.name === 'dining_collar_right') {
        child.position.x = 0.68 + metrics.pedestalSpreadX * 1.2;
      } else if (child.name === 'dining_beam') {
        child.position.y = 0.42 + metrics.tabletopLiftY * 0.45;
        child.rotation.y = (1 - eased) * Math.PI * 0.5;
      } else if (child.name === 'dining_top') {
        child.position.y = 0.75 + metrics.tabletopLiftY;
      } else if (child.name === 'dining_centerpiece') {
        child.position.y = 0.96 + metrics.tabletopLiftY * 1.45;
        child.rotation.y = eased * Math.PI * 2;
      }
    });
  } else if (mode === 'wardrobe-open') {
    const rad = THREE.MathUtils.degToRad(metrics.doorOpenAngleDeg);
    group.traverse((child) => {
      if (child.name === 'wardrobe_door_left') {
        child.rotation.y = -rad;
      } else if (child.name === 'wardrobe_door_right') {
        child.rotation.y = rad;
      }
    });
  } else if (mode === 'bed-furnish') {
    group.traverse((child) => {
      if (child.name === 'bed_mattress') {
        const mProg = Math.max(0, Math.min(1, (metrics.progress - 0.2) / 0.35));
        child.visible = mProg > 0.02;
        child.position.y = 0.39 + (1 - mProg) * 0.9;
        child.scale.setScalar(0.01 + mProg * 0.99);
      } else if (child.name === 'bed_headboard' || child.name === 'bed_headcushion') {
        const hProg = Math.max(0, Math.min(1, (metrics.progress - 0.45) / 0.3));
        child.visible = hProg > 0.02;
        child.position.z =
          (child.name === 'bed_headboard' ? -1.14 : -1.04) - (1 - hProg) * 0.8;
        child.scale.setScalar(0.01 + hProg * 0.99);
      } else if (child.name === 'bed_bedding') {
        const bProg = Math.max(0, Math.min(1, (metrics.progress - 0.7) / 0.3));
        child.visible = bProg > 0.02;
        child.scale.setScalar(0.01 + bProg * 0.99);
      }
    });
  } else if (mode === 'sofa-orbital') {
    group.rotation.y = THREE.MathUtils.degToRad(metrics.sofaOrbitAngleDeg);
    group.position.y = 0.14 + Math.sin(metrics.progress * Math.PI * 2) * 0.08;
  }
}
