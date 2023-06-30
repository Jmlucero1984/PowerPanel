import { _decorator, Color, Component, EventTouch, Graphics, Input, Node, v2, Vec3 } from 'cc';
const { ccclass, property } = _decorator;

@ccclass('Square')
export class Square extends   Graphics {
 
    start() {
        this.node.on(Input.EventType.TOUCH_MOVE, this.onTouchMove, this);
        this.clear();
        this.lineWidth = 20;
         
        this.strokeColor = Color.GREEN;
        this.fillColor = Color.CYAN;
        this.moveTo(0,0);
        this.lineTo(0,600);
        this.lineTo(800,600);
        this.lineTo(800,0);
        this.close();
        this.fill();
        this.stroke();
       
    }

    update(deltaTime: number) {
        //this.material.setProperty("move",v2(this.node.position.x*-0.1,this.node.position.y*-0.1));
    }
 

    onTouchMove(event: EventTouch) {
 
        let pos = event.getUILocation();
        this.node.setWorldPosition(new Vec3(pos.x, pos.y, 0));
    }



    
}
