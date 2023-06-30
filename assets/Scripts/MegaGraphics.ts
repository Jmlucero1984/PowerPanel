

import { _decorator, Component, director, MeshRenderer, gfx, Node, primitives, utils, Color, Button, Vec3, Mesh, resources, renderer, CameraComponent, UIMeshRenderer, RenderableComponent, Material, QuadRenderData, ModelComponent } from 'cc';

const { ccclass, property } = _decorator;

interface ISubMesh {
    positions: Float32Array;
    normals: Float32Array;
    uvs: Float32Array;
    minPos: Vec3;
    maxPos: Vec3;
}

@ccclass('MegaGraphics')
export class MegaGraphics extends Component {
 
    @property(CameraComponent)
    cameraComp: CameraComponent = null!

    @property(Material)
    material3d: Material = null!


    private _mainCamera: renderer.scene.Camera = null!;
    private _increaseVertexCount = 900;
    private _subMeshes: ISubMesh[] = [];
    private _options: primitives.ICreateDynamicMeshOptions = null!;
    private _geometries: primitives.IDynamicGeometry[] = [];
    private _dragon: MeshRenderer=null!;
    private _initialize: boolean = false;
    private _destroyed: boolean = false;
    private acum:number=0;

    // debug only
    private _showBoundingBox = false;
    private _boundingBoxColor = new Color(255, 255, 255, 255);

    public isLoadedMesh = false;


    onLoad() {
        this.node.addComponent(MeshRenderer);
        this.node.addComponent(UIMeshRenderer);
    }
    

    start() {
        
      
       this._dragon=this.node.getComponent(MeshRenderer) as MeshRenderer;
    
         
      
       this._dragon.setMaterial(this.material3d,0);
        this.node.setScale(new Vec3(100,100,1));
        this.initCamera();
       
        this.initMesh();
    }



    private initCamera() {
        this._mainCamera = this.cameraComp.camera;
    }

 

    private initMesh() {

        let options: primitives.ICreateDynamicMeshOptions = {
            maxSubMeshes: 0,
            maxSubMeshVertices: 0,
            maxSubMeshIndices: 0
        };
        let poligons = 1
        let triangles = 2 * poligons;
        let indices = [0,2,1,2,3,1]

        let newPositions = new Float32Array(indices.length * 3);
        let newNormals = new Float32Array(indices.length * 3);
        let newUvs = new Float32Array(12);
        let minPos = new Vec3(Infinity, Infinity, Infinity);
        let maxPos = new Vec3(-Infinity, -Infinity, -Infinity);
        let newPos = new Vec3();
        console.log("PHASE 1")
       
        let positions = [
          0, 4, 0,
         4,  2, 0,
         0, 0, 0,
          4, 0, 0  
        ]

  
        let normals = [
            0,1,-0,
            0,1,-0,
            0,1,-0,
            0,1,-0
        ]
      let uvs = [
     
   
      0.00, 0.0,
      0.00, 0.95,
      0.95, 0.0,
      0.00, 0.95,
      0.95, 0.95,
      0.95, 0.0,
    ]

        for (let i = 0; i < indices.length; i++) {
            const index = indices[i];
            console.log("----------------------")
            for (let k = 0; k < 3; k++) {
                console.log("POSITION del item i: "+i+" es "+positions[index * 3 + k])
                newPositions[i * 3 + k] = positions[index * 3 + k];
                console.log("NORMAL del item i: "+i+" es "+normals[index * 3 + k])
                newNormals[i * 3 + k] = normals[index * 3 + k];
            }
            newPos.set(newPositions[i * 3], newPositions[i * 3 + 1], newPositions[i * 3 + 2]);
            Vec3.min(minPos, minPos, newPos);
            Vec3.max(maxPos, maxPos, newPos); 
        }

        for(let i = 0; i<12;i++){
            newUvs[i] = uvs[i];

        }
        console.log("PHASE 2")
        const subMesh: ISubMesh = {
            positions: newPositions,
            normals: newNormals,
            uvs: newUvs,
            minPos,
            maxPos,
        };

        this._subMeshes.push(subMesh);
        options.maxSubMeshVertices = Math.max(options.maxSubMeshVertices, newPositions.length / 3);

        options.maxSubMeshes = this._subMeshes.length;
        this._options = options;
       

        for (let i = 0; i < this._options.maxSubMeshes; i++) {
            let geometry: primitives.IDynamicGeometry = {
                positions: this._subMeshes[i].positions,
                normals: this._subMeshes[i].normals,
                uvs: this._subMeshes[i].uvs,
                minPos: this._subMeshes[i].minPos,
                maxPos: this._subMeshes[i].maxPos,
            }

            this._geometries.push(geometry);
        }
        console.log(this._geometries.length)
        console.log("PHASE 3")


            const mesh = utils.MeshUtils.createDynamicMesh(0, this._geometries[0], undefined, this._options);
            for (let i = 0; i < this._options.maxSubMeshes; i++) {
                console.log("GEOM: "+this._geometries);
                mesh.updateSubMesh(i, this._geometries[i]);
            }
            const meshRenderer = this._dragon;//.getComponent(MeshRenderer) as MeshRenderer;
            meshRenderer.mesh=mesh;
            meshRenderer.onGeometryChanged();

            this._initialize = true;
            this.isLoadedMesh = true;
            console.log("load gltf succes")
      
        
    }
 

 

    onDestroy() {
        this._destroyed = true;
    }

    update(deltaTime: number) {
        if (!this._initialize) {
            return;
        }

 
    }
}

