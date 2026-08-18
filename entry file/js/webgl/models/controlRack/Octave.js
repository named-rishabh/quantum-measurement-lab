import { Group, Mesh, MeshBasicMaterial, MeshStandardMaterial, BoxGeometry, CapsuleGeometry, CylinderGeometry, PlaneGeometry, CanvasTexture, CircleGeometry } from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default class Octave {
    constructor() {
        this.group = new Group();
        this.createModel();
    }

    createModel() {
        // Safe Merge Utility to avoid attribute/index mismatches
        function safeMerge(geometries) {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        }

        // Shared Materials
        const bodyMat = new MeshStandardMaterial({ color: 0x161618, metalness: 0.8, roughness: 0.25 });
        const panelMat = new MeshStandardMaterial({ color: 0x0c0c0d, metalness: 0.5, roughness: 0.15 });
        const frontHoleMat = new MeshStandardMaterial({ color: 0x020202, roughness: 1 });
        const goldMat = new MeshStandardMaterial({ color: 0xd4af37, metalness: 0.9, roughness: 0.1 });
        const silverMat = new MeshStandardMaterial({ color: 0xffffff, metalness: 0.9, roughness: 0.2 });
        const darkPlastMat = new MeshStandardMaterial({ color: 0x1a1a1a, roughness: 0.6 });

        // Geometry Buckets
        const holeGeoms = [];
        const goldGeoms = [];
        const silverGeoms = [];
        const darkPlastGeoms = [];

        // 1. Main 1U Rack Chassis
        const body = new Mesh(new BoxGeometry(4.95, 0.85, 2.65), bodyMat);
        body.castShadow = true;
        body.receiveShadow = true;
        this.group.add(body);

        // 2. Front Recessed Bezel Capsule
        const panelGeom = new CapsuleGeometry(0.33, 4.6, 10, 40);
        panelGeom.rotateZ(Math.PI / 2);
        panelGeom.scale(1, 1, 0.1);
        panelGeom.translate(0, 0, 1.33);
        this.group.add(new Mesh(panelGeom, panelMat));

        // 3. Ventilation Micro-Holes Grid (~750 holes)
        for (let x = -2.2; x <= 2.2; x += 0.05) {
            for (let y = -0.28; y <= 0.28; y += 0.06) {
                if (Math.abs(x) < 0.2 || (x > -2.1 && x < -1.7)) continue;
                const hole = new CylinderGeometry(0.009, 0.009, 0.02, 8);
                hole.rotateX(Math.PI / 2);
                hole.translate(x, y, 1.34);
                holeGeoms.push(hole);
            }
        }

        // 4. QM Branding Logo Badge
        const logoCanvas = document.createElement("canvas");
        logoCanvas.width = 256;
        logoCanvas.height = 256;
        const ctx = logoCanvas.getContext("2d");
        ctx.fillStyle = "transparent";
        ctx.clearRect(0, 0, 256, 256);
        ctx.strokeStyle = "#00D2FF";
        ctx.lineWidth = 24;
        ctx.lineCap = "round";
        ctx.beginPath(); ctx.arc(80, 128, 45, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath(); ctx.moveTo(150, 85); ctx.lineTo(150, 170); ctx.lineTo(190, 85); ctx.lineTo(190, 170); ctx.stroke();

        const logoTexture = new CanvasTexture(logoCanvas);
        const logo = new Mesh(
            new PlaneGeometry(0.35, 0.35),
            new MeshBasicMaterial({ map: logoTexture, transparent: true })
        );
        logo.position.set(0, 0, 1.345);
        this.group.add(logo);

        // 5. Port Geometry Collectors
        function collectSMA(x, y, z, dir) {
            const flange = new CircleGeometry(0.05, 16);
            flange.translate(x, y, z + 0.025);
            goldGeoms.push(flange);

            const base = new CylinderGeometry(0.04, 0.06, 0.05, 16);
            base.rotateX((Math.PI / 2) * dir);
            base.translate(x, y, z + 0.025);
            goldGeoms.push(base);

            const inside = new CylinderGeometry(0.03, 0.035, 0.06, 16);
            inside.rotateX((Math.PI / 2) * dir);
            inside.translate(x, y, z + 0.03);
            silverGeoms.push(inside);

            const wire = new CylinderGeometry(0.01, 0.01, 0.075, 16);
            wire.rotateX((Math.PI / 2) * dir);
            wire.translate(x, y, z + 0.03);
            darkPlastGeoms.push(wire);
        }

        function collectBNC(x, y, z, dir) {
            const base = new CylinderGeometry(0.06, 0.06, 0.08, 16);
            base.rotateX((Math.PI / 2) * dir);
            base.translate(x, y, z + 0.04 * dir);
            silverGeoms.push(base);
        }

        // Front SMAs
        const frontPositions = [
            [-2.0, -0.1], [-1.5, -0.1],
            [-1.0, 0.12], [-1.0, -0.18], [-0.8, 0.12], [-0.8, -0.18], [-0.6, 0.12], [-0.6, -0.18], [-0.4, 0.12], [-0.4, -0.18], [-0.2, 0.12], [-0.2, -0.18],
            [0.2, 0.12], [0.2, -0.18], [0.4, 0.12], [0.4, -0.18], [0.6, 0.12], [0.6, -0.18], [0.8, 0.12], [0.8, -0.18], [1.0, 0.12], [1.0, -0.18],
            [1.3, 0.12], [1.3, -0.18], [1.5, 0.12], [1.5, -0.18], [1.7, 0.12], [1.7, -0.18], [2.0, 0.12], [2.0, -0.18]
        ];
        frontPositions.forEach(p => collectSMA(p[0], p[1], 1.33, 1));

        // 6. Rear Panel Hardware
        const rearZ = -1.35;

        // Exhaust Patches
        [-2.2, 2.2].forEach(xOffset => {
            const vent = new BoxGeometry(0.4, 0.5, 0.01);
            vent.translate(xOffset, 0, rearZ);
            darkPlastGeoms.push(vent);
        });

        // Rear SMAs & BNCs
        const rearSMAs = [
            [-1.7, 0.15], [-1.7, -0.15], [-1.2, 0.15], [-1.2, -0.15],
            [-0.9, 0.15], [-0.9, -0.15], [-0.7, 0.15], [-0.7, -0.15], [-0.5, 0.15], [-0.5, -0.15],
            [-0.2, 0.15], [-0.2, -0.15], [0.0, 0.15], [0.0, -0.15], [0.2, 0.15], [0.2, -0.15],
            [0.4, 0.15], [0.4, -0.15], [0.6, 0.15], [0.6, -0.15]
        ];
        rearSMAs.forEach(p => collectSMA(p[0], p[1], rearZ, -1));

        collectBNC(-1.4, 0.0, rearZ, -1);
        collectBNC(0.8, 0.0, rearZ, -1);

        // Ethernet & USB
        const eth = new BoxGeometry(0.18, 0.35, 0.1);
        eth.translate(1.3, -0.05, rearZ - 0.02);
        silverGeoms.push(eth);

        const usb = new BoxGeometry(0.16, 0.08, 0.08);
        usb.translate(1.6, -0.18, rearZ - 0.01);
        silverGeoms.push(usb);

        // Power Switch & AC Jack
        const switchBox = new BoxGeometry(0.18, 0.28, 0.08);
        switchBox.translate(1.6, 0.12, rearZ - 0.01);
        darkPlastGeoms.push(switchBox);

        const powerJack = new CylinderGeometry(0.07, 0.07, 0.1, 16);
        powerJack.rotateX(Math.PI / 2);
        powerJack.translate(1.9, -0.12, rearZ - 0.02);
        darkPlastGeoms.push(powerJack);

        // 7. Execute Geometry Merging
        const mergedHoles = safeMerge(holeGeoms);
        if (mergedHoles) this.group.add(new Mesh(mergedHoles, frontHoleMat));

        const mergedGold = safeMerge(goldGeoms);
        if (mergedGold) this.group.add(new Mesh(mergedGold, goldMat));

        const mergedSilver = safeMerge(silverGeoms);
        if (mergedSilver) this.group.add(new Mesh(mergedSilver, silverMat));

        const mergedDark = safeMerge(darkPlastGeoms);
        if (mergedDark) this.group.add(new Mesh(mergedDark, darkPlastMat));
    }

    getGroup() {
        return this.group;
    }
}