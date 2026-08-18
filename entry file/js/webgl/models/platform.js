import * as THREE from 'three';

export default class Platform {
    constructor() {
        this.group = new THREE.Group();
        this.buildPlatform();
    }

    buildPlatform() {
        // Pre-orient and position the geometry to reduce matrix recalculation
        const floorGeometry = new THREE.PlaneGeometry(200, 200);
        floorGeometry.rotateX(-Math.PI / 2);
        floorGeometry.translate(0, -8, 0);

        // Standard material is lighter on the GPU pipeline than Physical
        const floorMaterial = new THREE.MeshStandardMaterial({ 
            color: 0x777777, 
            roughness: 0.8,
            metalness: 0.1
        });

        const floor = new THREE.Mesh(floorGeometry, floorMaterial);
        floor.receiveShadow = true;
        this.group.add(floor);
    }

    getGroup() {
        return this.group;
    }
}