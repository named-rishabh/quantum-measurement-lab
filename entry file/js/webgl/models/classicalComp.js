import * as THREE from 'three';

export default class classicalComputer {

    constructor() {
        // The main group requested
        this.group = new THREE.Group();
        this.group.scale.set(2.5,2.3,2.5);
        this.group.position.set(10,-8,5);
        
        // Basic materials for visual distinction (you can swap these out later)
        this.matBody = new THREE.MeshStandardMaterial({ color: 0xccc4c4 });
        this.matDark = new THREE.MeshStandardMaterial({ color: 0x333333 });
        this.matScreen = new THREE.MeshStandardMaterial({ color: 0x111111 });
        this.matMetal = new THREE.MeshStandardMaterial({ color: 0x949393, metalness: 1, roughness: 0.15 });

        this.buildCabinet();
        this.buildCasters();
        this.buildFrontPanels();
        this.buildMonitorAssembly();
    }

    buildCabinet() {
        // Main cabinet body
        const bodyGeo = new THREE.BoxGeometry(2, 2.6, 1.8);
        const body = new THREE.Mesh(bodyGeo, this.matBody);
        body.position.y = 1.3; // Sit on top of casters
        this.group.add(body);

        // Top desk/counter surface (slightly wider than the cabinet)
        const topGeo = new THREE.BoxGeometry(2.1, 0.1, 1.9);
        const topSurface = new THREE.Mesh(topGeo, this.matBody);
        topSurface.position.y = 2.65;
        this.group.add(topSurface);
    }

    buildCasters() {
        const casterGeo = new THREE.CylinderGeometry(0.15, 0.15, 0.1, 16);
        // Rotate to roll forward/backward
        casterGeo.rotateZ(Math.PI / 2);

        // Positions for the 4 corners
        const positions = [
            [-0.8, 0.15,  0.7],
            [ 0.8, 0.15,  0.7],
            [-0.8, 0.15, -0.7],
            [ 0.8, 0.15, -0.7]
        ];

        positions.forEach(pos => {
            const caster = new THREE.Mesh(casterGeo, this.matDark);
            caster.position.set(...pos);
            this.group.add(caster);
            
            // Add a small bracket connecting the wheel to the cabinet
            const bracketGeo = new THREE.BoxGeometry(0.1, 0.15, 0.15);
            const bracket = new THREE.Mesh(bracketGeo, this.matMetal);
            bracket.position.set(pos[0], pos[1] + 0.1, pos[2]);
            this.group.add(bracket);
        });
    }

    buildFrontPanels() {
        // Lower Cabinet Door
        const doorGeo = new THREE.BoxGeometry(1.8, 1.5, 0.05);
        const door = new THREE.Mesh(doorGeo, this.matBody);
        door.position.set(0, 1.1, 0.925);
        this.group.add(door);

        // Door Handle
        const handleGeo = new THREE.BoxGeometry(0.2, 0.05, 0.1);
        const handle = new THREE.Mesh(handleGeo, this.matMetal);
        handle.position.set(-0.7, 1.1, 0.98);
        this.group.add(handle);

        // Middle Angled Tray / Indent
        const trayGeo = new THREE.BoxGeometry(1.8, 0.3, 0.2);
        const tray = new THREE.Mesh(trayGeo, this.matDark);
        tray.position.set(0, 2.0, 0.85);
        tray.rotation.x = Math.PI / 8; // Slight angle
        this.group.add(tray);

        // Upper Control Interface
        const controlGeo = new THREE.BoxGeometry(1.8, 0.4, 0.05);
        const controlPanel = new THREE.Mesh(controlGeo, this.matBody);
        controlPanel.position.set(0, 2.35, 0.925);
        this.group.add(controlPanel);

        // Small LCD Screen on Upper Control
        const lcdGeo = new THREE.BoxGeometry(0.6, 0.25, 0.06);
        const lcd = new THREE.Mesh(lcdGeo, this.matScreen);
        lcd.position.set(-0.4, 2.35, 0.93);
        this.group.add(lcd);
    }

    buildMonitorAssembly() {
        // Monitor Stand Base
        const standBaseGeo = new THREE.BoxGeometry(0.6, 0.05, 0.4);
        const standBase = new THREE.Mesh(standBaseGeo, this.matMetal);
        standBase.position.set(0, 2.725, 0);
        this.group.add(standBase);

        // Monitor Stand Neck
        const neckGeo = new THREE.CylinderGeometry(0.1, 0.15, 0.8, 16);
        const neck = new THREE.Mesh(neckGeo, this.matMetal);
        neck.position.set(0, 3.1, 0);
        this.group.add(neck);

        // Monitor / Top Panel (The dotted panel from 1000089175.jpg)
        const monitorGeo = new THREE.BoxGeometry(1.8, 1.5, 0.15);
        const monitor = new THREE.Mesh(monitorGeo, this.matBody);
        monitor.position.set(0, 3.9, 0.1);
        this.group.add(monitor);

        // Monitor Frame/Bezel
        const bezelGeo = new THREE.BoxGeometry(1.85, 1.55, 0.1);
        const bezel = new THREE.Mesh(bezelGeo, this.matDark);
        bezel.position.set(0, 3.9, 0.08);
        this.group.add(bezel);

        // Add a few cylindrical details to mimic the pattern on the back/front of the panel
        const dotGeo = new THREE.CylinderGeometry(0.04, 0.04, 0.18, 8);
        dotGeo.rotateX(Math.PI / 2);
        
        // Randomly place a few dots to simulate the patch-holes/buttons on the screen
        const dotPositions = [
            [-0.5, 4.2], [0.2, 4.3], [0.6, 4.1], [-0.3, 3.8], 
            [0.4, 3.6], [-0.6, 3.4], [0.5, 3.4], [0, 4.0]
        ];

        dotPositions.forEach(pos => {
            const dot = new THREE.Mesh(dotGeo, this.matDark);
            dot.position.set(pos[0], pos[1], 0.1);
            this.group.add(dot);
        });
    }
    getGroup(){
        return this.group;
    }
}