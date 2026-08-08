import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
import DilutionRefrigerator from "../models/dilutionRefrigerator.js";
import PipeAssembly from "../models/pipeAssembly.js";
import ControlRack from "../models/controlRack/CRindex.js";
import Platform from "../models/Platform.js";
import classicalComputer from "../models/classicalComp.js";
import Glasswall from "../models/glasswall.js";
import CryoCase from "../models/cryocase.js";


export default class World {
    constructor(experience, loadingManager) {
        this.scene = experience.scene;
        this.gltfLoader = new GLTFLoader(loadingManager);

        const dilutionRefrigerator = new DilutionRefrigerator();
        this.scene.add(dilutionRefrigerator.getGroup());

        this.gltfLoader.load('/glbFiles/Compressor.glb', (gltf) => {
            const compressorModel = gltf.scene;
            this.scene.add(compressorModel);
        });


        this.gltfLoader.load('/glbFiles/ghs.glb', (gltf) => {
            const ghsModel = gltf.scene;
            this.scene.add(ghsModel);
        });

        const pipeAssembly = new PipeAssembly();
        this.scene.add(pipeAssembly.getGroup());

        this.gltfLoader.load('/glbFiles/Stand.glb', (gltf) => {
            const standModel = gltf.scene;
            this.scene.add(standModel);
        });

        const controlRack = new ControlRack();
        this.scene.add(controlRack.getGroup());

        const classicalComputerInstance = new classicalComputer();
        this.scene.add(classicalComputerInstance.getGroup());

        const platform = new Platform();
        this.scene.add(platform.getGroup());

        const glasswall= new Glasswall();
        this.scene.add(glasswall.getGroup());

        this.cryoCase = new CryoCase();
        this.scene.add(this.cryoCase.getGroup());
    }
}