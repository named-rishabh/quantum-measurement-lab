import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default class classicalComputer {
    constructor() {
        this.group = new THREE.Group();
        this.group.scale.set(2.5, 2.3, 2.5);
        this.group.position.set(10, -8, 5);

        // Materials
        this.matBody = new THREE.MeshStandardMaterial({ color: 0xccc4c4 });
        this.matDark = new THREE.MeshStandardMaterial({ color: 0x333333 });
        this.matScreen = new THREE.MeshStandardMaterial({ color: 0x111111 });
        this.matMetal = new THREE.MeshStandardMaterial({ color: 0x949393, metalness: 1, roughness: 0.15 });

        this.buildModel();
    }

    buildModel() {
        // Safe merge helper
        const safeMerge = (geometries) => {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        };

        // Geometry Buckets
        const bodyGeoms = [];
        const darkGeoms = [];
        const metalGeoms = [];

        // 1. Cabinet Body & Surfaces
        const bodyGeo = new THREE.BoxGeometry(2, 2.6, 1.8);
        bodyGeo.translate(0, 1.3, 0);
        bodyGeoms.push(bodyGeo);

        const topGeo = new THREE.BoxGeometry(2.1, 0.1, 1.9);
        topGeo.translate(0, 2.65, 0);
        bodyGeoms.push(topGeo);

        const doorGeo = new THREE.BoxGeometry(1.8, 1.5, 0.05);
        doorGeo.translate(0, 1.1, 0.925);
        bodyGeoms.push(doorGeo);

        const controlGeo = new THREE.BoxGeometry(1.8, 0.4, 0.05);
        controlGeo.translate(0, 2.35, 0.925);
        bodyGeoms.push(controlGeo);

        const monitorGeo = new THREE.BoxGeometry(1.8, 1.5, 0.15);
        monitorGeo.translate(0, 3.9, 0.1);
        bodyGeoms.push(monitorGeo);

        // 2. Dark Plastics (Casters, Tray, Bezel, Dots)
        const casterPositions = [
            [-0.8, 0.15,  0.7],
            [ 0.8, 0.15,  0.7],
            [-0.8, 0.15, -0.7],
            [ 0.8, 0.15, -0.7]
        ];

        casterPositions.forEach(([x, y, z]) => {
            const caster = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
            caster.rotateZ(Math.PI / 2);
            caster.translate(x, y, z);
            darkGeoms.push(caster);

            const bracket = new THREE.BoxGeometry(0.1, 0.15, 0.15);
            bracket.translate(x, y + 0.1, z);
            metalGeoms.push(bracket);
        });

        const trayGeo = new THREE.BoxGeometry(1.8, 0.3, 0.2);
        trayGeo.rotateX(Math.PI / 8);
        trayGeo.translate(0, 2.0, 0.85);
        darkGeoms.push(trayGeo);

        const bezelGeo = new THREE.BoxGeometry(1.85, 1.55, 0.1);
        bezelGeo.translate(0, 3.9, 0.08);
        darkGeoms.push(bezelGeo);

        const dotPositions = [
            [-0.5, 4.2], [0.2, 4.3], [0.6, 4.1], [-0.3, 3.8], 
            [0.4, 3.6], [-0.6, 3.4], [0.5, 3.4], [0, 4.0]
        ];

        dotPositions.forEach(([x, y]) => {
            const dot = new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8);
            dot.rotateX(Math.PI / 2);
            dot.translate(x, y, 0.1);
            darkGeoms.push(dot);
        });

        // 3. Metal Components (Handle, Stand Base & Neck)
        const handleGeo = new THREE.BoxGeometry(0.2, 0.05, 0.1);
        handleGeo.translate(-0.7, 1.1, 0.98);
        metalGeoms.push(handleGeo);

        const standBaseGeo = new THREE.BoxGeometry(0.6, 0.05, 0.4);
        standBaseGeo.translate(0, 2.725, 0);
        metalGeoms.push(standBaseGeo);

        const neckGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 16);
        neckGeo.translate(0, 3.1, 0);
        metalGeoms.push(neckGeo);

        // 4. LCD Screen Mesh (Single Draw Call)
        const lcdGeo = new THREE.BoxGeometry(0.6, 0.25, 0.06);
        lcdGeo.translate(-0.4, 2.35, 0.93);
        this.group.add(new THREE.Mesh(lcdGeo, this.matScreen));

        // 5. Batch & Merge
        const mergedBody = safeMerge(bodyGeoms);
        if (mergedBody) {
            const m = new THREE.Mesh(mergedBody, this.matBody);
            m.castShadow = true;
            m.receiveShadow = true;
            this.group.add(m);
        }

        const mergedDark = safeMerge(darkGeoms);
        if (mergedDark) this.group.add(new THREE.Mesh(mergedDark, this.matDark));

        const mergedMetal = safeMerge(metalGeoms);
        if (mergedMetal) this.group.add(new THREE.Mesh(mergedMetal, this.matMetal));
    }

    getGroup() {
        return this.group;
    }
}