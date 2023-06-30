import { Canvas, Input, Script } from 'cc';
import { _decorator, Component, Event, EventMouse, EventTouch, Node, Size, UITransform, Vec3 } from 'cc';
import { ConnectorManager } from './ConnectorManager';
import Cable from './Cable';
import { ConnectorHover } from './Panel/ConnectorHover';
import { Display } from './Display';
const { ccclass, property } = _decorator;

@ccclass('CableTerminal')
export class CableTerminal extends Component {
 
 
    public connectedNode:Node=null;
    private terminalName:string;
    start() {}

    onLoad() {
        this.terminalName=this.node.parent.name;
     
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
 
 

      
    }

 
    onTouchStart(event: EventTouch) {
 
        ConnectorManager.touched(this.node);
    };
    onTouchMove(event: EventTouch) {
        Display.print("Terminal: "+this.terminalName)
        
       
        let pos = event.getUILocation();
        this.node.parent.setWorldPosition(new Vec3(pos.x, pos.y, 0));
    }
    onTouchEnd(event: EventTouch) {

        ConnectorManager.tryConnect(this.node);

    }






    update(deltaTime: number) {
        let nodeLeft = this.node.parent.parent.getComponent(Cable).getLTerminal();
        let nodeRight = this.node.parent.parent.getComponent(Cable).getRTerminal();
        if(nodeLeft!=null && nodeRight !=null) {
            let leftAmount = nodeLeft.getComponent(ConnectorHover).getCapacity();
            let rightAmount = nodeRight.getComponent(ConnectorHover).getCapacity();

            if(leftAmount>rightAmount+1) {
                Display.print("Pushing from left to right...")
                nodeLeft.getComponent(ConnectorHover).changeCapacity(-1);
                nodeRight.getComponent(ConnectorHover).changeCapacity(+1);
            } else if (leftAmount+1<rightAmount) {
                Display.print("Pushing from right to left...")
                nodeLeft.getComponent(ConnectorHover).changeCapacity(+1);
                nodeRight.getComponent(ConnectorHover).changeCapacity(-1);
            }
        }
 
    }
}
