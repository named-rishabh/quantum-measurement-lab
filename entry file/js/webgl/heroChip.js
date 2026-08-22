import * as THREE from "three";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";

// A richer, self-contained hero scene: glowing diamond-oriented chip,
// colored orbiting rings, a vertical light beam, and a starfield behind it.
// Still fully isolated from the main lab Experience - its own renderer/scene.
export default class HeroChip {
    constructor(canvas) {
        this.canvas = canvas;
        this.clock = new THREE.Clock();

        this.scene = new THREE.Scene();

        this.camera = new THREE.PerspectiveCamera(
            40,
            canvas.clientWidth / canvas.clientHeight,
            0.1,
            200
        );
        this.camera.position.set(0, 0.5, 9);
        this._initialCameraPos = { x: 0, y: 0.5, z: 9 };
        this._initialBloomStrength = 1.15;

        this.renderer = new THREE.WebGLRenderer({
            canvas,
            antialias: true,
            alpha: true
        });
        this.renderer.setSize(canvas.clientWidth, canvas.clientHeight, false);
        this.renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        this.renderer.toneMapping = THREE.ACESFilmicToneMapping;
        this.renderer.toneMappingExposure = 1.1;

        this._buildComposer();
        this._buildStarfield();
        this._buildChip();
        this._buildBeam();
        this._buildOrbitRings();
        this._buildLights();
        this._buildHoverDetection();

        // The chip + beam + rings live in one group, offset to the right
        // of the screen to match a left-text / right-visual layout.
        this.group = new THREE.Group();
        this.group.add(this.chip);
        this.group.add(this.beam);
        this.group.add(this.ringsGroup);
        this.group.position.set(1.3, -0.2, 0);
        this.group.scale.set(1.35, 1.35, 1.35);
        this.scene.add(this.group);

        this._resizeHandler = () => this.resize();
        window.addEventListener("resize", this._resizeHandler);

        this._flying = false;
        this._raf = requestAnimationFrame(() => this._tick());
    }

    _buildComposer() {
        this.composer = new EffectComposer(this.renderer);
        const renderPass = new RenderPass(this.scene, this.camera);
        this.composer.addPass(renderPass);

        this.bloomPass = new UnrealBloomPass(
            new THREE.Vector2(this.canvas.clientWidth, this.canvas.clientHeight),
            1.15, // strength
            0.55, // radius
            0.15  // threshold
        );
        this.composer.addPass(this.bloomPass);
    }

    _buildStarfield() {
        const starCount = 900;
        const positions = new Float32Array(starCount * 3);
        for (let i = 0; i < starCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 60;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 40;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 60 - 10;
        }
        const geo = new THREE.BufferGeometry();
        geo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
        const mat = new THREE.PointsMaterial({
            color: 0xaad4ff,
            size: 0.045,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true
        });
        this.stars = new THREE.Points(geo, mat);
        this.scene.add(this.stars);
    }

    _buildChip() {
        // Square chip viewed corner-up (diamond silhouette), tilted slightly
        // so it reads as a 3D object rather than a flat card.
        const bodyGeo = new THREE.BoxGeometry(2.4, 0.2, 2.4);
        const bodyMat = new THREE.MeshPhysicalMaterial({
            color: 0x14141c,
            metalness: 0.4,
            roughness: 0.6
        });
        this.chip = new THREE.Mesh(bodyGeo, bodyMat);
        this.chip.rotation.y = Math.PI / 4; // diamond orientation
        this.chip.rotation.x = THREE.MathUtils.degToRad(28); // requested ~25-30 deg tilt

        const edges = new THREE.EdgesGeometry(bodyGeo);
        const edgeMat = new THREE.LineBasicMaterial({
            color: 0x7fc8ff,
            transparent: true,
            opacity: 0.7
        });
        this.chip.add(new THREE.LineSegments(edges, edgeMat));

        // Glowing core - this is what the bloom pass will make actually glow
        const coreGeo = new THREE.PlaneGeometry(1, 1);
        const coreMat = new THREE.MeshBasicMaterial({
            color: 0x66ccff,
            transparent: true,
            opacity: 0.95
        });
        this.core = new THREE.Mesh(coreGeo, coreMat);
        this.core.rotation.x = -Math.PI / 2;
        this.core.position.y = 0.12;
        this.chip.add(this.core);

        // Thin circuit-like lines etched across the top face
        const traceGroup = new THREE.Group();
        const traceMat = new THREE.LineBasicMaterial({ color: 0xbfe6ff, transparent: true, opacity: 0.35 });
        for (let i = -2; i <= 2; i++) {
            const pts = [
                new THREE.Vector3(i * 0.4, 0.11, -1.1),
                new THREE.Vector3(i * 0.4, 0.11, 1.1)
            ];
            const geo = new THREE.BufferGeometry().setFromPoints(pts);
            traceGroup.add(new THREE.Line(geo, traceMat));
        }
        this.chip.add(traceGroup);
    }

    _buildBeam() {
        // Vertical additive-blended light shaft shooting up from the chip core
        const beamGeo = new THREE.CylinderGeometry(0.006, 0.11, 14, 24, 1, true);
        const beamMat = new THREE.MeshBasicMaterial({
            color: 0x9fd8ff,
            transparent: true,
            opacity: 0.18,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide,
            depthWrite: false
        });
        this.beam = new THREE.Mesh(beamGeo, beamMat);
        this.beam.position.y = 7;
    }

    _buildOrbitRings() {
        this.ringsGroup = new THREE.Group();
        this.rings = [];
        this.orbitDots = []; // tracked separately so hover can control their glow

        const ringConfigs = [
            { radius: 2.0, color: 0x4fa8ff, tiltX: 0.3, tiltZ: 0.1, speed: 0.25 },
            { radius: 2.6, color: 0x8a6bff, tiltX: -0.4, tiltZ: 0.5, speed: -0.18 },
            { radius: 3.2, color: 0xff6bd6, tiltX: 0.6, tiltZ: -0.3, speed: 0.14 },
            { radius: 3.8, color: 0x4fa8ff, tiltX: -0.2, tiltZ: 0.8, speed: -0.1 }
        ];

        ringConfigs.forEach((cfg) => {
            const geo = new THREE.TorusGeometry(cfg.radius, 0.006, 8, 128);
            const mat = new THREE.MeshBasicMaterial({
                color: cfg.color,
                transparent: true,
                opacity: 0.5,
                blending: THREE.AdditiveBlending,
                depthWrite: false
            });
            const ring = new THREE.Mesh(geo, mat);
            ring.rotation.x = cfg.tiltX;
            ring.rotation.z = cfg.tiltZ;
            this.ringsGroup.add(ring);
            const ringData = { mesh: ring, speed: cfg.speed };
            this.rings.push(ringData);

            // A few bright "particle" points riding along each ring
            const dotCount = 3;
            for (let i = 0; i < dotCount; i++) {
                const dotGeo = new THREE.SphereGeometry(0.035, 8, 8);
                const dotMat = new THREE.MeshBasicMaterial({
                    color: cfg.color,
                    transparent: true,
                    opacity: 0.15, // dim by default, brightens on beam hover
                    blending: THREE.AdditiveBlending
                });
                const dot = new THREE.Mesh(dotGeo, dotMat);
                ring.add(dot);
                this.orbitDots.push(dot);
                ringData[`dot${i}`] = {
                    mesh: dot,
                    radius: cfg.radius,
                    offset: (i / dotCount) * Math.PI * 2
                };
            }
        });
    }

    _buildHoverDetection() {
        // The beam only glows brighter when the user's cursor is over it,
        // instead of pulsing on its own.
        this.raycaster = new THREE.Raycaster();
        this.mouse = new THREE.Vector2(-10, -10); // start off-screen
        this._beamHoverTarget = 0.06; // idle (near-invisible) opacity
        this.beam.material.opacity = this._beamHoverTarget;

        this._pointerMoveHandler = (event) => {
            const rect = this.canvas.getBoundingClientRect();
            this.mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
            this.mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;
        };
        this.canvas.addEventListener("pointermove", this._pointerMoveHandler);

        this._pointerLeaveHandler = () => {
            this.mouse.set(-10, -10);
        };
        this.canvas.addEventListener("pointerleave", this._pointerLeaveHandler);
    }

    _buildLights() {
        const ambient = new THREE.AmbientLight(0x1a2440, 1.5);
        this.scene.add(ambient);

        const key = new THREE.PointLight(0x66ccff, 26, 25);
        key.position.set(4, 3, 6);
        this.scene.add(key);

        const purple = new THREE.PointLight(0x8a5cff, 14, 20);
        purple.position.set(-3, -2, -2);
        this.scene.add(purple);

        const pink = new THREE.PointLight(0xff6bd6, 8, 15);
        pink.position.set(2, -3, 3);
        this.scene.add(pink);
    }

    _tick() {
        const elapsed = this.clock.getElapsedTime();

        if (!this._flying) {
            this.chip.rotation.y += 0.0035;
        }

        this.rings.forEach((r) => {
            // Rotating around Y (not the ring's own symmetry axis) is what
            // actually makes a tilted ring look like it's revolving.
            r.mesh.rotation.y += r.speed * 0.35 * 0.016;
            for (let i = 0; i < 3; i++) {
                const dot = r[`dot${i}`];
                if (!dot) continue;
                const angle = elapsed * 0.6 + dot.offset;
                dot.mesh.position.set(
                    Math.cos(angle) * dot.radius,
                    0,
                    Math.sin(angle) * dot.radius
                );
            }
        });

        // Beam and orbit dots only brighten on hover, via raycasting against the beam
        this.raycaster.setFromCamera(this.mouse, this.camera);
        const hit = this.raycaster.intersectObject(this.beam, false).length > 0;

        const targetBeamOpacity = hit ? 0.55 : 0.06;
        this.beam.material.opacity += (targetBeamOpacity - this.beam.material.opacity) * 0.12;

        const targetDotOpacity = hit ? 0.9 : 0.15;
        this.orbitDots.forEach((dot) => {
            dot.material.opacity += (targetDotOpacity - dot.material.opacity) * 0.12;
        });

        this.stars.rotation.y = elapsed * 0.01;

        this.composer.render();
        this._raf = requestAnimationFrame(() => this._tick());
    }

    // Called on "ENTER THE LAB" click - camera pushes into the chip's core.
    flyIn(gsap, onComplete) {
        this._flying = true;
        gsap.to(this.camera.position, {
            x: this.group.position.x,
            y: this.group.position.y + 0.2,
            z: 2,
            duration: 1.3,
            ease: "power2.inOut"
        });
        gsap.to(this.chip.rotation, {
            y: this.chip.rotation.y + Math.PI * 0.6,
            duration: 1.3,
            ease: "power2.inOut"
        });
        gsap.to(this.bloomPass, {
            strength: 2.5,
            duration: 1.3,
            ease: "power2.in",
            onComplete
        });
    }

    // Called when the user scrolls back up to the hero - reverses flyIn
    // so the scene returns to its original resting view.
    flyOut(gsap) {
        gsap.to(this.camera.position, {
            x: this._initialCameraPos.x,
            y: this._initialCameraPos.y,
            z: this._initialCameraPos.z,
            duration: 1.1,
            ease: "power2.inOut"
        });
        gsap.to(this.bloomPass, {
            strength: this._initialBloomStrength,
            duration: 1.1,
            ease: "power2.out",
            onComplete: () => {
                this._flying = false;
            }
        });
    }

    resize() {
        const width = this.canvas.clientWidth;
        const height = this.canvas.clientHeight;
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height, false);
        this.composer.setSize(width, height);
    }

    destroy() {
        cancelAnimationFrame(this._raf);
        window.removeEventListener("resize", this._resizeHandler);
        this.canvas.removeEventListener("pointermove", this._pointerMoveHandler);
        this.canvas.removeEventListener("pointerleave", this._pointerLeaveHandler);
        this.renderer.dispose();
    }
}