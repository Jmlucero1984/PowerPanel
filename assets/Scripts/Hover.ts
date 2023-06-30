import { _decorator, Component, EventTouch, Input, Node, Sprite, UIOpacity, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Hover')
export class Hover extends Component {

    @property({
        type: Sprite
       })
    public green: Sprite;
    @property({
        type: Sprite
       })
    public grey: Sprite;

    
    onLoad() {
    
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
      
 

      
    }
    onTouchMove(event: EventTouch) {
         this.grey.getComponent(UIOpacity).opacity=0;
    }
    update(deltaTime: number) {
        
    }
}


