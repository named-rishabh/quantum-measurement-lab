import * as THREE from "three";
import * as BufferGeometryUtils from "three/examples/jsm/utils/BufferGeometryUtils.js";

export default class WireManager {
    constructor() {
        this.group = new THREE.Group();
        // Stores paths bucketed by color key: { "#0257db": [ { points, thickness, tubularSegments, radialSegments }, ... ] }
        this.wireBatches = new Map();
        this.materials = new Map();
    }

    /**
     * Registers a wire path to be batched
     * @param {THREE.Vector3[]} cordinateList - Array of points defining the curve
     * @param {Object} options - Custom color, thickness, and segment quality
     */
    addWire(cordinateList, options = {}) {
        const color = options.color || "#0257db";
        const thickness = options.thickness || 0.015;
        const tubularSegments = options.tubularSegments || 48;
        const radialSegments = options.radialSegments || 8;

        if (!this.wireBatches.has(color)) {
            this.wireBatches.set(color, []);
        }

        this.wireBatches.get(color).push({
            points: cordinateList,
            thickness,
            tubularSegments,
            radialSegments
        });
    }

    /**
     * Builds and merges all registered wire paths into 1 mesh per color
     */
    buildWires() {
        // Safe Merge Helper to avoid index/attribute mismatch errors
        const safeMerge = (geometries) => {
            if (!geometries || geometries.length === 0) return null;
            const normalized = geometries.map((geo) => {
                const g = geo.index ? geo.toNonIndexed() : geo;
                if (!g.attributes.normal) g.computeVertexNormals();
                return g;
            });
            return BufferGeometryUtils.mergeGeometries(normalized, false);
        };

        this.wireBatches.forEach((wires, color) => {
            const geometries = [];

            wires.forEach(({ points, thickness, tubularSegments, radialSegments }) => {
                const curve = new THREE.CatmullRomCurve3(points);
                const tubeGeo = new THREE.TubeGeometry(
                    curve,
                    tubularSegments,
                    thickness,
                    radialSegments,
                    false
                );
                geometries.push(tubeGeo);
            });

            const mergedGeometry = safeMerge(geometries);

            if (mergedGeometry) {
                if (!this.materials.has(color)) {
                    this.materials.set(
                        color,
                        new THREE.MeshStandardMaterial({
                            color: color,
                            roughness: 0.4,
                            metalness: 0.1
                        })
                    );
                }

                const batchedMesh = new THREE.Mesh(mergedGeometry, this.materials.get(color));
                batchedMesh.castShadow = true;
                batchedMesh.receiveShadow = true;

                this.group.add(batchedMesh);
            }
        });
    }

    getGroup() {
        return this.group;
    }
}