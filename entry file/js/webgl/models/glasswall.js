import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default class GlassWall {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(-4, -7, -9);
        this.buildGlassWall();
    }

    buildGlassWall() {
        // Safe Merge Utility
        const safeMerge = (geometries) => {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        };

        const width = 55;
        const height = 55;
        const glassThickness = 0.4;
        const frameThickness = 0.8;
        const frameDepth = 0.6;

        // 1. Transmissive Glass Pane (1 Draw Call)
        const glassMat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            transmission: 1,
            transparent: true,
            roughness: 0,
            metalness: 0,
            thickness: 0.5,
            ior: 1.5,
            envMapIntensity: 2,
            side: THREE.DoubleSide
        });

        const glass = new THREE.Mesh(
            new THREE.BoxGeometry(width, height, glassThickness),
            glassMat
        );
        this.group.add(glass);

        // 2. Structural Perimeter Frame (Merged -> 1 Draw Call)
        const frameMat = new THREE.MeshStandardMaterial({
            color: 0x222428,
            metalness: 0.85,
            roughness: 0.25
        });

        const frameGeoms = [];

        // Top & Bottom Horizontal Beams
        const hBeamW = width + frameThickness * 2;
        const topBeam = new THREE.BoxGeometry(hBeamW, frameThickness, frameDepth);
        topBeam.translate(0, height / 2 + frameThickness / 2, 0);
        frameGeoms.push(topBeam);

        const bottomBeam = new THREE.BoxGeometry(hBeamW, frameThickness, frameDepth);
        bottomBeam.translate(0, -height / 2 - frameThickness / 2, 0);
        frameGeoms.push(bottomBeam);

        // Left & Right Vertical Struts
        const leftStrut = new THREE.BoxGeometry(frameThickness, height, frameDepth);
        leftStrut.translate(-width / 2 - frameThickness / 2, 0, 0);
        frameGeoms.push(leftStrut);

        const rightStrut = new THREE.BoxGeometry(frameThickness, height, frameDepth);
        rightStrut.translate(width / 2 + frameThickness / 2, 0, 0);
        frameGeoms.push(rightStrut);

        const mergedFrameGeo = safeMerge(frameGeoms);
        if (mergedFrameGeo) {
            const frameMesh = new THREE.Mesh(mergedFrameGeo, frameMat);
            frameMesh.castShadow = true;
            frameMesh.receiveShadow = true;
            this.group.add(frameMesh);
        }
    }

    getGroup() {
        return this.group;
    }
}