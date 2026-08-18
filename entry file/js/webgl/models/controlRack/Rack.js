import * as THREE from 'three';
import { Group, Mesh } from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default class Rack {
    constructor() {
        this.group = new Group();
        this.createModel();
    }

    createModel() {
        // Helper for safe geometry merging
        function safeMerge(geometries) {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        }

        // --- Materials ---
        const rackFrameMat = new THREE.MeshStandardMaterial({ color: 0xdddddd, roughness: 0.4, metalness: 0.2 });
        const railsMat = new THREE.MeshStandardMaterial({ color: 0x333333, roughness: 0.5, metalness: 0.8 });
        const aluminumExtrusionMat = new THREE.MeshStandardMaterial({ color: 0xb0b0b0, roughness: 0.3, metalness: 0.8 });
        const shelfMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.7, metalness: 0.2 });
        const baseWheelMat = new THREE.MeshStandardMaterial({ color: 0x111111, roughness: 0.6 });

        // Geometry Buckets
        const rackFrameGeoms = [];
        const railsGeoms = [];
        const aluminumGeoms = [];
        const wheelGeoms = [];

        // Dimensions
        const rackWidth = 0.6;
        const rackDepth = 0.8;
        const lowerRackHeight = 1.4;
        const upperRackHeight = 0.9;
        const postThickness = 0.04;

        // ==========================================
        // 1. LOWER ENCLOSED CABINET RACK
        // ==========================================
        const pillars = [
            { x: -rackWidth / 2 + postThickness / 2, z: -rackDepth / 2 + postThickness / 2 },
            { x:  rackWidth / 2 - postThickness / 2, z: -rackDepth / 2 + postThickness / 2 },
            { x: -rackWidth / 2 + postThickness / 2, z:  rackDepth / 2 - postThickness / 2 },
            { x:  rackWidth / 2 - postThickness / 2, z:  rackDepth / 2 - postThickness / 2 }
        ];

        // 4 Vertical Pillars
        pillars.forEach(p => {
            const pillar = new THREE.BoxGeometry(postThickness, lowerRackHeight, postThickness);
            pillar.translate(p.x, lowerRackHeight / 2, p.z);
            rackFrameGeoms.push(pillar);
        });

        // Top & Bottom Horizontal Plates
        const bottomPlate = new THREE.BoxGeometry(rackWidth, postThickness, rackDepth);
        bottomPlate.translate(0, postThickness / 2, 0);
        rackFrameGeoms.push(bottomPlate);

        const topPlate = new THREE.BoxGeometry(rackWidth, postThickness, rackDepth);
        topPlate.translate(0, lowerRackHeight - postThickness / 2, 0);
        rackFrameGeoms.push(topPlate);

        // Side Panels
        const sidePanelW = postThickness / 4;
        const sidePanelH = lowerRackHeight - postThickness * 2;
        const sidePanelD = rackDepth - postThickness * 2;

        const leftSide = new THREE.BoxGeometry(sidePanelW, sidePanelH, sidePanelD);
        leftSide.translate(-rackWidth / 2 + postThickness / 8, lowerRackHeight / 2, 0);
        rackFrameGeoms.push(leftSide);

        const rightSide = new THREE.BoxGeometry(sidePanelW, sidePanelH, sidePanelD);
        rightSide.translate(rackWidth / 2 - postThickness / 8, lowerRackHeight / 2, 0);
        rackFrameGeoms.push(rightSide);

        // Mounting Rails
        const railH = lowerRackHeight - postThickness * 2;
        const leftRail = new THREE.BoxGeometry(0.02, railH, 0.02);
        leftRail.translate(-rackWidth / 2 + postThickness + 0.01, lowerRackHeight / 2, rackDepth / 2 - postThickness - 0.01);
        railsGeoms.push(leftRail);

        const rightRail = new THREE.BoxGeometry(0.02, railH, 0.02);
        rightRail.translate(rackWidth / 2 - postThickness - 0.01, lowerRackHeight / 2, rackDepth / 2 - postThickness - 0.01);
        railsGeoms.push(rightRail);

        // Middle Wooden Shelf
        const woodShelfGeo = new THREE.BoxGeometry(rackWidth - postThickness * 2, 0.015, rackDepth - postThickness * 2);
        const woodShelf = new Mesh(woodShelfGeo, shelfMat);
        woodShelf.position.set(0, 0.78, -0.04);
        this.group.add(woodShelf);

        // Base Wheels
        const wheelPositions = [
            { x: -rackWidth / 2 + 0.05, z: -rackDepth / 2 + 0.05 },
            { x:  rackWidth / 2 - 0.05, z: -rackDepth / 2 + 0.05 },
            { x: -rackWidth / 2 + 0.05, z:  rackDepth / 2 - 0.05 },
            { x:  rackWidth / 2 - 0.05, z:  rackDepth / 2 - 0.05 }
        ];

        wheelPositions.forEach(w => {
            const wheel = new THREE.CylinderGeometry(0.03, 0.03, 0.04, 16);
            wheel.rotateZ(Math.PI / 2);
            wheel.translate(w.x, -0.03, w.z);
            wheelGeoms.push(wheel);
        });

        // ==========================================
        // 2. UPPER OPEN-FRAME ALUMINUM RACK
        // ==========================================
        const aluThickness = 0.03;
        const upperYOffset = lowerRackHeight;

        // 4 Vertical Extrusions
        pillars.forEach(p => {
            const strut = new THREE.BoxGeometry(aluThickness, upperRackHeight, aluThickness);
            strut.translate(p.x, upperRackHeight / 2 + upperYOffset, p.z);
            aluminumGeoms.push(strut);
        });

        // Width Beams (Front & Rear, Top & Bottom)
        const beamW = rackWidth - aluThickness * 2;
        const rearZ = -rackDepth / 2 + aluThickness / 2;
        const frontZ = rackDepth / 2 - aluThickness / 2;
        const bottomY = aluThickness / 2 + upperYOffset;
        const topY = upperRackHeight - aluThickness / 2 + upperYOffset;

        [bottomY, topY].forEach(yPos => {
            const rearBeam = new THREE.BoxGeometry(beamW, aluThickness, aluThickness);
            rearBeam.translate(0, yPos, rearZ);
            aluminumGeoms.push(rearBeam);

            const frontBeam = new THREE.BoxGeometry(beamW, aluThickness, aluThickness);
            frontBeam.translate(0, yPos, frontZ);
            aluminumGeoms.push(frontBeam);
        });

        // Depth Beams (Left & Right, Top & Bottom)
        const beamD = rackDepth - aluThickness * 2;
        const leftX = -rackWidth / 2 + aluThickness / 2;
        const rightX = rackWidth / 2 - aluThickness / 2;

        [bottomY, topY].forEach(yPos => {
            const leftBeam = new THREE.BoxGeometry(aluThickness, aluThickness, beamD);
            leftBeam.translate(leftX, yPos, 0);
            aluminumGeoms.push(leftBeam);

            const rightBeam = new THREE.BoxGeometry(aluThickness, aluThickness, beamD);
            rightBeam.translate(rightX, yPos, 0);
            aluminumGeoms.push(rightBeam);
        });

        // Intermediate Upper Shelves
        const upperShelfLayers = [0.25, 0.475, 0.72];
        upperShelfLayers.forEach(layerY => {
            const shelf = new THREE.BoxGeometry(rackWidth - aluThickness * 2, 0.01, rackDepth - aluThickness * 2);
            shelf.translate(0, layerY + upperYOffset, 0);
            aluminumGeoms.push(shelf);
        });

        // ==========================================
        // 3. MERGE & BATCH
        // ==========================================
        const mergedFrame = safeMerge(rackFrameGeoms);
        if (mergedFrame) {
            const frameMesh = new Mesh(mergedFrame, rackFrameMat);
            frameMesh.castShadow = true;
            frameMesh.receiveShadow = true;
            this.group.add(frameMesh);
        }

        const mergedRails = safeMerge(railsGeoms);
        if (mergedRails) this.group.add(new Mesh(mergedRails, railsMat));

        const mergedAluminum = safeMerge(aluminumGeoms);
        if (mergedAluminum) this.group.add(new Mesh(mergedAluminum, aluminumExtrusionMat));

        const mergedWheels = safeMerge(wheelGeoms);
        if (mergedWheels) this.group.add(new Mesh(mergedWheels, baseWheelMat));

        this.group.position.y = 0.05;
    }

    getGroup() {
        return this.group;
    }
}