import * as THREE from 'three';
import { RoundedBoxGeometry } from 'three/examples/jsm/geometries/RoundedBoxGeometry.js';
export default class Mixingchamber {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(-5,-4.5,0);
        //this.group.rotation.y=Math.PI/2;

        this.buildMixingchamber();
    }

    buildMixingchamber() {

        
         const plateShape = new THREE.Shape();

         plateShape.moveTo(-1.3, -1.5);
         plateShape.lineTo(1.3, -1.5);
         plateShape.lineTo(1.3, 1.5);
         plateShape.lineTo(-1.3, 1.5);
         plateShape.lineTo(-1.3, -1.5);


         // Circular hole
         for (let i = -1.1; i < 1.3; i += 0.4) 
            for (let j = -1.1; j < 1.4; j += 0.4) {
               const holePath = new THREE.Path();
                holePath.absarc(
                     i, // X position
                      j, // Y position
                     0.08, // radius
                     0,
                     Math.PI * 2,
                      false
                    );
        
         plateShape.holes.push(holePath);

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

         

        
        
    }

    getGroup() {
        return this.group;
    }
}
