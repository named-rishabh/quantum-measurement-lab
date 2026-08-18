import * as THREE from 'three';
import * as BufferGeometryUtils from 'three/examples/jsm/utils/BufferGeometryUtils.js';

export default class GHS {
    constructor() {
        this.group = new THREE.Group();
        this.group.scale.set(11.7, 11.7, 9);
        this.group.position.set(-8, 0.8, -13.5);
        this.group.rotation.y = Math.PI;
        this.buildGHS();
    }

    buildGHS() {
        // --- Helper for safe merging across mixed geometry types ---
        function safeMerge(geometries) {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        }

        // --- Shared Materials ---
        const polishedSteelMat = new THREE.MeshStandardMaterial({
            color: 0x28282B,
            metalness: 1,
            roughness: 0.16
        });

        const subtleJointMat = new THREE.MeshStandardMaterial({
            color: 0x3a3f47,
            metalness: 0.7,
            roughness: 0.4
        });

        const screenBezelMat = new THREE.MeshStandardMaterial({
            color: 0x9ba5b0,
            metalness: 0.8,
            roughness: 0.28
        });

        const darkMountMat = new THREE.MeshStandardMaterial({
            color: 0x111111,
            metalness: 0.7,
            roughness: 0.4
        });

        const lightSteelMat = new THREE.MeshStandardMaterial({
            color: 0xE7E7E7,
            metalness: 0.95,
            roughness: 0.15,
            side: THREE.DoubleSide
        });

        const copperMat = new THREE.MeshStandardMaterial({
            color: 0xb87333,
            metalness: 1,
            roughness: 0.15,
            side: THREE.DoubleSide
        });

        const blueHandleMat = new THREE.MeshStandardMaterial({
            color: 0x1a5b8c,
            metalness: 0.4,
            roughness: 0.6
        });

        const dewarWhiteMat = new THREE.MeshStandardMaterial({
            color: 0xFAF9F6,
            roughness: 0.5,
            metalness: 0.3
        });

        const blueCapMat = new THREE.MeshBasicMaterial({ color: 0x1c3a76 });
        const glowRingMat = new THREE.MeshBasicMaterial({ color: 0x3498db });

        // Geometry collection buckets
        const polishedSteelGeoms = [];
        const subtleJointGeoms = [];
        const darkMountGeoms = [];
        const lightSteelGeoms = [];
        const copperGeoms = [];
        const glowRingGeoms = [];
        const dewarWhiteGeoms = [];

        // Helper: Rounded Box Extrusion
        function createRoundedBoxGeometry(width, height, depth, radius, bevelSegments) {
            const shape = new THREE.Shape();
            const w = width / 2;
            const d = depth / 2;
            const r = radius;

            shape.moveTo(-w + r, -d);
            shape.lineTo(w - r, -d);
            shape.absarc(w - r, -d + r, r, -Math.PI / 2, 0, false);
            shape.lineTo(w, d - r);
            shape.absarc(w - r, d - r, r, 0, Math.PI / 2, false);
            shape.lineTo(-w + r, d);
            shape.absarc(-w + r, d - r, r, Math.PI / 2, Math.PI, false);
            shape.lineTo(-w, -d + r);
            shape.absarc(-w + r, -d + r, r, Math.PI, Math.PI * 1.5, false);

            const extrudeSettings = {
                steps: 1,
                depth: height - (r * 2),
                bevelEnabled: true,
                bevelThickness: r,
                bevelSize: 0,
                bevelOffset: 0,
                bevelSegments: bevelSegments,
                curveSegments: 24
            };

            const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings);
            geometry.center();
            geometry.rotateX(Math.PI / 2);
            return geometry;
        }

        const curveRadius = 0.035;
        const segmentSmoothness = 8;
        const chamberOffsetY = 0.1;

        // 1. Chamber Main Shell & Recesses
        const capGeo = createRoundedBoxGeometry(0.7, 0.24, 0.7, curveRadius, segmentSmoothness);
        capGeo.translate(0, 0.53 + chamberOffsetY, 0);
        polishedSteelGeoms.push(capGeo);

        const centerSteelGeo = createRoundedBoxGeometry(0.7, 1.1, 0.7, curveRadius, segmentSmoothness);
        centerSteelGeo.translate(0, -0.18 + chamberOffsetY, 0);
        polishedSteelGeoms.push(centerSteelGeo);

        const joint1Geo = createRoundedBoxGeometry(0.69, 0.01, 0.69, curveRadius, segmentSmoothness);
        joint1Geo.translate(0, 0.405 + chamberOffsetY, 0);
        subtleJointGeoms.push(joint1Geo);

        const joint3Geo = createRoundedBoxGeometry(0.69, 0.01, 0.69, curveRadius, segmentSmoothness);
        joint3Geo.translate(0, -0.49 + chamberOffsetY, 0);
        subtleJointGeoms.push(joint3Geo);

        const joint4Geo = createRoundedBoxGeometry(0.59, 0.01, 0.59, curveRadius, segmentSmoothness);
        joint4Geo.translate(0, -0.645 + chamberOffsetY, 0);
        subtleJointGeoms.push(joint4Geo);

        // 2. Fridge Stand (Base Plate & Feet)
        const plateGeo = new THREE.BoxGeometry(0.65, 0.02, 0.65);
        plateGeo.translate(0, -0.6, 0);
        darkMountGeoms.push(plateGeo);

        const footPositions = [
            { x: 0.225, z: 0.225 },
            { x: -0.225, z: 0.225 },
            { x: 0.225, z: -0.225 },
            { x: -0.225, z: -0.225 }
        ];

        footPositions.forEach(pos => {
            const footBase = new THREE.CylinderGeometry(0.015, 0.06, 0.03, 24);
            footBase.translate(pos.x, -0.6 - 0.14, pos.z);
            lightSteelGeoms.push(footBase);

            const shaft = new THREE.CylinderGeometry(0.015, 0.015, 0.15, 16);
            shaft.translate(pos.x, -0.6 - 0.07, pos.z);
            polishedSteelGeoms.push(shaft);
        });

        // 3. Screen Bezel & Telemetry Display Canvas
        const screenEnclosureGeo = createRoundedBoxGeometry(0.56, 0.34, 0.02, 0.01, 3);
        const screenEnclosure = new THREE.Mesh(screenEnclosureGeo, screenBezelMat);
        screenEnclosure.position.set(0, -0.145 + chamberOffsetY, 0.36);
        this.group.add(screenEnclosure);

        const statsCanvas = document.createElement('canvas');
        statsCanvas.width = 512;
        statsCanvas.height = 256;
        const ctx = statsCanvas.getContext('2d');
        const statsTexture = new THREE.CanvasTexture(statsCanvas);
        const screenDisplayMat = new THREE.MeshBasicMaterial({ map: statsTexture });

        function renderEmbeddedDisplay(temp, pressure, flow) {
            ctx.fillStyle = '#090e14';
            ctx.fillRect(0, 0, 512, 256);

            ctx.strokeStyle = '#3498db';
            ctx.lineWidth = 8;
            ctx.strokeRect(12, 12, 488, 232);

            ctx.fillStyle = '#3498db';
            ctx.font = 'bold 24px "Segoe UI", sans-serif';
            ctx.fillText('CHAMBER TELEMETRY [ACTIVE]', 35, 55);

            ctx.lineWidth = 1;
            ctx.beginPath();
            ctx.moveTo(35, 75);
            ctx.lineTo(477, 75);
            ctx.strokeStyle = 'rgba(52, 152, 219, 0.3)';
            ctx.stroke();

            ctx.font = '24px "Courier New", monospace';
            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('GAS MATRIX   :', 35, 115);
            ctx.fillStyle = '#e67e22';
            ctx.fillText('He-3 / He-4 Mix', 225, 115);

            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('VACUUM PRESS:', 35, 155);
            ctx.fillStyle = '#2ecc71';
            ctx.fillText(pressure + ' mbar', 225, 155);

            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('CORE TEMP    :', 35, 195);
            ctx.fillStyle = '#2ecc71';
            ctx.fillText(temp + ' mK', 225, 195);

            ctx.fillStyle = '#7f8c8d';
            ctx.fillText('FLOW RATE    :', 35, 230);
            ctx.fillStyle = '#2ecc71';
            ctx.fillText(flow + ' umol/s', 225, 230);

            statsTexture.needsUpdate = true;
        }

        const displayScreen = new THREE.Mesh(new THREE.PlaneGeometry(0.53, 0.31), screenDisplayMat);
        displayScreen.name = 'TelemetryScreenMesh';
        displayScreen.position.set(0, -0.145 + chamberOffsetY, 0.372);
        this.group.add(displayScreen);

        // 4. Handle Mounts & Grip
        const topMount = new THREE.CylinderGeometry(0.012, 0.012, 0.05, 16);
        topMount.rotateX(Math.PI / 2);
        topMount.translate(-0.32 + 0.03, -0.045 + 0.35 + chamberOffsetY, 0.375);
        darkMountGeoms.push(topMount);

        const botMount = new THREE.CylinderGeometry(0.012, 0.012, 0.05, 16);
        botMount.rotateX(Math.PI / 2);
        botMount.translate(-0.32 + 0.03, -0.245 + 0.35 + chamberOffsetY, 0.375);
        darkMountGeoms.push(botMount);

        const gripGeo = new THREE.CylinderGeometry(0.015, 0.015, 0.22, 16);
        const gripMesh = new THREE.Mesh(gripGeo, blueHandleMat);
        gripMesh.position.set(-0.32 + 0.03, -0.145 + 0.35 + chamberOffsetY, 0.40);
        this.group.add(gripMesh);

        // 5. RF Data Ports
        const startY = -0.38;
        const spacingY = 0.07;

        for (let i = 0; i < 5; i++) {
            const py = startY - (i * spacingY) + chamberOffsetY;

            const pBase = new THREE.CylinderGeometry(0.025, 0.025, 0.01, 32);
            pBase.rotateX(Math.PI / 2);
            pBase.translate(-0.3, py, 0.352);
            subtleJointGeoms.push(pBase);

            const pInner = new THREE.CylinderGeometry(0.012, 0.012, 0.012, 32);
            pInner.rotateX(Math.PI / 2);
            pInner.translate(-0.3, py, 0.354);
            lightSteelGeoms.push(pInner);

            if (i < 2) {
                const ringGlow = new THREE.TorusGeometry(0.018, 0.002, 8, 24);
                ringGlow.translate(-0.3, py, 0.357);
                glowRingGeoms.push(ringGlow);

                const portLight = new THREE.PointLight(0x3498db, 0.6, 0.3);
                portLight.position.set(-0.3, py, 0.372);
                this.group.add(portLight);
            }
        }

        // 6. Dewar Vessel & Handles
        const dewarPoints = [
            new THREE.Vector2(0, 0),
            new THREE.Vector2(9, 0),
            new THREE.Vector2(10, 1),
            new THREE.Vector2(10, 4),
            new THREE.Vector2(9.6, 4.2),
            new THREE.Vector2(9.6, 4.8),
            new THREE.Vector2(10, 5),
            new THREE.Vector2(10, 10),
            new THREE.Vector2(9.6, 10.2),
            new THREE.Vector2(9.6, 10.8),
            new THREE.Vector2(10, 11),
            new THREE.Vector2(10, 16),
            new THREE.Vector2(9.6, 16.2),
            new THREE.Vector2(9.6, 16.8),
            new THREE.Vector2(10, 17),
            new THREE.Vector2(10, 22)
        ];

        for (let i = 1; i <= 12; i++) {
            const t = i / 12;
            const r = 2.5 + 7.5 * Math.cos(t * Math.PI / 2);
            const y = 22 + 6 * Math.sin(t * Math.PI / 2);
            dewarPoints.push(new THREE.Vector2(r, y));
        }
        dewarPoints.push(new THREE.Vector2(2.5, 30));

        const dewarBodyGeo = new THREE.LatheGeometry(dewarPoints, 32);
        dewarBodyGeo.scale(0.015, 0.015, 0.015);
        dewarBodyGeo.translate(-0.6, -0.75, 0.2);
        dewarWhiteGeoms.push(dewarBodyGeo);

        const handleProfile = new THREE.Shape();
        handleProfile.moveTo(-2, 0);
        handleProfile.lineTo(-1.5, 4);
        handleProfile.lineTo(1.5, 4);
        handleProfile.lineTo(2, 0);
        handleProfile.lineTo(1, 0);
        handleProfile.lineTo(0.5, 2.5);
        handleProfile.lineTo(-0.5, 2.5);
        handleProfile.lineTo(-1, 0);

        const handleExtrudeOpt = {
            depth: 1.5,
            bevelEnabled: true,
            bevelThickness: 0.2,
            bevelSize: 0.2,
            bevelSegments: 2
        };

        const leftHandle = new THREE.ExtrudeGeometry(handleProfile, handleExtrudeOpt);
        leftHandle.translate(0, 0, -0.75);
        leftHandle.rotateZ(Math.PI / 5.5);
        leftHandle.translate(-7.5, 24, 0);
        leftHandle.scale(0.015, 0.015, 0.015);
        leftHandle.translate(-0.6, -0.75, 0.2);
        dewarWhiteGeoms.push(leftHandle);

        const rightHandle = new THREE.ExtrudeGeometry(handleProfile, handleExtrudeOpt);
        rightHandle.translate(0, 0, -0.75);
        rightHandle.rotateZ(-Math.PI / 5.5);
        rightHandle.translate(7.5, 24, 0);
        rightHandle.scale(0.015, 0.015, 0.015);
        rightHandle.translate(-0.6, -0.75, 0.2);
        dewarWhiteGeoms.push(rightHandle);

        const capShape = new THREE.Shape();
        capShape.absarc(0, 0, 3.2, 0, Math.PI * 2, false);
        const capGeoDewar = new THREE.ExtrudeGeometry(capShape, { depth: 2, bevelEnabled: false });
        capGeoDewar.rotateX(-Math.PI / 2);
        capGeoDewar.translate(0, 29, 0);
        capGeoDewar.scale(0.015, 0.015, 0.015);
        capGeoDewar.translate(-0.6, -0.75, 0.2);
        this.group.add(new THREE.Mesh(capGeoDewar, blueCapMat));

        // 7. Connector Pipes & Collars
        const connPath1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-25, -1.8, 1.95),
            new THREE.Vector3(-25, 1.5, 1.95),
            new THREE.Vector3(-26, 1.5, 1.95)
        ]);
        const connPath2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-25, -2, 1.95),
            new THREE.Vector3(-25, 0.6, 1.95),
            new THREE.Vector3(-26, 0.6, 1.95)
        ]);

        const cTube1 = new THREE.TubeGeometry(connPath1, 64, 0.2, 20, false);
        cTube1.translate(0.3, 0, 0);
        cTube1.scale(0.05, 0.08, 0.05);
        cTube1.translate(0.65, -0.14, 0.1);
        lightSteelGeoms.push(cTube1);

        const cTube2 = new THREE.TubeGeometry(connPath2, 64, 0.2, 20, false);
        cTube2.translate(-0.5, 0, 0);
        cTube2.scale(0.05, 0.08, 0.05);
        cTube2.translate(0.65, -0.14, 0.1);
        lightSteelGeoms.push(cTube2);

        const collar1 = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32);
        collar1.rotateZ(Math.PI / 2);
        collar1.translate(-25.7, 1.5, 1.95);
        collar1.scale(0.05, 0.08, 0.05);
        collar1.translate(0.65, -0.14, 0.1);
        copperGeoms.push(collar1);

        const collar2 = new THREE.CylinderGeometry(0.25, 0.25, 0.3, 32);
        collar2.rotateZ(Math.PI / 2);
        collar2.translate(-26.4, 0.6, 1.95);
        collar2.scale(0.05, 0.08, 0.05);
        collar2.translate(0.65, -0.14, 0.1);
        copperGeoms.push(collar2);

        // Curved Dewar Piping
        const pDewar1 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.63, -0.018, 0.198),
            new THREE.Vector3(-0.8, -0.05, 0.2),
            new THREE.Vector3(-0.8, -0.1, 0.3),
            new THREE.Vector3(-0.7, -0.2, 0.4),
            new THREE.Vector3(-0.5, -0.3, 0.45),
            new THREE.Vector3(-0.3, -0.28, 0.4),
            new THREE.Vector3(-0.31, -0.28, 0.33)
        ]);
        const pDewar2 = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-0.66, -0.085, 0.198),
            new THREE.Vector3(-0.8, -0.15, 0.2),
            new THREE.Vector3(-0.8, -0.25, 0.3),
            new THREE.Vector3(-0.7, -0.35, 0.4),
            new THREE.Vector3(-0.5, -0.4, 0.45),
            new THREE.Vector3(-0.3, -0.35, 0.4),
            new THREE.Vector3(-0.31, -0.35, 0.33)
        ]);

        lightSteelGeoms.push(new THREE.TubeGeometry(pDewar1, 96, 0.01, 20, false));
        lightSteelGeoms.push(new THREE.TubeGeometry(pDewar2, 96, 0.01, 20, false));

        // 8. Safe Geometry Merging
        const mergedPolished = safeMerge(polishedSteelGeoms);
        if (mergedPolished) this.group.add(new THREE.Mesh(mergedPolished, polishedSteelMat));

        const mergedSubtle = safeMerge(subtleJointGeoms);
        if (mergedSubtle) this.group.add(new THREE.Mesh(mergedSubtle, subtleJointMat));

        const mergedDark = safeMerge(darkMountGeoms);
        if (mergedDark) this.group.add(new THREE.Mesh(mergedDark, darkMountMat));

        const mergedLightSteel = safeMerge(lightSteelGeoms);
        if (mergedLightSteel) this.group.add(new THREE.Mesh(mergedLightSteel, lightSteelMat));

        const mergedCopper = safeMerge(copperGeoms);
        if (mergedCopper) this.group.add(new THREE.Mesh(mergedCopper, copperMat));

        const mergedDewar = safeMerge(dewarWhiteGeoms);
        if (mergedDewar) this.group.add(new THREE.Mesh(mergedDewar, dewarWhiteMat));

        const mergedGlow = safeMerge(glowRingGeoms);
        if (mergedGlow) this.group.add(new THREE.Mesh(mergedGlow, glowRingMat));

        // Telemetry Update Loop
        const updateHardwareFeeds = () => {
            const currentTemp = (9.76 + Math.random() * 0.15).toFixed(2);
            const currentPressure = (1.18 + Math.random() * 0.03).toFixed(2) + 'e-6';
            const currentFlow = (41.9 + Math.random() * 0.5).toFixed(1);
            renderEmbeddedDisplay(currentTemp, currentPressure, currentFlow);
        };

        updateHardwareFeeds();
        setInterval(updateHardwareFeeds, 1000);
    }

    getGroup() {
        return this.group;
    }
}