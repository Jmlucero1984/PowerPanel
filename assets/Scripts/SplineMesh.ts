 
import { CCBoolean, CCInteger, Enum } from 'cc';
import { Vec2 } from 'cc';
 
import { v2 } from 'cc';
import { Vec3 } from 'cc';
import { UITransform } from 'cc';
 
import { Graphics } from 'cc';
import { _decorator, Component, Node } from 'cc';
 
import { GraphicMesh_v4 } from './GraphicMesh_v4';
 
const { ccclass, property } = _decorator;
export enum TipoForma {
    BezierCurve
}

 
@ccclass('SplineMesh')
export class SplineMesh extends GraphicMesh_v4 {
  
 
    @property({ type: Enum(TipoForma) })
    TipoForma: TipoForma = TipoForma.BezierCurve;
    @property({ visible: function (this) { if (this.TipoForma == TipoForma.BezierCurve ) { return true; } } })
    _aproximation = true;
  
 

    @property(Node)
    cp1: Node = null;
    @property(Node)
    cp2: Node = null;
    @property(Node)
    cp3: Node = null;
    @property(Node)
    cp4: Node = null;
    @property({ group:"Render" })
    @property(CCInteger)
    meshWidth:number=30;
    @property({ group:"Render" })
    @property(CCBoolean)
    UV_unit:boolean=false;
    @property({ group:"Render" })
    @property({ slide: true, range: [0, 20], step: 0.1 })
    repeat_Mult:number=0; 
    @property({ group:"Render" })
    @property({ slide: true, range: [-20, 20], step: 0.1 })
    time_Mult:number=10; 
 
    private oldControlPoints: Vec2[] = [];
    private controlPoints: Vec2[] = [];

 

    start() {
        this.oldControlPoints = this.getActualControlPoints();
        this.material.setProperty("mults",v2(1,1));
        this.drawShape()
    }
    update(deltaTime: number) {
        this.controlPoints = this.getActualControlPoints();
        if (!this.compare(this.controlPoints, this.oldControlPoints)) {
            console.log("CHANGED!")
            this.oldControlPoints = this.getActualControlPoints();
            this.drawShape()
        }
      
    }
 
   

    drawShape() {
        this.clear();
        if(this.Render_Mat.name="PowerLine") {
            console.log("SETTED "+this.node.parent.name)
           // this.material.setProperty("mults",v2(this.repeat_Mult,this.time_Mult));
           }
           
            let dims = this.getComponent(UITransform).contentSize;
            this.moveTo(this.cp1.position.x, this.cp1.position.y);
       
            if (this.TipoForma == TipoForma.BezierCurve) {
                if (this._aproximation) {
                    
                    let c1= v2(this.cp1.position.x,this.cp1.position.y)
                    let c2= v2(this.cp2.position.x+this.cp1.position.x,this.cp2.position.y+this.cp1.position.y)
                    let c3= v2(this.cp3.position.x,this.cp3.position.y)
                    let c4= v2(this.cp4.position.x+this.cp3.position.x,this.cp4.position.y+this.cp3.position.y)
                    let points = this.getBezierCurvePoints2d(c1,c2,c3,c4,30);
                    let actualx = this.cp1.position.x;
                    let actualy = this.cp1.position.y;
                    for (let index = 0; index < points.length; index++) {
                        this.moveTo(actualx, actualy);
                        this.lineTo(points[index].x, points[index].y);
                        actualx = points[index].x;
                        actualy = points[index].y;
                    }
                    this.loadData(points,this.meshWidth,this.UV_unit);
          
                    this.stroke()
                    
                } else {
                this.bezierCurveTo(this.cp2.position.x, this.cp2.position.y, this.cp3.position.x, this.cp3.position.y, this.cp4.position.x, this.cp4.position.y)
                this.stroke();
 
                }
    
            }
 
    }
    getActualControlPoints() {
        let controlPoints = [
            v2(this.cp1.position.x, this.cp1.position.y),
            v2(this.cp2.position.x + this.cp1.position.x, this.cp2.position.y + this.cp1.position.y),
            v2(this.cp3.position.x, this.cp3.position.y),
            v2(this.cp4.position.x + this.cp3.position.x, this.cp4.position.y + this.cp3.position.y)
        ];
        return controlPoints;
    }
    compare(actual: Vec2[], old: Vec2[]): boolean {
        let iguales: boolean = true;
        for (let i = 0; i < actual.length; i++) {
            if (actual[i].x != old[i].x || actual[i].y != old[i].y) { iguales = false; }
        }
        return iguales;
    }

    calculateExternals(points:Vec3[],offset:number):Vec2[] {
        const offsetPoints: Vec2[] = [];
        const res=function (vector_a:Vec2,vector_b:Vec2){
            return  v2(vector_a.x-vector_b.x,vector_a.y-vector_b.y);
        }
        const prod=function(esc:number, vector:Vec2){
            return v2(esc*vector.x,esc*vector.y )
        }
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
   
 
    getBezierCurvePoints2d(startPoint: Vec2, startTangent: Vec2, endPoint: Vec2,endTangent: Vec2, segments:number): Vec2[] {

        const prod=function(esc:number, vector:Vec2){
            return v2(esc*vector.x,esc*vector.y)
        }
        const sum=function (vector_a:Vec2,vector_b:Vec2){
            return v2(vector_a.x+vector_b.x,vector_a.y+vector_b.y);
        }
        const bezierPoints: Vec2[] = [];
        for (let index = 0; index <= segments; index++) {
            let t=index/segments
            let P5 =sum(prod(1-t,startPoint),prod(t,startTangent));
            let P6 =sum(prod(1-t,startTangent),prod(t,endTangent));  
            let P7 =sum(prod(1-t,endTangent),prod(t,endPoint));  
            let P8 =sum(prod(1-t,P5),prod(t,P6));  
            let P9 =sum(prod(1-t,P6),prod(t,P7));   
            let BZ =sum(prod(1-t,P8),prod(t,P9)); 
            bezierPoints.push(BZ);
            
        }
        return bezierPoints;
    }





    

    

}


