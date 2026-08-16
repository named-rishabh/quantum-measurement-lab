import * as THREE from 'three';

export default class Mixingchamber {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(-5.2, -3.7, -0.4);

        this.buildMixingchamber();
    }

    buildMixingchamber() {
        // --- 1. Build Gold Plate ---
        const plateShape = new THREE.Shape();
        plateShape.moveTo(-1.3, -1.5);
        plateShape.lineTo(1.3, -1.5);
        plateShape.lineTo(1.3, 1.5);
        plateShape.lineTo(-1.3, 1.5);
        plateShape.lineTo(-1.3, -1.5);

        // Circular hole grid
        for (let i = -1.2; i < 1.3; i += 0.4) {
            for (let j = -1.2; j < 1.4; j += 0.4) {
                const holePath = new THREE.Path();
                holePath.absarc(i, j, 0.08, 0, Math.PI * 2, false);
                plateShape.holes.push(holePath);
            }
        }

        const plategeom = new THREE.ExtrudeGeometry(plateShape, {
            depth: 0.2,
            bevelEnabled: false
        });

        const platemat = new THREE.MeshStandardMaterial({
            color: 0xD4AF37,
            side: THREE.DoubleSide,
            roughness: 0.15,
            metalness: 1
        });

        const plate = new THREE.Mesh(plategeom, platemat);
        this.group.add(plate);

        const plateDepth = 0.2; 

        // --- 2. Build Copper Sample Holder & PCB ---
        // Positioned centrally on the upper half of the gold plate
        const sampleHolder = this.createSampleHolder(0, 0.3, plateDepth);
        this.group.add(sampleHolder);

        // --- 3. Build 4 SMA Connectors and Cables ---
        // Positioned directly below the PCB
        const startX = -0.45;
        const startY = -0.6;
        const spacing = 0.3;

        for (let i = 0; i < 4; i++) {
            const xPos = startX + (i * spacing);
            const yPos = startY;
            const zPos = plateDepth; 

            // Add the metallic SMA hardware
            const smaConnector = this.createSMAConnector(xPos, yPos, zPos);
            this.group.add(smaConnector);

            // Define the 3D path for the semi-rigid cable
            const curvePoints = [
                new THREE.Vector3(xPos, yPos - 0.03, zPos + 0.1), 
                new THREE.Vector3(xPos, yPos + 0.3, zPos + 0.6), 
                new THREE.Vector3(xPos + 0.2, yPos + 0.8, zPos + 0.4), 
                new THREE.Vector3(xPos + 0, yPos + 1.2, zPos + 0.1),
                new THREE.Vector3(xPos + 0, yPos + 1.8, zPos + 0.1)  
            ];

            const cable = this.createCable(curvePoints, 0x88aacc); 
            this.group.add(cable);
        }
    }

    // --- Helper Methods ---

    createSampleHolder(x, y, z) {
        const holderGroup = new THREE.Group();
        holderGroup.position.set(x, y, z);
        holderGroup.scale.set(1.2,1.2,1.1);

        // 1. Main Copper Mount (Thermal Bath)
        const copperMat = new THREE.MeshStandardMaterial({
            color: 0xb87333, // Raw copper hue
            roughness: 0.4,
            metalness: 0.8
        });
        const mountGeom = new THREE.BoxGeometry(1.4, 1.2, 0.15);
        const mount = new THREE.Mesh(mountGeom, copperMat);
        mount.position.z = 0.075; 
        holderGroup.add(mount);

        // 2. Custom PCB (Printed Circuit Board)
        const pcbMat = new THREE.MeshStandardMaterial({
            color: 0x8b5a2b, // Bare FR4 board color matching the image
            roughness: 0.85,
            metalness: 0.9
        });
        const pcbGeom = new THREE.BoxGeometry(1.0, 1.0, 0.05);
        const pcb = new THREE.Mesh(pcbGeom, pcbMat);
        pcb.position.set(-0.1, -0.05, 0.175); // Sitting flush on the copper mount
        holderGroup.add(pcb);

        // 3. Multi-pin DC Connector Housing (Black plastic block on the right)
        const dcHousingMat = new THREE.MeshStandardMaterial({
            color: 0x151515,
            roughness: 0.3,
            metalness: 0.9
        });
        const dcHousingGeom = new THREE.BoxGeometry(0.25, 0.6, 0.18);
        const dcHousing = new THREE.Mesh(dcHousingGeom, dcHousingMat);
        dcHousing.position.set(0.55, 0.1, 0.24); // Mounted to the side of the PCB
        holderGroup.add(dcHousing);

        // Optional: Small brass screw heads securing the PCB
        const screwMat = new THREE.MeshStandardMaterial({ color: 0xD4AF37, metalness: 1, roughness: 0.2 });
        const screwGeom = new THREE.CylinderGeometry(0.03, 0.03, 0.02, 8);
        screwGeom.rotateX(Math.PI / 2);
        
        const screwPositions = [
            [-0.5, 0.35, 0.21], [0.3, 0.35, 0.21], 
            [-0.5, -0.45, 0.21], [0.3, -0.45, 0.21]
        ];

        screwPositions.forEach(pos => {
            const screw = new THREE.Mesh(screwGeom, screwMat);
            screw.position.set(pos[0], pos[1], pos[2]);
            holderGroup.add(screw);
        });

        const textureLoader = new THREE.TextureLoader();
        const texture = textureLoader.load('./public/assets/images/chip.png');
        const chipMat = new THREE.MeshStandardMaterial({metalness: 0.9, roughness: 0.2, map : texture, transparent: true, alphaTest: 0.5 });
        const chipGeom = new THREE.BoxGeometry(1.7, 1.1, 0.02);
        const chip = new THREE.Mesh(chipGeom, chipMat);
        chip.position.set(-0.1, -0.05, 0.2); // Position the chip on the PCB
        holderGroup.add(chip);

        return holderGroup;
    }

    createSMAConnector(x, y, z) {
        const smaGroup = new THREE.Group();
        smaGroup.position.set(x + 0.1, y + 0.5, z + 0.2);
        
        const smaMat = new THREE.MeshStandardMaterial({
            color: 0xcccccc, 
            roughness: 0.3,
            metalness: 0.9
        });

        const nutGeom = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 6);
        nutGeom.rotateX(Math.PI / 2);
        const nut = new THREE.Mesh(nutGeom, smaMat);
        nut.position.z = 0.02; 
        smaGroup.add(nut);

        const barrelGeom = new THREE.CylinderGeometry(0.06, 0.06, 0.1, 16);
        barrelGeom.rotateX(Math.PI / 2);
        const barrel = new THREE.Mesh(barrelGeom, smaMat);
        barrel.position.z = 0.1; 
        smaGroup.add(barrel);

        return smaGroup;
    }

    createCable(points, colorHex) {
        const curve = new THREE.CatmullRomCurve3(points);
        const tubeGeom = new THREE.TubeGeometry(curve, 64, 0.035, 8, false);
        const tubeMat = new THREE.MeshStandardMaterial({
            color: colorHex,
            roughness: 0.6, 
            metalness: 0.1
        });
        const cables = new THREE.Mesh(tubeGeom, tubeMat);
        cables.position.set(0.1,0.5,0.2);
        return cables;
    }

    getGroup() {
        return this.group;
    }
}