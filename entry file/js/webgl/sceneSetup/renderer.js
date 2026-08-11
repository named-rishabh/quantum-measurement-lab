// Draws the scene onto the canvas every frame.

import {WebGLRenderer} from "three";
import Stats from "three/examples/jsm/libs/stats.module.js";

export default class Renderer {
    constructor(experience) {
        this.experience = experience;
        this.width = this.experience.wrapper.getBoundingClientRect().width;
        this.height = this.experience.wrapper.getBoundingClientRect().height;
        this.scene = experience.scene;
        this.camera = experience.camera.camera;
        this.stats = new Stats();
        this.stats.showPanel(0); // 0: fps, 1: ms, 2: mb
        document.body.appendChild(this.stats.dom);
        this.renderer = new WebGLRenderer({
            canvas: experience.canvas,
            antialias: true

        });
        this.renderer.debug.checkShaderErrors = false;
        this.renderer.setSize(
            this.width, this.height
        );
        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );

    }

    resize(width, height) {
        this.renderer.setSize(
            width, height
        );
        this.renderer.setPixelRatio(
            Math.min(window.devicePixelRatio, 2)
        );
    }

    update() {
        this.stats.begin();
        this.renderer.render(
            this.scene,
            this.camera
        );
        this.stats.end();
    }
}