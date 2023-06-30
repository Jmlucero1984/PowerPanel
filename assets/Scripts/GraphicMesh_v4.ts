


import { _decorator, Component, Node, Graphics, UI, graphicsAssembler, IAssembler, Vec2, Color, __private, UIVertexFormat, gfx, warnID, director, RenderingSubMesh, Vec3, v2, Texture2D, Size, size, Material, MeshRenderData, log, Renderable2D } from 'cc';
 

const { ccclass, property } = _decorator;
 


const attributes2 = UIVertexFormat.vfmtPosColor.concat([
    new gfx.Attribute('a_dist', gfx.Format.R32F),
    new gfx.Attribute('a_line', gfx.Format.R32F),
]);

const componentPerVertex2 = UIVertexFormat.getComponentPerVertex(attributes2);

const stride2 = UIVertexFormat.getAttributeStride(attributes2);

class Point2 extends Vec2 {
    public dx = 0;
    public dy = 0;
    public dmx = 0;
    public dmy = 0;
    public flags = 0;
    public len = 0;
    public lineLength = 0;
    constructor(x: number, y: number) {
        super(x, y);
        this.reset();
    }

    public reset() {
        this.dx = 0;
        this.dy = 0;
        this.dmx = 0;
        this.dmy = 0;
        this.flags = 0;
        this.len = 0;
        this.lineLength = 0;
    }
}


const attrBytes2 = 9;
let _impl: __private._cocos_2d_assembler_graphics_webgl_impl__Impl | null = null;

const MAX_VERTEX = 65535;
const MAX_INDICES = MAX_VERTEX * 2;

const PI = Math.PI;
const min = Math.min;
const max = Math.max;
const ceil = Math.ceil;
const acos = Math.acos;
const cos = Math.cos;
const sin = Math.sin;
const atan2 = Math.atan2;
const _tempV2 = v2();


let _renderData: MeshRenderData | null = null;
const _curColor = new Color();

const vec3_temps: Vec3[] = [];
for (let i = 0; i < 4; i++) {
    vec3_temps.push(new Vec3());
}

let indexStart:number =0;
let lineC: number = 1;
let bezierPoints_to_mesh: Vec2[] = [];
let meshWidth:number=0;
let uv_unit:boolean=false;
const calculateDistances = function(points:Vec2[]):number[] {
    let sum=0;
    const res=function (vector_a:Vec2,vector_b:Vec2){
        return  v2(vector_a.x-vector_b.x,vector_a.y-vector_b.y);
    }
    let _distances:number[]=[];
    for (let index = 0; index < points.length-1; index++) {
        let dist=res(points[index+1], points[index]).length()
         _distances.push(dist)
         sum+=dist;  
    }
    _distances.push(sum);
    return _distances;
}

const pushInto = function (receiver:any, newData:any[]) {
    for (let index = 0; index < newData.length; index++) {
        receiver.copyWithin
        receiver.push(newData[index]); 
    }
}




const calculateExternals=function (points:Vec2[],offset:number):Vec2[] {
    const offsetPoints: Vec2[] = [];
    const res=function (vector_a:Vec2,vector_b:Vec2){ return  v2(vector_a.x-vector_b.x,vector_a.y-vector_b.y);}
    const prod=function(esc:number, vector:Vec2){  return v2(esc*vector.x,esc*vector.y )  }
    const normalize=function (vector:Vec2,len:number){
        let mag=vector.normalize()
        return prod(len,mag);
    }
    const perpendicular=function (vector:Vec2){
        return v2(-vector.y,vector.x);
    }
    const sum=function (vector_a:Vec2,vector_b:Vec2){
        return v2(vector_a.x+vector_b.x,vector_a.y+vector_b.y);
    }
    let dir:Vec2;
    for (let index = 0; index < points.length-1; index++) {
        let pointFront=v2(points[index+1].x,points[index+1].y)
        let pointBack=v2(points[index].x,points[index].y)
        dir=res(pointFront,pointBack);
        let perpend=sum(perpendicular( normalize(dir,offset)),pointBack);
        offsetPoints.push(perpend)
    }
    offsetPoints.push(sum(perpendicular( normalize(dir,offset)),v2(points[points.length-1].x,points[points.length-1].y)));
    return offsetPoints;
}


@ccclass('GraphicMesh_v4')
export class GraphicMesh_v4 extends Graphics {
    @property({ group:"Render" })
    @property(Texture2D)
    lineTexture: Texture2D = null;
    @property({ group:"Render" })
    @property(Material)
    Render_Mat: Material = null;

    onLoad() { 
        if (this.lineTexture) {
            this.lineWidth = this.lineTexture.height;
            lineC = this.lineWidth / (this.lineTexture.height * 1 * this.lineTexture.width);
        }
        if (this.Render_Mat) {
            this.setMaterial(this.Render_Mat, 0);
            if (this.lineTexture)
                this.getSharedMaterial(0).setProperty("texture1", this.lineTexture);
        } 
        super.onLoad();
    }

    onEnable() {
        if (this.Render_Mat) {
            this.setMaterial(this.Render_Mat, 0);
            if (this.lineTexture)
                this.getSharedMaterial(0).setProperty("texture1", this.lineTexture);
        } 
    }
    onDestroy() {

    };

    start() {

    }
    loadData(points:Vec2[], mWidth:number, uv_u:boolean) {
        uv_unit=uv_u;
        bezierPoints_to_mesh=points;
        meshWidth=mWidth;
    }


    /**
     * initialization assembler render data assembler
     */
    protected _flushAssembler() {
        const assembler = Graphics.Assembler!.getAssembler(this);
        let superGraphicsAssembler: any = {};
        for (let kk in assembler) {
            superGraphicsAssembler[kk] = assembler[kk];
        }
  
        superGraphicsAssembler.stroke = function (graphics: Graphics) {
            Color.copy(_curColor, graphics.strokeColor);
 
            if (!graphics.impl) { return; }
            this._expandStroke!(graphics);
            graphics.impl.updatePathOffset = true;
            this.end(graphics);
        };

 
        superGraphicsAssembler._expandStroke = function (graphics: Graphics) {
            let indexStart:number =0;
   
            _impl = graphics.impl;
            if (!_impl) { return; }

            const meshBuffer: MeshRenderData | null = _renderData = this.getRenderData!(graphics,300);
            if (!meshBuffer) {return;  }
            let abovePoints =  calculateExternals(bezierPoints_to_mesh,meshWidth);
            let underPoints =  calculateExternals(bezierPoints_to_mesh,-meshWidth);
            let distances = calculateDistances(bezierPoints_to_mesh);
        
           let my_i_data:number[]=[];
            let my_v_data:Float32List=[];
            if(uv_unit) {
          
                for (let index = 0; index < bezierPoints_to_mesh.length-1; index++) {
             
            
                    pushInto(my_v_data, [abovePoints[index].x,abovePoints[index].y,0,1,1,1,1,1,0]);
                    pushInto(my_v_data, [bezierPoints_to_mesh[index].x,bezierPoints_to_mesh[index].y,0,1,1,1,1,0,0])
                    pushInto(my_v_data, [underPoints[index].x,underPoints[index].y,0,1,1,1,1,-1,0])
                    pushInto(my_v_data, [abovePoints[index+1].x,abovePoints[index+1].y,0,1,1,1,1,1,1]);
                    pushInto(my_v_data, [bezierPoints_to_mesh[index+1].x,bezierPoints_to_mesh[index+1].y,0,1,1,1,1,0,1])
                    pushInto(my_v_data, [underPoints[index+1].x,underPoints[index+1].y,0,1,1,1,1,-1,1])
            
                }
                let initIndex=0;
          
                for (let index = 1; index < bezierPoints_to_mesh.length; index++) {
     
                 pushInto(my_i_data, [initIndex+2,initIndex+1,initIndex+5])
                 pushInto(my_i_data, [initIndex+1,initIndex+5,initIndex+4])
                 pushInto(my_i_data, [initIndex+1,initIndex,initIndex+4])
                 pushInto(my_i_data, [initIndex,initIndex+4,initIndex+3])
                  
                     initIndex+=6;
                 } 
            } else {
                let u_acum=0;
                for (let index = 0; index < bezierPoints_to_mesh.length; index++) {
                    let vcoord=0;
                    let totalLenght=distances[distances.length-1];
                    if(index>0) {
                        u_acum+=distances[index-1];
                        vcoord=u_acum/totalLenght;
                    }
            
                    pushInto(my_v_data, [abovePoints[index].x,abovePoints[index].y,0,1,1,1,1,1,vcoord]);
                    pushInto(my_v_data, [bezierPoints_to_mesh[index].x,bezierPoints_to_mesh[index].y,0,1,1,1,1,0,vcoord])
                    pushInto(my_v_data, [underPoints[index].x,underPoints[index].y,0,1,1,1,1,-1,vcoord])
            
                }
                let initIndex=0;
          
                for (let index = 1; index < bezierPoints_to_mesh.length; index++) {
     
                 pushInto(my_i_data, [initIndex+2,initIndex+1,initIndex+5])
                 pushInto(my_i_data, [initIndex+1,initIndex+5,initIndex+4])
                 pushInto(my_i_data, [initIndex+1,initIndex,initIndex+4])
                 pushInto(my_i_data, [initIndex,initIndex+4,initIndex+3])
                  
                     initIndex+=3;
                 } 
            }
          
        
                
            for (let index = 0; index < my_i_data.length; index++) {
                this._iSet(my_i_data[index])       
             }
       
            for (let index = 0; index < my_v_data.length; index+=9) {
                this._vSet(my_v_data[index],my_v_data[index+1],my_v_data[index+7],my_v_data[index+8])    
             }
       
            _renderData = null;
            _impl = null;
        }; 
        
        
        //**get a render data */
        superGraphicsAssembler.getRenderData = function (graphics: Graphics, vertexCount: number): MeshRenderData {
 
            if (!_impl) {
                return null;
            }
            const renderDataList = _impl.getRenderDataList();
            let renderData = renderDataList[_impl.dataOffset];
            if (!renderData) {
                return null;
            }

            let meshBuffer = renderData;
            const maxVertexCount = meshBuffer ? meshBuffer.vertexStart + vertexCount : 0;
            if (maxVertexCount > MAX_VERTEX || maxVertexCount * 3 > MAX_INDICES) {
                ++_impl.dataOffset;

                if (_impl.dataOffset < renderDataList.length) {
                    renderData = renderDataList[_impl.dataOffset];
                } else {
                    renderData = _impl.requestRenderData();
                    renderDataList[_impl.dataOffset] = renderData;
                }
                meshBuffer = renderData;
            }

            if (meshBuffer && meshBuffer.vertexCount < maxVertexCount) {
                meshBuffer.request(vertexCount, vertexCount * 3);
            }
            return renderData;
        };
        
        superGraphicsAssembler._iSet = function (i: number) {
            if (!_renderData) {
                return;
            }
            const meshBuffer = _renderData;
           // let dataOffset = meshBuffer.vertexStart * attrBytes2;
            const iData = meshBuffer.iData;
            iData[ meshBuffer.indexStart] = i;
            meshBuffer.indexStart++;
        }
            /**set vertex data */
            superGraphicsAssembler._vSet = function (x: number, y: number, distance = 0, lineLong = 0) {
                if (!_renderData) {
                    return;
                }
                const meshBuffer = _renderData;
                let dataOffset = meshBuffer.vertexStart * attrBytes2;
                const vData = meshBuffer.vData;
                vData[dataOffset++] = x;
                vData[dataOffset++] = y;
                vData[dataOffset++] = 0;
                Color.toArray(vData, Color.WHITE, dataOffset);
                dataOffset += 4;
                vData[dataOffset++] = distance;
                vData[dataOffset++] = lineLong;
                meshBuffer.vertexStart++;
            }

        if (this._assembler !== superGraphicsAssembler) {
            this._assembler = superGraphicsAssembler;
        }
    }

    /**Create vertex databuffer */
    public activeSubModel(idx: number) {
        if (!this.model) {
            warnID(4500, this.node.name);
            return;
        }

        if (this.model.subModels.length <= idx) {
            const gfxDevice: gfx.Device = director.root.device;
            const vertexBuffer = gfxDevice.createBuffer(new gfx.BufferInfo(
                gfx.BufferUsageBit.VERTEX | gfx.BufferUsageBit.TRANSFER_DST,
                gfx.MemoryUsageBit.DEVICE,
                65535 * stride2,
                stride2,
            ));
            const indexBuffer = gfxDevice.createBuffer(new gfx.BufferInfo(
                gfx.BufferUsageBit.INDEX | gfx.BufferUsageBit.TRANSFER_DST,
                gfx.MemoryUsageBit.DEVICE,
                65535 * Uint16Array.BYTES_PER_ELEMENT * 2,
                Uint16Array.BYTES_PER_ELEMENT,
            ));
            const renderMesh = new RenderingSubMesh([vertexBuffer], attributes2, gfx.PrimitiveMode.TRIANGLE_LIST, indexBuffer);
            renderMesh.subMeshIdx = 0;
            if (this.getMaterialInstance(0)) {
                this.model.initSubModel(idx, renderMesh, this.getMaterialInstance(0)!);
            }
            this["_graphicsUseSubMeshes"].push(renderMesh);
        }
    }
    /**Refresh the rendering data */
    protected _uploadData() {
        const impl = this.impl;
        if (!impl) {
            return;
        }

        const renderDataList = impl && impl.getRenderDataList();
        if (renderDataList.length <= 0 || !this.model) {
            return;
        }

        const subModelList = this.model.subModels;
        for (let i = 0; i < renderDataList.length; i++) {
            const renderData = renderDataList[i];
            const ia = subModelList[i].inputAssembler;
            if (renderData.lastFilledVertex === renderData.vertexStart) { continue; }
            const vb = new Float32Array(renderData.vData.buffer, 0, renderData.vertexStart * componentPerVertex2);
            ia.vertexBuffers[0].update(vb);
            ia.vertexCount = renderData.vertexStart;
            const ib = new Uint16Array(renderData.iData.buffer, 0, renderData.indexStart);
            ia.indexBuffer!.update(ib);
            ia.indexCount = renderData.indexStart;
            renderData.lastFilledVertex = renderData.vertexStart;
            renderData.lastFilledIndex = renderData.indexStart;
        }
        this._isNeedUploadData = false;
    }

}

