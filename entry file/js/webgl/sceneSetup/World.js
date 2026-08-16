import * as THREE from "three";
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js';
import { KTX2Loader } from 'three/examples/jsm/loaders/KTX2Loader.js';
import DilutionRefrigerator from "../models/dilutionRefrigerator.js";
import PipeAssembly from "../models/pipeAssembly.js";
import ControlRack from "../models/controlRack/CRindex.js";
import Platform from "../models/Platform.js";
import classicalComputer from "../models/classicalComp.js";
import Glasswall from "../models/glasswall.js";
import CryoCase from "../models/cryocase.js";
import Mixingchamber from "../models/mixingchamber.js";

export default class World {
    constructor(experience, loadingManager) {
        this.scene = experience.scene;
        this.ktx2Loader = new KTX2Loader();
        this.ktx2Loader.setTranscoderPath('https://cdn.jsdelivr.net/npm/three@0.160.0/examples/jsm/libs/basis/');
        this.ktx2Loader.detectSupport(experience.renderer.renderer);

        this.gltfLoader = new GLTFLoader(loadingManager);
        this.gltfLoader.setKTX2Loader(this.ktx2Loader);

        const dilutionRefrigerator = new DilutionRefrigerator();
        this.scene.add(dilutionRefrigerator.getGroup());

        this.gltfLoader.load('./glbFiles/CompressorKTX2.glb', (gltf) => {
            const compressorModel = gltf.scene;
            this.scene.add(compressorModel);
        });


        this.gltfLoader.load('./glbFiles/ghsKTX2.glb', (gltf) => {
            const ghsModel = gltf.scene;
            this.scene.add(ghsModel);
        });

        const pipeAssembly = new PipeAssembly();
        this.scene.add(pipeAssembly.getGroup());

        this.gltfLoader.load('./glbFiles/StandKTX2.glb', (gltf) => {
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

        this.mixingchamber = new Mixingchamber();
        this.scene.add(this.mixingchamber.getGroup());

    }
}