import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default class PipeAssembly { 
    constructor() {
        this.group = new THREE.Group();
        this.group.scale.set(2.3, 2, 2);
        this.group.position.set(-7.2, 10.7, -5.3);
        this.group.rotation.y = -Math.PI / 2;
        
        this.buildPipeAssembly();
    }

    buildPipeAssembly() {
        // Safe Merge Utility to prevent index/attribute mismatches
        const safeMerge = (geometries) => {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        };

        // Shared Materials
        const pipeMaterial = new THREE.MeshStandardMaterial({
            color: 0xb0b0b0,
            metalness: 0.9,
            roughness: 0.25
        });
        
        const darkMetalMaterial = new THREE.MeshStandardMaterial({
            color: 0x999999,
            metalness: 1.0,
            roughness: 0.25
        });

        // Geometry Buckets
        const pipeGeoms = [];
        const darkMetalGeoms = [];

        // 1. Horizontal Pipe & Elbow
        const mainHorizPipe = new THREE.CylinderGeometry(0.15, 0.15, 5, 32);
        mainHorizPipe.rotateZ(Math.PI / 2);
        mainHorizPipe.translate(-0.5, 2, 0);
        pipeGeoms.push(mainHorizPipe);

        const elbowTorus = new THREE.TorusGeometry(0.5, 0.2, 24, 48, Math.PI / 2);
        elbowTorus.translate(2.0, 1.5, 0);
        pipeGeoms.push(elbowTorus);

        const leftEndFlange = new THREE.CylinderGeometry(0.24, 0.24, 0.08, 32);
        leftEndFlange.rotateZ(Math.PI / 2);
        leftEndFlange.translate(-2.7, 2, 0);
        pipeGeoms.push(leftEndFlange);

        const elbowConnectorFlange = new THREE.CylinderGeometry(0.28, 0.28, 0.10, 32);
        elbowConnectorFlange.rotateZ(Math.PI / 2);
        elbowConnectorFlange.translate(2.0, 2.0, 0);
        darkMetalGeoms.push(elbowConnectorFlange);

        // 2. Right Vertical Pipe & Base Flange
        const rightVertPipe = new THREE.CylinderGeometry(0.20, 0.20, 1, 32);
        rightVertPipe.translate(2.5, 1.0, 0);
        pipeGeoms.push(rightVertPipe);

        const bottomBaseFlange = new THREE.CylinderGeometry(0.32, 0.32, 0.08, 32);
        bottomBaseFlange.translate(2.5, 1.0, 0);
        pipeGeoms.push(bottomBaseFlange);

        // 3. T-Branch Junction Components
        const tJunctionBody = new THREE.CylinderGeometry(0.28, 0.28, 0.5, 32);
        tJunctionBody.rotateZ(Math.PI / 2);
        tJunctionBody.translate(-3, 2.0, 0);
        pipeGeoms.push(tJunctionBody);

        const leftSideVertPipe = new THREE.CylinderGeometry(0.16, 0.16, 2.5, 32);
        leftSideVertPipe.translate(-3, 0.8, 0);
        pipeGeoms.push(leftSideVertPipe);

        const leftSideLowerCollar = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32);
        leftSideLowerCollar.translate(-3, 1.75, 0);
        pipeGeoms.push(leftSideLowerCollar);

        const tJunctionVertStem = new THREE.CylinderGeometry(0.22, 0.22, 0.6, 32);
        tJunctionVertStem.translate(-3, 2.0, 0);
        pipeGeoms.push(tJunctionVertStem);

        const tJunctionHorizStem = new THREE.CylinderGeometry(0.18, 0.18, 0.3, 32);
        tJunctionHorizStem.rotateZ(Math.PI / 2);
        tJunctionHorizStem.translate(-3, 2.0, 0);
        pipeGeoms.push(tJunctionHorizStem);

        const leftSideTopCap = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 32);
        leftSideTopCap.translate(-3, 2.50, 0);
        pipeGeoms.push(leftSideTopCap);

        const leftSideBottomExt = new THREE.CylinderGeometry(0.18, 0.18, 0.12, 32);
        leftSideBottomExt.translate(-3, 1.42, 0);
        pipeGeoms.push(leftSideBottomExt);

        const ghuCollar = new THREE.CylinderGeometry(0.22, 0.22, 0.12, 32);
        ghuCollar.rotateX(Math.PI);
        ghuCollar.translate(-3, -0.5, 0);
        pipeGeoms.push(ghuCollar);

        // 4. Dark Metal Blocks
        const leftSideUpperDarkBlock = new THREE.CylinderGeometry(0.26, 0.26, 0.15, 32);
        leftSideUpperDarkBlock.translate(-3, 2.38, 0);
        darkMetalGeoms.push(leftSideUpperDarkBlock);

        const leftSideLowerDarkBlock = new THREE.CylinderGeometry(0.26, 0.26, 0.15, 32);
        leftSideLowerDarkBlock.translate(-3, 1.62, 0);
        darkMetalGeoms.push(leftSideLowerDarkBlock);

        // 5. Batch & Merge into Scene
        const mergedPipeGeo = safeMerge(pipeGeoms);
        if (mergedPipeGeo) {
            const pipeMesh = new THREE.Mesh(mergedPipeGeo, pipeMaterial);
            pipeMesh.castShadow = true;
            pipeMesh.receiveShadow = true;
            this.group.add(pipeMesh);
        }

        const mergedDarkMetalGeo = safeMerge(darkMetalGeoms);
        if (mergedDarkMetalGeo) {
            const darkMetalMesh = new THREE.Mesh(mergedDarkMetalGeo, darkMetalMaterial);
            darkMetalMesh.castShadow = true;
            darkMetalMesh.receiveShadow = true;
            this.group.add(darkMetalMesh);
        }
    }

    getGroup() {
        return this.group;
    }
}