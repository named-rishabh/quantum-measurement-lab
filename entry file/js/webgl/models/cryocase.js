import * as THREE from 'three';
import gsap from 'gsap';

export default class CryoCase {
    constructor() {
        this.group = new THREE.Group();
        this.isOpen = false;
        
        // 1. Create separate groups for the two halves
        this.leftHalf = new THREE.Group();
        this.rightHalf = new THREE.Group();
        
        // 2. Add both halves to the main group
        this.group.add(this.leftHalf);
        this.group.add(this.rightHalf);
        this.group.scale.set(1.2,1.2,1.2);
        this.group.position.set(-5.15,-5.6,0.15);

        this.buildCryocase();
    }

    buildCryocase() {
        const material = new THREE.MeshStandardMaterial({ 
            color: 0xb87333, 
            side: THREE.DoubleSide, 
            metalness: 1, 
            roughness: 0.15
        });
        
        const tiers = [
            [2.6, 0.0, 0.2], // Solid base
            [2.6, 2.4, 4.5], // Hollow
            [2.8, 2.6, 0.1], // Flange
            [2.7, 2.5, 4.2], // Hollow
            [3, 2.7, 0.1], // Flange
            [2.9, 2.7, 4.5], // Hollow
            [3, 2.7, 0.1]    // Top Flange
        ];

        let currentY = 0;

        tiers.forEach(([outR, inR, height]) => {
            
            // --- LEFT HALF ---
            const leftShape = new THREE.Shape();
            if (inR > 0) {
                leftShape.absarc(0, 0, outR, 0, Math.PI, false);      
                leftShape.lineTo(-inR, 0);                            
                leftShape.absarc(0, 0, inR, Math.PI, 0, true);        
                leftShape.lineTo(outR, 0);                            
            } else {
                leftShape.absarc(0, 0, outR, 0, Math.PI, false);
                leftShape.lineTo(0, 0);
            }

            const leftGeo = new THREE.ExtrudeGeometry(leftShape, { 
                depth: height, 
                curveSegments: 32, 
                bevelEnabled: false 
            });
            const leftMesh = new THREE.Mesh(leftGeo, material);
            leftMesh.rotation.x = -Math.PI / 2;
            leftMesh.position.y = currentY;
            this.leftHalf.add(leftMesh);


            // --- RIGHT HALF ---
            const rightShape = new THREE.Shape();
            if (inR > 0) {
                rightShape.absarc(0, 0, outR, Math.PI, Math.PI * 2, false);
                rightShape.lineTo(inR, 0);
                rightShape.absarc(0, 0, inR, Math.PI * 2, Math.PI, true);
                rightShape.lineTo(-outR, 0);
            } else {
                rightShape.absarc(0, 0, outR, Math.PI, Math.PI * 2, false);
                rightShape.lineTo(0, 0);
            }

            const rightGeo = new THREE.ExtrudeGeometry(rightShape, { 
                depth: height, 
                curveSegments: 32, 
                bevelEnabled: false
            });
            const rightMesh = new THREE.Mesh(rightGeo, material);
            rightMesh.rotation.x = -Math.PI / 2;
            rightMesh.position.y = currentY;
            this.rightHalf.add(rightMesh);

            currentY += height;
        });
    }

    open() {
        if (this.isOpen) return;
        this.isOpen = true;
        
        // 1. Rotate the FRONT half (rightHalf) 180 degrees
        gsap.to(this.rightHalf.rotation, {
            y: Math.PI, 
            duration: 1.5,
            ease: "power2.inOut"
        });

        // 2. Shrink it slightly on X and Z so it slides cleanly inside the back wall
        gsap.to(this.rightHalf.scale, {
            x: 0.98,
            z: 0.98,
            duration: 1.5,
            ease: "power2.inOut"
        });
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;

        // Rotate it back to the front
        gsap.to(this.rightHalf.rotation, { 
            y: 0, 
            duration: 1.5, 
            ease: "power2.inOut" 
        });

        // Scale it back to 100% so it seals flush again
        gsap.to(this.rightHalf.scale, { 
            x: 1, 
            z: 1, 
            duration: 1.5, 
            ease: "power2.inOut" 
        });
    }

    getGroup() {
        return this.group;
    }
}