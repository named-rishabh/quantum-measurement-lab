import * as THREE from "three";
import { GLTFExporter } from 'three/examples/jsm/exporters/GLTFExporter.js';
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

        // const glasswall= new Glasswall();
        // this.scene.add(glasswall.getGroup());

        this.cryoCase = new CryoCase();
        this.scene.add(this.cryoCase.getGroup());

        this.mixingchamber = new Mixingchamber();
        this.scene.add(this.mixingchamber.getGroup());

        // Using your Compressor class


        const stand = new DilutionRefrigerator();
        const ghsGroup = stand.getGroup();

    // Call the export function (e.g., on a button click or right after instantiating)
        // this.exportToGLB(ghsGroup, 'DilutionRefrigerator_.glb');
    }

    exportToGLB(inputObject, filename = 'model.glb') {
    const exporter = new GLTFExporter();

    const options = {
        binary: true,           // Output as .glb (binary format)
        trs: false,             // Preserves position, rotation, scale matrices
        onlyVisible: true,      // Skips hidden objects
        truncateDrawRange: true,
        embedImages: true       // Embed textures directly into the GLB
    };

    exporter.parse(
        inputObject,
        (gltf) => {
            // Success callback: gltf is an ArrayBuffer when binary: true
            const blob = new Blob([gltf], { type: 'application/octet-stream' });
            
            // Trigger automatic browser download
            const link = document.createElement('a');
            link.href = URL.createObjectURL(blob);
            link.download = filename;
            link.click();
            URL.revokeObjectURL(link.href);
        },
        (error) => {
            console.error('An error occurred while exporting the GLB:', error);
        },
        options
    );
}
}