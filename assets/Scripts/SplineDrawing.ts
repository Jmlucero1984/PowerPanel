import { _decorator, Color, Component, Graphics, Node, RenderTexture, Sprite, SpriteFrame, Texture2D, UITransform, v2, v4, Vec2, Vec3, Vec4 } from 'cc';
const { ccclass, property } = _decorator;

 

@ccclass
export default class SplineDrawing extends Component {
    @property( Graphics)
    private graphic:  Graphics;
    @property( Sprite)
    private spP1:  Sprite;
    @property( Sprite)
    private spCP1:  Sprite;
    @property( Sprite)
    private spP2:  Sprite;
    @property( Sprite)
    private spCP2:  Sprite;

    @property(Node)
    private targetNode: Node = null;

    private elapsedTime: number = 0;
    private duration: number = 3;  // Total time to complete the curve (in seconds)
    private points:Vec4[]=[];
    private controlPoints: Vec2[]=[];
   

    start() {
        // Create the sprite
        const sprite = this.targetNode.addComponent(Sprite);
        // Set the sprite's image or texture
        
        // Schedule update function
        this.schedule(this.updateBezierCurve, 0.02);
    }


    update() {
        this.graphic.clear();
        this.graphic.lineWidth = 5;
        this.graphic.strokeColor =  Color.BLACK;
        // Define your control points here
          this.controlPoints = [
            v2(this.spP1.node.position.x, this.spP1.node.position.y),
            v2(this.spCP1.node.position.x, this.spCP1.node.position.y),
            v2(this.spCP2.node.position.x, this.spCP2.node.position.y),
            v2(this.spP2.node.position.x, this.spP2.node.position.y),
        ];
        this.points= this.getPoints(this.controlPoints);
        this.drawSpline(this.graphic, this.points);
    }

    getPoints(controlPoints: Vec2[]): Vec4[] {
        var salida:Vec4[]=[];
        let numPoints = controlPoints.length;
        let midPoint:Vec2;
        for (let i = 0; i < numPoints-1; i++) {
            const startPoint = controlPoints[i];
            const endPoint = controlPoints[i + 1];
            midPoint =  v2(
                (startPoint.x + endPoint.x) / 2,
                (startPoint.y + endPoint.y) / 2
            );
           
        salida.push( v4(startPoint.x, startPoint.y, midPoint.x, midPoint.y));
        }

       salida.push(v4(midPoint.x, midPoint.y, controlPoints[numPoints-1].x, controlPoints[numPoints-1].y) );
        return salida
    }
 
    drawSpline(graphics:  Graphics, drawPoints: Vec4[]) {
        const numPoints = drawPoints.length;
       // console.log("CANTIDAD DE PUNTOS:" ,drawPoints.length)
        graphics.moveTo(drawPoints[0].x, drawPoints[0].y);
        for (let i = 0; i < numPoints; i++) {
           // graphics.bezierCurveTo(drawPoints[i].x,drawPoints[i].y,drawPoints[i].z,drawPoints[i].w);
          graphics.quadraticCurveTo(drawPoints[i].x,drawPoints[i].y,drawPoints[i].z,drawPoints[i].w);
        }
        graphics.stroke();
    } 


    updateBezierCurve(dt: number, points: Vec4[] ) {
        this.elapsedTime += dt;
        const t = this.elapsedTime / this.duration;
        // Calculate the position on the Bezier curve using the curve equation
 
        let actualPos =  this.calculateBezierPoint(this.controlPoints,t)
        // Update the sprite's position
        this.targetNode.setPosition(actualPos.x,actualPos.y,0);

        // If the curve animation is completed, unschedule the update function
        if (t >= 1) {
            this.elapsedTime=0;
           //this.unschedule(this.updateBezierCurve);
        }
    }

    calculateBezierPoint(ctrPoint:Vec2[], t: number):  Vec2 {

        let startPoint=ctrPoint[0];
        let startTangent=ctrPoint[1];
        let endTangent=ctrPoint[2];
        let endPoint =ctrPoint[3];
    
       // let endPoint=ctrPoint[3];

        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;

        const p0 = startPoint.x * uu * u;
        const p1 = 3 * startTangent.x * uu * t;
        const p2 = 3 * endTangent.x * u * tt;
        const p3 = endPoint.x * t * tt;
    
        const x = p0 + p1 + p2 + p3;

        const q0 = startPoint.y * uu * u;
        const q1 = 3 * startTangent.y * uu * t;
        const q2 = 3 * endTangent.y * u * tt;
        const q3 = endPoint.y * t * tt;
    
        const y = q0 + q1 + q2 + q3;

        return v2(x,y);
    }

 /*
     let startPoint=ctrPoint[0];
        let startTangent=ctrPoint[1];
        let endTangent=ctrPoint[2];
        let midPoint = v2((startTangent.x+endTangent.x)/2,(startTangent.y+endTangent.y)/2);
    
        let endPoint=ctrPoint[3];

        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;

        const p =  v2(0, 0);
        p.x = uu * startPoint.x + 2 * u * t * startTangent.x + tt * midPoint.x - 2 * u * t * startTangent.x;
        p.y = uu * startPoint.y + 2 * u * t * startTangent.y + tt * midPoint.y - 2 * u * t * startTangent.y;

        return p;




 */









    /*drawSpline(graphics:  Graphics, controlPoints: Vec2[]) {
        const numPoints = controlPoints.length;

        graphics.moveTo(controlPoints[0].x, controlPoints[0].y);
        let midPoint:Vec2;

        for (let i = 0; i < numPoints - 1; i++) {
            const startPoint = controlPoints[i];
            const endPoint = controlPoints[i + 1];

            midPoint =  v2(
                (startPoint.x + endPoint.x) / 2,
                (startPoint.y + endPoint.y) / 2
            );

            graphics.quadraticCurveTo(startPoint.x, startPoint.y, midPoint.x, midPoint.y);

        }
        graphics.quadraticCurveTo(midPoint.x, midPoint.y, controlPoints[numPoints-1].x, controlPoints[numPoints-1].y);
        

        graphics.stroke();

       
    }*/

 
}