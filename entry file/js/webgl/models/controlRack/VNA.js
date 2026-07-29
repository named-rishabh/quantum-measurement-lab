import { 
    Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, BoxGeometry, 
    CylinderGeometry, PlaneGeometry, CanvasTexture, MeshPhysicalMaterial, 
    SphereGeometry, SRGBColorSpace, AdditiveBlending, ExtrudeGeometry, 
    Shape, InstancedMesh, Object3D 
} from "three";

// =====================================================================
// OPTIMIZATION: Global Materials Cache
// =====================================================================
const MATS = {
    body: new MeshStandardMaterial({ color: 0xf5f7fa, metalness: 0.9, roughness: 0.12, clearcoat: 1.0, clearcoatRoughness: 0.05 }),
    frontPanel: new MeshStandardMaterial({ color: 0xf5f7fa, metalness: 0.3, roughness: 0.2 }),
    foot: new MeshStandardMaterial({ color: 0x8a8a8a, metalness: 0.9, roughness: 0.35 }),
    screenFrame: new MeshStandardMaterial({ color: 0x2e5ea8, metalness: 0.25, roughness: 0.08 }),
    screenGlass: new MeshPhysicalMaterial({ color: 0xffffff, transparent: true, opacity: 0.07, roughness: 0.03, metalness: 0, clearcoat: 1, clearcoatRoughness: 0.03, reflectivity: 1 }),
    silverPanel: new MeshStandardMaterial({ color: 0xd7d9dc, metalness: 0.95, roughness: 0.18 }),
    blue: new MeshStandardMaterial({ color: 0x2e5ea8, metalness: 0.65, roughness: 0.32 }),
    grip: new MeshStandardMaterial({ color: 0xe8e8e8, metalness: 0.2, roughness: 0.6 }),
    vent: new MeshStandardMaterial({ color: 0xf5f7fa }),
    highlight: new MeshStandardMaterial({ color: 0xf5f7fa, metalness: 0.5, roughness: 0.5 }),
    btnStandard: new MeshStandardMaterial({ color: 0x2e2e2e, metalness: 0.2, roughness: 0.35 }),
    btnOrange: new MeshStandardMaterial({ color: 0xe66a00, metalness: 0.1, roughness: 0.4 }),
    btnTeal: new MeshStandardMaterial({ color: 0x00a896, metalness: 0.1, roughness: 0.4 }),
    socket: new MeshStandardMaterial({ color: 0x121212, roughness: 0.9 }),
    knob: new MeshStandardMaterial({ color: 0x1a1a1a, metalness: 0.5, roughness: 0.4 }),
    portGold: new MeshStandardMaterial({ color: 0xd5b24a, metalness: 1, roughness: 0.12 }),
    portMetal: new MeshStandardMaterial({ color: 0xfffff2, metalness: 0.1, roughness: 0.5 }),
    insulator: new MeshStandardMaterial({ color: 0xf2ead9, metalness: 0.1, roughness: 0.6 }),
    pin: new MeshStandardMaterial({ color: 0xffd76a, metalness: 1, roughness: 0.15 }),
    usb: new MeshStandardMaterial({ color: 0xd9d9d9, metalness: 1, roughness: 0.15 }),
    led: new MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 3 }),
    backFace: new MeshStandardMaterial({ color: 0x181818, roughness: 0.45, metalness: 0.6 }),
    screw: new MeshStandardMaterial({ color: 0xc8c8c8, metalness: 0.9, roughness: 0.2 }),
    powerHousing: new MeshStandardMaterial({ color: 0x0a0a0a, roughness: 0.7 }),
    switchBase: new MeshStandardMaterial({ color: 0x222222, roughness: 0.5 }),
    switchRocker: new MeshStandardMaterial({ color: 0x050505, roughness: 0.3 }),
    iecSocket: new MeshStandardMaterial({ color: 0x111111, roughness: 0.8 }),
    driveBay: new MeshStandardMaterial({ color: 0x2b2b2b, metalness: 0.8, roughness: 0.3 }),
    bluePort: new MeshStandardMaterial({ color: 0x0055aa, roughness: 0.4 }),
    genericMetal: new MeshStandardMaterial({ color: 0xffffff, metalness: 0.1, roughness: 0.5 })
};

// =====================================================================
// OPTIMIZATION: Global Geometry Cache
// =====================================================================
const BUTTON_DEPTH = 0.035;
const BUTTON_BEVEL = 0.006;

function createRoundedRectShape(w, h, r) {
    const shape = new Shape();
    const x = -w / 2, y = -h / 2;
    shape.moveTo(x, y + r);
    shape.lineTo(x, y + h - r);
    shape.quadraticCurveTo(x, y + h, x + r, y + h);
    shape.lineTo(x + w - r, y + h);
    shape.quadraticCurveTo(x + w, y + h, x + w, y + h - r);
    shape.lineTo(x + w, y + r);
    shape.quadraticCurveTo(x + w, y, x + w - r, y);
    shape.lineTo(x + r, y);
    shape.quadraticCurveTo(x, y, x, y + r);
    return shape;
}

const btnShape = createRoundedRectShape(0.14 - BUTTON_BEVEL * 2, 0.11 - BUTTON_BEVEL * 2, 0.015);
const btnGeo = new ExtrudeGeometry(btnShape, {
    steps: 1, depth: BUTTON_DEPTH, bevelEnabled: true,
    bevelThickness: BUTTON_BEVEL, bevelSize: BUTTON_BEVEL, bevelSegments: 4
});
btnGeo.center();

const GEOS = {
    foot: new CylinderGeometry(0.22, 0.26, 0.22, 40),
    vent: new BoxGeometry(0.03, 0.05, 0.06),
    button: btnGeo,
    socket: new BoxGeometry(0.14 + 0.008, 0.11 + 0.008, 0.002),
    led: new SphereGeometry(0.018, 12, 12),
    rfFlange: new CylinderGeometry(0.075, 0.075, 0.03, 32).rotateX(Math.PI / 2),
    rfNut: new CylinderGeometry(0.058, 0.058, 0.06, 6).rotateX(Math.PI / 2).rotateZ(Math.PI / 6),
    rfInsulator: new CylinderGeometry(0.032, 0.032, 0.02, 32).rotateX(Math.PI / 2),
    rfPin: new CylinderGeometry(0.011, 0.011, 0.05, 20).rotateX(Math.PI / 2),
    screw: new CylinderGeometry(0.025, 0.025, 0.01, 12).rotateX(Math.PI / 2),
    bncBase: new CylinderGeometry(0.045, 0.045, 0.04, 16).rotateX(Math.PI / 2),
    bncInput: new CylinderGeometry(0.04, 0.04, 0.05, 16).rotateX(Math.PI / 2),
    groundTerminal: new CylinderGeometry(0.03, 0.03, 0.04, 12).rotateX(Math.PI / 2)
};

const dummy = new Object3D(); // Helper for InstancedMesh transformations

export default class VNA {
    constructor() {
        this.group = new Group();
        this.createModel();
    }

    createModel() {
        this.group.position.y = 0.25;

        const body = new Mesh(new BoxGeometry(5, 2.1, 2.4), MATS.body);
        body.castShadow = true;
        body.receiveShadow = true;

        // ---- Surface z-reference constants ------------------------------------
        const FRONT_PANEL_DEPTH = 0.08;
        const FRONT_PANEL_Z = 1.17;
        const PANEL_FACE_Z = FRONT_PANEL_Z + FRONT_PANEL_DEPTH / 2;

        const frontPanel = new Mesh(new BoxGeometry(4.95, 2, FRONT_PANEL_DEPTH), MATS.frontPanel);
        frontPanel.position.z = FRONT_PANEL_Z;

        // ---- Feet (Optimized with InstancedMesh) ------------------------------
        const footPositions = [ [-2.15, 0.95], [2.15, 0.95], [-2.15, -0.95], [2.15, -0.95] ];
        const feetInst = new InstancedMesh(GEOS.foot, MATS.foot, 4);
        footPositions.forEach(([x, z], i) => {
            dummy.position.set(x, -1.18, z);
            dummy.updateMatrix();
            feetInst.setMatrixAt(i, dummy.matrix);
        });
        this.group.add(feetInst);

        // =====================================================================
        // DISPLAY SCREEN
        // =====================================================================
        const SCREEN_FRAME_DEPTH = 0.05;
        const screenFrame = new Mesh(new BoxGeometry(2.75, 1.35, SCREEN_FRAME_DEPTH), MATS.screenFrame);
        screenFrame.position.set(-0.72, 0.25, PANEL_FACE_Z + SCREEN_FRAME_DEPTH / 2);

        const SCREEN_FRAME_FACE_Z = PANEL_FACE_Z + SCREEN_FRAME_DEPTH;

        function createScreenTexture() {
            const canvas = document.createElement('canvas');
            canvas.width = 1024; canvas.height = 460;
            const ctx = canvas.getContext('2d');
            ctx.fillStyle = '#0a1f14';
            ctx.fillRect(0, 0, canvas.width, canvas.height);
            ctx.strokeStyle = 'rgba(255,255,255,0.18)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.moveTo(canvas.width / 2, 0); ctx.lineTo(canvas.width / 2, canvas.height);
            ctx.moveTo(0, canvas.height / 2); ctx.lineTo(canvas.width, canvas.height / 2);
            ctx.stroke();
            ctx.strokeStyle = 'rgba(70,160,100,0.35)';
            ctx.lineWidth = 1;
            for (let x = 0; x < canvas.width; x += canvas.width / 20) {
                ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
            }
            for (let y = 0; y < canvas.height; y += canvas.height / 12) {
                ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
            }
            const tex = new CanvasTexture(canvas);
            tex.colorSpace = SRGBColorSpace;
            return tex;
        }

        const screenTexture = createScreenTexture();
        const screen = new Mesh(
            new PlaneGeometry(2.55, 1.15),
            new MeshStandardMaterial({
                map: screenTexture, emissive: 0xffffff, emissiveMap: screenTexture,
                emissiveIntensity: 1.5, color: 0x111111, roughness: 0.35, metalness: 0
            })
        );
        screen.position.set(-0.72, 0.25, SCREEN_FRAME_FACE_Z + 0.002);

        const screenGlass = new Mesh(new PlaneGeometry(2.55, 1.15), MATS.screenGlass);
        screenGlass.position.set(-0.72, 0.25, SCREEN_FRAME_FACE_Z + 0.006);

        function createGlareTexture() {
            const c = document.createElement('canvas');
            c.width = 512; c.height = 512;
            const ctx = c.getContext('2d');
            const grad = ctx.createLinearGradient(0, 0, c.width, c.height);
            grad.addColorStop(0.00, 'rgba(255,255,255,0)');
            grad.addColorStop(0.42, 'rgba(255,255,255,0)');
            grad.addColorStop(0.50, 'rgba(255,255,255,0.4)');
            grad.addColorStop(0.58, 'rgba(255,255,255,0)');
            grad.addColorStop(1.00, 'rgba(255,255,255,0)');
            ctx.fillStyle = grad; ctx.fillRect(0, 0, c.width, c.height);
            return new CanvasTexture(c);
        }

        const glare = new Mesh(
            new PlaneGeometry(2.55, 1.15),
            new MeshBasicMaterial({
                map: createGlareTexture(), transparent: true, opacity: 0.55,
                blending: AdditiveBlending, depthWrite: false
            })
        );
        glare.position.set(-0.72, 0.25, SCREEN_FRAME_FACE_Z + 0.008);

        // =====================================================================
        // LOWER SILVER PANEL
        // =====================================================================
        const SILVER_PANEL_DEPTH = 0.04;
        const silverPanel = new Mesh(new BoxGeometry(4.95, 0.42, SILVER_PANEL_DEPTH), MATS.silverPanel);
        silverPanel.position.set(0, -0.79, PANEL_FACE_Z + SILVER_PANEL_DEPTH / 2);
        const SILVER_PANEL_FACE_Z = PANEL_FACE_Z + SILVER_PANEL_DEPTH;

        // =====================================================================
        // BLUE SIDE HANDLES
        // =====================================================================
        function makeHandle(side, group) {
            const handle = new Group();
            const outer = new Mesh(new BoxGeometry(0.32, 2.25, 0.28), MATS.blue);
            outer.position.x = side * 2.72;
            const top = new Mesh(new BoxGeometry(0.55, 0.25, 0.85), MATS.blue);
            top.position.set(side * 2.56, 1.0, 0);
            const bottom = top.clone();
            bottom.position.y = -1.0;
            const grip = new Mesh(new BoxGeometry(0.12, 1.35, 0.18), MATS.grip);
            grip.position.set(side * 2.63, 0, 0.05);
            handle.add(outer, top, bottom, grip);
            group.add(handle);
        }
        makeHandle(-1, this.group);
        makeHandle(1, this.group);

        // =====================================================================
        // SIDE VENTILATION (Optimized with InstancedMesh -> 1 draw call vs 476)
        // =====================================================================
        const rows = 14; const cols = 17; // derived from your loops
        const ventInst = new InstancedMesh(GEOS.vent, MATS.vent, rows * cols * 2);
        let ventIdx = 0;
        
        for (let i = 0; i < rows; i++) {
            const y = -0.65 + i * 0.10;
            for (let j = 0; j < cols; j++) {
                const z = -0.80 + j * 0.10;
                dummy.position.set(-2.47, y, z);
                dummy.updateMatrix();
                ventInst.setMatrixAt(ventIdx++, dummy.matrix);

                dummy.position.set(2.47, y, z);
                dummy.updateMatrix();
                ventInst.setMatrixAt(ventIdx++, dummy.matrix);
            }
        }
        this.group.add(ventInst);

        // =====================================================================
        // TOP HIGHLIGHT
        // =====================================================================
        const highlight = new Mesh(new BoxGeometry(4.85, 0.02, 2.28), MATS.highlight);
        highlight.position.y = 1.06;

        // =====================================================================
        // BUTTONS (Optimized with InstancedMesh)
        // =====================================================================
        const BUTTON_Z = PANEL_FACE_Z + BUTTON_DEPTH;
        const posStandard = [], posOrange = [], posTeal = [], posSocket = [];

        function addBtnLoc(x, y, targetArr) {
            targetArr.push({x, y});
            posSocket.push({x, y});
        }

        // Top-left blocks
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 3; c++) {
                addBtnLoc(0.95 + c * 0.17, 0.60 - r * 0.14, posStandard);
                addBtnLoc(1.50 + c * 0.17, 0.60 - r * 0.14, posStandard);
            }
        }
        // Top-right block (mixed colors)
        addBtnLoc(2.05, 0.60, posStandard);
        addBtnLoc(2.22, 0.60, posStandard);
        addBtnLoc(2.05, 0.46, posOrange);
        addBtnLoc(2.22, 0.46, posTeal);

        // Middle blocks
        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 3; c++) { addBtnLoc(0.95 + c * 0.17, 0.25 - r * 0.14, posStandard); }
            addBtnLoc(1.48, 0.25 - r * 0.14, posStandard);
        }

        // Lower blocks
        addBtnLoc(0.95, -0.40, posStandard);
        addBtnLoc(1.30, -0.40, posStandard);
        addBtnLoc(1.48, -0.32, posStandard);
        addBtnLoc(1.48, -0.48, posStandard);
        addBtnLoc(1.66, -0.40, posStandard);

        // Generate Socket Base Plates
        const socketInst = new InstancedMesh(GEOS.socket, MATS.socket, posSocket.length);
        posSocket.forEach((pos, i) => {
            dummy.position.set(pos.x, pos.y, PANEL_FACE_Z + 0.001);
            dummy.updateMatrix();
            socketInst.setMatrixAt(i, dummy.matrix);
        });
        this.group.add(socketInst);

        // Generate Button Caps
        const buildButtons = (positions, mat) => {
            if (!positions.length) return;
            const inst = new InstancedMesh(GEOS.button, mat, positions.length);
            inst.castShadow = true; inst.receiveShadow = true;
            positions.forEach((pos, i) => {
                dummy.position.set(pos.x, pos.y, BUTTON_Z);
                dummy.updateMatrix();
                inst.setMatrixAt(i, dummy.matrix);
            });
            this.group.add(inst);
        };
        buildButtons(posStandard, MATS.btnStandard);
        buildButtons(posOrange, MATS.btnOrange);
        buildButtons(posTeal, MATS.btnTeal);

        // Rotary Knob
        const knobRadius = 0.2, knobHeight = 0.06;
        const knobGeo = new CylinderGeometry(knobRadius, knobRadius, knobHeight, 64).rotateX(Math.PI / 2);
        const rotaryKnob = new Mesh(knobGeo, MATS.knob);
        rotaryKnob.position.set(1.95, 0.04, PANEL_FACE_Z + knobHeight / 2);
        rotaryKnob.castShadow = true;
        this.group.add(rotaryKnob);

        // =====================================================================
        // FOUR RF PORTS (Optimized with InstancedMesh)
        // =====================================================================
        const RF_FLANGE_DEPTH = 0.03, RF_NUT_DEPTH = 0.06, RF_INSULATOR_DEPTH = 0.02, RF_PIN_DEPTH = 0.05;
        const rfXPos = [-1.60, -0.50, 0.60, 1.70];
        
        const rfFlangeInst = new InstancedMesh(GEOS.rfFlange, MATS.portGold, 4);
        const rfNutInst = new InstancedMesh(GEOS.rfNut, MATS.portMetal, 4);
        const rfInsInst = new InstancedMesh(GEOS.rfInsulator, MATS.insulator, 4);
        const rfPinInst = new InstancedMesh(GEOS.rfPin, MATS.pin, 4);

        rfXPos.forEach((x, i) => {
            dummy.position.set(x, -0.79, SILVER_PANEL_FACE_Z + RF_FLANGE_DEPTH / 2);
            dummy.updateMatrix(); rfFlangeInst.setMatrixAt(i, dummy.matrix);

            const fZ = SILVER_PANEL_FACE_Z + RF_FLANGE_DEPTH;
            dummy.position.set(x, -0.79, fZ + RF_NUT_DEPTH / 2);
            dummy.updateMatrix(); rfNutInst.setMatrixAt(i, dummy.matrix);

            const nZ = fZ + RF_NUT_DEPTH;
            dummy.position.set(x, -0.79, nZ + RF_INSULATOR_DEPTH / 2);
            dummy.updateMatrix(); rfInsInst.setMatrixAt(i, dummy.matrix);

            const iZ = nZ + RF_INSULATOR_DEPTH;
            dummy.position.set(x, -0.79, iZ + RF_PIN_DEPTH / 2);
            dummy.updateMatrix(); rfPinInst.setMatrixAt(i, dummy.matrix);
        });
        this.group.add(rfFlangeInst, rfNutInst, rfInsInst, rfPinInst);

        // =====================================================================
        // FRONT USB & LEDs (Optimized with InstancedMesh)
        // =====================================================================
        const USB_DEPTH = 0.03;
        const usb = new Mesh(new BoxGeometry(0.16, 0.08, USB_DEPTH), MATS.usb);
        usb.position.set(-2.15, -0.78, SILVER_PANEL_FACE_Z + USB_DEPTH / 2);

        const LED_RADIUS = 0.018;
        const ledInst = new InstancedMesh(GEOS.led, MATS.led, 6);
        for (let i = 0; i < 6; i++) {
            dummy.position.set(-1.60 + i * 0.14, 0.93, PANEL_FACE_Z + LED_RADIUS);
            dummy.updateMatrix();
            ledInst.setMatrixAt(i, dummy.matrix);
        }

        // =====================================================================
        // BACK PANEL IMPLEMENTATION
        // =====================================================================
        const BACK_PANEL_Z = -1.21;
        const backPanelGroup = new Group();

        const backFace = new Mesh(new BoxGeometry(4.85, 1.95, 0.02), MATS.backFace);
        backFace.position.set(0, 0, BACK_PANEL_Z);
        backPanelGroup.add(backFace);

        // Rear Screws (Optimized)
        const screwPos = [
            [-2.3, 0.9], [0, 0.9], [0.8, 0.9], [1.7, 0.9],
            [-2.3, 0.1], [-1.0, 0.1], [0, 0.1], [2.3, 0.1],
            [-2.3, -0.3], [0, -0.3], [2.3, -0.3],
            [-2.3, -0.85], [0, -0.85], [1.1, -0.85], [2.3, -0.85]
        ];
        const screwInst = new InstancedMesh(GEOS.screw, MATS.screw, screwPos.length);
        screwPos.forEach(([x, y], i) => {
            dummy.position.set(x, y, BACK_PANEL_Z - 0.011);
            dummy.updateMatrix();
            screwInst.setMatrixAt(i, dummy.matrix);
        });
        backPanelGroup.add(screwInst);

        // Power Module
        const powerHousing = new Mesh(new BoxGeometry(0.75, 0.45, 0.02), MATS.powerHousing);
        powerHousing.position.set(0.65, 0.55, BACK_PANEL_Z - 0.012);
        
        const switchBase = new Mesh(new BoxGeometry(0.2, 0.28, 0.03), MATS.switchBase);
        switchBase.position.set(0.48, 0.55, BACK_PANEL_Z - 0.015);

        const switchRocker = new Mesh(new BoxGeometry(0.14, 0.22, 0.02), MATS.switchRocker);
        switchRocker.rotation.x = 0.15;
        switchRocker.position.set(0.48, 0.55, BACK_PANEL_Z - 0.022);

        const iecSocket = new Mesh(new BoxGeometry(0.3, 0.25, 0.03), MATS.iecSocket);
        iecSocket.position.set(0.8, 0.55, BACK_PANEL_Z - 0.015);
        backPanelGroup.add(powerHousing, switchBase, switchRocker, iecSocket);

        // Port Bias Connectors (Optimized)
        const bncTopInst = new InstancedMesh(GEOS.bncBase, MATS.portMetal, 4);
        for (let i = 0; i < 4; i++) {
            dummy.position.set(1.4 + i * 0.22, 0.72, BACK_PANEL_Z - 0.02);
            dummy.updateMatrix();
            bncTopInst.setMatrixAt(i, dummy.matrix);
        }
        backPanelGroup.add(bncTopInst);

        // System Drive Module 
        const driveBay = new Mesh(new BoxGeometry(1.2, 0.22, 0.02), MATS.driveBay);
        driveBay.position.set(0.2, 0.25, BACK_PANEL_Z - 0.012);
        backPanelGroup.add(driveBay);

        // Ribbon / IO Ports
        const handlerPort = new Mesh(new BoxGeometry(0.65, 0.18, 0.03), MATS.bluePort);
        handlerPort.position.set(1.7, 0.28, BACK_PANEL_Z - 0.015);
        const gpibPort = new Mesh(new BoxGeometry(0.65, 0.18, 0.03), MATS.bluePort);
        gpibPort.position.set(1.7, -0.12, BACK_PANEL_Z - 0.015);
        backPanelGroup.add(handlerPort, gpibPort);

        // Connectivity Section
        const usbB = new Mesh(new BoxGeometry(0.1, 0.1, 0.02), MATS.bluePort);
        usbB.position.set(-0.7, -0.1, BACK_PANEL_Z - 0.012);
        const dpPort = new Mesh(new BoxGeometry(0.12, 0.06, 0.02), MATS.genericMetal);
        dpPort.position.set(-0.35, -0.12, BACK_PANEL_Z - 0.012);
        const hdmiPort = new Mesh(new BoxGeometry(0.12, 0.05, 0.02), MATS.genericMetal);
        hdmiPort.position.set(-0.15, -0.12, BACK_PANEL_Z - 0.012);
        const lanPort = new Mesh(new BoxGeometry(0.12, 0.12, 0.03), MATS.genericMetal);
        lanPort.position.set(0.05, -0.09, BACK_PANEL_Z - 0.015);
        const usb3A = new Mesh(new BoxGeometry(0.08, 0.12, 0.02), MATS.bluePort);
        usb3A.position.set(0.24, -0.09, BACK_PANEL_Z - 0.012);
        const usb3B = new Mesh(new BoxGeometry(0.08, 0.12, 0.02), MATS.bluePort);
        usb3B.position.set(0.36, -0.09, BACK_PANEL_Z - 0.012);
        backPanelGroup.add(usbB, dpPort, hdmiPort, lanPort, usb3A, usb3B);

        // Lower Section BNC Ports (Optimized)
        const bncPositionsX = [-1.7, -1.45, -1.2, -0.95, 0.35, 0.6, 0.85, 1.1];
        const bncLowerInst = new InstancedMesh(GEOS.bncInput, MATS.portMetal, bncPositionsX.length);
        bncPositionsX.forEach((x, i) => {
            dummy.position.set(x, -0.42, BACK_PANEL_Z - 0.025);
            dummy.updateMatrix();
            bncLowerInst.setMatrixAt(i, dummy.matrix);
        });
        backPanelGroup.add(bncLowerInst);

        const userPort = new Mesh(new BoxGeometry(0.5, 0.12, 0.025), MATS.genericMetal);
        userPort.position.set(-0.3, -0.42, BACK_PANEL_Z - 0.012);
        backPanelGroup.add(userPort);

        const groundTerminal = new Mesh(GEOS.groundTerminal, MATS.portMetal);
        groundTerminal.position.set(-1.7, -0.75, BACK_PANEL_Z - 0.02);
        backPanelGroup.add(groundTerminal);

        this.group.add(body, frontPanel, screenFrame, screen, screenGlass, glare, silverPanel, highlight, usb, ledInst, backPanelGroup);
    }
}