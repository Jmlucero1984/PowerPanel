import { Input } from 'cc';
import { v3 } from 'cc';
import { Vec2 } from 'cc';
import { v2 } from 'cc';
import { Vec3 } from 'cc';
import { EventTouch } from 'cc';
import { _decorator, Component, Node } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DraggableSpline')
export class DraggableSpline extends Component {

    private itemPosition:Vec2;
    private initOffset:Vec2;
    protected onLoad(): void {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
    }
    start() {
             
      

    }

    update(deltaTime: number) {
        
    }

    
    onTouchStart(event: EventTouch) {
       console.log("SIBLING INDEX: "+ this.node.parent.getSiblingIndex());
     
 
 
    };
    onTouchMove(event: EventTouch) {
         
 
        this.node.parent.setWorldPosition(new Vec3(this.node.parent.getWorldPosition().x+event.getDeltaX(),this.node.parent.getWorldPosition().y+event.getDeltaY()));
 
    }
    onTouchEnd(event: EventTouch) {

    

    }
}

 
 
 




