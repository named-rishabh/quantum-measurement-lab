import { Group, MeshStandardMaterial, Mesh, BoxGeometry, CapsuleGeometry, CylinderGeometry, MeshBasicMaterial } from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default class OPX {
  constructor() {
    this.group = new Group();
    this.createModel();
  }

  createModel() {
    // Safe geometry merge utility to prevent attribute and indexing mismatches
    function safeMerge(geometries) {
      if (!geometries || geometries.length === 0) return null;
      const normalized = geometries.map((geo) => {
        const g = geo.index ? geo.toNonIndexed() : geo;
        if (!g.attributes.normal) g.computeVertexNormals();
        return g;
      });
      return BufferGeometryUtils.mergeGeometries(normalized, false);
    }

    // ---------- Chassis Dimensions ----------
    const CHASSIS_W = 4.9;
    const CHASSIS_H = 1;
    const CHASSIS_D = 2.6;
    const FRONT_Z = CHASSIS_D / 2;
    const BACK_Z = -CHASSIS_D / 2;

    // ---------- Materials ----------
    const bodyMat = new MeshStandardMaterial({ color: 0x161618, metalness: 0.6, roughness: 0.5 });
    const bevelMat = new MeshStandardMaterial({ color: 0x2c2c30, metalness: 0.8, roughness: 0.3 });
    const capsuleMat = new MeshStandardMaterial({ color: 0x050505, metalness: 0.1, roughness: 0.05 });
    const goldMat = new MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
    const silverMat = new MeshStandardMaterial({ color: 0xcccccc, metalness: 0.8, roughness: 0.2 });
    const darkPlastMat = new MeshStandardMaterial({ color: 0x111111, roughness: 0.7 });
    const greenMat = new MeshStandardMaterial({ color: 0x00a86b, roughness: 0.5 });
    const greenInteriorMat = new MeshStandardMaterial({ color: 0x008754, roughness: 0.6 });
    const redMat = new MeshStandardMaterial({ color: 0xcc1111, roughness: 0.4 });
    const dividerMat = new MeshBasicMaterial({ color: 0x00d8ff });

    // Geometry Buckets
    const goldGeoms = [];
    const silverGeoms = [];
    const darkPlastGeoms = [];
    const greenGeoms = [];
    const greenInteriorGeoms = [];
    const dividerGeoms = [];

    // 1. Main Chassis & Bevel
    const body = new Mesh(new BoxGeometry(CHASSIS_W, CHASSIS_H, CHASSIS_D), bodyMat);
    body.castShadow = true;
    body.receiveShadow = true;
    this.group.add(body);

    const bevel = new Mesh(new BoxGeometry(CHASSIS_W * 0.995, 0.02, CHASSIS_D * 0.995), bevelMat);
    bevel.position.y = CHASSIS_H / 2 + 0.001;
    this.group.add(bevel);

    // ==========================================
    // FRONT PANEL SIDE (Z > 0)
    // ==========================================
    const CAPSULE_Z = FRONT_Z + 0.015;
    const CAPSULE_LENGTH = 4.3;
    const CAPSULE_RADIUS = 0.31;
    const CAPSULE_DEPTH_SCALE = 0.12;

    const capsuleGeo = new CapsuleGeometry(CAPSULE_RADIUS, CAPSULE_LENGTH, 8, 24);
    capsuleGeo.rotateZ(Math.PI / 2);
    capsuleGeo.scale(1, 1, CAPSULE_DEPTH_SCALE);
    capsuleGeo.translate(0, 0, CAPSULE_Z);
    this.group.add(new Mesh(capsuleGeo, capsuleMat));

    // Chrome Trim Rim
    const trimGeo = new CapsuleGeometry(CAPSULE_RADIUS + 0.008, CAPSULE_LENGTH, 8, 24);
    trimGeo.rotateZ(Math.PI / 2);
    trimGeo.scale(1, 1, CAPSULE_DEPTH_SCALE * 0.7);
    trimGeo.translate(0, 0, CAPSULE_Z - 0.005);
    silverGeoms.push(trimGeo);

    // Front Ports Collector
    const FRONT_SURFACE_Z = CAPSULE_Z + CAPSULE_RADIUS * CAPSULE_DEPTH_SCALE;
    function collectFrontPort(x, y) {
      const base = new CylinderGeometry(0.045, 0.045, 0.04, 16);
      base.rotateX(Math.PI / 2);
      base.translate(x, y, FRONT_SURFACE_Z);
      goldGeoms.push(base);

      const inside = new CylinderGeometry(0.025, 0.025, 0.045, 16);
      inside.rotateX(Math.PI / 2);
      inside.translate(x, y, FRONT_SURFACE_Z);
      silverGeoms.push(inside);

      const wire = new CylinderGeometry(0.01, 0.01, 0.075, 16);
      wire.rotateX(Math.PI / 2);
      wire.translate(x, y, FRONT_SURFACE_Z);
      darkPlastGeoms.push(wire);
    }

    const FRONT_TOP_Y = 0.12;
    const FRONT_BOTTOM_Y = -0.12;
    const STEP_X = 0.20;

    // Section 1: Digital Markers
    const S1_CENTER_X = -0.95;
    [-2, -1, 0, 1, 2].forEach(i => {
      collectFrontPort(S1_CENTER_X + i * STEP_X, FRONT_TOP_Y);
      collectFrontPort(S1_CENTER_X + i * STEP_X, FRONT_BOTTOM_Y);
    });

    // Section 2: Analog Outputs
    const S2_CENTER_X = 0.65;
    [-2, -1, 0, 1, 2].forEach(i => {
      collectFrontPort(S2_CENTER_X + i * STEP_X, FRONT_TOP_Y);
      collectFrontPort(S2_CENTER_X + i * STEP_X, FRONT_BOTTOM_Y);
    });

    // Section 3: Analog Inputs
    const S3_X = 1.75;
    collectFrontPort(S3_X, FRONT_TOP_Y);
    collectFrontPort(S3_X, FRONT_BOTTOM_Y);

    // Front Neon Dividers
    [-1.60, -0.30, 1.45].forEach(x => {
      const div = new BoxGeometry(0.012, 0.38, 0.01);
      div.translate(x, 0, FRONT_SURFACE_Z + 0.002);
      dividerGeoms.push(div);
    });

    // ==========================================
    // BACK PANEL SIDE (Z < 0)
    // ==========================================
    const BACK_SURFACE_Z = BACK_Z - 0.005;

    // Fans
    const fanPlate = new BoxGeometry(1.6, 0.85, 0.01);
    fanPlate.translate(-1.5, 0, BACK_SURFACE_Z);
    darkPlastGeoms.push(fanPlate);

    [-1.9, -1.1].forEach(x => {
      const fanSil = new CylinderGeometry(0.32, 0.32, 0.01, 16);
      fanSil.rotateX(Math.PI / 2);
      fanSil.translate(x, 0, BACK_SURFACE_Z - 0.005);
      darkPlastGeoms.push(fanSil);
    });

    // Green Terminal Blocks
    const greenXPositions = [-0.32, 0.04, 0.40, 0.76, 1.14, 1.50];
    const BLOCK_W = 0.24;
    const BLOCK_H = 0.14;
    const BLOCK_D = 0.08;
    const PIN_COUNT = 4;
    const spacing = BLOCK_W / (PIN_COUNT + 1);

    greenXPositions.forEach(bx => {
      const by = 0.35;
      const bz = BACK_SURFACE_Z;

      const shell = new BoxGeometry(BLOCK_W, BLOCK_H, BLOCK_D * 0.4);
      shell.translate(bx, by, bz - BLOCK_D * 0.2);
      greenGeoms.push(shell);

      const topLip = new BoxGeometry(BLOCK_W, 0.015, BLOCK_D);
      topLip.translate(bx, by + (BLOCK_H / 2) - 0.0075, bz - BLOCK_D / 2);
      greenGeoms.push(topLip);

      const botLip = new BoxGeometry(BLOCK_W, 0.015, BLOCK_D);
      botLip.translate(bx, by - (BLOCK_H / 2) + 0.0075, bz - BLOCK_D / 2);
      greenGeoms.push(botLip);

      const leftWall = new BoxGeometry(0.015, BLOCK_H, BLOCK_D);
      leftWall.translate(bx - (BLOCK_W / 2) + 0.0075, by, bz - BLOCK_D / 2);
      greenGeoms.push(leftWall);

      const rightWall = new BoxGeometry(0.015, BLOCK_H, BLOCK_D);
      rightWall.translate(bx + (BLOCK_W / 2) - 0.0075, by, bz - BLOCK_D / 2);
      greenGeoms.push(rightWall);

      for (let i = 1; i <= PIN_COUNT; i++) {
        const tooth = new BoxGeometry(0.012, BLOCK_H * 0.7, BLOCK_D * 0.8);
        tooth.translate(bx - (BLOCK_W / 2) + (i * spacing), by, bz - BLOCK_D * 0.5);
        greenInteriorGeoms.push(tooth);
      }
    });

    // Rear Connectivity Ports
    const lan = new BoxGeometry(0.14, 0.14, 0.08);
    lan.translate(0.0, 0.1, BACK_SURFACE_Z - 0.04);
    silverGeoms.push(lan);

    const usbStack = new BoxGeometry(0.14, 0.18, 0.06);
    usbStack.translate(0.0, -0.18, BACK_SURFACE_Z - 0.03);
    silverGeoms.push(usbStack);

    const qsfp = new BoxGeometry(0.22, 0.12, 0.08);
    qsfp.translate(0.4, 0.1, BACK_SURFACE_Z - 0.04);
    silverGeoms.push(qsfp);

    const syncPort = new BoxGeometry(0.35, 0.08, 0.04);
    syncPort.translate(0.85, 0.1, BACK_SURFACE_Z - 0.02);
    silverGeoms.push(syncPort);

    // Multi-pin Blocks
    [1.25, 1.55].forEach(x => {
      const mp = new BoxGeometry(0.22, 0.32, 0.06);
      mp.translate(x, 0.12, BACK_SURFACE_Z - 0.03);
      darkPlastGeoms.push(mp);
    });

    // Rear SMAs
    [0.35, 0.70, 1.05, 1.35, 1.65].forEach(x => {
      const base = new CylinderGeometry(0.035, 0.035, 0.06, 12);
      base.rotateX(Math.PI / 2);
      base.translate(x, -0.18, BACK_SURFACE_Z - 0.03);
      goldGeoms.push(base);
    });

    // Power Module
    const pwrTrim = new BoxGeometry(0.26, 0.32, 0.02);
    pwrTrim.translate(2.1, 0.22, BACK_SURFACE_Z - 0.01);
    this.group.add(new Mesh(pwrTrim, redMat));

    const pwrSwitch = new BoxGeometry(0.2, 0.24, 0.03);
    pwrSwitch.translate(2.1, 0.22, BACK_SURFACE_Z - 0.02);
    darkPlastGeoms.push(pwrSwitch);

    const acSocket = new BoxGeometry(0.26, 0.3, 0.06);
    acSocket.translate(2.1, -0.16, BACK_SURFACE_Z - 0.03);
    darkPlastGeoms.push(acSocket);

    // ==========================================
    // BATCH MERGES
    // ==========================================
    const mergedGold = safeMerge(goldGeoms);
    if (mergedGold) this.group.add(new Mesh(mergedGold, goldMat));

    const mergedSilver = safeMerge(silverGeoms);
    if (mergedSilver) this.group.add(new Mesh(mergedSilver, silverMat));

    const mergedDarkPlast = safeMerge(darkPlastGeoms);
    if (mergedDarkPlast) this.group.add(new Mesh(mergedDarkPlast, darkPlastMat));

    const mergedGreen = safeMerge(greenGeoms);
    if (mergedGreen) this.group.add(new Mesh(mergedGreen, greenMat));

    const mergedGreenInterior = safeMerge(greenInteriorGeoms);
    if (mergedGreenInterior) this.group.add(new Mesh(mergedGreenInterior, greenInteriorMat));

    const mergedDividers = safeMerge(dividerGeoms);
    if (mergedDividers) this.group.add(new Mesh(mergedDividers, dividerMat));
  }

  getGroup() {
    return this.group;
  }
}