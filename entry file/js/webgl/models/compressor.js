import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default class Compressor {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(8.2, -4, -13);
        this.group.rotation.y = Math.PI;
        this.buildCompressor();
    }

    buildCompressor() {
        // Shared Materials
        const metallicMat = new THREE.MeshStandardMaterial({ color: 0x71797E, metalness: 1, roughness: 0.15 });
        const blackMat = new THREE.MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.8, roughness: 0.3 });
        const redMat = new THREE.MeshStandardMaterial({ color: 0xcc0000, metalness: 0.8, roughness: 0.1 });
        const greenMat = new THREE.MeshStandardMaterial({ color: 'green', side: THREE.DoubleSide });
        const whiteEmissiveMat = new THREE.MeshStandardMaterial({ color: 'white', emissive: 'white', emissiveIntensity: 0.5 });
        const whiteBasicMat = new THREE.MeshBasicMaterial({ color: 'white', side: THREE.DoubleSide });
        const mcbBodyMat = new THREE.MeshStandardMaterial({ color: 0xffffff });

        // Geometry collection buckets for batching
        const metallicGeoms = [];
        const blackGeoms = [];
        const redGeoms = [];

        // 1. Chassis Body (Metallic)
        metallicGeoms.push(new THREE.BoxGeometry(8, 6.5, 5));

        // 2. Control Panel & Button
        const panelGeom = new THREE.BoxGeometry(4, 2.2, 0.1);
        panelGeom.translate(0, 1.5, 2.55);
        blackGeoms.push(panelGeom);

        const buttonGeom = new THREE.CylinderGeometry(0.3, 0.3, 0.15, 32);
        buttonGeom.rotateX(Math.PI / 2);
        buttonGeom.translate(1.4, 1.7, 2.55);
        metallicGeoms.push(buttonGeom);

        // Green Ring (Unique material, standalone mesh)
        const ringGeom = new THREE.RingGeometry(0.2, 0.28, 16);
        ringGeom.rotateZ(Math.PI / 2);
        const ring = new THREE.Mesh(ringGeom, greenMat);
        ring.position.set(1.4, 1.7, 2.64);
        this.group.add(ring);

        // Screen (Emissive, standalone mesh)
        const screenGeom = new THREE.BoxGeometry(2, 1.1, 0.05);
        const screen = new THREE.Mesh(screenGeom, whiteEmissiveMat);
        screen.position.set(0, 1.5, 2.6);
        this.group.add(screen);

        // 3. MCB Component
        const mcb = new THREE.Mesh(new THREE.BoxGeometry(0.8, 1.4, 0.1), mcbBodyMat);
        mcb.position.set(-2.5, 1.3, 2.5);
        this.group.add(mcb);

        const leverGeom = new THREE.BoxGeometry(0.3, 0.7, 0.05);
        leverGeom.translate(-2.5, 1.1, 2.65);
        blackGeoms.push(leverGeom);

        const mcbLabelGeom = new THREE.BoxGeometry(0.7, 0.2, 0.005);
        mcbLabelGeom.translate(-2.5, 1.65, 2.63);
        redGeoms.push(mcbLabelGeom);

        // 4. Handles
        [-3.5, 3.5].forEach((xPos) => {
            const gripGeom = new THREE.CylinderGeometry(0.15, 0.15, 2.2);
            gripGeom.translate(xPos, 1.6, 2.8 + 0.6);
            blackGeoms.push(gripGeom);

            const topSup = new THREE.BoxGeometry(0.15, 0.15, 1.2);
            topSup.translate(xPos, 1.6 + 1.1, 2.8);
            blackGeoms.push(topSup);

            const botSup = new THREE.BoxGeometry(0.15, 0.15, 1.2);
            botSup.translate(xPos, 1.6 - 1.1, 2.8);
            blackGeoms.push(botSup);
        });

        // 5. Red Banner Label
        const redBannerGeom = new THREE.BoxGeometry(8, 0.4, 0.1);
        redBannerGeom.translate(0, 0, 2.5);
        redGeoms.push(redBannerGeom);

        // 6. Ventilation Grills
        for (let i = -15; i < 5; i += 0.6) {
            const hGrill = new THREE.BoxGeometry(5.1, 0.05, 0.1);
            hGrill.translate(-1.5, i * 0.15 - 1.0, 2.45);
            metallicGeoms.push(hGrill);
        }
        for (let i = -26.8; i < 8; i += 2) {
            const vGrill = new THREE.BoxGeometry(0.1, 3.0, 0.1);
            vGrill.translate(i * 0.15, -1.75, 2.45);
            metallicGeoms.push(vGrill);
        }

        // 7. Pressure Gauges / Knobs
        const knobGeom1 = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 32);
        knobGeom1.rotateX(Math.PI / 2);
        knobGeom1.translate(3.3, -1, 2.5);

        const knobGeom2 = new THREE.CylinderGeometry(0.55, 0.55, 0.1, 32);
        knobGeom2.rotateX(Math.PI / 2);
        knobGeom2.translate(1.7, -1, 2.5);

        const mergedKnobsGeom = BufferGeometryUtils.mergeGeometries([knobGeom1, knobGeom2]);
        this.group.add(new THREE.Mesh(mergedKnobsGeom, whiteBasicMat));

        // 8. Caster Wheels
        [
            [3.2, 1.7], [-3.2, 1.7],
            [3.2, -1.7], [-3.2, -1.7]
        ].forEach(([x, z]) => {
            const wheelGeom = new THREE.CylinderGeometry(0.6, 0.6, 0.35, 16);
            wheelGeom.rotateZ(Math.PI / 2);
            wheelGeom.translate(x, -3.3, z);
            blackGeoms.push(wheelGeom);
        });

        // 9. Pipe Sleeves (Replaces loop of 160 ring planes with solid geometry)
        [1.7, 3.3].forEach((xPos) => {
            const sleeveGeom = new THREE.CylinderGeometry(0.2, 0.2, 0.6, 16, 1, true);
            sleeveGeom.rotateX(Math.PI / 2);
            sleeveGeom.translate(xPos, -2, 2.4);
            metallicGeoms.push(sleeveGeom);
        });

        // 10. Pipes (Tubes)
        const pipePoints1 = [
            new THREE.Vector3(1.7, -2, 2.7),
            new THREE.Vector3(1.7, -2, 3.2),
            new THREE.Vector3(1.7, -1.6, 3.45),
            new THREE.Vector3(1.8, 3, 3.5),
            new THREE.Vector3(2, 4, 3),
            new THREE.Vector3(2, 3.8, 0),
            new THREE.Vector3(2.45, 3.8, -7),
            new THREE.Vector3(2.45, 4, -7),
            new THREE.Vector3(2.8, 15.2, -7),
            new THREE.Vector3(2.8, 15.2, -7.5),
            new THREE.Vector3(2.8, 15.4, -16),
            new THREE.Vector3(2.8, 15.5, -16),
            new THREE.Vector3(2.8, 17, -16),
            new THREE.Vector3(3, 17.1, -16),
            new THREE.Vector3(4, 17.1, -16)
        ];

        const pipePoints2 = [
            new THREE.Vector3(3.3, -2, 2.7),
            new THREE.Vector3(3.3, -2, 3.2),
            new THREE.Vector3(3.3, -1.6, 3.45),
            new THREE.Vector3(3.4, 3, 3.5),
            new THREE.Vector3(3.4, 4, 3),
            new THREE.Vector3(3.4, 3.8, 0),
            new THREE.Vector3(3, 3.8, -6.5),
            new THREE.Vector3(3, 4, -6.5),
            new THREE.Vector3(3, 15.2, -6.5),
            new THREE.Vector3(3.1, 15.2, -7.5),
            new THREE.Vector3(3.1, 15.5, -16),
            new THREE.Vector3(3.1, 16.6, -16),
            new THREE.Vector3(4, 16.7, -16)
        ];

        [pipePoints1, pipePoints2].forEach((pts) => {
            const curve = new THREE.CatmullRomCurve3(pts);
            const pipeGeom = new THREE.TubeGeometry(curve, 100, 0.1, 12, false);
            metallicGeoms.push(pipeGeom);
        });

        // 11. Final Batched Merges
        if (metallicGeoms.length > 0) {
            const mergedMetallic = BufferGeometryUtils.mergeGeometries(metallicGeoms, false);
            this.group.add(new THREE.Mesh(mergedMetallic, metallicMat));
        }

        if (blackGeoms.length > 0) {
            const mergedBlack = BufferGeometryUtils.mergeGeometries(blackGeoms, false);
            this.group.add(new THREE.Mesh(mergedBlack, blackMat));
        }

        if (redGeoms.length > 0) {
            const mergedRed = BufferGeometryUtils.mergeGeometries(redGeoms, false);
            this.group.add(new THREE.Mesh(mergedRed, redMat));
        }
    }

    getGroup() {
        return this.group;
    }
}