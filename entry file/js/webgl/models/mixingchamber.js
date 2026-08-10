import * as THREE from 'three';

export default class Mixingchamber {
    constructor() {
        this.group = new THREE.Group();
        this.group.position.set(-1,-5.5,0);
        this.group.rotation.y=Math.PI/2;

        this.buildMixingchamber();
    }

    buildMixingchamber() {

        // Glass geometry
         const basecylindermat = new THREE.MeshStandardMaterial({color: 0xd4af37, side: THREE.DoubleSide, roughness: 0.15, metalness: 1});
         const backcylinderGeom = new THREE.CylinderGeometry(2.,2.,5.5,32,1,true,0,Math.PI);  
         const backcylinder=new THREE.Mesh(backcylinderGeom,basecylindermat);   
         this.group.add(backcylinder);
         const basecylinderGeom = new THREE.CylinderGeometry(2,2,0.3);
         const basecylinder =new THREE.Mesh(basecylinderGeom,basecylindermat);
         this.group.add(basecylinder);
         basecylinder.position.set(0.,-2.6,0);
         const topcylinder= basecylinder.clone();
         this.group.add(topcylinder);
         topcylinder.position.set(0,2.6,0);

        

        // Frame
        
    }

    getGroup() {
        return this.group;
    }
}