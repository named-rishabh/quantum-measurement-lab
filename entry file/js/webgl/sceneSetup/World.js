import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import DilutionRefrigerator from "../models/dilutionRefrigerator.js";
import PipeAssembly from "../models/pipeAssembly.js";
import ControlRack from "../models/controlRack/CRindex.js";
import Platform from "../models/Platform.js";
import classicalComputer from "../models/classicalComp.js";
import Glasswall from "../models/glasswall.js";


export default class World {
    constructor(experience) {
        this.scene = experience.scene;

        const dilutionRefrigerator = new DilutionRefrigerator();
        this.scene.add(dilutionRefrigerator.getGroup());

        const compressorLoader = new GLTFLoader()
        compressorLoader.load('/glbFiles/Compressor.glb', (gltf) => {
            const model = gltf.scene;
            this.scene.add(model);
        });


        const GHS = new GLTFLoader()
        GHS.load('/glbFiles/ghs.glb', (gltf) => {
            const model = gltf.scene;
            const screenMesh = model.getObjectByName('TelemetryScreenMesh');
            this.scene.add(model);
        });

        const pipeAssembly = new PipeAssembly();
        this.scene.add(pipeAssembly.getGroup());

        const standLoader = new GLTFLoader()
        standLoader.load('/glbFiles/Stand.glb', (gltf) => {
            const model = gltf.scene;
            this.scene.add(model);
        });

        const controlRack = new ControlRack();
        this.scene.add(controlRack.getGroup());

        const classicalComputerInstance = new classicalComputer();
        this.scene.add(classicalComputerInstance.getGroup());

        const platform = new Platform();
        this.scene.add(platform.getGroup());

        const glasswall= new Glasswall();
        this.scene.add(glasswall.getGroup());
    }
}