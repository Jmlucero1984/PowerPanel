
import { _decorator, Component, Node, Graphics, UI, graphicsAssembler, IAssembler, Vec2, Color, __private, UIVertexFormat, gfx, warnID, director, RenderingSubMesh, Vec3, v2, Texture2D, Size, size, Material, MeshRenderData, log, Renderable2D } from 'cc';
import { earcut } from './earcut';

const { ccclass, property } = _decorator;

/**
 * Predefined variables
 * Name = SuperGraphics
 * DateTime = Thu Dec 09 2021 11:01:18 GMT+0800 (中国标准时间)
 * Author = 希格斯玻色子
 * FileBasename = SuperGraphics.ts
 * FileBasenameNoExtension = SuperGraphics
 * URL = db://assets/scripts/app/mediator/common/SuperGraphics.ts
 * ManualUrl = https://docs.cocos.com/creator/3.3/manual/zh/
 *
 */



 const attributes2 = UIVertexFormat.vfmtPosColor.concat([
    new gfx.Attribute('a_dist', gfx.Format.R32F),
    new gfx.Attribute('a_line',gfx.Format.R32F),
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
    constructor (x: number, y: number) {
        super(x, y);
        this.reset();
    }

    public reset () {
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

function curveDivs (r: number, arc: number, tol: number) {
    const da = acos(r / (r + tol)) * 2.0;
    return max(2, ceil(arc / da));
}

function clamp (v: number, minNum: number, maxNum: number) {
    if (v < minNum) {
        return minNum;
    } else if (v > maxNum) {
        return maxNum;
    }
    return v;
}

let lineC:number = 1;


 
@ccclass('SuperGraphics')
export class SuperGraphics extends Graphics {
    @property(Texture2D)
    lineTexture:Texture2D = null;
    @property(Material)
    myMat:Material = null;

    onLoad(){
        if (this.lineTexture){
            this.lineWidth = this.lineTexture.height;
            lineC =   this.lineWidth/ (this.lineTexture.height *1  * this.lineTexture.width);
        }
        if (this.myMat){
            this.setMaterial(this.myMat,0);
            if (this.lineTexture)
             this.getMaterial(0).setProperty("texture1",this.lineTexture);
        }
        
        super.onLoad();
    }

    onEnable(){
        if (this.myMat){
            this.setMaterial(this.myMat,0);
            if (this.lineTexture)
             this.getMaterial(0).setProperty("texture1",this.lineTexture);
        }
    }

    start () {
        
    }

    /**
     * initialization assembler render data assembler
     */
    protected _flushAssembler () {
        const assembler = Graphics.Assembler!.getAssembler(this);
        /*********** */
        let superGraphicsAssembler:any = {};
        //Copy the properties of the original assembler
        for(let kk in assembler){
            superGraphicsAssembler[kk] = assembler[kk];
        }
        //Modify the properties of the new assembler
        /**connection*/
        superGraphicsAssembler.stroke = function (graphics: Graphics) {
            Color.copy(_curColor, graphics.strokeColor);
            // graphics.node.getWorldMatrix(_currMatrix);
            if (!graphics.impl) {
                return;
            }
    
            this._flattenPaths!(graphics.impl);
            this._expandStroke!(graphics);
    
            graphics.impl.updatePathOffset = true;
    
            this.end(graphics);
        };
        /**filling*/
        superGraphicsAssembler.fill = function (graphics: Graphics) {
            Color.copy(_curColor, graphics.fillColor);
            // graphics.node.getWorldMatrix(_currMatrix);
    
            this._expandFill!(graphics);
            if (graphics.impl) {
                graphics.impl.updatePathOffset = true;
            }
    
            this.end(graphics);
        }
        /**Path data collation */
        superGraphicsAssembler._flattenPaths = function (impl: __private._cocos_2d_assembler_graphics_webgl_impl__Impl) {
            const paths = impl.paths;
            for (let i = impl.pathOffset, l = impl.pathLength; i < l; i++) {
                const path = paths[i];
                const pts = path.points;
    
                let p0 = pts[pts.length - 1];
                let p1 = pts[0];
    
                // if (pts.length > 2 && p0.equals(p1)) {
                //     path.closed = true;
                //     pts.pop();
                //     p0 = pts[pts.length - 1];
                // }
                /******** */
                let lineLength = 0;
                pts[0]["lineLength"] = lineLength;
                let p00:__private._cocos_2d_assembler_graphics_webgl_impl__Point = null;
                let p11 = pts[0];
                let subPos = v2();
                /********* */
                for (let j = 0, size = pts.length; j < size; j++) {
                    // Calculate segment direction and length
                    const dPos = new Point2(p1.x, p1.y);
                    dPos.subtract(p0);
                    p0.len = dPos.length();
                    if (dPos.x || dPos.y) {
                        dPos.normalize();
                    }
                    p0.dx = dPos.x;
                    p0.dy = dPos.y;
                    //***** */
                    p11 = pts[j];
                    if (j != 0){
                        //p0 is the previous one, p1 is the current one
                        //p00 It is the previous one, and p11 is the current one
                        Vec2.subtract(subPos,p11,p00);
                        lineLength += (subPos.length() * lineC);
                        p11["lineLength"] = lineLength;
                    }
                    p00 = pts[j] ;
                    //******* */
                    // Advance
                    p0 = p1;
                    p1 = pts[j + 1];

                }
                // if (pts.length > 3 && pts[pts.length-1].len != pts[pts.length-2].len){
                //     pts[pts.length - 1].len = pts[pts.length-2].len;
                // }
                log(pts);
            }
        };
        //**get a render data */
        superGraphicsAssembler.getRenderData = function (graphics: Graphics, vertexCount: number):MeshRenderData {
            console.log("GetRenderData called")
            if (!_impl) {
                return null;
            }
    
            const renderDataList = _impl.getRenderDataList();
            console.log("renderDataList: "+renderDataList)
      
            let renderData = renderDataList[_impl.dataOffset];
            if (!renderData) {
                return null;
            }
            console.log("render data: " + renderData)
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
        /**Assembling Wired Rendering Data */
        superGraphicsAssembler._expandStroke = function(graphics: Graphics) {
            const w = graphics.lineWidth * 2;
            const lineCap = graphics.lineCap;
            const lineJoin = graphics.lineJoin;
            const miterLimit = graphics.miterLimit;
    
            _impl = graphics.impl;
    
            if (!_impl) {
                return;
            }
    
            const nCap = curveDivs(w, PI, _impl.tessTol);
    
            this._calculateJoins(_impl, w, lineJoin, miterLimit);
    
            const paths = _impl.paths;
    
            // Calculate max vertex usage.
            let vertexCount = 0;
            console.log("_impl.pahOffset: "+ _impl.pathOffset)
            console.log("_impl.pahOffset: "+ _impl.pathOffset)
            for (let i = _impl.pathOffset, l = _impl.pathLength; i < l; i++) {
                const path = paths[i];
                const pointsLength = path.points.length;
    
                if (lineJoin == 1) {
                    vertexCount += (pointsLength + path.bevel * (nCap + 2) + 1) * 2;
                } else {
                    vertexCount += (pointsLength + path.bevel * 5 + 1) * 2;
                } // plus one for loop
    
                if (!path.closed) {
                    // space for caps
                    if (lineCap == 1) {
                        vertexCount += (nCap * 2 + 2) * 2;
                    } else {
                        vertexCount += (3 + 3) * 2;
                    }
                }
            }
            console.log("VERTEX COUNT: " + vertexCount)
    
            const meshBuffer: MeshRenderData | null = _renderData = this.getRenderData!(graphics, vertexCount);
            if (!meshBuffer) {
                return;
            }
            const vData = meshBuffer.vData;
            const iData = meshBuffer.iData;
    
            for (let i = _impl.pathOffset, l = _impl.pathLength; i < l; i++) {
                const path = paths[i];
                const pts = path.points;
                const pointsLength = pts.length;
                const offset = meshBuffer.vertexStart;
    
                let p0: Point2;
                let p1: Point2;
                let start = 0;
                let end = 0;
                const loop = path.closed;
                let startEndL:number = 0;
                if (loop) {
                    // Looping
                    p0 = pts[pointsLength - 1] as Point2;
                    p1 = pts[0] as Point2;
                    start = 0;
                    end = pointsLength;
                    Vec2.subtract(_tempV2,p1,p0);
                    startEndL = _tempV2.length();
                } else {
                    // Add cap
                    p0 = pts[0] as Point2;
                    p1 = pts[1] as Point2;
                    start = 1;
                    end = pointsLength - 1;
                }
    
                p1 = p1 || p0;
    
                if (!loop) {
                    // Add cap
                    const dPos = new Point2(p1.x, p1.y);
                    dPos.subtract(p0);
                    dPos.normalize();
    
                    const dx = dPos.x;
                    const dy = dPos.y;
    
                    if (lineCap == 0) {
                        this._buttCapStart!(p0, dx, dy, w, 0);
                    } else if (lineCap == 2) {
                        this._buttCapStart!(p0, dx, dy, w, w);
                    } else if (lineCap == 1) {
                        this._roundCapStart!(p0, dx, dy, w, nCap);
                    }
                }
    
                for (let j = start; j < end; ++j) {
                    if (lineJoin == 1) {
                        this._roundJoin(p0, p1, w, w, nCap);
                    } else if ((p1.flags & (0x04 | 0x08)) !== 0) {
                        this._bevelJoin(p0, p1, w, w);
                    } else {
                        this._vSet!(p1.x + p1.dmx * w, p1.y + p1.dmy * w, 1,p1.lineLength);
                        this._vSet!(p1.x - p1.dmx * w, p1.y - p1.dmy * w, -1,p1.lineLength);
                    }
    
                    p0 = p1;
                    p1 = pts[j + 1] as Point2;
                }
    
                if (loop) {
                    // Loop it
                    const vDataOffset = offset * attrBytes2;
                    this._vSet(vData[vDataOffset], vData[vDataOffset + 1], 1,startEndL);
                    this._vSet(vData[vDataOffset + attrBytes2], vData[vDataOffset + attrBytes2 + 1], -1,startEndL);
                } else {
                    // Add cap
                    const dPos = new Point2(p1.x, p1.y);
                    dPos.subtract(p0);
                    dPos.normalize();
    
                    const dx = dPos.x;
                    const dy = dPos.y;
    
                    if (lineCap == 0) {
                        this._buttCapEnd!(p1, dx, dy, w, 0);
                    } else if (lineCap == 2) {
                        this._buttCapEnd!(p1, dx, dy, w, w);
                    } else if (lineCap == 1) {
                        this._roundCapEnd!(p1, dx, dy, w, nCap);
                    }
                }
    
                // stroke indices
                let indicesOffset = meshBuffer.indexStart;
                for (let begin = offset + 2, over = meshBuffer.vertexStart; begin < over; begin++) {
                    iData[indicesOffset++] = begin - 2;
                    iData[indicesOffset++] = begin - 1;
                    iData[indicesOffset++] = begin;
                }
    
                meshBuffer.indexStart = indicesOffset;
            }
            _renderData = null;
            _impl = null;
        };

        /**Assembling Populate Render Data */
        superGraphicsAssembler._expandFill = function(graphics: Graphics) {
            _impl = graphics.impl;
            if (!_impl) {
                return;
            }
    
            const paths = _impl.paths;
    
            // Calculate max vertex usage.
            let vertexCount = 0;
            for (let i = _impl.pathOffset, l = _impl.pathLength; i < l; i++) {
                const path = paths[i];
                const pointsLength = path.points.length;
    
                vertexCount += pointsLength;
            }
    
            const renderData: MeshRenderData | null = _renderData = this.getRenderData!(graphics, vertexCount);
            if (!renderData) {
                return;
            }
    
            const meshBuffer = renderData;
            const vData = meshBuffer.vData;
            const iData = meshBuffer.iData;
    
            for (let i = _impl.pathOffset, l = _impl.pathLength; i < l; i++) {
                const path = paths[i];
                const pts = path.points;
                const pointsLength = pts.length;
    
                if (pointsLength === 0) {
                    continue;
                }
    
                // Calculate shape vertices.
                const vertexOffset = renderData.vertexStart;
    
                for (let j = 0; j < pointsLength; ++j) {
                    if (pts[j].y > 0){
                        this._vSet!(pts[j].x, pts[j].y,0,pts[j]["lineLength"]);
                    }else{
                        this._vSet!(pts[j].x, pts[j].y,60,pts[j]["lineLength"]);
                    }
                    
                }
    
                let indicesOffset = renderData.indexStart;
    
                if (path.complex) {
                    const earcutData: number[] = [];
                    for (let j = vertexOffset, end = renderData.vertexStart; j < end; j++) {
                        let vDataOffset = j * attrBytes2;
                        earcutData.push(vData[vDataOffset++]);
                        earcutData.push(vData[vDataOffset++]);
                        earcutData.push(vData[vDataOffset++]);
                    }
    
                    const newIndices =   earcut(earcutData, null, 3);
    
                    if (!newIndices || newIndices.length === 0) {
                        continue;
                    }
    
                    for (let j = 0, nIndices = newIndices.length; j < nIndices; j++) {
                        iData[indicesOffset++] = newIndices[j] + vertexOffset;
                    }
                } else {
                    const first = vertexOffset;
                    for (let start = vertexOffset + 2, end = meshBuffer.vertexStart; start < end; start++) {
                        iData[indicesOffset++] = first;
                        iData[indicesOffset++] = start - 1;
                        iData[indicesOffset++] = start;
                    }
                }
    
                meshBuffer.indexStart = indicesOffset;
            }
    
            _renderData = null;
            _impl = null;
        };
        superGraphicsAssembler._buttCapStart = function (p: Point2, dx: number, dy: number, w: number, d: number) {
            const px = p.x - dx * d;
            const py = p.y - dy * d;
            const dlx = dy;
            const dly = -dx;
    
            this._vSet!(px + dlx * w, py + dly * w, 1,p.lineLength);
            this._vSet!(px - dlx * w, py - dly * w, -1,p.lineLength);
        };

        superGraphicsAssembler._buttCapEnd = function (p: Point2, dx: number, dy: number, w: number, d: number) {
            const px = p.x + dx * d;
            const py = p.y + dy * d;
            const dlx = dy;
            const dly = -dx;
    
            this._vSet!(px + dlx * w, py + dly * w, 1,p.lineLength);
            this._vSet!(px - dlx * w, py - dly * w, -1,p.lineLength);
        };

        superGraphicsAssembler._roundCapStart = function (p: Point2, dx: number, dy: number, w: number, nCap: number) {
            const px = p.x;
            const py = p.y;
            const dlx = dy;
            const dly = -dx;
    
            for (let i = 0; i < nCap; i++) {
                const a = i / (nCap - 1) * PI;
                const ax = cos(a) * w;
                const ay = sin(a) * w;
                this._vSet!(px - dlx * ax - dx * ay, py - dly * ax - dy * ay, 1,p.lineLength);
                this._vSet!(px, py, 0,p.lineLength);
            }
            this._vSet!(px + dlx * w, py + dly * w, 1,p.lineLength);
            this._vSet!(px - dlx * w, py - dly * w, -1,p.lineLength);
        };

        superGraphicsAssembler._roundCapEnd = function (p: Point2, dx: number, dy: number, w: number, nCap: number) {
            const px = p.x;
            const py = p.y;
            const dlx = dy;
            const dly = -dx;
    
            this._vSet!(px + dlx * w, py + dly * w, 1,p.lineLength);
            this._vSet!(px - dlx * w, py - dly * w, -1,p.lineLength);
            for (let i = 0; i < nCap; i++) {
                const a = i / (nCap - 1) * PI;
                const ax = cos(a) * w;
                const ay = sin(a) * w;
                this._vSet!(px, py, 0,p.lineLength);
                this._vSet!(px - dlx * ax + dx * ay, py - dly * ax + dy * ay, 1,p.lineLength);
            }
        };

        superGraphicsAssembler._roundJoin = function (p0: Point2, p1: Point2, lw: number, rw: number, nCap: number) {
            const dlx0 = p0.dy;
            const dly0 = -p0.dx;
            const dlx1 = p1.dy;
            const dly1 = -p1.dx;
    
            const p1x = p1.x;
            const p1y = p1.y;
    
            if ((p1.flags & 0x02) !== 0) {
                const out = this._chooseBevel!(p1.flags & 0x08, p0, p1, lw);
                const lx0 = out[0];
                const ly0 = out[1];
                const lx1 = out[2];
                const ly1 = out[3];
    
                const a0 = atan2(-dly0, -dlx0);
                let a1 = atan2(-dly1, -dlx1);
                if (a1 > a0) { a1 -= PI * 2; }
    
                this._vSet!(lx0, ly0, 1,p1.lineLength);
                this._vSet!(p1x - dlx0 * rw, p1.y - dly0 * rw, -1,p1.lineLength);
    
                const n = clamp(ceil((a0 - a1) / PI) * nCap, 2, nCap);
                for (let i = 0; i < n; i++) {
                    const u = i / (n - 1);
                    const a = a0 + u * (a1 - a0);
                    const rx = p1x + cos(a) * rw;
                    const ry = p1y + sin(a) * rw;
                    this._vSet!(p1x, p1y, 0,p1.lineLength);
                    this._vSet!(rx, ry, -1,p1.lineLength);
                }
    
                this._vSet!(lx1, ly1, 1,p1.lineLength);
                this._vSet!(p1x - dlx1 * rw, p1y - dly1 * rw, -1,p1.lineLength);
            } else {
                const out = this._chooseBevel!(p1.flags & 0x08, p0, p1, -rw);
                const rx0 = out[0];
                const ry0 = out[1];
                const rx1 = out[2];
                const ry1 = out[3];
    
                const a0 = atan2(dly0, dlx0);
                let a1 = atan2(dly1, dlx1);
                if (a1 < a0) { a1 += PI * 2; }
    
                this._vSet!(p1x + dlx0 * rw, p1y + dly0 * rw, 1,p1.lineLength);
                this._vSet!(rx0, ry0, -1,p1.lineLength);
    
                const n = clamp(ceil((a1 - a0) / PI) * nCap, 2, nCap);
                for (let i = 0; i < n; i++) {
                    const u = i / (n - 1);
                    const a = a0 + u * (a1 - a0);
                    const lx = p1x + cos(a) * lw;
                    const ly = p1y + sin(a) * lw;
                    this._vSet!(lx, ly, 1,p1.lineLength);
                    this._vSet!(p1x, p1y, 0,p1.lineLength);
                }
    
                this._vSet!(p1x + dlx1 * rw, p1y + dly1 * rw, 1,p1.lineLength);
                this._vSet!(rx1, ry1, -1,p1.lineLength);
            }
        }

        superGraphicsAssembler._bevelJoin = function (p0: Point2, p1: Point2, lw: number, rw: number) {
            let rx0 = 0;
            let ry0 = 0;
            let rx1 = 0;
            let ry1 = 0;
            let lx0 = 0;
            let ly0 = 0;
            let lx1 = 0;
            let ly1 = 0;
            const dlx0 = p0.dy;
            const dly0 = -p0.dx;
            const dlx1 = p1.dy;
            const dly1 = -p1.dx;
    
            if (p1.flags & 0x02) {
                const out = this._chooseBevel!(p1.flags & 0x08, p0, p1, lw);
                lx0 = out[0];
                ly0 = out[1];
                lx1 = out[2];
                ly1 = out[3];
    
                this._vSet!(lx0, ly0, 1,p1.lineLength);
                this._vSet!(p1.x - dlx0 * rw, p1.y - dly0 * rw, -1,p1.lineLength);
    
                this._vSet!(lx1, ly1, 1,p1.lineLength);
                this._vSet!(p1.x - dlx1 * rw, p1.y - dly1 * rw, -1,p1.lineLength);
            } else {
                const out = this._chooseBevel!(p1.flags & 0x08, p0, p1, -rw);
                rx0 = out[0];
                ry0 = out[1];
                rx1 = out[2];
                ry1 = out[3];
    
                this._vSet!(p1.x + dlx0 * lw, p1.y + dly0 * lw, 1,p1.lineLength);
                this._vSet!(rx0, ry0, -1,p1.lineLength);
    
                this._vSet!(p1.x + dlx1 * lw, p1.y + dly1 * lw, 1,p1.lineLength);
                this._vSet!(rx1, ry1, -1,p1.lineLength);
            }
        }

        /**set vertex data */
        superGraphicsAssembler._vSet = function (x: number, y: number, distance = 0, lineLong = 0) {
            if (!_renderData) {
                return;
            }
    
            const meshBuffer = _renderData;
            let dataOffset = meshBuffer.vertexStart * attrBytes2;
            const vData = meshBuffer.vData;
            // vec3.set(_tempVec3, x, y, 0);
            // vec3.transformMat4(_tempVec3, _tempVec3, _currMatrix);
    
            vData[dataOffset++] = x;
            vData[dataOffset++] = y;
            vData[dataOffset++] = 0;
            Color.toArray(vData, _curColor, dataOffset);
            dataOffset += 4;
            vData[dataOffset++] = distance;
            vData[dataOffset++] = lineLong;
            meshBuffer.vertexStart++;
        }

        if (this._assembler !== superGraphicsAssembler) {
            this._assembler = superGraphicsAssembler;
        }
        /************ */
    }

    /**Create vertex databuffer */
    public activeSubModel (idx: number) {
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

            this.model.initSubModel(idx, renderMesh, this.getMaterialInstance(0)!);
            this["_graphicsUseSubMeshes"].push(renderMesh);
        }
    }
    /**Refresh the rendering data */
    protected _uploadData () {
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
            if (renderData.lastFilledVertex === renderData.vertexStart) {
                continue;
            }

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