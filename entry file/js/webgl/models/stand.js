import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default class Stand {
    constructor() {
        this.group = new THREE.Group();
        this.group.scale.set(3, 2.5, 3);
        this.group.position.y = -8.5;
        this.group.position.x = -7;
        this.buildStand();
    }

    buildStand() {
        // Safe merge helper to prevent indexing and attribute mismatch errors
        function safeMerge(geometries) {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        }

        // Shared Materials
        const aluminumMaterial = new THREE.MeshStandardMaterial({ color: '#c5cbd1', metalness: 0.9, roughness: 0.1 });
        const darkFrameMaterial = new THREE.MeshStandardMaterial({ color: '#1c1f22', roughness: 0.7 });
        const housingMaterial = new THREE.MeshPhysicalMaterial({ color: 0x636A6E, metalness: 1, roughness: 0.15 });
        const silverMaterial = new THREE.MeshPhysicalMaterial({ color: 0xd6d6d6, metalness: 1, roughness: 0.15 });
        const copperMaterial = new THREE.MeshPhysicalMaterial({ color: 0xb87333, metalness: 1, roughness: 0.15 });

        // Geometry Buckets
        const aluminumGeoms = [];
        const darkFrameGeoms = [];
        const housingGeoms = [];
        const silverGeoms = [];
        const copperGeoms = [];

        // 1. VERTICAL LEGS
        const legPositions = [
            { x: -2, z: -2 }, { x: 4, z: -2 },
            { x: -2, z: 2 },  { x: 4, z: 2 }
        ];
        legPositions.forEach(pos => {
            const leg = new THREE.BoxGeometry(0.3, 7.6, 0.3);
            leg.translate(pos.x, 4, pos.z);
            aluminumGeoms.push(leg);
        });

        // 2. MAIN HEADER BED & GUSSETS
        const hConfigs = [
            { geom: new THREE.BoxGeometry(6.3, 0.5, 0.4), x: 1, y: 7.6, z: 2 },
            { geom: new THREE.BoxGeometry(6.3, 0.5, 0.4), x: 1, y: 7.6, z: -2 },
            { geom: new THREE.BoxGeometry(0.4, 0.5, 4.4), x: -2, y: 7.6, z: 0 },
            { geom: new THREE.BoxGeometry(0.4, 0.5, 4.4), x: 4, y: 7.6, z: 0 }
        ];
        hConfigs.forEach(({ geom, x, y, z }) => {
            geom.translate(x, y, z);
            aluminumGeoms.push(geom);
        });

        const gussetPositions = [
            { x: 2, z: 1.8 }, { x: -0.8, z: 1.8 },
            { x: 2, z: -1.7 }, { x: -0.8, z: -1.7 }
        ];
        gussetPositions.forEach(pos => {
            const gusset = new THREE.BoxGeometry(0.4, 0.1, 0.3);
            gusset.rotateY(Math.PI / 2);
            gusset.translate(pos.x, 7.85, pos.z);
            darkFrameGeoms.push(gusset);
        });

        // 3. HORIZONTAL & ANGLED CROSS BRACES
        const braceHeights = [3.0, 7.6];
        const left = [-2, -0.8];
        const right = [4, 2];

        braceHeights.forEach((h, i) => {
            const bLeft = new THREE.BoxGeometry(0.3, 0.4, 4.0);
            bLeft.translate(left[i], h, 0);
            aluminumGeoms.push(bLeft);

            const bRight = new THREE.BoxGeometry(0.3, 0.4, 4.0);
            bRight.translate(right[i], h, 0);
            aluminumGeoms.push(bRight);

            const bBack = new THREE.BoxGeometry(3.1, 0.4, 0.3);
            bBack.translate(0.6, 7.6, -1.4);
            aluminumGeoms.push(bBack);

            const bFront = new THREE.BoxGeometry(3.1, 0.4, 0.3);
            bFront.translate(0.6, 7.6, 1.45);
            aluminumGeoms.push(bFront);
        });

        const supports = [
            { x: -1.6, y: 6.7, z: -2, angle: Math.PI / 3 },
            { x: -1.6, y: 6.7, z: 2, angle: Math.PI / 3 },
            { x: 3.6, y: 6.7, z: -2, angle: -Math.PI / 3 },
            { x: 3.6, y: 6.7, z: 2, angle: -Math.PI / 3 }
        ];
        supports.forEach(({ x, y, z, angle }) => {
            const sup = new THREE.BoxGeometry(1.6, 0.3, 0.3);
            sup.rotateZ(angle);
            sup.translate(x, y, z);
            aluminumGeoms.push(sup);
        });

        // 4. ROOF PLATFORM
        const roof = new THREE.BoxGeometry(1.6, 0.15, 4.3);
        roof.translate(2.8 + 0.25, -0.05 + 8.0, 0);
        darkFrameGeoms.push(roof);

        // 5. TOP EF VALVE ARRAY ASSEMBLY (Local to World Transformation)
        const efMat = new THREE.Matrix4();
        const efEuler = new THREE.Euler(Math.PI / 2, Math.PI, 0);
        efMat.compose(
            new THREE.Vector3(3, 8.5, -1.5),
            new THREE.Quaternion().setFromEuler(efEuler),
            new THREE.Vector3(0.45, 0.45, 0.45)
        );

        const efHousingLocals = [
            new THREE.BoxGeometry(1, 2, 2),
            new THREE.BoxGeometry(1, 2, 2).translate(0, 2.02, 0)
        ];

        // Horizontal grill ribs
        for (let i = -1.0; i <= 2.8; i += 0.6) {
            const extra = new THREE.BoxGeometry(0.12, 1, 0.4);
            extra.rotateZ(Math.PI / 2);
            extra.translate(0, i, 1.2);
            efHousingLocals.push(extra);
        }

        // Vertical grill bars
        for (let j = -0.4; j <= 0.6; j += 0.4) {
            const extra2 = new THREE.BoxGeometry(4, 0.2, 0.4);
            extra2.rotateZ(Math.PI / 2);
            extra2.translate(j, 1, 1.2);
            efHousingLocals.push(extra2);
        }

        efHousingLocals.forEach(g => {
            g.applyMatrix4(efMat);
            housingGeoms.push(g);
        });

        const efSilverLocals = [];
        [0, 2.05].forEach(yPos => {
            const conn = new THREE.CylinderGeometry(0.7, 0.7, 3, 16, 1);
            conn.rotateZ(Math.PI / 2);
            conn.translate(0, yPos, 0);
            efSilverLocals.push(conn);

            const end1 = new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            end1.rotateZ(-Math.PI / 2);
            end1.translate(1.3, yPos, 0);
            efSilverLocals.push(end1);

            const end2 = new THREE.SphereGeometry(0.65, 16, 16, 0, Math.PI * 2, 0, Math.PI / 2);
            end2.rotateZ(Math.PI / 2);
            end2.translate(-1.3, yPos, 0);
            efSilverLocals.push(end2);
        });

        const efWireCurve1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.95, 0.00, 0.00),
            new THREE.Vector3(1.95, 0.05, 0.00),
            new THREE.Vector3(2.55, 0.08, 0.05),
            new THREE.Vector3(2.80, 0.1, 0.08),
            new THREE.Vector3(3.05, 0.1, 0.1),
            new THREE.Vector3(3.55, 0.2, 0.2),
            new THREE.Vector3(3.75, 0.2, 0.3),
            new THREE.Vector3(3.88, 0.3, 0.5),
            new THREE.Vector3(3.96, 3.1, 0.8),
            new THREE.Vector3(3.96, 3.15, 0.6)
        ]);
        efSilverLocals.push(new THREE.TubeGeometry(efWireCurve1, 48, 0.05, 8, false));

        const efWireCurve2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(1.95, 2.05, 0.00),
            new THREE.Vector3(2.45, 2.05, 0.00),
            new THREE.Vector3(2.85, 2.08, 0.08),
            new THREE.Vector3(3.3, 2.1, 0.1),
            new THREE.Vector3(3.58, 2.90, 0.32),
            new THREE.Vector3(3.58, 3.20, 0.38),
            new THREE.Vector3(3.6, 3.42, 0.46),
            new THREE.Vector3(3.6, 3.6, 0.46),
            new THREE.Vector3(3.61, 3.65, 0.31)
        ]);
        efSilverLocals.push(new THREE.TubeGeometry(efWireCurve2, 48, 0.05, 8, false));

        efSilverLocals.forEach(g => {
            g.applyMatrix4(efMat);
            silverGeoms.push(g);
        });

        // 6. PTC HEAD ASSEMBLY (Local to World Transformation)
        const ptcMat = new THREE.Matrix4();
        ptcMat.compose(
            new THREE.Vector3(3, 8.5, 1),
            new THREE.Quaternion(),
            new THREE.Vector3(0.3, 0.3, 0.3)
        );

        const ptcHousingLocals = [
            new THREE.CylinderGeometry(0.9, 0.9, 1.4, 32).translate(0, 2.0, 0),
            new THREE.CylinderGeometry(1.3, 1.3, 2.5, 32).translate(0, 0.15, 0),
            new THREE.CylinderGeometry(1.8, 1.8, 0.9, 32).translate(0, -1.4, 0)
        ];

        const ptcSilverLocals = [
            new THREE.CylinderGeometry(1.15, 1.15, 0.15, 32).translate(0, 1.25, 0)
        ];

        // 8 Top Ring Bolts
        for (let i = 0; i < 8; i++) {
            const angle = (i / 8) * Math.PI * 2;
            const bolt = new THREE.CylinderGeometry(0.07, 0.07, 0.30, 8);
            bolt.translate(Math.cos(angle) * 1.15, 1.35, Math.sin(angle) * 1.15);
            ptcSilverLocals.push(bolt);
        }

        // 12 Flange Bolts
        for (let i = 0; i < 12; i++) {
            const angle = (i / 12) * Math.PI * 2;
            const bolt = new THREE.CylinderGeometry(0.06, 0.06, 0.12, 8);
            bolt.translate(Math.cos(angle) * 1.55, -0.88, Math.sin(angle) * 1.55);
            ptcSilverLocals.push(bolt);
        }

        // Side Connectors
        for (let i = 0; i < 2; i++) {
            const yOffset = 0.5 - i * 0.6;

            const pipe = new THREE.CylinderGeometry(0.15, 0.15, 1.5, 16);
            pipe.rotateZ(Math.PI / 2);
            pipe.translate(1.8, yOffset, 0);
            ptcSilverLocals.push(pipe);

            const collar = new THREE.CylinderGeometry(0.32, 0.32, 0.12, 16);
            collar.rotateZ(Math.PI / 2);
            collar.translate(2.35, yOffset, 0);
            ptcSilverLocals.push(collar);

            const fitting = new THREE.CylinderGeometry(0.25, 0.25, 0.4, 16);
            fitting.rotateZ(Math.PI / 2);
            fitting.translate(2.6, yOffset, 0);
            ptcHousingLocals.push(fitting);
        }

        const brassFitting = new THREE.CylinderGeometry(0.12, 0.16, 0.35, 16);
        brassFitting.rotateZ(Math.PI / 2);
        brassFitting.translate(-1.38, 0.45, 0);
        brassFitting.applyMatrix4(ptcMat);
        copperGeoms.push(brassFitting);

        ptcHousingLocals.forEach(g => {
            g.applyMatrix4(ptcMat);
            housingGeoms.push(g);
        });

        ptcSilverLocals.forEach(g => {
            g.applyMatrix4(ptcMat);
            silverGeoms.push(g);
        });

        // Independent Stand Connection Tube
        const ptc2topring = new THREE.CatmullRomCurve3([
            new THREE.Vector3(2.8, 8.64, 1),
            new THREE.Vector3(2.5, 8.64, 1),
            new THREE.Vector3(2.1, 8.7, 1),
            new THREE.Vector3(1.7, 8.9, 0.8),
            new THREE.Vector3(1.6, 8.9, 0.6),
            new THREE.Vector3(1.4, 8.9, 0.3),
            new THREE.Vector3(1.1, 8.8, 0.2),
            new THREE.Vector3(1.1, 8.5, 0.2)
        ]);
        ptc2topring.curveType = 'chordal';
        housingGeoms.push(new THREE.TubeGeometry(ptc2topring, 48, 0.02, 8, false));

        // 7. BATCHED MESH ADDITIONS
        const mergedAluminum = safeMerge(aluminumGeoms);
        if (mergedAluminum) this.group.add(new THREE.Mesh(mergedAluminum, aluminumMaterial));

        const mergedDarkFrame = safeMerge(darkFrameGeoms);
        if (mergedDarkFrame) this.group.add(new THREE.Mesh(mergedDarkFrame, darkFrameMaterial));

        const mergedHousing = safeMerge(housingGeoms);
        if (mergedHousing) this.group.add(new THREE.Mesh(mergedHousing, housingMaterial));

        const mergedSilver = safeMerge(silverGeoms);
        if (mergedSilver) this.group.add(new THREE.Mesh(mergedSilver, silverMaterial));

        const mergedCopper = safeMerge(copperGeoms);
        if (mergedCopper) this.group.add(new THREE.Mesh(mergedCopper, copperMaterial));
    }

    getGroup() {
        return this.group;
    }
}