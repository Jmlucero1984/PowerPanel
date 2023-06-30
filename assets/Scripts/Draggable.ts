import { Canvas, Input } from 'cc';
import { _decorator, Component, Event, EventMouse, EventTouch, Node, Size, UITransform, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Draggable')
export class Draggable extends Component {

    @property({
        type: Node
    })
    public nodeImage: Node;

 
    public pressed: Boolean = false;
    


    start() {}

    onLoad() {
        this.node.on(Input.EventType.TOUCH_START, this.onTouchStart, this);
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.node.on(Input.EventType.TOUCH_END, this.onTouchEnd, this);
 
 

      
    }

    onTouchStart(event: EventTouch) {};
    onTouchMove(event: EventTouch) {
        let pos = event.getUILocation();
        this.node.parent.setWorldPosition(new Vec3(pos.x, pos.y, 0));
    }
    onTouchEnd(event: EventTouch) {}






    update(deltaTime: number) {



    }
}


