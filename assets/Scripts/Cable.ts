import { _decorator, CCBoolean, Color, Component, EffectAsset, Gradient, Graphics, instantiate, Label, Material, MeshRenderer, Node, RenderTexture, SliderComponent, Sprite, SpriteFrame, SpriteRenderer, Texture2D, UIOpacity, UITransform, v2, v3, v4, Vec2, Vec3, Vec4 } from 'cc';
import { Display } from './Display';
import { DraggablePanel } from './Panel/DragablePanel';
import { ConnectorHover } from './Panel/ConnectorHover';
import { SplineMesh } from './SplineMesh';
const { ccclass, property } = _decorator;



@ccclass
export default class Cable extends Component {
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
    private proxyLine: Node = null;


    @property(Node)
    private spline: Node



    @property(Label)
    public display: Label


    @property(CCBoolean)
    public PassParamToShader: Boolean = false;

    private RTerminal: Node = null;
    private LTerminal: Node = null
    private pushingElectrons: boolean = false;
    private frameElapsedTime: number = 0;
    private _spline: SplineMesh = null;

    showInDisplay(slot: number, contenido: string) {
        this.display.getComponent(Display).showInDisplay(slot, contenido);
    }
    getRTerminal() {
        // console.log("DEVOLVINEDO RIGHT TERMINAL")
        if (this.RTerminal != null) {
            // console.log(this.RTerminal.name)
        } else {
            // console.log("NULO!!")
        }
        return this.RTerminal;
    }
    getLTerminal() {
        return this.LTerminal;
    }

    setTangentPosition(terminal:Node, hover:Node)
    { console.log("CALLLLEEDDDDDD")
    console.log("NAME: "+ terminal.name)
        if(hover.name==="Connector TR" || hover.name==="Connector BR") {
            terminal.parent.getChildByName("CP").setPosition(v3(100,0,.0));
        } else {
            terminal.parent.getChildByName("CP").setPosition(v3(-100,0,.0));
        }

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
    }


    start() {
        this.proxyLine.destroy();
        this._spline=this.spline.getComponent(SplineMesh);

    }


    getDashVelocity(delta:number):number {
        let output=0;
        if(delta>1000) { output= 10;}
        else {
            output=  (Math.trunc(delta/10))/10 ;
        }
        if( output<2) {
            output=2;
        }
      
        return output;
    

    }


    update(dt: number) {
        this.frameElapsedTime += dt;
        if (this.frameElapsedTime > 1 && this.PassParamToShader) {  //0.02
            this.frameElapsedTime = 0;

            //this.graphic.material.setProperty("move",v2(dx,dy));

        }

        if (this.RTerminal != null && this.LTerminal != null) {
            let rightCapacity = this.RTerminal.getComponent(ConnectorHover).getCapacity();
            let leftCapacity = this.LTerminal.getComponent(ConnectorHover).getCapacity();
            let dif = Math.abs(rightCapacity - leftCapacity);
            if (dif > 1) {
                if (!this.pushingElectrons) {
                    this.pushingElectrons = true;
                }
                if (this.pushingElectrons) {

                    if (rightCapacity < leftCapacity) {
                    
                      // let factor=this.getDashVelocity( dif);
                       this.display.string="FACTOR L->R: "
                        if (this._spline.Render_Mat.name = "PowerLine") {

                          
                            this._spline.material.setProperty("mults", v2(5.0, -5));
                        }
                    } else if (rightCapacity > leftCapacity) {
                 
                    // let factor= this.getDashVelocity(dif);
                        this.display.string="FACTOR L<-R: ";
                  
                        if (this._spline.Render_Mat.name = "PowerLine") {
                            this._spline.material.setProperty("mults", v2( 5.0,  5));
                        }
                    }
                }
            } else {

                if (this.pushingElectrons) {
                    this.pushingElectrons = false;
                    if (this._spline.Render_Mat.name = "PowerLine") {
                        this._spline.material.setProperty("mults", v2(0, 1));
                    }
                }
            }
        } else {
            if (this.pushingElectrons) {
                this.pushingElectrons = false;
                if (this._spline.Render_Mat.name = "PowerLine") {
                    this._spline.material.setProperty("mults", v2(0, 1));
                }
            }
        }

    }


}

