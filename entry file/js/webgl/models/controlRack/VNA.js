import { 
    Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, BoxGeometry, 
    CylinderGeometry, PlaneGeometry, CanvasTexture, MeshPhysicalMaterial, 
    SphereGeometry, SRGBColorSpace, AdditiveBlending, ExtrudeGeometry, Shape 
} from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default class VNA {
    constructor() {
        this.group = new Group();
        this.createModel();
    }

    createModel() {
        this.group.position.y = 0.25;

        // Safe merge helper
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
        const MATS = {
            body: new MeshStandardMaterial({ color: 0xf5f7fa, metalness: 0.9, roughness: 0.12 }),
            blue: new MeshStandardMaterial({ color: 0x2e5ea8, metalness: 0.65, roughness: 0.32 }),
            silver: new MeshStandardMaterial({ color: 0xd7d9dc, metalness: 0.95, roughness: 0.18 }),
            darkPlast: new MeshStandardMaterial({ color: 0x181818, roughness: 0.7 }),
            foot: new MeshStandardMaterial({ color: 0x8a8a8a, metalness: 0.9, roughness: 0.35 }),
            btnStandard: new MeshStandardMaterial({ color: 0x2e2e2e, metalness: 0.2, roughness: 0.35 }),
            btnOrange: new MeshStandardMaterial({ color: 0xe66a00, metalness: 0.1, roughness: 0.4 }),
            btnTeal: new MeshStandardMaterial({ color: 0x00a896, metalness: 0.1, roughness: 0.4 }),
            portGold: new MeshStandardMaterial({ color: 0xd5b24a, metalness: 1, roughness: 0.12 }),
            portMetal: new MeshStandardMaterial({ color: 0xfffff2, metalness: 0.8, roughness: 0.2 }),
            insulator: new MeshStandardMaterial({ color: 0xf2ead9, metalness: 0.1, roughness: 0.6 }),
            bluePort: new MeshStandardMaterial({ color: 0x0055aa, roughness: 0.4 }),
            led: new MeshStandardMaterial({ color: 0x00ff66, emissive: 0x00ff66, emissiveIntensity: 2 })
        };

        // Buckets
        const bodyGeoms = [];
        const blueGeoms = [];
        const silverGeoms = [];
        const darkPlastGeoms = [];
        const goldGeoms = [];
        const portMetalGeoms = [];
        const insulatorGeoms = [];
        const bluePortGeoms = [];
        const footGeoms = [];
        const btnStandardGeoms = [];
        const btnOrangeGeoms = [];
        const btnTealGeoms = [];
        const ledGeoms = [];

        // Reference Planes
        const FRONT_PANEL_DEPTH = 0.08;
        const FRONT_PANEL_Z = 1.17;
        const PANEL_FACE_Z = FRONT_PANEL_Z + FRONT_PANEL_DEPTH / 2;
        const SILVER_PANEL_DEPTH = 0.04;
        const SILVER_PANEL_FACE_Z = PANEL_FACE_Z + SILVER_PANEL_DEPTH;
        const BACK_PANEL_Z = -1.21;

        // 1. Chassis Body, Front Panel, and Top Highlight
        const bodyBox = new BoxGeometry(5, 2.1, 2.4);
        bodyGeoms.push(bodyBox);

        const frontPanel = new BoxGeometry(4.95, 2, FRONT_PANEL_DEPTH);
        frontPanel.translate(0, 0, FRONT_PANEL_Z);
        bodyGeoms.push(frontPanel);

        const highlight = new BoxGeometry(4.85, 0.02, 2.28);
        highlight.translate(0, 1.06, 0);
        bodyGeoms.push(highlight);

        // Side Vents
        for (let i = 0; i < 14; i++) {
            const y = -0.65 + i * 0.10;
            for (let j = 0; j < 17; j++) {
                const z = -0.80 + j * 0.10;
                const vLeft = new BoxGeometry(0.03, 0.05, 0.06);
                vLeft.translate(-2.47, y, z);
                bodyGeoms.push(vLeft);

                const vRight = new BoxGeometry(0.03, 0.05, 0.06);
                vRight.translate(2.47, y, z);
                bodyGeoms.push(vRight);
            }
        }

        // Feet
        [ [-2.15, 0.95], [2.15, 0.95], [-2.15, -0.95], [2.15, -0.95] ].forEach(([x, z]) => {
            const foot = new CylinderGeometry(0.22, 0.26, 0.22, 16);
            foot.translate(x, -1.18, z);
            footGeoms.push(foot);
        });

        // 2. Screen Bezel & Side Handles
        const screenFrame = new BoxGeometry(2.75, 1.35, 0.05);
        screenFrame.translate(-0.72, 0.25, PANEL_FACE_Z + 0.025);
        blueGeoms.push(screenFrame);

        [-1, 1].forEach(side => {
            const outer = new BoxGeometry(0.32, 2.25, 0.28);
            outer.translate(side * 2.72, 0, 0);
            blueGeoms.push(outer);

            const top = new BoxGeometry(0.55, 0.25, 0.85);
            top.translate(side * 2.56, 1.0, 0);
            blueGeoms.push(top);

            const bottom = new BoxGeometry(0.55, 0.25, 0.85);
            bottom.translate(side * 2.56, -1.0, 0);
            blueGeoms.push(bottom);

            const grip = new BoxGeometry(0.12, 1.35, 0.18);
            grip.translate(side * 2.63, 0, 0.05);
            silverGeoms.push(grip);
        });

        // 3. Screen Face & Display Canvas Texture
        const SCREEN_FRAME_FACE_Z = PANEL_FACE_Z + 0.05;
        const canvas = document.createElement('canvas');
        canvas.width = 1024; canvas.height = 460;
        const ctx = canvas.getContext('2d');
        ctx.fillStyle = '#0a1f14';
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.strokeStyle = 'rgba(70,160,100,0.35)';
        ctx.lineWidth = 1;
        for (let x = 0; x < canvas.width; x += 51) {
            ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, canvas.height); ctx.stroke();
        }
        for (let y = 0; y < canvas.height; y += 38) {
            ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(canvas.width, y); ctx.stroke();
        }

        const screenTexture = new CanvasTexture(canvas);
        screenTexture.colorSpace = SRGBColorSpace;
        const screen = new Mesh(
            new PlaneGeometry(2.55, 1.15),
            new MeshStandardMaterial({
                map: screenTexture, emissive: 0xffffff, emissiveMap: screenTexture,
                emissiveIntensity: 1.5, color: 0x111111, roughness: 0.35
            })
        );
        screen.position.set(-0.72, 0.25, SCREEN_FRAME_FACE_Z + 0.002);
        this.group.add(screen);

        const glareCanvas = document.createElement('canvas');
        glareCanvas.width = 512; glareCanvas.height = 512;
        const gCtx = glareCanvas.getContext('2d');
        const grad = gCtx.createLinearGradient(0, 0, 512, 512);
        grad.addColorStop(0.42, 'rgba(255,255,255,0)');
        grad.addColorStop(0.50, 'rgba(255,255,255,0.4)');
        grad.addColorStop(0.58, 'rgba(255,255,255,0)');
        gCtx.fillStyle = grad; gCtx.fillRect(0, 0, 512, 512);

        const glare = new Mesh(
            new PlaneGeometry(2.55, 1.15),
            new MeshBasicMaterial({
                map: new CanvasTexture(glareCanvas), transparent: true, opacity: 0.55,
                blending: AdditiveBlending, depthWrite: false
            })
        );
        glare.position.set(-0.72, 0.25, SCREEN_FRAME_FACE_Z + 0.008);
        this.group.add(glare);

        // 4. Lower Silver Panel & Front Connectors
        const silverPanel = new BoxGeometry(4.95, 0.42, SILVER_PANEL_DEPTH);
        silverPanel.translate(0, -0.79, PANEL_FACE_Z + SILVER_PANEL_DEPTH / 2);
        silverGeoms.push(silverPanel);

        const usb = new BoxGeometry(0.16, 0.08, 0.03);
        usb.translate(-2.15, -0.78, SILVER_PANEL_FACE_Z + 0.015);
        silverGeoms.push(usb);

        // RF Ports
        const rfXPos = [-1.60, -0.50, 0.60, 1.70];
        rfXPos.forEach(x => {
            const flange = new CylinderGeometry(0.075, 0.075, 0.03, 16);
            flange.rotateX(Math.PI / 2);
            flange.translate(x, -0.79, SILVER_PANEL_FACE_Z + 0.015);
            goldGeoms.push(flange);

            const nut = new CylinderGeometry(0.058, 0.058, 0.06, 6);
            nut.rotateX(Math.PI / 2);
            nut.translate(x, -0.79, SILVER_PANEL_FACE_Z + 0.03 + 0.03);
            portMetalGeoms.push(nut);

            const ins = new CylinderGeometry(0.032, 0.032, 0.02, 16);
            ins.rotateX(Math.PI / 2);
            ins.translate(x, -0.79, SILVER_PANEL_FACE_Z + 0.09 + 0.01);
            insulatorGeoms.push(ins);

            const pin = new CylinderGeometry(0.011, 0.011, 0.05, 12);
            pin.rotateX(Math.PI / 2);
            pin.translate(x, -0.79, SILVER_PANEL_FACE_Z + 0.11 + 0.025);
            goldGeoms.push(pin);
        });

        // 5. Button Keypad & Sockets
        const btnShape = new Shape();
        const bw = 0.128, bh = 0.098, br = 0.015;
        btnShape.moveTo(-bw / 2 + br, -bh / 2);
        btnShape.lineTo(bw / 2 - br, -bh / 2);
        btnShape.quadraticCurveTo(bw / 2, -bh / 2, bw / 2, -bh / 2 + br);
        btnShape.lineTo(bw / 2, bh / 2 - br);
        btnShape.quadraticCurveTo(bw / 2, bh / 2, bw / 2 - br, bh / 2);
        btnShape.lineTo(-bw / 2 + br, bh / 2);
        btnShape.quadraticCurveTo(-bw / 2, bh / 2, -bw / 2, bh / 2 - br);
        btnShape.lineTo(-bw / 2, -bh / 2 + br);
        btnShape.quadraticCurveTo(-bw / 2, -bh / 2, -bw / 2 + br, -bh / 2);

        const btnExtrudeSettings = { steps: 1, depth: 0.035, bevelEnabled: true, bevelThickness: 0.006, bevelSize: 0.006, bevelSegments: 2 };
        const btnGeoTemplate = new ExtrudeGeometry(btnShape, btnExtrudeSettings);
        btnGeoTemplate.center();

        const collectBtn = (x, y, targetArr) => {
            const socket = new BoxGeometry(0.148, 0.118, 0.002);
            socket.translate(x, y, PANEL_FACE_Z + 0.001);
            darkPlastGeoms.push(socket);

            const cap = btnGeoTemplate.clone();
            cap.translate(x, y, PANEL_FACE_Z + 0.035);
            targetArr.push(cap);
        };

        // Populate Buttons
        for (let r = 0; r < 2; r++) {
            for (let c = 0; c < 3; c++) {
                collectBtn(0.95 + c * 0.17, 0.60 - r * 0.14, btnStandardGeoms);
                collectBtn(1.50 + c * 0.17, 0.60 - r * 0.14, btnStandardGeoms);
            }
        }
        collectBtn(2.05, 0.60, btnStandardGeoms);
        collectBtn(2.22, 0.60, btnStandardGeoms);
        collectBtn(2.05, 0.46, btnOrangeGeoms);
        collectBtn(2.22, 0.46, btnTealGeoms);

        for (let r = 0; r < 4; r++) {
            for (let c = 0; c < 3; c++) collectBtn(0.95 + c * 0.17, 0.25 - r * 0.14, btnStandardGeoms);
            collectBtn(1.48, 0.25 - r * 0.14, btnStandardGeoms);
        }

        [ [0.95, -0.40], [1.30, -0.40], [1.48, -0.32], [1.48, -0.48], [1.66, -0.40] ].forEach(([bx, by]) => {
            collectBtn(bx, by, btnStandardGeoms);
        });

        // Rotary Knob
        const knob = new CylinderGeometry(0.2, 0.2, 0.06, 24);
        knob.rotateX(Math.PI / 2);
        knob.translate(1.95, 0.04, PANEL_FACE_Z + 0.03);
        darkPlastGeoms.push(knob);

        // LEDs
        for (let i = 0; i < 6; i++) {
            const led = new SphereGeometry(0.018, 8, 8);
            led.translate(-1.60 + i * 0.14, 0.93, PANEL_FACE_Z + 0.018);
            ledGeoms.push(led);
        }

        // 6. Back Panel Hardware
        const backFace = new BoxGeometry(4.85, 1.95, 0.02);
        backFace.translate(0, 0, BACK_PANEL_Z);
        darkPlastGeoms.push(backFace);

        // Screws
        const screwPos = [
            [-2.3, 0.9], [0, 0.9], [0.8, 0.9], [1.7, 0.9],
            [-2.3, 0.1], [-1.0, 0.1], [0, 0.1], [2.3, 0.1],
            [-2.3, -0.3], [0, -0.3], [2.3, -0.3],
            [-2.3, -0.85], [0, -0.85], [1.1, -0.85], [2.3, -0.85]
        ];
        screwPos.forEach(([x, y]) => {
            const sc = new CylinderGeometry(0.025, 0.025, 0.01, 8);
            sc.rotateX(Math.PI / 2);
            sc.translate(x, y, BACK_PANEL_Z - 0.011);
            silverGeoms.push(sc);
        });

        // Power Socket & Switch
        const powerHousing = new BoxGeometry(0.75, 0.45, 0.02);
        powerHousing.translate(0.65, 0.55, BACK_PANEL_Z - 0.012);
        darkPlastGeoms.push(powerHousing);

        const switchBase = new BoxGeometry(0.2, 0.28, 0.03);
        switchBase.translate(0.48, 0.55, BACK_PANEL_Z - 0.015);
        darkPlastGeoms.push(switchBase);

        const switchRocker = new BoxGeometry(0.14, 0.22, 0.02);
        switchRocker.rotateX(0.15);
        switchRocker.translate(0.48, 0.55, BACK_PANEL_Z - 0.022);
        darkPlastGeoms.push(switchRocker);

        const iecSocket = new BoxGeometry(0.3, 0.25, 0.03);
        iecSocket.translate(0.8, 0.55, BACK_PANEL_Z - 0.015);
        darkPlastGeoms.push(iecSocket);

        const driveBay = new BoxGeometry(1.2, 0.22, 0.02);
        driveBay.translate(0.2, 0.25, BACK_PANEL_Z - 0.012);
        darkPlastGeoms.push(driveBay);

        // Rear BNCs
        for (let i = 0; i < 4; i++) {
            const bnc = new CylinderGeometry(0.045, 0.045, 0.04, 12);
            bnc.rotateX(Math.PI / 2);
            bnc.translate(1.4 + i * 0.22, 0.72, BACK_PANEL_Z - 0.02);
            portMetalGeoms.push(bnc);
        }

        const bncPositionsX = [-1.7, -1.45, -1.2, -0.95, 0.35, 0.6, 0.85, 1.1];
        bncPositionsX.forEach(x => {
            const bncIn = new CylinderGeometry(0.04, 0.04, 0.05, 12);
            bncIn.rotateX(Math.PI / 2);
            bncIn.translate(x, -0.42, BACK_PANEL_Z - 0.025);
            portMetalGeoms.push(bncIn);
        });

        const groundTerminal = new CylinderGeometry(0.03, 0.03, 0.04, 8);
        groundTerminal.rotateX(Math.PI / 2);
        groundTerminal.translate(-1.7, -0.75, BACK_PANEL_Z - 0.02);
        portMetalGeoms.push(groundTerminal);

        // Rear IO Ports
        [ [1.7, 0.28, 0.65, 0.18], [1.7, -0.12, 0.65, 0.18], [-0.7, -0.1, 0.1, 0.1], [0.24, -0.09, 0.08, 0.12], [0.36, -0.09, 0.08, 0.12] ].forEach(([x, y, w, h]) => {
            const bp = new BoxGeometry(w, h, 0.02);
            bp.translate(x, y, BACK_PANEL_Z - 0.015);
            bluePortGeoms.push(bp);
        });

        [ [-0.35, -0.12, 0.12, 0.06], [-0.15, -0.12, 0.12, 0.05], [0.05, -0.09, 0.12, 0.12], [-0.3, -0.42, 0.5, 0.12] ].forEach(([x, y, w, h]) => {
            const gp = new BoxGeometry(w, h, 0.02);
            gp.translate(x, y, BACK_PANEL_Z - 0.012);
            silverGeoms.push(gp);
        });

        // 7. Execute Geometry Merging
        const mergedBody = safeMerge(bodyGeoms);
        if (mergedBody) this.group.add(new Mesh(mergedBody, MATS.body));

        const mergedFeet = safeMerge(footGeoms);
        if (mergedFeet) this.group.add(new Mesh(mergedFeet, MATS.foot));

        const mergedBlue = safeMerge(blueGeoms);
        if (mergedBlue) this.group.add(new Mesh(mergedBlue, MATS.blue));

        const mergedSilver = safeMerge(silverGeoms);
        if (mergedSilver) this.group.add(new Mesh(mergedSilver, MATS.silver));

        const mergedDark = safeMerge(darkPlastGeoms);
        if (mergedDark) this.group.add(new Mesh(mergedDark, MATS.darkPlast));

        const mergedGold = safeMerge(goldGeoms);
        if (mergedGold) this.group.add(new Mesh(mergedGold, MATS.portGold));

        const mergedPortMetal = safeMerge(portMetalGeoms);
        if (mergedPortMetal) this.group.add(new Mesh(mergedPortMetal, MATS.portMetal));

        const mergedInsulator = safeMerge(insulatorGeoms);
        if (mergedInsulator) this.group.add(new Mesh(mergedInsulator, MATS.insulator));

        const mergedBluePorts = safeMerge(bluePortGeoms);
        if (mergedBluePorts) this.group.add(new Mesh(mergedBluePorts, MATS.bluePort));

        const mergedBtnStd = safeMerge(btnStandardGeoms);
        if (mergedBtnStd) this.group.add(new Mesh(mergedBtnStd, MATS.btnStandard));

        const mergedBtnOrg = safeMerge(btnOrangeGeoms);
        if (mergedBtnOrg) this.group.add(new Mesh(mergedBtnOrg, MATS.btnOrange));

        const mergedBtnTeal = safeMerge(btnTealGeoms);
        if (mergedBtnTeal) this.group.add(new Mesh(mergedBtnTeal, MATS.btnTeal));

        const mergedLEDs = safeMerge(ledGeoms);
        if (mergedLEDs) this.group.add(new Mesh(mergedLEDs, MATS.led));
    }

    getGroup() {
        return this.group;
    }
}