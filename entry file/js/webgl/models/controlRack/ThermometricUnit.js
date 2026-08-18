import { Group, Mesh, MeshStandardMaterial, BoxGeometry, CanvasTexture, PlaneGeometry, CylinderGeometry, Color, Shape, ExtrudeGeometry } from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default class ThermometricUnit {
    constructor() {
        this.group = new Group();
        this.createModel();
    }

    createModel() {
        // Safe Merge Helper
        function safeMerge(geometries) {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        }

        // --- Materials ---
        const materials = {
            chassis: new MeshStandardMaterial({ color: 0xe2e6e1, roughness: 0.3, metalness: 0.1 }),
            bezelFace: new MeshStandardMaterial({ color: 0xb0b4ae, roughness: 0.5 }),
            plateBackground: new MeshStandardMaterial({ color: 0xdcdfdc, roughness: 0.4 }),
            buttonGrayLight: new MeshStandardMaterial({ color: 0xe8ebe7, roughness: 0.45, metalness: 0.05 }),
            buttonGrayDark: new MeshStandardMaterial({ color: 0x2d3a4a, roughness: 0.5, metalness: 0.1 }),
            buttonBlue: new MeshStandardMaterial({ color: 0x7da8d6, roughness: 0.45, metalness: 0.05 }),
            buttonRed: new MeshStandardMaterial({ color: 0xd9533f, roughness: 0.45, metalness: 0.05 }),
            buttonHousing: new MeshStandardMaterial({ color: 0x737772, roughness: 0.6 }),
            ledGreenOn: new MeshStandardMaterial({ color: 0x55ff55, roughness: 0.2, emissive: 0x44d444 }),
            ledGreenOff: new MeshStandardMaterial({ color: 0x114411, roughness: 0.5 }),
            ledAmberOn: new MeshStandardMaterial({ color: 0xffaa33, roughness: 0.2, emissive: 0xcc7711 }),
            ledAmberOff: new MeshStandardMaterial({ color: 0x442200, roughness: 0.5 }),
            rearPanel: new MeshStandardMaterial({ color: 0xc8ccc7, roughness: 0.4, metalness: 0.3 }),
            metalGold: new MeshStandardMaterial({ color: 0xcfa63c, roughness: 0.2, metalness: 0.85 }),
            metalSilver: new MeshStandardMaterial({ color: 0xcccccc, roughness: 0.15, metalness: 0.9 }),
            blackPlastic: new MeshStandardMaterial({ color: 0x181818, roughness: 0.6 })
        };

        // Geometry Buckets
        const chassisGeoms = [];
        const plateGeoms = [];
        const housingGeoms = [];
        const btnBlueGeoms = [];
        const btnGrayLightGeoms = [];
        const btnGrayDarkGeoms = [];
        const btnRedGeoms = [];
        const ledGreenOnGeoms = [];
        const ledGreenOffGeoms = [];
        const ledAmberOnGeoms = [];
        const ledAmberOffGeoms = [];
        const silverGeoms = [];
        const goldGeoms = [];
        const blackPlasticGeoms = [];

        const width = 32;
        const height = 8;
        const depth = 24;
        const frontZ = depth / 2 + 0.02;

        // 1. Main Chassis & Front Frame
        const mainBody = new BoxGeometry(width, height, depth);
        chassisGeoms.push(mainBody);

        const bezel = new BoxGeometry(width + 0.4, height + 0.4, 0.4);
        bezel.translate(0, 0, frontZ);
        chassisGeoms.push(bezel);

        const face = new BoxGeometry(width - 0.4, height - 0.4, 0.1);
        face.translate(0, 0, frontZ + 0.2);
        this.group.add(new Mesh(face, materials.bezelFace));

        // 2. Graphic LCD Screen
        const canvasText = document.createElement('canvas');
        canvasText.width = 1024;
        canvasText.height = 512;
        const ctx = canvasText.getContext('2d');
        ctx.fillStyle = '#010812';
        ctx.fillRect(0, 0, 1024, 512);

        ctx.fillStyle = '#66ccff';
        ctx.font = 'bold 74px monospace';
        ctx.fillText('98.837 kΩ', 140, 200);

        ctx.font = '36px monospace';
        ctx.fillText('1 Sample Space       99.135 kΩ Max', 60, 100);
        ctx.fillText('Sample->A  19.8581 mK  1 Range        200 kΩ', 60, 320);
        ctx.fillText('Setpoint   20.0000 mK    Excitation   316 pA', 60, 390);
        ctx.fillText('Heat 6.22 % of 31.6µA  Power        9.86 fW', 60, 460);

        const screenTexture = new CanvasTexture(canvasText);
        const screenMat = new MeshStandardMaterial({
            map: screenTexture,
            emissiveMap: screenTexture,
            emissive: new Color(0x444444),
            roughness: 0.05
        });

        const screen = new Mesh(new PlaneGeometry(12, 5.0), screenMat);
        screen.position.set(-9.25, 0, frontZ + 0.26);
        this.group.add(screen);

        // 3. Shape Profiles & Generators
        const createRoundedRectShape = (w, h, r) => {
            const shape = new Shape();
            shape.moveTo(-w / 2 + r, -h / 2);
            shape.lineTo(w / 2 - r, -h / 2);
            shape.quadraticCurveTo(w / 2, -h / 2, w / 2, -h / 2 + r);
            shape.lineTo(w / 2, h / 2 - r);
            shape.quadraticCurveTo(w / 2, h / 2, w / 2 - r, h / 2);
            shape.lineTo(-w / 2 + r, h / 2);
            shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - r);
            shape.lineTo(-w / 2, -h / 2 + r);
            shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2 + r, -h / 2);
            return shape;
        };

        const createArrowShape = (w, h, isUp) => {
            const shape = new Shape();
            if (isUp) {
                shape.moveTo(0, h / 2);
                shape.quadraticCurveTo(w / 2, h / 4, w / 2, -h / 2 + 0.1);
                shape.quadraticCurveTo(w / 2, -h / 2, w / 2 - 0.1, -h / 2);
                shape.lineTo(-w / 2 + 0.1, -h / 2);
                shape.quadraticCurveTo(-w / 2, -h / 2, -w / 2, -h / 2 + 0.1);
                shape.quadraticCurveTo(-w / 2, h / 4, 0, h / 2);
            } else {
                shape.moveTo(0, -h / 2);
                shape.quadraticCurveTo(w / 2, -h / 4, w / 2, h / 2 - 0.1);
                shape.quadraticCurveTo(w / 2, h / 2, w / 2 - 0.1, h / 2);
                shape.lineTo(-w / 2 + 0.1, h / 2);
                shape.quadraticCurveTo(-w / 2, h / 2, -w / 2, h / 2 - 0.1);
                shape.quadraticCurveTo(-w / 2, -h / 4, 0, -h / 2);
            }
            return shape;
        };

        const extrudeOptions = { depth: 0.12, bevelEnabled: true, bevelThickness: 0.04, bevelSize: 0.03, bevelSegments: 3, steps: 1 };
        const housingOptions = { depth: 0.04, bevelEnabled: false };

        const collectButton = (x, y, shape, targetBucket) => {
            const housingGeo = new ExtrudeGeometry(shape, housingOptions);
            housingGeo.translate(x, y, frontZ + 0.25);
            housingGeoms.push(housingGeo);

            const capGeo = new ExtrudeGeometry(shape, extrudeOptions);
            capGeo.translate(x, y, frontZ + 0.28);
            targetBucket.push(capGeo);
        };

        const collectLED = (x, y, targetBucket) => {
            const ledGeo = new BoxGeometry(0.18, 0.18, 0.08);
            ledGeo.translate(x, y, frontZ + 0.27);
            targetBucket.push(ledGeo);
        };

        // 4. Sub-panel Plates
        const leftPlateGeo = new ExtrudeGeometry(createRoundedRectShape(5.4, 5.0, 0.2), housingOptions);
        leftPlateGeo.translate(0.4, 0, frontZ + 0.22);
        plateGeoms.push(leftPlateGeo);

        const midPlateGeo = new ExtrudeGeometry(createRoundedRectShape(3.4, 5.0, 0.2), housingOptions);
        midPlateGeo.translate(5.2, 0, frontZ + 0.22);
        plateGeoms.push(midPlateGeo);

        // 5. Controls - Left Block
        const standardPadShape = createRoundedRectShape(0.9, 0.7, 0.15);
        const arrowShapeUp = createArrowShape(0.7, 0.6, true);
        const arrowShapeDown = createArrowShape(0.7, 0.6, false);

        for (let i = 0; i < 4; i++) {
            const x = 0.4 - 2.1 + (i * 1.4);
            collectButton(x, 1.2, standardPadShape, btnBlueGeoms);
            collectLED(x, 1.8, i === 2 ? ledGreenOnGeoms : ledGreenOffGeoms);
            collectButton(x, 0.1, arrowShapeUp, btnBlueGeoms);
            collectButton(x, -1.1, arrowShapeDown, btnBlueGeoms);
        }

        // 6. Controls - Middle Block
        collectButton(5.2 - 0.8, 1.2, standardPadShape, btnBlueGeoms);
        collectLED(5.2 - 0.8, 1.8, ledAmberOnGeoms);

        collectButton(5.2 + 0.8, 1.2, standardPadShape, btnBlueGeoms);
        collectLED(5.2 + 0.8, 1.8, ledAmberOffGeoms);

        const setpointShape = createRoundedRectShape(2.7, 0.6, 0.15);
        collectButton(5.2, 0.1, setpointShape, btnBlueGeoms);

        collectButton(5.2 - 0.8, -1.0, standardPadShape, btnBlueGeoms);
        collectButton(5.2 + 0.8, -1.0, standardPadShape, btnBlueGeoms);

        const allOffShape = createRoundedRectShape(1.8, 0.5, 0.12);
        collectButton(5.2, -2.0, allOffShape, btnRedGeoms);

        // 7. Controls - Right Keypad & Command Block
        const numKeyShape = createRoundedRectShape(0.9, 0.55, 0.25);
        for (let row = 0; row < 4; row++) {
            for (let col = 0; col < 3; col++) {
                const x = 11.2 - 2.2 + (col * 1.3);
                const y = 1.6 - (row * 1.1);
                collectButton(x, y, numKeyShape, btnGrayLightGeoms);
            }
        }

        const cmdKeyShape = createRoundedRectShape(1.1, 0.8, 0.2);
        collectButton(11.2 + 1.6, 1.6, cmdKeyShape, btnGrayDarkGeoms);
        collectButton(11.2 + 1.6, 0.7, arrowShapeUp, btnBlueGeoms);
        collectButton(11.2 + 1.6, -0.4, arrowShapeDown, btnBlueGeoms);
        collectButton(11.2 + 1.6, -1.5, cmdKeyShape, btnGrayDarkGeoms);

        const statusLEDsX = 11.2 + 3.1;
        collectLED(statusLEDsX, 1.8, ledGreenOnGeoms);
        collectLED(statusLEDsX, 1.1, ledGreenOffGeoms);
        collectLED(statusLEDsX, 0.4, ledAmberOffGeoms);
        collectLED(statusLEDsX, -0.3, ledGreenOffGeoms);

        // 8. Feet / Leg Stands
        [-width / 2 + 3, width / 2 - 3].forEach(x => {
            const frontLeg = new CylinderGeometry(0.3, 0.4, 1.8, 16);
            frontLeg.translate(x, -height / 2 - 0.6, depth / 2 - 2);
            blackPlasticGeoms.push(frontLeg);

            const rearLeg = new CylinderGeometry(0.3, 0.4, 0.72, 16);
            rearLeg.translate(x, -height / 2 - 0.2, -depth / 2 + 2);
            blackPlasticGeoms.push(rearLeg);
        });

        // 9. Rear Hardware Panel
        const rearZ = -depth / 2 - 0.02;

        const rearFace = new BoxGeometry(width - 0.4, height - 0.4, 0.1);
        rearFace.rotateY(Math.PI);
        rearFace.translate(0, 0, rearZ);
        this.group.add(new Mesh(rearFace, materials.rearPanel));

        // DIN Inputs
        [-11, -8, -4].forEach(x => {
            const din = new CylinderGeometry(0.65, 0.65, 0.25, 24);
            din.rotateX(Math.PI / 2);
            din.translate(x, -1, rearZ - 0.12);
            silverGeoms.push(din);
        });

        // BNC Connectors
        [-1, 2].forEach(x => {
            const outer = new CylinderGeometry(0.35, 0.35, 0.5, 24);
            outer.rotateX(Math.PI / 2);
            outer.translate(x, -1, rearZ - 0.25);
            silverGeoms.push(outer);

            const inner = new CylinderGeometry(0.12, 0.12, 0.6, 12);
            inner.rotateX(Math.PI / 2);
            inner.translate(x, -1, rearZ - 0.25);
            goldGeoms.push(inner);
        });

        // Terminal Strips
        const collectTerminal = (x, y, pins) => {
            const block = new BoxGeometry(pins * 0.45, 0.5, 0.4);
            block.translate(x, y, rearZ - 0.2);
            blackPlasticGeoms.push(block);
        };
        collectTerminal(6, -1, 6);
        collectTerminal(10, -1, 4);

        // Ethernet
        const eth = new BoxGeometry(0.8, 0.8, 0.35);
        eth.translate(13, -1, rearZ - 0.15);
        silverGeoms.push(eth);

        // D-Sub Ports
        const collectDSub = (x, y, wSize) => {
            const shell = new BoxGeometry(wSize, 0.5, 0.25);
            shell.translate(x, y, rearZ - 0.12);
            silverGeoms.push(shell);

            const inner = new BoxGeometry(wSize - 0.3, 0.25, 0.3);
            inner.translate(x, y, rearZ - 0.14);
            blackPlasticGeoms.push(inner);
        };
        collectDSub(10, 2, 3.4);
        collectDSub(-10, 2, 2.0);

        // Power Socket
        const powerModule = new BoxGeometry(2.8, 1.6, 0.4);
        powerModule.translate(13, 2, rearZ - 0.2);
        blackPlasticGeoms.push(powerModule);

        // 10. Execute Merges
        const mergedChassis = safeMerge(chassisGeoms);
        if (mergedChassis) {
            const m = new Mesh(mergedChassis, materials.chassis);
            m.castShadow = true;
            m.receiveShadow = true;
            this.group.add(m);
        }

        const mergedPlate = safeMerge(plateGeoms);
        if (mergedPlate) this.group.add(new Mesh(mergedPlate, materials.plateBackground));

        const mergedHousing = safeMerge(housingGeoms);
        if (mergedHousing) this.group.add(new Mesh(mergedHousing, materials.buttonHousing));

        const mergedBlueBtn = safeMerge(btnBlueGeoms);
        if (mergedBlueBtn) this.group.add(new Mesh(mergedBlueBtn, materials.buttonBlue));

        const mergedLightBtn = safeMerge(btnGrayLightGeoms);
        if (mergedLightBtn) this.group.add(new Mesh(mergedLightBtn, materials.buttonGrayLight));

        const mergedDarkBtn = safeMerge(btnGrayDarkGeoms);
        if (mergedDarkBtn) this.group.add(new Mesh(mergedDarkBtn, materials.buttonGrayDark));

        const mergedRedBtn = safeMerge(btnRedGeoms);
        if (mergedRedBtn) this.group.add(new Mesh(mergedRedBtn, materials.buttonRed));

        const mergedGreenOn = safeMerge(ledGreenOnGeoms);
        if (mergedGreenOn) this.group.add(new Mesh(mergedGreenOn, materials.ledGreenOn));

        const mergedGreenOff = safeMerge(ledGreenOffGeoms);
        if (mergedGreenOff) this.group.add(new Mesh(mergedGreenOff, materials.ledGreenOff));

        const mergedAmberOn = safeMerge(ledAmberOnGeoms);
        if (mergedAmberOn) this.group.add(new Mesh(mergedAmberOn, materials.ledAmberOn));

        const mergedAmberOff = safeMerge(ledAmberOffGeoms);
        if (mergedAmberOff) this.group.add(new Mesh(mergedAmberOff, materials.ledAmberOff));

        const mergedSilver = safeMerge(silverGeoms);
        if (mergedSilver) this.group.add(new Mesh(mergedSilver, materials.metalSilver));

        const mergedGold = safeMerge(goldGeoms);
        if (mergedGold) this.group.add(new Mesh(mergedGold, materials.metalGold));

        const mergedBlack = safeMerge(blackPlasticGeoms);
        if (mergedBlack) this.group.add(new Mesh(mergedBlack, materials.blackPlastic));
    }

    getGroup() {
        return this.group;
    }
}