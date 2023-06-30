import { _decorator, Color, Component, Graphics, instantiate, Label, Node, RenderTexture, SliderComponent, Sprite, SpriteFrame, Texture2D, UIOpacity, UITransform, v2, v3, v4, Vec2, Vec3, Vec4 } from 'cc';
import { Display } from './Display';
import { DraggablePanel } from './Panel/DragablePanel';
import { ConnectorHover } from './Panel/ConnectorHover';
const { ccclass, property } = _decorator;



class Pulse {
    private pulso: Node;
    private movePoints: Vec2[];
    private elapsedTime: number = 0;
    public duration: number;
    private callback: CallableFunction;
    public velocity: number;
    private id: number;
    private overallOpacity: number = 255;

    constructor(pulso: Node, movePoints: Vec2[], duration: number, callback: CallableFunction, id: number) {
        this.pulso = pulso;
        this.movePoints = movePoints;
        this.duration = duration;
        this.callback = callback;
        this.pulso.getComponent(UIOpacity).opacity = 0;
        this.id = id;
        this.pulso.getComponentInChildren(Label).string = String(this.id);





    }
    inmovilizar() {
        //this.pulso.getComponent(UIOpacity).opacity = 0;
       // this.elapsedTime = this.duration;
        console.log("REMOVING " + this.id);
        this.pulso.destroy();
     


    }
    reiniciar(df: number) {
        //this.pulso.getComponent(UIOpacity).opacity=255;
        if (df >= 0) {
            this.elapsedTime = 0;
        } else {
            this.elapsedTime = this.duration
        }

    }

    avanzar(dt: number) {

        this.elapsedTime += dt;
        const t = this.elapsedTime / this.duration;

        // Calculate the position on the Bezier curve using the cu^rve equation
        let index = Math.floor(100 * t)
        this.pulso.getComponentInChildren(Label).string = String(this.id) + "\n" + String(index) + "\ndt: " + String((Math.round(dt * 1000)) / 1000);
        if (index >= 100) {

            this.pulso.getComponent(UIOpacity).opacity = 0;
            console.log("REMOVING " + this.id)
            this.callback(this);
        } else {
            let op: number = this.overallOpacity;

            if (index <= 10) {
                this.pulso.getComponent(UIOpacity).opacity = (index * op / 10);
            }
            if (index >= 90) {
                this.pulso.getComponent(UIOpacity).opacity = (((100 - index) / 10) * op);

            }
            this.pulso.setPosition(new Vec3(this.movePoints[index].x, this.movePoints[index].y, 0));
        }
    }




}


@ccclass
export default class OldBezierCode extends Component {
    @property(Graphics)
    private graphic: Graphics;

    @property(Node)
    private spP1: Node;
    @property(Sprite)
    private spCP1: Sprite;
    @property(Node)
    private spP2: Node;
    @property(Sprite)
    private spCP2: Sprite;

    @property(Node)
    private targetNode: Node = null;

    @property(Node)
    public display: Node



    @property({
        type: SliderComponent
    })
    public slider: SliderComponent;
    @property({
        type: SliderComponent
    })
    public velocidad: SliderComponent;

    private elapsedTime: number = 0;
    private duration: number = 3;  // Total time to complete the curve (in seconds)
    private points: Vec4[] = [];
    private controlPoints: Vec2[] = [];
    private branchInd = true;
    private pulses: Pulse[] = [];
    private awaitingPulses: Pulse[] = [];
    private oldControlPoints: Vec2[] = [];
    private movePoints: Vec2[] = [];
    private cantPulses: number = 1;
    private intervalAcum: number = 0;
    private durationFactor = 4;
    private RTerminal: Node = null;
    private LTerminal: Node = null
    private id: number = 1;
    private connected: boolean = false;



    showInDisplay(slot: number, contenido: string) {
        this.display.getComponent(Display).showInDisplay(slot, contenido);
    }

    getRTerminal() {
        return this.RTerminal;
    }
    getLTerminal() {
        return this.LTerminal;
    }
    setRTerminal(conector: Node) {
        this.RTerminal = conector;
        if (conector != null) {
            console.log("--------- L TERMINAL: " + conector.name + " -----------")
        } else {
            console.log("--------- R TERMINAL:  DESCONECTADO  -----------")
        }

    }
    setLTerminal(conector: Node) {
        this.LTerminal = conector;
        if (conector != null) {

            console.log("--------- L TERMINAL: " + conector.name + " -----------")
        } else {
            console.log("--------- L TERMINAL: DESCONETADO -----------")
        }
    }



    onLoad() {
        this.slider.progress = 0.1;
        this.velocidad.progress = 0.5;
      

        if (this.targetNode != null) {

            this.inicializarPulse(this.pulses);
        }
        this.oldControlPoints = [v2(0, 0), v2(0, 0), v2(0, 0), v2(0, 0)];
        for (let i = 0; i < 100; i++) {
            this.movePoints.push(v2(0, 0));
        }
    }



    start() {


    }

    compare(actual: Vec2[], old: Vec2[]): boolean {
        let iguales: boolean = true;
        for (let i = 0; i < actual.length; i++) {
            if (actual[i].x != old[i].x || actual[i].y != old[i].y) {
                iguales = false;
            }
        }
        return iguales;
    }


    inicializarPulse(vector:Pulse[]){
        type MyCallback = (pulse: Pulse) => void;
        const myCallback: MyCallback = (pulse: Pulse) => {
            if (this.pulses.length > 0) {
                let el = this.pulses.shift();
                this.awaitingPulses.push(el);
            }
        };
        vector.push(new Pulse(this.targetNode, this.movePoints, this.duration, myCallback, this.id));
        this.id++;
    }

    update() {
        this.cantPulses = Math.round(50 * this.slider.progress);
        this.durationFactor = 10 * this.velocidad.progress;
        this.showInDisplay(1, "Pulses: " + this.cantPulses)
        this.graphic.lineWidth = 5;
        this.graphic.strokeColor = Color.RED;
       

        // Define your control points here
        this.controlPoints = [
            v2(this.spP1.position.x, this.spP1.position.y),
            v2(this.spCP1.node.position.x + this.spP1.position.x, this.spCP1.node.position.y + this.spP1.position.y),
            v2(this.spCP2.node.position.x + this.spP2.position.x, this.spCP2.node.position.y + this.spP2.position.y),
            v2(this.spP2.position.x, this.spP2.position.y)
        ];
        if (!this.compare(this.controlPoints, this.oldControlPoints)) {
            this.drawLinedSpline(this.controlPoints, this.graphic)
            this.generateMovePoints(this.controlPoints);
            this.oldControlPoints[0] = this.controlPoints[0];
            this.oldControlPoints[1] = this.controlPoints[1];
            this.oldControlPoints[2] = this.controlPoints[2];
            this.oldControlPoints[3] = this.controlPoints[3];
        }
        if (this.RTerminal != null && this.LTerminal != null) {
            let rightCapacity = this.RTerminal.getComponent(ConnectorHover).getCapacity();
            let leftCapacity = this.LTerminal.getComponent(ConnectorHover).getCapacity();
            if (!this.connected) {
                this.connected = true
              
                if (rightCapacity != leftCapacity) {

                    console.log("SCHEDULING FOR UNEVEN")
                    this.schedule(this.updateBezierCurveVectorPos, 0.02);
                } 
            } else {
                   if (rightCapacity == leftCapacity) {
                    console.log("FIRST")
                    for (let i = 0; i <this.pulses.length; i++){
                        this.pulses[i].inmovilizar();
                        this.pulses[i]=null;
                    }
                    for (let i = 0; i <this.awaitingPulses.length; i++){
                        this.awaitingPulses[i].inmovilizar();
                        this.awaitingPulses[i]=null;
                    }
                    this.unschedule(this.updateBezierCurveVectorPos);
                    this.pulses=null;
                    this.awaitingPulses=null;
                    this.id=0;
                    this.inicializarPulse(this.pulses);
                    this.inicializarPulse(this.awaitingPulses);
     
                    console.log("UNSCHEDULING FOR EQUALITY")
                    
                }
                 
            }

        } else {
            if (this.connected) {
                this.connected = false;
                for (let i = 0; i <this.pulses.length; i++){
                    this.pulses[i].inmovilizar();
                    this.pulses[i]=null;
                }
                for (let i = 0; i <this.awaitingPulses.length; i++){
                    this.awaitingPulses[i].inmovilizar();
                    this.awaitingPulses[i]=null;
                }
                this.pulses=null;
                this.awaitingPulses=null;
                console.log("UNSCHEDULING FOR DISCONECTED")
                this.unschedule(this.updateBezierCurveVectorPos);
                this.id=0;
                this.inicializarPulse(this.pulses);
                this.inicializarPulse(this.awaitingPulses);
            }
        }
    }


    generateMovePoints(drawPoints: Vec2[]) {
        for (let i = 0; i < 50; i++) { this.movePoints[i] = this.calculateBezierPoint(drawPoints, false, i / 50); }
        for (let i = 0; i < 50; i++) { this.movePoints[i + 50] = this.calculateBezierPoint(drawPoints, true, i / 50); }
    }

    drawLinedSpline(drawPoints: Vec2[], graph: Graphics) {
        console.log("Drawing")
        graph.clear();
        graph.moveTo(drawPoints[0].x, drawPoints[0].y);
        for (let i = 0; i < 20; i++) {
            let actualPos = this.calculateBezierPoint(drawPoints, false, i / 20);
            graph.lineTo(actualPos.x, actualPos.y);
        }
        for (let i = 0; i <= 20; i++) {
            let actualPos = this.calculateBezierPoint(drawPoints, true, i / 20);
            graph.lineTo(actualPos.x, actualPos.y);
        }
        graph.stroke();

    }

    updateBezierCurveVectorPos(dt: number) {
        console.log("STILL SCHEDULED")
  this.graphic.strokeColor = Color.MAGENTA
        let total = this.pulses.length + this.awaitingPulses.length;

        if (this.cantPulses > total) {
            for (let i = 0; i < this.cantPulses - total; i++) {
                let newNode: Node = instantiate(this.targetNode);
                newNode.setPosition(v3(0, 0, 0));
                this.node.addChild(newNode);
                this.inicializarPulse(this.awaitingPulses);
                
            }
        }
        this.showInDisplay(5, "PULSES: " + this.pulses.length)
        this.showInDisplay(6, "AWAITING: " + this.awaitingPulses.length)
        this.intervalAcum += dt;
        this.showInDisplay(2, "dt: " + dt * this.durationFactor)
        this.showInDisplay(3, "ACUM: " + this.intervalAcum)

        if (this.pulses.length > 0) {  //this.pulses.length
            this.pulses.forEach(element => {

                element.avanzar(dt * this.durationFactor);

            });
        }
        let interval = this.duration / (this.cantPulses - 2)
        this.showInDisplay(4, "DUR/CANT: " + interval)
        if (this.intervalAcum >= interval) {
            this.intervalAcum = 0;
            if (this.awaitingPulses.length > 0) {
                let el = this.awaitingPulses.shift();

                el.reiniciar(this.durationFactor);
                this.pulses.push(el);
            }
            /* while(this.awaitingPulses.length>1) {
                 let v=this.awaitingPulses.shift();
             }*/
        }

        /*
       this.elapsedTime += dt*1;
       const t = this.elapsedTime / this.duration;
       // Calculate the position on the Bezier curve using the cu^rve equation
       if(t>=1) {
           this.elapsedTime = 0;
       } else {
    
       let index = Math.floor(100*t)
       //this.graphicDotted.lineTo(actualPos.x, actualPos.y);
       // Update the sprite's position
       //this.graphicDotted.stroke();
       // If the curve animation is completed, unschedule the update function
       this.targetNode.setPosition(new Vec3(this.movePoints[index].x,this.movePoints[index].y,0));
       }*/


    }




    calculateBezierPoint(drawPoints: Vec2[], branch: boolean, t: number): Vec2 {
        let startPoint;
        let promX;
        let promY;
        let endPoint;
        let midPoint;
        if (!branch) {
            startPoint = drawPoints[0];
            promX = (drawPoints[2].x + drawPoints[1].x) / 2;
            promY = (drawPoints[2].y + drawPoints[1].y) / 2;
            endPoint = v2(promX, promY);
            midPoint = drawPoints[1];
        } else {
            promX = (drawPoints[2].x + drawPoints[1].x) / 2;
            promY = (drawPoints[2].y + drawPoints[1].y) / 2;
            startPoint = v2(promX, promY);
            midPoint = drawPoints[2];
            endPoint = drawPoints[3]
        }
        // let endPoint=ctrPoint[3];
        const u = 1 - t;
        const tt = t * t;
        const uu = u * u;
        const p = v2(0, 0);
        p.x = uu * startPoint.x + 2.0 * u * t * midPoint.x + tt * endPoint.x;
        p.y = uu * startPoint.y + 2.0 * u * t * midPoint.y + tt * endPoint.y;

        return p;
    }




}



/*   drawSpline(graphics: Graphics, drawPoints: Vec2[]) {
        const numPoints = drawPoints.length;
        
             graphics.moveTo(drawPoints[0].x, drawPoints[0].y);
            let promX = (drawPoints[1].x+drawPoints[0].x)/2;
            let promY = (drawPoints[1].y+drawPoints[0].y)/2;
             graphics.quadraticCurveTo(drawPoints[0].x,drawPoints[0].y,promX,promY);
              promX = (drawPoints[2].x+drawPoints[1].x)/2;
             promY = (drawPoints[2].y+drawPoints[1].y)/2;
             graphics.quadraticCurveTo(drawPoints[1].x,drawPoints[1].y,promX,promY);
             promX = (drawPoints[3].x+drawPoints[2].x)/2;
             promY = (drawPoints[3].y+drawPoints[2].y)/2;
             graphics.quadraticCurveTo(drawPoints[2].x,drawPoints[2].y,promX,promY);
             promX = (drawPoints[3].x+drawPoints[2].x)/2;
             promY = (drawPoints[3].y+drawPoints[2].y)/2;
             graphics.quadraticCurveTo(promX,promY,drawPoints[3].x,drawPoints[3].y);
          
             graphics.moveTo(drawPoints[0].x, drawPoints[0].y);
             let promX = (drawPoints[1].x + drawPoints[2].x) / 2;
             let promY = (drawPoints[1].y + drawPoints[2].y) / 2;
             graphics.bezierCurveTo(drawPoints[0].x, drawPoints[0].y, drawPoints[1].x, drawPoints[1].y, promX, promY)
             let oldX = promX;
             let oldY = promY;
             promX = (drawPoints[3].x + drawPoints[2].x) / 2;
             promY = (drawPoints[3].y + drawPoints[2].y) / 2;
             graphics.bezierCurveTo(oldX, oldY, drawPoints[2].x, drawPoints[2].y, drawPoints[3].x, drawPoints[3].y)
             graphics.stroke();
         }
*/



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