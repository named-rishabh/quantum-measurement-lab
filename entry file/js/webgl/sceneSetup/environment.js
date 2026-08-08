import { PMREMGenerator } from 'three';
import { RoomEnvironment } from
'three/examples/jsm/environments/RoomEnvironment.js';

export function addEnvironment(scene,renderer){

    const pmremGenerator = new PMREMGenerator( renderer );
    pmremGenerator.compileEquirectangularShader();

    // Apply it to the scene
    scene.environment = pmremGenerator.fromScene( new RoomEnvironment(), 0.04 ).texture;
}