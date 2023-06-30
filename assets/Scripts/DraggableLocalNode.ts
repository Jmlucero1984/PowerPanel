import { Canvas, Input } from 'cc';
import { _decorator, Component, Event, EventMouse, EventTouch, Node, Size, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('DraggableLocalNode')
export class DraggableLocalNode extends Component {
 
 
 

    start() {}

    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
 
 

      
    }

    onTouchStart(event: EventTouch) {};
    onTouchMove(event: EventTouch) {
        let pos = event.getUILocation();
        
       this.node.setWorldPosition(new Vec3(pos.x, pos.y, 0));
    }
    onTouchEnd(event: EventTouch) {}






    update(deltaTime: number) {



    }
}
