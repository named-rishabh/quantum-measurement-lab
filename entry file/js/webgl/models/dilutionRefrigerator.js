import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

const SHARED_MATERIALS = {
    goldFlange: new THREE.MeshStandardMaterial({ color: 0xd4af37, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }),
    goldTube: new THREE.MeshStandardMaterial({ color: 0xd4af37, side: THREE.DoubleSide, roughness: 0.1, metalness: 1 }),
    goldConnector: new THREE.MeshStandardMaterial({ color: 0xffd700, metalness: 1, roughness: 0.15 }),
    lightGreyRough: new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.2, metalness: 1 }),
    lightGreyMedium: new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }),
    lightGreySmooth: new THREE.MeshStandardMaterial({ color: 0xE7E7E7, side: THREE.DoubleSide, roughness: 0.05, metalness: 1 }),
    darkGrey: new THREE.MeshStandardMaterial({ color: 0x353E43, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }),
    mediumGrey: new THREE.MeshStandardMaterial({ color: 0x595959, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }),
    silver: new THREE.MeshStandardMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide, roughness: 0.15, metalness: 1 }),
    silverTube: new THREE.MeshStandardMaterial({ color: 0xC0C0C0, side: THREE.DoubleSide, roughness: 0.1, metalness: 1 }),
    copperStill: new THREE.MeshStandardMaterial({ color: 0xD37B37, side: THREE.DoubleSide, roughness: 0.05, metalness: 1 }),
    copperRough: new THREE.MeshStandardMaterial({ color: 0xB87333, metalness: 1, roughness: 0.3 }),
    silverPhysical: new THREE.MeshPhysicalMaterial({ color: 0xd6d6d6, metalness: 1, roughness: 0.15 }),
    housingPhysical: new THREE.MeshPhysicalMaterial({ color: 0x636A6E, metalness: 1, roughness: 0.15 }),
    copperPhysical: new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 1, roughness: 0.15 }),
    boltSteel: new THREE.MeshStandardMaterial({ color: 0x889498, metalness: 0.9, roughness: 0.25 }),
    helixWire: new THREE.MeshStandardMaterial({ color: 0x71797E, metalness: 1, roughness: 0.15 }),
    ringPurple: new THREE.MeshStandardMaterial({ color: 0x9370DB, metalness: 1, roughness: 0.15 }),
    ringGrey: new THREE.MeshStandardMaterial({ color: 0x636A6E, metalness: 1, roughness: 0.15 }),
    vacuumCylinder: new THREE.MeshStandardMaterial({ color: 0x595959, metalness: 0.7, roughness: 0.45 })
};

export default class DilutionRefrigerator {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(-5.15, -2, 0.15);
        this.group.scale.set(1.2, 1.1, 1.2);
        this.buildDilutionRefrigerator();
    }

    buildDilutionRefrigerator() {
        function safeMerge(geometries) {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        }

        function createHexNutGeo(radius, thickness) {
            const hexnutshape = new THREE.Shape();
            for (let i = 0; i < 6; i++) {
                const hexnutangle = (i * Math.PI) / 3;
                const x = radius * Math.cos(hexnutangle);
                const y = radius * Math.sin(hexnutangle);
                if (i === 0) hexnutshape.moveTo(x, y);
                else hexnutshape.lineTo(x, y);
            }
            hexnutshape.closePath();
            return new THREE.ExtrudeGeometry(hexnutshape, { depth: thickness, bevelEnabled: false });
        }

        // Geometry Buckets
        const goldFlangeGeoms = [];
        const goldTubeGeoms = [];
        const goldConnectorGeoms = [];
        const lightGreyRoughGeoms = [];
        const lightGreyMedGeoms = [];
        const lightGreySmoothGeoms = [];
        const darkGreyGeoms = [];
        const mediumGreyGeoms = [];
        const silverGeoms = [];
        const silverTubeGeoms = [];
        const copperStillGeoms = [];
        const copperRoughGeoms = [];
        const silverPhysGeoms = [];
        const housingPhysGeoms = [];
        const copperPhysGeoms = [];
        const helixWireGeoms = [];
        const ringPurpleGeoms = [];
        const ringGreyGeoms = [];
        const vaccumCylinderGeoms = [];

        // 1. Gold Stage Flanges
        const plateConfigs = [
            { radius: 2.8, yPosition: 10 },
            { radius: 2.6, yPosition: 7.5 },
            { radius: 2.2, yPosition: 5 },
            { radius: 1.8, yPosition: 2.5 },
            { radius: 1.6, yPosition: 0 }
        ];

        plateConfigs.forEach((config, index) => {
            const shape = new THREE.Shape();
            shape.absarc(0, 0, config.radius, 0, Math.PI * 2, false);
            if (index >= plateConfigs.length - 3) {
                const numHoles = 3;
                const holeRadius = 0.3;
                for (let i = 0; i < numHoles; i++) {
                    const angle = (i / numHoles) * Math.PI;
                    const x = Math.cos(angle) * config.radius * 0.6;
                    const y = Math.sin(angle) * config.radius * 0.6;
                    const holePath = new THREE.Path();
                    holePath.absarc(x, y, holeRadius, 0, 2 * Math.PI, true);
                    shape.holes.push(holePath);
                }
            }
            const geo = new THREE.ExtrudeGeometry(shape, { depth: 0.2, bevelEnabled: false, curveSegments: 24 });
            geo.rotateX(Math.PI / 2);
            geo.translate(0, config.yPosition, 0);
            goldFlangeGeoms.push(geo);
        });

        // 2. Main DF Vacuum Pipes
        const dfPipes = [
            { r: 0.15, d: 11.7, x: 0.92, y: 0, z: -0.74 },
            { r: 0.2, d: 0.1, x: 0.92, y: 0, z: -0.74 },
            { r: 0.16, d: 11.7, x: -1.04, y: 0, z: 0.77 },
            { r: 0.16, d: 11.7, x: 0.95, y: 0, z: 0.79 },
            { r: 0.23, d: 0.1, x: -1.04, y: 0, z: 0.77 },
            { r: 0.23, d: 0.1, x: 0.95, y: 0, z: 0.75 }
        ];

        dfPipes.forEach(({ r, d, x, y, z }) => {
            const shape = new THREE.Shape();
            shape.absarc(0, 0, r, 0, Math.PI * 2, false);
            const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 32 });
            geo.rotateX(-Math.PI / 2);
            geo.translate(x, y, z);
            lightGreyRoughGeoms.push(geo);
        });

        // 3. Top Dark Grey Flange Plate & Cylinders
        const tfShape = new THREE.Shape();
        tfShape.absarc(0, 0, 3.5, 0, Math.PI * 2, false);
        const tfGeo = new THREE.ExtrudeGeometry(tfShape, { depth: 0.2, bevelEnabled: false, curveSegments: 32 });
        tfGeo.rotateX(Math.PI / 2);
        tfGeo.translate(0, 11.9, 0);
        darkGreyGeoms.push(tfGeo);

        const tfCylinders = [
            { r: 0.2, d: 0.9, x: -1.5, y: 11.8, z: -1, a: Math.PI * 2, b: false },
            { r: 0.24, d: 0.1, x: -1.5, y: 12.4, z: -1, a: Math.PI * 2, b: false },
            { r: 0.35, d: 1.3, x: -1.5, y: 12.7, z: -1.15, a: Math.PI, b: false },
            { r: 1, d: 0.2, x: 1.5, y: 11.9, z: 0, a: Math.PI * 2, b: false },
            { r: 0.8, d: 0.9, x: 1.5, y: 12, z: 0, a: Math.PI * 2, b: false },
            { r: 0.32, d: 1, x: 0, y: 11.9, z: 0.2, a: Math.PI * 2, b: false },
            { r: 0.3, d: 0.01, x: 0, y: 12.6, z: 0.2, a: Math.PI * 2, b: true },
            { r: 0.45, d: 0.15, x: -0.1, y: 12, z: 1.5, a: Math.PI * 2, b: true },
            { r: 0.55, d: 0.1, x: -0.1, y: 12.05, z: 1.5, a: Math.PI * 2, b: false },
            { r: 0.45, d: 0.15, x: -0.3, y: 12, z: -1.5, a: Math.PI * 2, b: true },
            { r: 0.53, d: 0.1, x: -0.3, y: 12.05, z: -1.5, a: Math.PI * 2, b: false },
            { r: 0.12, d: 1.5, x: 1.2, y: 12, z: 0.3, a: Math.PI * 2, b: false },
            { r: 0.12, d: 1.8, x: 1.5, y: 12, z: -0.3, a: Math.PI * 2, b: false },
            { r: 0.16, d: 1.5, x: 1.9, y: 12, z: 0.2, a: Math.PI * 2, b: false },
            { r: 0.1, d: 0.8, x: -0.6, y: 11.9, z: 0.5, a: Math.PI * 2, b: false },
            { r: 0.1, d: 0.8, x: -0.4, y: 11.9, z: -0.4, a: Math.PI * 2, b: false },
            { r: 0.24, d: 0.1, x: -1.9, y: 11.9, z: 1.4, a: Math.PI * 2, b: false },
            { r: 0.08, d: 0.2, x: 1.4, y: 11.9, z: 2.0, a: Math.PI * 2, b: false },
            { r: 0.08, d: 0.2, x: 1.8, y: 11.9, z: 1.2, a: Math.PI * 2, b: false },
            { r: 0.08, d: 0.2, x: 2.7, y: 11.9, z: 0.1, a: Math.PI * 2, b: false },
            { r: 0.08, d: 0.2, x: 2.7, y: 11.9, z: -0.3, a: Math.PI * 2, b: false }
        ];

        tfCylinders.forEach(({ r, d, x, y, z, a, b }) => {
            const shape = new THREE.Shape();
            shape.absarc(0, 0, r, 0, a, true);
            const geo = new THREE.ExtrudeGeometry(shape, {
                depth: d,
                bevelEnabled: b,
                bevelSize: 0.01,
                bevelThickness: 0.02,
                curveSegments: 32
            });
            geo.rotateX(-Math.PI / 2);
            geo.translate(x, y, z);
            mediumGreyGeoms.push(geo);
        });

        // 4. Top Flange Vacuum Assembly
        const topFlangeMat = new THREE.Matrix4();
        topFlangeMat.compose(new THREE.Vector3(-1.8, -8, -0.45), new THREE.Quaternion(), new THREE.Vector3(3, 2.5, 3));

        const tfVacuumGeos = [];
        const tfPurpleRings = [];
        const tfGreyRings = [];
        const tfMedGreyGeos = [];

        function addVacuumAssy(x, y, z, sx = 1, sy = 1, sz = 1) {
            const localMat = new THREE.Matrix4();
            localMat.compose(new THREE.Vector3(x, y, z), new THREE.Quaternion(), new THREE.Vector3(sx, sy, sz));

            const topCyl = new THREE.CylinderGeometry(0.3 * 0.4, 0.3 * 0.4, 0.2 * 0.2, 16);
            topCyl.translate(1, 8.2, 0.7);
            topCyl.applyMatrix4(localMat);
            tfMedGreyGeos.push(topCyl);

            const rPurp = new THREE.RingGeometry(0.09, 0.13, 16);
            rPurp.rotateX(-Math.PI / 2);
            rPurp.translate(1, 8.2, 0.7);
            rPurp.applyMatrix4(localMat);
            tfPurpleRings.push(rPurp);

            const rGrey = new THREE.RingGeometry(0.085, 0.09, 16);
            rGrey.rotateX(-Math.PI / 2);
            rGrey.translate(1, 8.23, 0.7);
            rGrey.applyMatrix4(localMat);
            tfGreyRings.push(rGrey);
        }

        const vCyl1 = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
        vCyl1.translate(0.9, 8.05, 0.7);
        tfVacuumGeos.push(vCyl1);

        const vCyl2 = new THREE.CylinderGeometry(0.1, 0.1, 0.3, 16);
        vCyl2.translate(0.3, 8.05, 0.5);
        tfVacuumGeos.push(vCyl2);

        addVacuumAssy(-0.1, 0, 0);
        addVacuumAssy(-0.7, 0, -0.2);
        addVacuumAssy(-0.4, 0.15, -0.48);
        addVacuumAssy(0.07, 0.1, -0.26, 0.4, 1, 0.4);
        addVacuumAssy(0.0, 0.08, 0.04, 0.4, 1, 0.4);
        addVacuumAssy(-0.74, -0.19, 0.12, 0.71, 1, 0.71);
        addVacuumAssy(0.767, -0.15, 0.61, 0.3, 1, 0.3);
        addVacuumAssy(0.897, -0.15, 0.34, 0.3, 1, 0.3);
        addVacuumAssy(1.2, -0.15, -0.02, 0.3, 1, 0.3);
        addVacuumAssy(1.2, -0.15, -0.16, 0.3, 1, 0.3);

        tfVacuumGeos.forEach((g) => { g.applyMatrix4(topFlangeMat); vaccumCylinderGeoms.push(g); });
        tfPurpleRings.forEach((g) => { g.applyMatrix4(topFlangeMat); ringPurpleGeoms.push(g); });
        tfGreyRings.forEach((g) => { g.applyMatrix4(topFlangeMat); ringGreyGeoms.push(g); });
        tfMedGreyGeos.forEach((g) => { g.applyMatrix4(topFlangeMat); mediumGreyGeoms.push(g); });

        // 5. Dilution Unit Assembly
        const duMat = new THREE.Matrix4();
        duMat.compose(new THREE.Vector3(-0.8, 0, 0.4), new THREE.Quaternion(), new THREE.Vector3(0.5, 1.1, 0.5));

        // Continuous Heat Exchanger Coil
        const chePoints = [];
        for (let i = 0; i <= 150; i++) {
            const angle = i * 0.3;
            const height = i * 0.005 + 2.5;
            chePoints.push(new THREE.Vector3(Math.cos(angle) * 0.5, height, Math.sin(angle) * 0.5));
        }
        const cheGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(chePoints), 48, 0.04, 8, false);
        cheGeo.applyMatrix4(duMat);
        goldTubeGeoms.push(cheGeo);

        // Step Heat Exchangers
        [1, 1.3, 1.6, 1.9].forEach((y) => {
            const sheGeo = new THREE.TorusGeometry(0.5, 0.15, 6, 24);
            sheGeo.rotateX(Math.PI / 2);
            sheGeo.translate(0, y - 0.1, 0);
            sheGeo.applyMatrix4(duMat);
            silverGeoms.push(sheGeo);
        });

        // Dilution Cylindrical Bodies
        const duCylinders = [
            { r: 0.55, d: 0.2, y: 3.5, b: copperStillGeoms },
            { r: 0.5, d: 0.4, y: 3.5, b: copperStillGeoms },
            { r: 0.48, d: 0.5, y: 0.1, b: lightGreySmoothGeoms },
            { r: 0.75, d: 0.05, y: 0, b: goldFlangeGeoms },
            { r: 0.65, d: 0.08, y: 0.05, b: silverGeoms },
            { r: 0.75, d: 0.25, y: 2.05, b: goldFlangeGeoms },
            { r: 0.75, d: 0.08, y: 3.9, b: copperStillGeoms },
            { r: 0.35, d: 0.08, y: 3.98, b: copperStillGeoms },
            { r: 0.25, d: 2.6, y: 4.0, b: lightGreySmoothGeoms },
            { r: 0.45, d: 0.09, y: 4.35, b: copperStillGeoms },
            { r: 0.45, d: 0.08, y: 4.28, b: lightGreySmoothGeoms },
            { r: 0.75, d: 0.08, y: 0.55, b: lightGreySmoothGeoms },
            { r: 0.7, d: 0.2, y: 5, b: copperStillGeoms },
            { r: 0.7, d: 0.2, y: 4.8, b: lightGreySmoothGeoms }
        ];

        duCylinders.forEach(({ r, d, y, b }) => {
            const shape = new THREE.Shape();
            shape.absarc(0, 0, r, 0, Math.PI * 2, false);
            const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 32 });
            geo.rotateX(-Math.PI / 2);
            geo.translate(0, y, 0);
            geo.applyMatrix4(duMat);
            b.push(geo);
        });

        // Stage Vertical Rods
        const duPipes = [
            { x: 0.6 * Math.cos(Math.PI / 2), y: 0.55, z: -0.6 * Math.sin(Math.PI / 2) },
            { x: 0.6 * Math.cos(Math.PI), y: 0.55, z: -0.6 * Math.sin(Math.PI) },
            { x: 0.6 * Math.cos(Math.PI * 2), y: 0.55, z: -0.6 * Math.sin(Math.PI * 2) },
            { x: 0.6 * Math.cos(Math.PI * 1.5), y: 0.55, z: -0.6 * Math.sin(Math.PI * 1.5) },
            { x: 0.6 * Math.cos((Math.PI * 7) / 6), y: 2.2, z: -0.6 * Math.sin((Math.PI * 7) / 6) },
            { x: 0.6 * Math.cos((Math.PI * 11) / 6), y: 2.2, z: -0.6 * Math.sin((Math.PI * 11) / 6) },
            { x: 0.6 * Math.cos((Math.PI * 2) / 3), y: 2.2, z: -0.6 * Math.sin((Math.PI * 2) / 3) }
        ];

        duPipes.forEach(({ x, y, z }) => {
            const shape = new THREE.Shape();
            shape.absarc(0, 0, 0.08, 0, Math.PI * 2, false);
            const geo = new THREE.ExtrudeGeometry(shape, { depth: 1.7, bevelEnabled: false, curveSegments: 16 });
            geo.rotateX(-Math.PI / 2);
            geo.translate(x, y, z);
            geo.applyMatrix4(duMat);
            lightGreyMedGeoms.push(geo);
        });

        // Continuous Heat Exchanger Feed Tubes
        const hPlate9Pts = [
            new THREE.Vector3(0.5, 2.5, 0.1),
            new THREE.Vector3(0.45, 2.45, -0.1),
            new THREE.Vector3(0.45, 1.5, -0.1),
            new THREE.Vector3(0.5, 0.85, -0.1),
            new THREE.Vector3(0.5, 0.8, 0.0),
            new THREE.Vector3(-0.3, 0.8, 0.0),
            new THREE.Vector3(-0.35, 0.6, 0)
        ];
        const hPlate9Geo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hPlate9Pts), 32, 0.04, 8, false);
        hPlate9Geo.applyMatrix4(duMat);
        goldFlangeGeoms.push(hPlate9Geo);

        const hUpperPts = [];
        for (let i = 150; i <= 165; i++) {
            const angle = i * 0.3;
            const height = i * 0.005 + 2.5;
            const radius = 0.5 + (i - 150) * 0.003;
            hUpperPts.push(new THREE.Vector3(Math.cos(angle) * radius, height, Math.sin(angle) * radius));
        }
        const endX = hUpperPts[hUpperPts.length - 1].x;
        const endZ = hUpperPts[hUpperPts.length - 1].z;
        hUpperPts.push(new THREE.Vector3(endX, 3.4, endZ), new THREE.Vector3(endX, 3.5, endZ));
        const hUpperGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(hUpperPts), 32, 0.04, 8, false);
        hUpperGeo.applyMatrix4(duMat);
        goldFlangeGeoms.push(hUpperGeo);

        // Joule-Thomson Coil
        const jtPoints = [];
        for (let i = 0; i <= 150; i++) {
            const angle = i * 0.6;
            const height = i * 0.005 + 5.4;
            jtPoints.push(new THREE.Vector3(Math.cos(angle) * 0.4, height, Math.sin(angle) * 0.4));
        }
        const jtGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(jtPoints), 48, 0.025, 8, false);
        jtGeo.applyMatrix4(duMat);
        silverTubeGeoms.push(jtGeo);

        // 6. RF Coaxial Stages & Attenuators
        const rfMat = new THREE.Matrix4();
        const rfRot = new THREE.Quaternion().setFromEuler(new THREE.Euler(-Math.PI / 2, 0, 0));
        rfMat.compose(new THREE.Vector3(-0.1, -0.08, -0.8), rfRot, new THREE.Vector3(0.4, 0.4, 1));

        const attLocalGeos = [];
        attLocalGeos.push(new THREE.CylinderGeometry(0.1, 0.1, 0.22, 12).translate(0, 0, 0));
        attLocalGeos.push(new THREE.CylinderGeometry(0.01, 0.01, 0.2, 8).translate(0, 0.07, 0));
        
        const fEndShape = new THREE.Shape();
        fEndShape.absarc(0, 0, 0.06, 0, Math.PI * 2);
        const fEndHole = new THREE.Path();
        fEndHole.absarc(0, 0, 0.045, 0, Math.PI * 2);
        fEndShape.holes.push(fEndHole);
        const fEndGeo = new THREE.ExtrudeGeometry(fEndShape, { depth: 0.17, bevelEnabled: false });
        fEndGeo.rotateX(Math.PI / 2);
        fEndGeo.translate(0, 0.17, 0);
        attLocalGeos.push(fEndGeo);
        const attBaseMerged = safeMerge(attLocalGeos);

        for (let zLevel = 0; zLevel <= 10; zLevel += 2.5) {
            const pGeo = new RoundedBoxGeometry(3, 3, 0.3, 2, 0.1);
            pGeo.translate(0, 0, zLevel);
            pGeo.applyMatrix4(rfMat);
            goldFlangeGeoms.push(pGeo);

            const curveOffsetX = Math.sin(zLevel * 1.5) * 0.2;
            const curveOffsetY = Math.cos(zLevel * 1.5) * 0.2;

            for (let i = -1.2; i < 1.2; i += 1) {
                for (let j = -1.0; j < 1.2; j += 1) {
                    const connGeo = new THREE.CylinderGeometry(0.05, 0.1, 0.2, 8);
                    connGeo.rotateX(Math.PI / 2);
                    connGeo.translate(j + curveOffsetX, i + curveOffsetY, zLevel + 0.14);
                    connGeo.applyMatrix4(rfMat);
                    goldConnectorGeoms.push(connGeo);

                    if (zLevel > 0 && zLevel < 10 && attBaseMerged) {
                        const attClone = attBaseMerged.clone();
                        attClone.rotateX(-Math.PI / 2);
                        attClone.translate(j + curveOffsetX, i + curveOffsetY, zLevel + 0.14);
                        attClone.applyMatrix4(rfMat);
                        goldFlangeGeoms.push(attClone);
                    }
                }
            }
        }

        // RF Routing Wire Tubes
        const rfPoints = [];
        for (let i = 0; i <= 60; i++) {
            const z = 0.46 + (i / 60) * 9.54;
            const x = Math.sin((z - 0.14) * 2.49) * 0.2 + 0.01;
            const y = Math.cos((z - 0.14) * 2.49) * 0.2;
            rfPoints.push(new THREE.Vector3(x, y, z));
        }
        const rfBaseTube = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(rfPoints), 60, 0.035, 6, false);

        for (let i = -1.18; i < 1.2; i += 1) {
            for (let j = -1.08; j < 1.2; j += 1) {
                const cGeo = rfBaseTube.clone();
                cGeo.translate(j, i, 0);
                cGeo.applyMatrix4(rfMat);
                helixWireGeoms.push(cGeo);
            }
        }

        // RF Filter Assemblies
        for (let k = -2.0; k <= -0.2; k += 1) {
            const fBox = new THREE.BoxGeometry(0.4, 0.2, 2.5);
            fBox.rotateX(Math.PI / 2);
            fBox.translate(1.17 + k, 0, 0.34);
            fBox.applyMatrix4(rfMat);
            goldFlangeGeoms.push(fBox);

            const fBase = new THREE.BoxGeometry(0.4, 0.09, 2.5);
            fBase.rotateX(Math.PI / 2);
            fBase.translate(1.17 + k, 0, 0.2);
            fBase.applyMatrix4(rfMat);
            copperRoughGeoms.push(fBase);

            const fPlate = new RoundedBoxGeometry(0.4, 0.01, 2.7, 2, 0.02);
            fPlate.rotateX(Math.PI / 2);
            fPlate.translate(1.17 + k, 0, 0.15);
            fPlate.applyMatrix4(rfMat);
            copperRoughGeoms.push(fPlate);
        }

        // 7. Still Pump Line Assembly
        const pumpMat = new THREE.Matrix4();
        pumpMat.compose(new THREE.Vector3(-0.8, 7.8, 0.2), new THREE.Quaternion(), new THREE.Vector3(0.6, 0.65, 0.6));

        const pumpBaseCurve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(0, -0.5, 0),
            new THREE.Vector3(0, 1, 0),
            new THREE.Vector3(-1.5, 2, 0),
            new THREE.Vector3(-1.5, 3, 0)
        ]);

        const pTubeGeo = new THREE.TubeGeometry(pumpBaseCurve, 48, 0.55, 12, false);
        pTubeGeo.applyMatrix4(pumpMat);
        lightGreyMedGeoms.push(pTubeGeo);

        const pumpHelixPts = [];
        const frames = pumpBaseCurve.computeFrenetFrames(300, false);
        for (let i = 0; i <= 200; i++) {
            const u = i / 200;
            const t = 0.35 + u * (0.62 - 0.35);
            const p = pumpBaseCurve.getPoint(t);
            const fIdx = Math.floor(t * 300);
            const angle = u * Math.PI * 2 * 20;
            pumpHelixPts.push(
                new THREE.Vector3()
                    .copy(p)
                    .addScaledVector(frames.normals[fIdx], Math.cos(angle) * 0.6)
                    .addScaledVector(frames.binormals[fIdx], Math.sin(angle) * 0.6)
            );
        }
        const pHelixGeo = new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pumpHelixPts), 120, 0.05, 6, false);
        pHelixGeo.applyMatrix4(pumpMat);
        helixWireGeoms.push(pHelixGeo);

        [
            { r: 0.8, d: 0.5, y: 2.9, x: -1.5, z: 0 },
            { r: 1.2, d: 0.3, y: 3.4, x: -1.5, z: 0 },
            { r: 1.1, d: 0.4, y: 3.6, x: -1.5, z: 0 },
            { r: 1.2, d: 3.5, y: 4.0, x: -1.5, z: 0 },
            { r: 1.3, d: 0.4, y: 7.0, x: -1.5, z: 0 },
            { r: 1.3, d: 0.4, y: 7.5, x: -1.5, z: 0 },
            { r: 0.2, d: 0.1, y: 8.1, x: -1.73, z: 1.37 },
            { r: 0.2, d: 0.1, y: 8.1, x: -2.35, z: -1.2 },
            { r: 0.2, d: 0.1, y: 8.1, x: -0.14, z: -0.4 },
            { r: 0.7, d: 0.2, y: -0.45, x: 0, z: 0 },
            { r: 0.6, d: 0.6, y: -1.0, x: 0, z: 0 }
        ].forEach(({ r, d, y, x, z }) => {
            const shape = new THREE.Shape();
            shape.absarc(0, 0, r, 0, Math.PI * 2, false);
            const geo = new THREE.ExtrudeGeometry(shape, { depth: d, bevelEnabled: false, curveSegments: 24 });
            geo.rotateX(-Math.PI / 2);
            geo.translate(x, y, z);
            geo.applyMatrix4(pumpMat);
            lightGreySmoothGeoms.push(geo);
        });

        // 8. Pulse Tube Cooler
        const ptcMat = new THREE.Matrix4();
        ptcMat.compose(new THREE.Vector3(0.92, 12.5, 0.5), new THREE.Quaternion(), new THREE.Vector3(0.8, 0.6, 0.8));

        const ptcSilverGeos = [
            new THREE.CylinderGeometry(0.45, 0.45, 3.5, 24).translate(0.35, -3.0, 0),
            new THREE.CylinderGeometry(0.20, 0.12, 6.5, 16).translate(-0.65, -4.6, 0),
            new THREE.CylinderGeometry(0.18, 0.18, 3.9, 16).translate(-0.5, -6.0, 0),
            new THREE.CylinderGeometry(0.18, 0.18, 3.9, 16).translate(0.5, -6.0, 0)
        ];
        ptcSilverGeos.forEach((g) => { g.applyMatrix4(ptcMat); silverPhysGeoms.push(g); });

        const ptcCopperGeos = [
            new THREE.CylinderGeometry(1.25, 1.25, 0.8, 32).translate(0, -4.2, 0),
            new THREE.CylinderGeometry(0.75, 0.75, 1.0, 32).translate(0.35, -3.5, 0),
            new THREE.CylinderGeometry(0.28, 0.28, 0.3, 16).translate(-0.5, -8.0, 0),
            new THREE.CylinderGeometry(0.28, 0.28, 0.3, 16).translate(0.5, -8.0, 0),
            new THREE.CylinderGeometry(1.1, 1.1, 0.25, 32).translate(0, -8.3, 0)
        ];
        ptcCopperGeos.forEach((g) => { g.applyMatrix4(ptcMat); copperPhysGeoms.push(g); });

        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const b = new THREE.CylinderGeometry(0.08, 0.08, 0.1, 8);
            b.translate(Math.cos(angle) * 0.9, -8.15, Math.sin(angle) * 0.9);
            b.applyMatrix4(ptcMat);
            housingPhysGeoms.push(b);
        }

        // 9. Instanced Structural Bolts
        const boltHead = new THREE.CylinderGeometry(0.3, 0.3, 0.2, 6);
        const boltWasher = new THREE.CylinderGeometry(0.35, 0.35, 0.05, 8).translate(0, -0.125, 0);
        const boltShaft = new THREE.CylinderGeometry(0.15, 0.15, 1, 8).translate(0, -0.8, 0);
        const mergedBoltGeo = safeMerge([boltHead, boltWasher, boltShaft]);

        const boltConfigs = [
            { radius: 1.5, num: 10, x: 0, y: 0.03, z: 0 },
            { radius: 0.5, num: 3, x: 0, y: 0.03, z: 0 },
            { radius: 0.4, num: 6, x: -0.8, y: 2.53, z: 0.2 },
            { radius: 1.7, num: 12, x: 0, y: 2.53, z: 0 },
            { radius: 1.9, num: 12, x: 0, y: 5.03, z: 0 },
            { radius: 0.3, num: 6, x: -0.8, y: 5.03, z: 0.2 },
            { radius: 2.3, num: 15, x: 0, y: 7.53, z: 0 },
            { radius: 0.6, num: 6, x: -0.8, y: 7.53, z: 0.2 },
            { radius: 2.5, num: 15, x: 0, y: 10.03, z: 0 },
            { radius: 0.75, num: 8, x: -1.7, y: 10.03, z: 0.2 },
            { radius: 3.0, num: 15, x: 0, y: 11.95, z: 0 },
            { radius: 0.8, num: 8, x: -1.7, y: 11.95, z: 0.2 },
            { radius: 0.4, num: 4, x: -0.2, y: 10.1, z: -0.72 },
            { radius: 0.9, num: 8, x: 1.5, y: 12.15, z: 0 },
            { radius: 0.7, num: 8, x: 1.5, y: 12.95, z: 0 }
        ];

        const totalBolts = boltConfigs.reduce((sum, config) => sum + config.num, 0);
        if (mergedBoltGeo) {
            const instancedBolts = new THREE.InstancedMesh(mergedBoltGeo, SHARED_MATERIALS.boltSteel, totalBolts);
            instancedBolts.castShadow = true;
            instancedBolts.receiveShadow = true;

            const dummy = new THREE.Object3D();
            let currentIdx = 0;

            boltConfigs.forEach((config) => {
                for (let i = 0; i < config.num; i++) {
                    const angle = (i / config.num) * Math.PI * 2;
                    dummy.position.set(
                        config.x + Math.cos(angle) * config.radius,
                        config.y,
                        config.z + Math.sin(angle) * config.radius
                    );
                    dummy.scale.set(0.2, 0.2, 0.2);
                    dummy.rotation.set(0, 0, 0);
                    dummy.updateMatrix();
                    instancedBolts.setMatrixAt(currentIdx++, dummy.matrix);
                }
            });

            instancedBolts.instanceMatrix.needsUpdate = true;
            this.group.add(instancedBolts);
        }

        // 10. Final Merged Batches
        const batches = [
            { geoms: goldFlangeGeoms, mat: SHARED_MATERIALS.goldFlange },
            { geoms: goldTubeGeoms, mat: SHARED_MATERIALS.goldTube },
            { geoms: goldConnectorGeoms, mat: SHARED_MATERIALS.goldConnector },
            { geoms: lightGreyRoughGeoms, mat: SHARED_MATERIALS.lightGreyRough },
            { geoms: lightGreyMedGeoms, mat: SHARED_MATERIALS.lightGreyMedium },
            { geoms: lightGreySmoothGeoms, mat: SHARED_MATERIALS.lightGreySmooth },
            { geoms: darkGreyGeoms, mat: SHARED_MATERIALS.darkGrey },
            { geoms: mediumGreyGeoms, mat: SHARED_MATERIALS.mediumGrey },
            { geoms: silverGeoms, mat: SHARED_MATERIALS.silver },
            { geoms: silverTubeGeoms, mat: SHARED_MATERIALS.silverTube },
            { geoms: copperStillGeoms, mat: SHARED_MATERIALS.copperStill },
            { geoms: copperPhysGeoms, mat: SHARED_MATERIALS.copperPhysical },
            { geoms: copperRoughGeoms, mat: SHARED_MATERIALS.copperRough },
            { geoms: silverPhysGeoms, mat: SHARED_MATERIALS.silverPhysical },
            { geoms: housingPhysGeoms, mat: SHARED_MATERIALS.housingPhysical },
            { geoms: helixWireGeoms, mat: SHARED_MATERIALS.helixWire },
            { geoms: ringPurpleGeoms, mat: SHARED_MATERIALS.ringPurple },
            { geoms: ringGreyGeoms, mat: SHARED_MATERIALS.ringGrey },
            { geoms: vaccumCylinderGeoms, mat: SHARED_MATERIALS.vacuumCylinder }
        ];

        batches.forEach(({ geoms, mat }) => {
            const merged = safeMerge(geoms);
            if (merged) {
                const m = new THREE.Mesh(merged, mat);
                m.castShadow = true;
                m.receiveShadow = true;
                this.group.add(m);
            }
        });
    }

    getGroup() {
        return this.group;
    }
}