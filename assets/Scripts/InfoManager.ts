import { _decorator, Component, Event, EventMouse, EventTouch, Label, MotionStreak, Node, Scene, Script, UITransform, Vec2, Vec3, View } from 'cc';
 
const { ccclass, property } = _decorator;

@ccclass('OnlyInfo')
export class OnlyInfo extends Component {
  
    @property({
        type: Label
       })
    public labelPosx: Label;
    @property({
        type: Label
       })
    public labelPosy: Label;
    @property({
        type: Label
       })
    public labelStatus: Label;
    @property({
        type: Node
       })
    public bg: Node;

    @property([Node])
    arrayOfNodes: Node[] = []

    private posMouse:Vec2;
    private mouseState:boolean



    start() {

    }

    onLoad() {
      
        this.bg.on(Node.EventType.MOUSE_MOVE, (event: EventMouse)=> {
            let loc = event.getUILocation()

            this.labelPosx.string = "Mouse x: "+(Math.round(loc.x*100)) /100;
            this.labelPosy.string = "Mouse y: "+(Math.round(loc.y*100)) /100;
            this.posMouse = new Vec2(loc.x,loc.y);
            if(event.getButton()==EventMouse.BUTTON_LEFT) {
                this.labelStatus.string = "Status: PRESSED"
                this.mouseState=true;

            } else {
                this.labelStatus.string = "Status: Idle"
                this.mouseState=false;
            }
         //.getComponent(UITransform).contentSize;
            /*
            let parentW = this.nodeImage.getParent().getComponent(UITransform).contentSize;
            console.log("parentW height: ", parentW.height)
            console.log("parent Width: ", parentW.width)
            
            console.log("TARGET: ", event.currentTarget);
            console.log("DELTAX: "+ event.getDeltaX);
            console.log("DELTAy: ",event.getDeltaY);*/
           ;
            
      


        }
         )
    }

    update(deltaTime: number) {
 
        
    }
}


